import type { INodeProperties } from 'n8n-workflow';

export const tenantOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['tenant'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new tenant',
				action: 'Create a tenant',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a tenant by ID',
				action: 'Get a tenant',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get many tenants',
				action: 'Get many tenants',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a tenant',
				action: 'Update a tenant',
			},
			{
				name: 'Bulk Delete',
				value: 'bulkDelete',
				description: 'Delete multiple tenants',
				action: 'Bulk delete tenants',
			},
		],
		default: 'getMany',
	},
];

export const tenantFields: INodeProperties[] = [
	// Get and Update operations
	{
		displayName: 'Tenant',
		name: 'tenantId',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				typeOptions: {
					searchListMethod: 'getTenants',
					searchable: true,
				},
			},
			{
				displayName: 'By ID',
				name: 'id',
				type: 'string',
				validation: [
					{
						type: 'regex',
						properties: {
							regex: '^\\d+$',
							errorMessage: 'Must be a numeric ID',
						},
					},
				],
				placeholder: '12345',
			},
		],
		displayOptions: {
			show: {
				resource: ['tenant'],
				operation: ['get', 'update'],
			},
		},
	},

	// Create operation
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['tenant'],
				operation: ['create'],
			},
		},
		description: 'Name of the tenant',
	},

	// Update Fields
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['tenant'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Name of the tenant',
			},
		],
	},

	// Bulk Delete
	{
		displayName: 'Tenant IDs',
		name: 'tenantIds',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['tenant'],
				operation: ['bulkDelete'],
			},
		},
		description: 'Comma-separated list of tenant IDs',
		placeholder: '123,456,789',
	},

	// Get Many
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['tenant'],
				operation: ['getMany'],
			},
		},
		default: false,
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['tenant'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,
			maxValue: 500,
		},
		default: 50,
		description: 'Max number of results to return',
	},
];
