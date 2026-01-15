import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { getImmyBotAuth } from '../../utils';

function getResourceLocatorValue(value: string | IDataObject): string {
	if (typeof value === 'string') {
		return value;
	}
	return (value.value as string) || '';
}

function parseUserIds(value: string | string[]): string[] {
	if (typeof value === 'string') {
		if (value.startsWith('[')) {
			return JSON.parse(value) as string[];
		}
		return value.split(',').map((id: string) => id.trim());
	}
	if (Array.isArray(value)) {
		return value.map((id: string) => id.trim());
	}
	return [];
}

function parseRoleNames(value: string): string[] {
	return value.split(',').map((role) => role.trim());
}

export async function userRouter(
	this: IExecuteFunctions,
	index: number,
	operation: string,
): Promise<IDataObject | IDataObject[]> {
	const auth = await getImmyBotAuth(this);

	if (operation === 'get') {
		const userId = getResourceLocatorValue(
			this.getNodeParameter('userId', index) as string | IDataObject,
		);
		return await this.helpers.httpRequest({
			...auth,
			method: 'GET',
			url: `/api/v1/users/${userId}`,
		});
	}

	if (operation === 'getMany') {
		const returnAll = this.getNodeParameter('returnAll', index, false);
		const filters = this.getNodeParameter('filters', index, {}) as IDataObject;
		const qs: IDataObject = {};

		// Build Sieve filter string
		const sieveFilters: string[] = [];

		if (filters.email) {
			// Use @=* for case-insensitive contains
			sieveFilters.push(`email@=*${filters.email}`);
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

		if (filters.isAdmin !== undefined && filters.isAdmin !== '') {
			// Boolean filter - exact match
			sieveFilters.push(`isAdmin==${filters.isAdmin}`);
		}

		if (filters.isSupportTechnician !== undefined && filters.isSupportTechnician !== '') {
			// Boolean filter - exact match
			sieveFilters.push(`isSupportTechnician==${filters.isSupportTechnician}`);
		}

		if (filters.emailConfirmed !== undefined && filters.emailConfirmed !== '') {
			// Boolean filter - exact match
			sieveFilters.push(`emailConfirmed==${filters.emailConfirmed}`);
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
			const limit = this.getNodeParameter('limit', index, 50) as number;
			qs.PageSize = limit;
		}

		const response = (await this.helpers.httpRequest({
			...auth,
			method: 'GET',
			url: '/api/v1/users',
			qs,
		})) as IDataObject[];

		return response;
	}

	if (operation === 'update') {
		const userId = getResourceLocatorValue(
			this.getNodeParameter('userId', index) as string | IDataObject,
		);
		const updateFields = this.getNodeParameter('updateFields', index, {}) as IDataObject;

		// Get current data
		const currentData = (await this.helpers.httpRequest({
			...auth,
			method: 'GET',
			url: `/api/v1/users/${userId}`,
		})) as IDataObject;

		const body: IDataObject = {
			...currentData,
		};

		if (updateFields.email !== undefined) {
			body.email = updateFields.email;
		}

		if (updateFields.firstName !== undefined) {
			body.firstName = updateFields.firstName;
		}

		if (updateFields.lastName !== undefined) {
			body.lastName = updateFields.lastName;
		}

		return await this.helpers.httpRequest({
			...auth,
			method: 'POST',
			url: `/api/v1/users/${userId}`,
			body,
		});
	}

	if (operation === 'delete') {
		const userId = getResourceLocatorValue(
			this.getNodeParameter('userId', index) as string | IDataObject,
		);
		return await this.helpers.httpRequest({
			...auth,
			method: 'DELETE',
			url: `/api/v1/users/${userId}`,
		});
	}

	if (operation === 'getClaims') {
		const response = (await this.helpers.httpRequest({
			...auth,
			method: 'GET',
			url: '/api/v1/users/claims',
		})) as IDataObject[];

		return response;
	}

	if (operation === 'createFromPerson') {
		const personId = getResourceLocatorValue(
			this.getNodeParameter('personId', index) as string | IDataObject,
		);

		return await this.helpers.httpRequest({
			...auth,
			method: 'POST',
			url: '/api/v1/users/create-from-person',
			body: {
				personId: parseInt(personId, 10),
			},
		});
	}

	if (operation === 'bulkDelete') {
		const userIdsStr = this.getNodeParameter('userIds', index) as string;
		const userIds = parseUserIds(userIdsStr);

		return await this.helpers.httpRequest({
			...auth,
			method: 'DELETE',
			url: '/api/v1/users/bulk-delete',
			body: {
				userIds,
			},
		});
	}

	if (operation === 'addRoles') {
		const userEmail = this.getNodeParameter('userEmail', index) as string;
		const roleNamesStr = this.getNodeParameter('roleNames', index) as string;
		const roleNames = parseRoleNames(roleNamesStr);

		return await this.helpers.httpRequest({
			...auth,
			method: 'POST',
			url: '/api/v1/users/add-roles',
			body: {
				userEmail,
				roleNames,
			},
		});
	}

	if (operation === 'removeRoles') {
		const userEmail = this.getNodeParameter('userEmail', index) as string;
		const roleNamesStr = this.getNodeParameter('roleNames', index) as string;
		const roleNames = parseRoleNames(roleNamesStr);

		return await this.helpers.httpRequest({
			...auth,
			method: 'POST',
			url: '/api/v1/users/remove-roles',
			body: {
				userEmail,
				roleNames,
			},
		});
	}

	if (operation === 'grantAccess') {
		const userEmail = this.getNodeParameter('userEmail', index) as string;
		const tenantId = getResourceLocatorValue(
			this.getNodeParameter('tenantId', index) as string | IDataObject,
		);

		return await this.helpers.httpRequest({
			...auth,
			method: 'POST',
			url: '/api/v1/users/grant-access',
			body: {
				userEmail,
				tenantId: parseInt(tenantId, 10),
			},
		});
	}

	if (operation === 'updateExpiration') {
		const userEmail = this.getNodeParameter('userEmail', index) as string;
		const expirationDate = this.getNodeParameter('expirationDate', index) as string;

		return await this.helpers.httpRequest({
			...auth,
			method: 'POST',
			url: '/api/v1/users/update-expiration',
			body: {
				userEmail,
				expirationDate,
			},
		});
	}

	if (operation === 'invalidateCache') {
		return await this.helpers.httpRequest({
			...auth,
			method: 'POST',
			url: '/api/v1/users/invalidate-cache',
			body: {},
		});
	}

	throw new Error(`Unknown operation: ${operation}`);
}
