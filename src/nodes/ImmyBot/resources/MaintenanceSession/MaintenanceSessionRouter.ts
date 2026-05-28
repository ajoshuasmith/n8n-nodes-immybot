import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { getImmyBotAuth, type ImmyBotAuthOptions } from '../../utils';

function getResourceLocatorValue(value: string | IDataObject): string {
	if (typeof value === 'string') {
		return value;
	}
	return (value.value as string) || '';
}

function softwareMatches(software: IDataObject, value: string): boolean {
	const normalized = value.toLowerCase();
	const candidates = [
		software.id,
		software.identifier,
		software.softwareIdentifier,
		software.name,
		software.displayName,
	]
		.filter((candidate) => candidate !== undefined && candidate !== null)
		.map((candidate) => String(candidate).toLowerCase());

	return candidates.includes(normalized);
}

async function resolveSoftwareMaintenanceIdentifier(
	this: IExecuteFunctions,
	auth: ImmyBotAuthOptions,
	softwareId: string,
): Promise<string> {
	if (/^\d+$/.test(softwareId)) {
		return softwareId;
	}

	const [localSoftware, globalSoftware] = await Promise.all([
		this.helpers.httpRequest({
			...auth,
			method: 'GET',
			url: '/api/v1/software/local',
		}),
		this.helpers.httpRequest({
			...auth,
			method: 'GET',
			url: '/api/v1/software/global',
		}),
	]);

	const allSoftware = [
		...((Array.isArray(localSoftware) ? localSoftware : []) as IDataObject[]),
		...((Array.isArray(globalSoftware) ? globalSoftware : []) as IDataObject[]),
	];
	const match = allSoftware.find((software) => softwareMatches(software, softwareId));

	if (!match?.id) {
		throw new Error(
			`Could not resolve ImmyBot software "${softwareId}" to a numeric software ID for maintenance execution`,
		);
	}

	return String(match.id);
}

export async function maintenanceSessionRouter(
	this: IExecuteFunctions,
	index: number,
	operation: string,
): Promise<IDataObject | IDataObject[]> {
	const auth = await getImmyBotAuth(this);

	// Get computer IDs - common for all operations
	const computerIds = this.getNodeParameter('computerIds', index, []) as string[];

	if (computerIds.length === 0) {
		throw new Error('At least one computer must be selected');
	}

	// Build computers array for API
	const computers = computerIds.map((id) => ({ computerId: parseInt(id, 10) }));

	// Get common options
	const options = this.getNodeParameter('options', index, {}) as IDataObject;
	const rebootPreference = (options.rebootPreference as number) ?? 1;
	const offlineBehavior = (options.offlineBehavior as number) ?? 2;
	const skipBackgroundJob = (options.skipBackgroundJob as boolean) ?? false;

	if (operation === 'runFullMaintenance') {
		const body: IDataObject = {
			fullMaintenance: true,
			computers,
			rebootPreference,
			offlineBehavior,
			skipBackgroundJob,
		};

		return await this.helpers.httpRequest({
			...auth,
			method: 'POST',
			url: '/api/v1/run-immy-service',
			body,
		});
	}

	if (operation === 'installSoftware') {
		const softwareId = getResourceLocatorValue(
			this.getNodeParameter('softwareId', index) as string | IDataObject,
		);
		const maintenanceIdentifier = await resolveSoftwareMaintenanceIdentifier.call(
			this,
			auth,
			softwareId,
		);

		// Get software-specific options
		const softwareOptions = this.getNodeParameter('softwareOptions', index, {}) as IDataObject;
		const desiredSoftwareState = (softwareOptions.desiredSoftwareState as number) ?? 5;
		const repair = (softwareOptions.repair as boolean) ?? false;

		const body: IDataObject = {
			fullMaintenance: false,
			maintenanceParams: {
				maintenanceIdentifier,
				maintenanceType: 0, // 0 = Software
				desiredSoftwareState,
				repair,
			},
			computers,
			rebootPreference,
			offlineBehavior,
			skipBackgroundJob,
		};

		return await this.helpers.httpRequest({
			...auth,
			method: 'POST',
			url: '/api/v1/run-immy-service',
			body,
		});
	}

	throw new Error(`Unknown operation: ${operation}`);
}
