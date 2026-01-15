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
		const qs: IDataObject = {};

		if (!returnAll) {
			const limit = this.getNodeParameter('limit', index, 50);
			qs.pageSize = limit;
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
