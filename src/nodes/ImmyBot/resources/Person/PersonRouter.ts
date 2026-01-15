import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { getImmyBotAuth } from '../../utils';

function getResourceLocatorValue(value: string | IDataObject): string {
	if (typeof value === 'string') {
		return value;
	}
	return (value.value as string) || '';
}

export async function personRouter(
	this: IExecuteFunctions,
	index: number,
	operation: string,
): Promise<IDataObject | IDataObject[]> {
	const auth = await getImmyBotAuth(this);

	if (operation === 'get') {
		const personId = getResourceLocatorValue(this.getNodeParameter('personId', index) as string | IDataObject);
		return await this.helpers.httpRequest({
			...auth,
			method: 'GET',
			url: `/api/v1/persons/${personId}`,
		});
	}

	if (operation === 'getMany') {
		const returnAll = this.getNodeParameter('returnAll', index, false);
		const filters = this.getNodeParameter('filters', index, {}) as IDataObject;
		const qs: IDataObject = {};

		// Build Sieve filter string
		const sieveFilters: string[] = [];

		if (filters.firstName) {
			// Use @=* for case-insensitive contains
			sieveFilters.push(`firstName@=*${filters.firstName}`);
		}

		if (filters.lastName) {
			// Use @=* for case-insensitive contains
			sieveFilters.push(`lastName@=*${filters.lastName}`);
		}

		if (filters.emailAddress) {
			// Use @=* for case-insensitive contains
			sieveFilters.push(`emailAddress@=*${filters.emailAddress}`);
		}

		if (filters.displayName) {
			// Use @=* for case-insensitive contains
			sieveFilters.push(`displayName@=*${filters.displayName}`);
		}

		if (filters.tenantId) {
			// Integer filter - exact match
			const tenantId = getResourceLocatorValue(filters.tenantId as string | IDataObject);
			sieveFilters.push(`tenantId==${tenantId}`);
		}

		// Add Sieve filters to query string (PascalCase param name)
		if (sieveFilters.length > 0) {
			qs.Filters = sieveFilters.join(',');
		}

		// Build Sieve sort string
		if (filters.sortBy) {
			// Use the sortBy value directly (already includes - prefix for descending)
			qs.Sorts = filters.sortBy as string;
		}

		// Pagination (PascalCase param name)
		if (!returnAll) {
			const limit = this.getNodeParameter('limit', index, 50);
			qs.PageSize = limit;
		}

		const response = (await this.helpers.httpRequest({
			...auth,
			method: 'GET',
			url: '/api/v1/persons',
			qs,
		})) as IDataObject[];

		return response;
	}

	throw new Error(`Unknown operation: ${operation}`);
}
