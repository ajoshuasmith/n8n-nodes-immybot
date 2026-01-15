import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { getImmyBotAuth } from '../../utils';

export async function changeRequestRouter(
	this: IExecuteFunctions,
	index: number,
	operation: string,
): Promise<IDataObject | IDataObject[]> {
	const auth = await getImmyBotAuth(this);

	if (operation === 'approve') {
		const changeRequestId = this.getNodeParameter('changeRequestId', index) as string;

		return await this.helpers.httpRequest({
			...auth,
			method: 'POST',
			url: `/api/v1/change-requests/${changeRequestId}/approve`,
			body: {},
		});
	}

	if (operation === 'deny') {
		const changeRequestId = this.getNodeParameter('changeRequestId', index) as string;
		const reason = this.getNodeParameter('reason', index, '') as string;

		const body: IDataObject = {};
		if (reason) {
			body.reason = reason;
		}

		return await this.helpers.httpRequest({
			...auth,
			method: 'POST',
			url: `/api/v1/change-requests/${changeRequestId}/deny`,
			body,
		});
	}

	if (operation === 'requireChanges') {
		const changeRequestId = this.getNodeParameter('changeRequestId', index) as string;
		const comment = this.getNodeParameter('comment', index) as string;

		return await this.helpers.httpRequest({
			...auth,
			method: 'POST',
			url: `/api/v1/change-requests/${changeRequestId}/require-changes`,
			body: {
				comment,
			},
		});
	}

	if (operation === 'comment') {
		const changeRequestId = this.getNodeParameter('changeRequestId', index) as string;
		const comment = this.getNodeParameter('comment', index) as string;

		return await this.helpers.httpRequest({
			...auth,
			method: 'POST',
			url: `/api/v1/change-requests/${changeRequestId}/comment`,
			body: {
				comment,
			},
		});
	}

	if (operation === 'delete') {
		const changeRequestId = this.getNodeParameter('changeRequestId', index) as string;

		return await this.helpers.httpRequest({
			...auth,
			method: 'DELETE',
			url: `/api/v1/change-requests/${changeRequestId}`,
		});
	}

	if (operation === 'getMany') {
		const returnAll = this.getNodeParameter('returnAll', index, false);
		const filters = this.getNodeParameter('filters', index, {}) as IDataObject;
		const qs: IDataObject = {};

		if (filters.status) {
			qs.status = filters.status as string;
		}

		if (!returnAll) {
			const limit = this.getNodeParameter('limit', index, 50) as number;
			qs.pageSize = limit;
		}

		const response = (await this.helpers.httpRequest({
			...auth,
			method: 'GET',
			url: '/api/v1/change-requests/dx',
			qs,
		})) as IDataObject[];

		return response;
	}

	if (operation === 'getOpenCount') {
		return await this.helpers.httpRequest({
			...auth,
			method: 'GET',
			url: '/api/v1/change-requests/open-count',
		});
	}

	throw new Error(`Unknown operation: ${operation}`);
}
