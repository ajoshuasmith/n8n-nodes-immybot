import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { getImmyBotAuth } from '../../utils';

function getResourceLocatorValue(value: string | IDataObject): string {
	if (typeof value === 'string') {
		return value;
	}
	return (value.value as string) || '';
}

export async function scriptRouter(
	this: IExecuteFunctions,
	index: number,
	operation: string,
): Promise<IDataObject | IDataObject[]> {
	const auth = await getImmyBotAuth(this);

	if (operation === 'getLocal') {
		const scriptId = this.getNodeParameter('scriptId', index) as string;
		return await this.helpers.httpRequest({
			...auth,
			method: 'GET',
			url: `/api/v1/scripts/local/${scriptId}`,
		});
	}

	if (operation === 'getGlobal') {
		const scriptId = this.getNodeParameter('scriptId', index) as string;
		return await this.helpers.httpRequest({
			...auth,
			method: 'GET',
			url: `/api/v1/scripts/global/${scriptId}`,
		});
	}

	if (operation === 'getMany') {
		const returnAll = this.getNodeParameter('returnAll', index, false);
		const databaseType = this.getNodeParameter('databaseType', index, 'Local') as string;
		const qs: IDataObject = {
			databaseType,
		};

		if (!returnAll) {
			const limit = this.getNodeParameter('limit', index, 50) as number;
			qs.take = limit;
		}

		const response = (await this.helpers.httpRequest({
			...auth,
			method: 'GET',
			url: '/api/v1/scripts/dx',
			qs,
		})) as IDataObject[];

		return response;
	}

	if (operation === 'runAdHoc') {
		const scriptBody = this.getNodeParameter('scriptBody', index) as string;
		const targetType = this.getNodeParameter('targetType', index) as string;
		const scriptOptions = this.getNodeParameter('scriptOptions', index, {}) as IDataObject;

		const body: IDataObject = {
			scriptBody,
		};

		// Set target based on type
		if (targetType === 'computer') {
			const computerId = getResourceLocatorValue(
				this.getNodeParameter('targetComputerId', index) as string | IDataObject,
			);
			body.computerId = parseInt(computerId, 10);
		} else if (targetType === 'tenant') {
			const tenantId = getResourceLocatorValue(
				this.getNodeParameter('targetTenantId', index) as string | IDataObject,
			);
			body.tenantId = parseInt(tenantId, 10);
		}

		// Add optional parameters
		if (scriptOptions.scriptName) {
			body.scriptName = scriptOptions.scriptName;
		}
		if (scriptOptions.scriptExecutionTimeoutSeconds) {
			body.scriptExecutionTimeoutSeconds = scriptOptions.scriptExecutionTimeoutSeconds;
		}
		if (scriptOptions.agentConnectionWaitTimeoutSeconds) {
			body.agentConnectionWaitTimeoutSeconds = scriptOptions.agentConnectionWaitTimeoutSeconds;
		}
		if (scriptOptions.invalidateFunctionScriptCache !== undefined) {
			body.invalidateFunctionScriptCache = scriptOptions.invalidateFunctionScriptCache;
		}

		return await this.helpers.httpRequest({
			...auth,
			method: 'POST',
			url: '/api/v1/scripts/run-adhoc-metascript',
			body,
		});
	}

	throw new Error(`Unknown operation: ${operation}`);
}
