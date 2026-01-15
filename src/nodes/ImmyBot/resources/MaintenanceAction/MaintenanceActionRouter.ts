import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { getImmyBotAuth } from '../../utils';

function getResourceLocatorValue(value: string | IDataObject): string {
	if (typeof value === 'string') {
		return value;
	}
	return (value.value as string) || '';
}

export async function maintenanceActionRouter(
	this: IExecuteFunctions,
	index: number,
	operation: string,
): Promise<IDataObject | IDataObject[]> {
	const auth = await getImmyBotAuth(this);

	if (operation === 'getLatestForComputer') {
		const computerId = getResourceLocatorValue(this.getNodeParameter('computerId', index) as string | IDataObject);
		return await this.helpers.httpRequest({
			...auth,
			method: 'GET',
			url: `/api/v1/maintenance-actions/latest-for-computer/${computerId}`,
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
			url: '/api/v1/maintenance-actions/dx',
			qs,
		})) as IDataObject[];

		return response;
	}

	throw new Error(`Unknown operation: ${operation}`);
}
