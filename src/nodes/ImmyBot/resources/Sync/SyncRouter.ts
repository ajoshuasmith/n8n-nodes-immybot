import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { getImmyBotAuth } from '../../utils';

function getResourceLocatorValue(value: string | IDataObject): string {
	if (typeof value === 'string') {
		return value;
	}
	return (value.value as string) || '';
}

export async function syncRouter(
	this: IExecuteFunctions,
	index: number,
	operation: string,
): Promise<IDataObject | IDataObject[]> {
	const auth = await getImmyBotAuth(this);

	if (operation === 'triggerUserAffinitySync') {
		const tenantIdParam = this.getNodeParameter('tenantId', index, '') as string | IDataObject;
		const body: IDataObject = {};

		if (tenantIdParam) {
			const tenantId = getResourceLocatorValue(tenantIdParam);
			if (tenantId) {
				body.tenantId = parseInt(tenantId, 10);
			}
		}

		return await this.helpers.httpRequest({
			...auth,
			method: 'POST',
			url: '/api/v1/syncs/trigger-user-affinity-sync',
			body,
		});
	}

	if (operation === 'triggerAzureUserSync') {
		const tenantIdParam = this.getNodeParameter('tenantId', index, '') as string | IDataObject;
		const body: IDataObject = {};

		if (tenantIdParam) {
			const tenantId = getResourceLocatorValue(tenantIdParam);
			if (tenantId) {
				body.tenantId = parseInt(tenantId, 10);
			}
		}

		return await this.helpers.httpRequest({
			...auth,
			method: 'POST',
			url: '/api/v1/syncs/azure-user-sync',
			body,
		});
	}

	throw new Error(`Unknown operation: ${operation}`);
}
