import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { getImmyBotAuth } from '../../utils';

export async function softwareRouter(
	this: IExecuteFunctions,
	index: number,
	operation: string,
): Promise<IDataObject | IDataObject[]> {
	const auth = await getImmyBotAuth(this);

	if (operation === 'getLocal') {
		const softwareIdentifier = this.getNodeParameter('softwareIdentifier', index) as string;
		return await this.helpers.httpRequest({
			...auth,
			method: 'GET',
			url: `/api/v1/software/local/${encodeURIComponent(softwareIdentifier)}`,
		});
	}

	if (operation === 'getGlobal') {
		const softwareIdentifier = this.getNodeParameter('softwareIdentifier', index) as string;
		return await this.helpers.httpRequest({
			...auth,
			method: 'GET',
			url: `/api/v1/software/global/${encodeURIComponent(softwareIdentifier)}`,
		});
	}

	if (operation === 'getManyLocal') {
		const returnAll = this.getNodeParameter('returnAll', index, false);
		const qs: IDataObject = {};

		if (!returnAll) {
			const limit = this.getNodeParameter('limit', index, 50) as number;
			qs.pageSize = limit;
		}

		const response = (await this.helpers.httpRequest({
			...auth,
			method: 'GET',
			url: '/api/v1/software/local',
			qs,
		})) as IDataObject[];

		return response;
	}

	if (operation === 'getManyGlobal') {
		const returnAll = this.getNodeParameter('returnAll', index, false);
		const qs: IDataObject = {};

		if (!returnAll) {
			const limit = this.getNodeParameter('limit', index, 50) as number;
			qs.pageSize = limit;
		}

		const response = (await this.helpers.httpRequest({
			...auth,
			method: 'GET',
			url: '/api/v1/software/global',
			qs,
		})) as IDataObject[];

		return response;
	}

	if (operation === 'createLocal') {
		const name = this.getNodeParameter('name', index) as string;
		const softwareIdentifier = this.getNodeParameter('softwareIdentifier', index) as string;
		const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

		const body: IDataObject = {
			name,
			softwareIdentifier,
			...additionalFields,
		};

		return await this.helpers.httpRequest({
			...auth,
			method: 'POST',
			url: '/api/v1/software/local',
			body,
		});
	}

	if (operation === 'createGlobal') {
		const name = this.getNodeParameter('name', index) as string;
		const softwareIdentifier = this.getNodeParameter('softwareIdentifier', index) as string;
		const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

		const body: IDataObject = {
			name,
			softwareIdentifier,
			...additionalFields,
		};

		return await this.helpers.httpRequest({
			...auth,
			method: 'POST',
			url: '/api/v1/software/global',
			body,
		});
	}

	if (operation === 'deleteLocal') {
		const softwareIdentifier = this.getNodeParameter('softwareIdentifier', index) as string;
		return await this.helpers.httpRequest({
			...auth,
			method: 'DELETE',
			url: `/api/v1/software/local/${encodeURIComponent(softwareIdentifier)}`,
		});
	}

	if (operation === 'deleteGlobal') {
		const softwareIdentifier = this.getNodeParameter('softwareIdentifier', index) as string;
		return await this.helpers.httpRequest({
			...auth,
			method: 'DELETE',
			url: `/api/v1/software/global/${encodeURIComponent(softwareIdentifier)}`,
		});
	}

	throw new Error(`Unknown operation: ${operation}`);
}
