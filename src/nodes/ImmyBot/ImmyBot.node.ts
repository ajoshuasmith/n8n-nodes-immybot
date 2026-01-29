import type {
	IExecuteFunctions,
	ILoadOptionsFunctions,
	INodeType,
	INodeTypeDescription,
	INodeExecutionData,
	IDataObject,
	INodeListSearchResult,
} from 'n8n-workflow';

import { computerOperations, computerFields } from './resources/Computer';
import { tenantOperations, tenantFields } from './resources/Tenant';
import { softwareOperations, softwareFields } from './resources/Software';
import { maintenanceActionOperations, maintenanceActionFields } from './resources/MaintenanceAction';
import { maintenanceSessionOperations, maintenanceSessionFields } from './resources/MaintenanceSession';
import { personOperations, personFields } from './resources/Person';
import { scriptOperations, scriptFields } from './resources/Script';
import { tagOperations, tagFields } from './resources/Tag';
import { syncOperations, syncFields } from './resources/Sync';
import { userOperations, userFields } from './resources/User';
import { changeRequestOperations, changeRequestFields } from './resources/ChangeRequest';
import { getImmyBotAuth } from './utils';

export class ImmyBot implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Immy.Bot',
		name: 'immyDotBot',
		icon: 'file:immybot.png',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with ImmyBot IT automation platform',
		defaults: {
			name: 'Immy.Bot',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'immyDotBotOAuth2Api',
				required: true,
			},
		],
		requestDefaults: {
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Change Request',
						value: 'changeRequest',
					},
					{
						name: 'Computer',
						value: 'computer',
					},
					{
						name: 'Maintenance Action',
						value: 'maintenanceAction',
					},
					{
						name: 'Maintenance Session',
						value: 'maintenanceSession',
					},
					{
						name: 'Person',
						value: 'person',
					},
					{
						name: 'Script',
						value: 'script',
					},
					{
						name: 'Software',
						value: 'software',
					},
					{
						name: 'Sync',
						value: 'sync',
					},
					{
						name: 'Tag',
						value: 'tag',
					},
					{
						name: 'Tenant',
						value: 'tenant',
					},
					{
						name: 'User',
						value: 'user',
					},
				],
				default: 'computer',
			},
			...changeRequestOperations,
			...changeRequestFields,
			...computerOperations,
			...computerFields,
			...tenantOperations,
			...tenantFields,
			...softwareOperations,
			...softwareFields,
			...maintenanceActionOperations,
			...maintenanceActionFields,
			...maintenanceSessionOperations,
			...maintenanceSessionFields,
			...personOperations,
			...personFields,
			...scriptOperations,
			...scriptFields,
			...syncOperations,
			...syncFields,
			...tagOperations,
			...tagFields,
			...userOperations,
			...userFields,
		],
	};

	methods = {
		listSearch: {
			async getComputers(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult> {
		const auth = await getImmyBotAuth(this);
				const results: Array<{ name: string; value: string; url?: string }> = [];
				const qs: IDataObject = {};

				if (filter) {
					qs.name = filter;
				}

				const computers = await this.helpers.httpRequest({
				...auth,
					method: 'GET',
					url: '/api/v1/computers',
					qs,
				});

				for (const computer of computers as IDataObject[]) {
					results.push({
						name: computer.name as string,
						value: (computer.id as number).toString(),
						url: computer.serialNumber
							? `Computer ${computer.name} (SN: ${computer.serialNumber})`
							: undefined,
					});
				}

				return { results };
			},

			async getTenants(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult> {
		const auth = await getImmyBotAuth(this);
				const results: Array<{ name: string; value: string; url?: string }> = [];

				const tenants = await this.helpers.httpRequest({
				...auth,
					method: 'GET',
					url: '/api/v1/tenants',
				});

				const filteredTenants = filter
					? (tenants as IDataObject[]).filter((t) =>
							(t.name as string).toLowerCase().includes(filter.toLowerCase()),
					  )
					: (tenants as IDataObject[]);

				for (const tenant of filteredTenants) {
					results.push({
						name: tenant.name as string,
						value: (tenant.id as number).toString(),
					});
				}

				return { results };
			},

			async getPersons(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult> {
		const auth = await getImmyBotAuth(this);
				const results: Array<{ name: string; value: string; url?: string }> = [];

				const persons = await this.helpers.httpRequest({
				...auth,
					method: 'GET',
					url: '/api/v1/persons',
				});

				const filteredPersons = filter
					? (persons as IDataObject[]).filter(
							(p) =>
								(p.firstName as string)?.toLowerCase().includes(filter.toLowerCase()) ||
								(p.lastName as string)?.toLowerCase().includes(filter.toLowerCase()) ||
								(p.email as string)?.toLowerCase().includes(filter.toLowerCase()),
					  )
					: (persons as IDataObject[]);

				for (const person of filteredPersons) {
					const name = `${person.firstName || ''} ${person.lastName || ''}`.trim() || person.email;
					results.push({
						name: name as string,
						value: (person.id as number).toString(),
						url: person.email as string,
					});
				}

				return { results };
			},

			async getTags(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult> {
		const auth = await getImmyBotAuth(this);
				const results: Array<{ name: string; value: string }> = [];

				const tags = await this.helpers.httpRequest({
				...auth,
					method: 'GET',
					url: '/api/v1/tags',
				});

				const filteredTags = filter
					? (tags as IDataObject[]).filter((t) =>
							(t.name as string).toLowerCase().includes(filter.toLowerCase()),
					  )
					: (tags as IDataObject[]);

				for (const tag of filteredTags) {
					results.push({
						name: tag.name as string,
						value: (tag.id as number).toString(),
					});
				}

				return { results };
			},

			async getSoftware(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult> {
		const auth = await getImmyBotAuth(this);
				const results: Array<{ name: string; value: string }> = [];

				const software = await this.helpers.httpRequest({
				...auth,
					method: 'GET',
					url: '/api/v1/software',
				});

				const filteredSoftware = filter
					? (software as IDataObject[]).filter((s) =>
							(s.name as string).toLowerCase().includes(filter.toLowerCase()),
					  )
					: (software as IDataObject[]);

				for (const sw of filteredSoftware) {
					results.push({
						name: sw.name as string,
						value: (sw.id as number).toString(),
					});
				}

				return { results };
			},

			async getUsers(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult> {
		const auth = await getImmyBotAuth(this);
				const results: Array<{ name: string; value: string; url?: string }> = [];

				const users = await this.helpers.httpRequest({
				...auth,
					method: 'GET',
					url: '/api/v1/users',
				});

				const filteredUsers = filter
					? (users as IDataObject[]).filter(
							(u) =>
								(u.firstName as string)?.toLowerCase().includes(filter.toLowerCase()) ||
								(u.lastName as string)?.toLowerCase().includes(filter.toLowerCase()) ||
								(u.email as string)?.toLowerCase().includes(filter.toLowerCase()),
					  )
					: (users as IDataObject[]);

				for (const user of filteredUsers) {
					const name =
						`${user.firstName || ''} ${user.lastName || ''}`.trim() || (user.email as string);
					results.push({
						name,
						value: user.id as string,
						url: user.email as string,
					});
				}

				return { results };
			},
		},
		loadOptions: {
			async getComputersMulti(this: ILoadOptionsFunctions) {
				const auth = await getImmyBotAuth(this);
				const computers = await this.helpers.httpRequest({
					...auth,
					method: 'GET',
					url: '/api/v1/computers',
				});

				return (computers as IDataObject[]).map((computer) => ({
					name: computer.name as string,
					value: (computer.id as number).toString(),
				}));
			},

			async getTagsMulti(this: ILoadOptionsFunctions) {
				const auth = await getImmyBotAuth(this);
				const tags = await this.helpers.httpRequest({
					...auth,
					method: 'GET',
					url: '/api/v1/tags',
				});

				return (tags as IDataObject[]).map((tag) => ({
					name: tag.name as string,
					value: (tag.id as number).toString(),
				}));
			},

			async getPersonsMulti(this: ILoadOptionsFunctions) {
				const auth = await getImmyBotAuth(this);
				const persons = await this.helpers.httpRequest({
					...auth,
					method: 'GET',
					url: '/api/v1/persons',
				});

				return (persons as IDataObject[]).map((person) => {
					const name = `${person.firstName || ''} ${person.lastName || ''}`.trim() || person.email;
					return {
						name: name as string,
						value: (person.id as number).toString(),
					};
				});
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0);
		const operation = this.getNodeParameter('operation', 0);

		for (let i = 0; i < items.length; i++) {
			try {
				if (resource === 'changeRequest') {
					const { changeRequestRouter } = await import(
						'./resources/ChangeRequest/ChangeRequestRouter'
					);
					const result = await changeRequestRouter.call(this, i, operation as string);
					const executionData = this.helpers.constructExecutionMetaData(
						this.helpers.returnJsonArray(result),
						{ itemData: { item: i } },
					);
					returnData.push(...executionData);
				} else if (resource === 'computer') {
					const { computerRouter } = await import('./resources/Computer/ComputerRouter');
					const result = await computerRouter.call(this, i, operation as string);
					const executionData = this.helpers.constructExecutionMetaData(
						this.helpers.returnJsonArray(result),
						{ itemData: { item: i } },
					);
					returnData.push(...executionData);
				} else if (resource === 'tenant') {
					const { tenantRouter } = await import('./resources/Tenant/TenantRouter');
					const result = await tenantRouter.call(this, i, operation as string);
					const executionData = this.helpers.constructExecutionMetaData(
						this.helpers.returnJsonArray(result),
						{ itemData: { item: i } },
					);
					returnData.push(...executionData);
				} else if (resource === 'software') {
					const { softwareRouter } = await import('./resources/Software/SoftwareRouter');
					const result = await softwareRouter.call(this, i, operation as string);
					const executionData = this.helpers.constructExecutionMetaData(
						this.helpers.returnJsonArray(result),
						{ itemData: { item: i } },
					);
					returnData.push(...executionData);
				} else if (resource === 'maintenanceAction') {
					const { maintenanceActionRouter } = await import(
						'./resources/MaintenanceAction/MaintenanceActionRouter'
					);
					const result = await maintenanceActionRouter.call(this, i, operation as string);
					const executionData = this.helpers.constructExecutionMetaData(
						this.helpers.returnJsonArray(result),
						{ itemData: { item: i } },
					);
					returnData.push(...executionData);
				} else if (resource === 'maintenanceSession') {
					const { maintenanceSessionRouter } = await import(
						'./resources/MaintenanceSession/MaintenanceSessionRouter'
					);
					const result = await maintenanceSessionRouter.call(this, i, operation as string);
					const executionData = this.helpers.constructExecutionMetaData(
						this.helpers.returnJsonArray(result),
						{ itemData: { item: i } },
					);
					returnData.push(...executionData);
				} else if (resource === 'person') {
					const { personRouter } = await import('./resources/Person/PersonRouter');
					const result = await personRouter.call(this, i, operation as string);
					const executionData = this.helpers.constructExecutionMetaData(
						this.helpers.returnJsonArray(result),
						{ itemData: { item: i } },
					);
					returnData.push(...executionData);
				} else if (resource === 'script') {
					const { scriptRouter } = await import('./resources/Script/ScriptRouter');
					const result = await scriptRouter.call(this, i, operation as string);
					const executionData = this.helpers.constructExecutionMetaData(
						this.helpers.returnJsonArray(result),
						{ itemData: { item: i } },
					);
					returnData.push(...executionData);
				} else if (resource === 'tag') {
					const { tagRouter } = await import('./resources/Tag/TagRouter');
					const result = await tagRouter.call(this, i, operation as string);
					const executionData = this.helpers.constructExecutionMetaData(
						this.helpers.returnJsonArray(result),
						{ itemData: { item: i } },
					);
					returnData.push(...executionData);
				} else if (resource === 'sync') {
					const { syncRouter } = await import('./resources/Sync/SyncRouter');
					const result = await syncRouter.call(this, i, operation as string);
					const executionData = this.helpers.constructExecutionMetaData(
						this.helpers.returnJsonArray(result),
						{ itemData: { item: i } },
					);
					returnData.push(...executionData);
				} else if (resource === 'user') {
					const { userRouter } = await import('./resources/User/UserRouter');
					const result = await userRouter.call(this, i, operation as string);
					const executionData = this.helpers.constructExecutionMetaData(
						this.helpers.returnJsonArray(result),
						{ itemData: { item: i } },
					);
					returnData.push(...executionData);
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: (error as Error).message },
						pairedItem: { item: i },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
