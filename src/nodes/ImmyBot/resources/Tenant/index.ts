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

	// Notice about filtering
	{
		displayName: '',
		name: 'filtersNotice',
		type: 'notice',
		default: '',
		displayOptions: {
			show: {
				resource: ['tenant'],
				operation: ['getMany'],
			},
		},
		description:
			'<strong>💡 Filtering Tips</strong><br>• Use filters below to reduce data at the API level<br>• Combine multiple filters to narrow results precisely<br>• All tenant properties are available in the response for additional filtering',
	},

	// Filters for Get Many
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		description: 'Server-side filters to reduce data transfer. Only matching tenants will be returned.',
		displayOptions: {
			show: {
				resource: ['tenant'],
				operation: ['getMany'],
			},
		},
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				placeholder: 'e.g. Acme Corp, {{ $json.tenantName }}',
				description:
					'Search for tenants by name. Finds tenants where the name contains this text (case-insensitive).',
				hint: 'Partial match - searches anywhere in tenant name. Example: "Corp" matches "Acme Corp", "TechCorp", etc.',
			},
			{
				displayName: 'Active Status',
				name: 'active',
				type: 'options',
				options: [
					{
						name: 'All',
						value: '',
					},
					{
						name: 'Active Only',
						value: 'true',
					},
					{
						name: 'Inactive Only',
						value: 'false',
					},
				],
				default: '',
				description: 'Filter by tenant active status',
				hint: 'Active tenants are currently in use. Inactive tenants may be archived or disabled.',
			},
			{
				displayName: 'MSP Tenants',
				name: 'isMsp',
				type: 'options',
				options: [
					{
						name: 'All',
						value: '',
					},
					{
						name: 'MSP Tenants Only',
						value: 'true',
					},
					{
						name: 'Non-MSP Tenants Only',
						value: 'false',
					},
				],
				default: '',
				description: 'Filter by MSP status',
				hint: 'MSP (Managed Service Provider) tenants typically manage other tenants.',
			},
			{
				displayName: 'Parent Tenant',
				name: 'parentTenantId',
				type: 'resourceLocator',
				default: { mode: 'list', value: '' },
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
				description: 'Filter to show only child tenants of a specific parent',
				hint: 'Useful for hierarchical tenant structures where one tenant manages others.',
			},
			{
				displayName: 'Sort By',
				name: 'sortBy',
				type: 'options',
				options: [
					{
						name: 'Name (A-Z)',
						value: 'name',
					},
					{
						name: 'Name (Z-A)',
						value: '-name',
					},
					{
						name: 'Created Date (Oldest First)',
						value: 'createdDate',
					},
					{
						name: 'Created Date (Newest First)',
						value: '-createdDate',
					},
					{
						name: 'Updated Date (Oldest First)',
						value: 'updatedDate',
					},
					{
						name: 'Updated Date (Newest First)',
						value: '-updatedDate',
					},
				],
				default: 'name',
				description: 'Sort results by a specific field',
				hint: 'Choose how to order the results. Prefix with "-" means descending order.',
			},
		],
	},
];
