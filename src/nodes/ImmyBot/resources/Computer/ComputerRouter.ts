import type { IExecuteFunctions, IDataObject, IHttpRequestOptions } from 'n8n-workflow';
import { getImmyBotAuth } from '../../utils';

function parseComputerIds(value: string | string[]): number[] {
	// Handle both comma-separated strings and JSON arrays
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

function parseTagIds(value: string | string[]): number[] {
	if (Array.isArray(value)) {
		return value.map((id) => parseInt(id, 10));
	}
	return value.split(',').map((id) => parseInt(id.trim(), 10));
}

function getResourceLocatorValue(value: string | IDataObject): string {
	if (typeof value === 'string') {
		return value;
	}
	return (value.value as string) || '';
}

export async function computerRouter(
	this: IExecuteFunctions,
	index: number,
	operation: string,
): Promise<IDataObject | IDataObject[]> {
	const auth = await getImmyBotAuth(this);

	if (operation === 'get') {
		const computerId = getResourceLocatorValue(
			this.getNodeParameter('computerId', index) as string | IDataObject,
		);
		return await this.helpers.httpRequest({
			...auth,
			method: 'GET',
			url: `/api/v1/computers/${computerId}`,
		});
	}

	if (operation === 'getMany') {
		const returnAll = this.getNodeParameter('returnAll', index, false);
		const filters = this.getNodeParameter('filters', index, {}) as IDataObject;
		const qs: IDataObject = {};

		// Build Sieve filter string
		const sieveFilters: string[] = [];

		if (filters.name) {
			// Use @=* for case-insensitive contains
			sieveFilters.push(`Name@=*${filters.name}`);
		}

		if (filters.tenantId) {
			// Use == for exact match
			const tenantId = getResourceLocatorValue(filters.tenantId as string | IDataObject);
			sieveFilters.push(`TenantId==${tenantId}`);
		}

		// Add Sieve filters to query string
		if (sieveFilters.length > 0) {
			qs.filters = sieveFilters.join(',');
		}

		// Build Sieve sort string
		if (filters.orderByUpdatedDate) {
			// Use -UpdatedDate for descending sort (most recent first)
			qs.sorts = '-UpdatedDate';
		}

		// Pagination
		if (!returnAll) {
			const limit = this.getNodeParameter('limit', index, 50);
			qs.pageSize = limit;
		}

		const response = (await this.helpers.httpRequest({
			...auth,
			method: 'GET',
			url: '/api/v1/computers',
			qs,
		})) as IDataObject[];

		return response;
	}

	if (operation === 'update') {
		const computerId = getResourceLocatorValue(this.getNodeParameter('computerId', index) as string | IDataObject);
		const updateFields = this.getNodeParameter('updateFields', index, {}) as IDataObject;

		// Get current computer data
		const currentData = (await this.helpers.httpRequest({
			...auth,
			method: 'GET',
			url: `/api/v1/computers/${computerId}`,
		})) as IDataObject;

		const body: IDataObject = {
			...currentData,
		};

		if (updateFields.name !== undefined) {
			body.name = updateFields.name;
		}

		if (updateFields.tenantId !== undefined) {
			body.tenantId = parseInt(
				getResourceLocatorValue(updateFields.tenantId as string | IDataObject),
				10,
			);
		}

		if (updateFields.serialNumber !== undefined) {
			body.serialNumber = updateFields.serialNumber;
		}

		if (updateFields.excludedFromMaintenance !== undefined) {
			body.excludedFromMaintenance = updateFields.excludedFromMaintenance;
		}

		return await this.helpers.httpRequest({
			...auth,
			method: 'PUT',
			url: `/api/v1/computers/${computerId}`,
			body,
		});
	}

	if (operation === 'getStatus') {
		const computerId = getResourceLocatorValue(this.getNodeParameter('computerId', index) as string | IDataObject);
		return await this.helpers.httpRequest({
			...auth,
			method: 'GET',
			url: `/api/v1/computers/${computerId}/status`,
		});
	}

	if (operation === 'getEvents') {
		const computerId = getResourceLocatorValue(this.getNodeParameter('computerId', index) as string | IDataObject);
		const options = this.getNodeParameter('options', index, {}) as IDataObject;
		const qs: IDataObject = {};

		if (options.limit) {
			qs.limit = options.limit;
		}

		const response = (await this.helpers.httpRequest({
			...auth,
			method: 'GET',
			url: `/api/v1/computers/${computerId}/events`,
			qs,
		})) as IDataObject[];

		return response;
	}

	if (operation === 'getDetectedSoftware') {
		const computerId = getResourceLocatorValue(this.getNodeParameter('computerId', index) as string | IDataObject);
		const response = (await this.helpers.httpRequest({
			...auth,
			method: 'GET',
			url: `/api/v1/computers/${computerId}/detected-computer-software`,
		})) as IDataObject[];

		return response;
	}

	if (operation === 'getInventory') {
		const returnAll = this.getNodeParameter('returnAll', index, false);
		const qs: IDataObject = {};

		if (!returnAll) {
			const limit = this.getNodeParameter('limit', index, 50);
			qs.pageSize = limit;
		}

		const response = (await this.helpers.httpRequest({
			...auth,
			method: 'GET',
			url: '/api/v1/computers/inventory',
			qs,
		})) as IDataObject[];

		return response;
	}

	if (operation === 'getInventoryScriptResults') {
		const computerId = getResourceLocatorValue(this.getNodeParameter('computerId', index) as string | IDataObject);
		const inventoryKey = this.getNodeParameter('inventoryKey', index) as string;

		return await this.helpers.httpRequest({
			...auth,
			method: 'GET',
			url: `/api/v1/computers/${computerId}/inventory-script-results/${inventoryKey}`,
		});
	}

	if (operation === 'getUserAffinities') {
		const returnAll = this.getNodeParameter('returnAll', index, false);
		const qs: IDataObject = {};

		if (!returnAll) {
			const limit = this.getNodeParameter('limit', index, 50);
			qs.pageSize = limit;
		}

		const response = (await this.helpers.httpRequest({
			...auth,
			method: 'GET',
			url: '/api/v1/computers/user-affinities',
			qs,
		})) as IDataObject[];

		return response;
	}

	if (operation === 'getAgentStatus') {
		const returnAll = this.getNodeParameter('returnAll', index, false);
		const qs: IDataObject = {};

		if (!returnAll) {
			const limit = this.getNodeParameter('limit', index, 50);
			qs.pageSize = limit;
		}

		const response = (await this.helpers.httpRequest({
			...auth,
			method: 'GET',
			url: '/api/v1/computers/agent-status',
			qs,
		})) as IDataObject[];

		return response;
	}

	if (operation === 'addTags') {
		const computerIds = (this.getNodeParameter('computerIds', index) as string[]).map((id) =>
			parseInt(id, 10),
		);
		const tagIds = (this.getNodeParameter('tagIds', index) as string[]).map((id) => parseInt(id, 10));

		return await this.helpers.httpRequest({
			...auth,
			method: 'POST',
			url: '/api/v1/computers/add-tags',
			body: {
				computerIds,
				tagIds,
			},
		});
	}

	if (operation === 'removeTags') {
		const computerIds = (this.getNodeParameter('computerIds', index) as string[]).map((id) =>
			parseInt(id, 10),
		);
		const tagIds = (this.getNodeParameter('tagIds', index) as string[]).map((id) => parseInt(id, 10));

		return await this.helpers.httpRequest({
			...auth,
			method: 'POST',
			url: '/api/v1/computers/remove-tags',
			body: {
				computerIds,
				tagIds,
			},
		});
	}

	if (operation === 'changeTenant') {
		const computerIds = (this.getNodeParameter('computerIds', index) as string[]).map((id) =>
			parseInt(id, 10),
		);
		const newTenantId = getResourceLocatorValue(
			this.getNodeParameter('newTenantId', index) as string | IDataObject,
		);

		return await this.helpers.httpRequest({
			...auth,
			method: 'POST',
			url: '/api/v1/computers/change-tenant',
			body: {
				computerIds,
				newTenantId: parseInt(newTenantId, 10),
			},
		});
	}

	if (operation === 'bulkDelete') {
		const computerIds = (this.getNodeParameter('computerIds', index) as string[]).map((id) =>
			parseInt(id, 10),
		);

		return await this.helpers.httpRequest({
			...auth,
			method: 'POST',
			url: '/api/v1/computers/bulk-delete',
			body: {
				computerIds,
			},
		});
	}

	if (operation === 'restore') {
		const computerIds = (this.getNodeParameter('computerIds', index) as string[]).map((id) =>
			parseInt(id, 10),
		);

		return await this.helpers.httpRequest({
			...auth,
			method: 'POST',
			url: '/api/v1/computers/restore',
			body: {
				computerIds,
			},
		});
	}

	if (operation === 'skipOnboarding') {
		const computerIds = (this.getNodeParameter('computerIds', index) as string[]).map((id) =>
			parseInt(id, 10),
		);

		return await this.helpers.httpRequest({
			...auth,
			method: 'POST',
			url: '/api/v1/computers/skip-onboarding',
			body: {
				computerIds,
			},
		});
	}

	if (operation === 'reinventory') {
		const computerId = getResourceLocatorValue(this.getNodeParameter('computerId', index) as string | IDataObject);

		return await this.helpers.httpRequest({
			...auth,
			method: 'POST',
			url: `/api/v1/computers/${computerId}/reinventory`,
			body: {},
		});
	}

	if (operation === 'setToNeedsOnboarding') {
		const computerId = getResourceLocatorValue(this.getNodeParameter('computerId', index) as string | IDataObject);

		return await this.helpers.httpRequest({
			...auth,
			method: 'POST',
			url: `/api/v1/computers/${computerId}/set-to-needs-onboarding`,
			body: {},
		});
	}

	if (operation === 'updatePrimaryPerson') {
		const computerId = getResourceLocatorValue(this.getNodeParameter('computerId', index) as string | IDataObject);
		const personId = getResourceLocatorValue(this.getNodeParameter('personId', index) as string | IDataObject);

		return await this.helpers.httpRequest({
			...auth,
			method: 'POST',
			url: `/api/v1/computers/${computerId}/update-primary-person`,
			body: {
				personId: parseInt(personId, 10),
			},
		});
	}

	if (operation === 'updateAdditionalPersons') {
		const computerId = getResourceLocatorValue(
			this.getNodeParameter('computerId', index) as string | IDataObject,
		);
		const personIds = (this.getNodeParameter('personIds', index) as string[]).map((id) =>
			parseInt(id, 10),
		);

		return await this.helpers.httpRequest({
			...auth,
			method: 'POST',
			url: `/api/v1/computers/${computerId}/update-additional-persons`,
			body: {
				personIds,
			},
		});
	}

	throw new Error(`Unknown operation: ${operation}`);
}
