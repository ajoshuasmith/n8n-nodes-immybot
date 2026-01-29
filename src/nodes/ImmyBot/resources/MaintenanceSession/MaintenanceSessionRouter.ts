import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { getImmyBotAuth } from '../../utils';

function getResourceLocatorValue(value: string | IDataObject): string {
	if (typeof value === 'string') {
		return value;
	}
	return (value.value as string) || '';
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

		// Get software-specific options
		const softwareOptions = this.getNodeParameter('softwareOptions', index, {}) as IDataObject;
		const desiredSoftwareState = (softwareOptions.desiredSoftwareState as number) ?? 5;
		const repair = (softwareOptions.repair as boolean) ?? false;

		const body: IDataObject = {
			fullMaintenance: false,
			maintenanceParams: {
				maintenanceIdentifier: softwareId,
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
