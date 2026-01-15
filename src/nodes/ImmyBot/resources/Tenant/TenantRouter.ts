import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { getImmyBotAuth } from '../../utils';

function getResourceLocatorValue(value: string | IDataObject): string {
	if (typeof value === 'string') {
		return value;
	}
	return (value.value as string) || '';
}

function parseIds(value: string | string[]): number[] {
	if (typeof value === 'string') {
		if (value.startsWith('[')) {
			return JSON.parse(value) as number[];
		}
		return value.split(',').map((id: string) => parseInt(id.trim(), 10));
	}
	if (Array.isArray(value)) {
		return value.map((id: string | number) => (typeof id === 'number' ? id : parseInt(id, 10)));
	}
	return [];
}

export async function tenantRouter(
	this: IExecuteFunctions,
	index: number,
	operation: string,
): Promise<IDataObject | IDataObject[]> {
	const auth = await getImmyBotAuth(this);

	if (operation === 'get') {
		const tenantId = getResourceLocatorValue(this.getNodeParameter('tenantId', index) as string | IDataObject);
		return await this.helpers.httpRequest({
			...auth,
			method: 'GET',
			url: `/api/v1/tenants/${tenantId}`,
		});
	}

	if (operation === 'getMany') {
		const returnAll = this.getNodeParameter('returnAll', index, false);
		const qs: IDataObject = {};

		if (!returnAll) {
			const limit = this.getNodeParameter('limit', index, 50);
			qs.pageSize = limit;
		}

		const response = (await this.helpers.httpRequest({
			...auth,
			method: 'GET',
			url: '/api/v1/tenants',
			qs,
		})) as IDataObject[];

		return response;
	}

	if (operation === 'create') {
		const name = this.getNodeParameter('name', index) as string;

		return await this.helpers.httpRequest({
			...auth,
			method: 'POST',
			url: '/api/v1/tenants',
			body: {
				name,
			},
		});
	}

	if (operation === 'update') {
		const tenantId = getResourceLocatorValue(this.getNodeParameter('tenantId', index) as string | IDataObject);
		const updateFields = this.getNodeParameter('updateFields', index, {}) as IDataObject;

		// Get current data
		const currentData = (await this.helpers.httpRequest({
			...auth,
			method: 'GET',
			url: `/api/v1/tenants/${tenantId}`,
		})) as IDataObject;

		const body: IDataObject = {
			...currentData,
			...updateFields,
		};

		return await this.helpers.httpRequest({
			...auth,
			method: 'PUT',
			url: `/api/v1/tenants/${tenantId}`,
			body,
		});
	}

	if (operation === 'bulkDelete') {
		const tenantIdsStr = this.getNodeParameter('tenantIds', index) as string;
		const tenantIds = parseIds(tenantIdsStr);

		return await this.helpers.httpRequest({
			...auth,
			method: 'POST',
			url: '/api/v1/tenants/bulk-delete',
			body: {
				tenantIds,
			},
		});
	}

	throw new Error(`Unknown operation: ${operation}`);
}
