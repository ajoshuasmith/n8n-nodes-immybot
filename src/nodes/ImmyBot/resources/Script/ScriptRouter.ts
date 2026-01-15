import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { getImmyBotAuth } from '../../utils';

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

	throw new Error(`Unknown operation: ${operation}`);
}
