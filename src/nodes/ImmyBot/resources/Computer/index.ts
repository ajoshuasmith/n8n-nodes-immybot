import type { INodeProperties } from 'n8n-workflow';

export const computerOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['computer'],
			},
		},
		options: [
			{
				name: 'Add Tags',
				value: 'addTags',
				description: 'Add tags to computers',
				action: 'Add tags to computers',
			},
			{
				name: 'Bulk Delete',
				value: 'bulkDelete',
				description: 'Delete multiple computers',
				action: 'Bulk delete computers',
			},
			{
				name: 'Change Tenant',
				value: 'changeTenant',
				description: 'Move computers to a different tenant',
				action: 'Change computer tenant',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a computer by ID',
				action: 'Get a computer',
			},
			{
				name: 'Get Agent Status',
				value: 'getAgentStatus',
				description: 'Get agent status for computers',
				action: 'Get computer agent status',
			},
			{
				name: 'Get Detected Software',
				value: 'getDetectedSoftware',
				description: 'Get detected software on a computer',
				action: 'Get detected software',
			},
			{
				name: 'Get Events',
				value: 'getEvents',
				description: 'Get events for a computer',
				action: 'Get computer events',
			},
			{
				name: 'Get Inventory',
				value: 'getInventory',
				description: 'Get inventory data for computers',
				action: 'Get computer inventory',
			},
			{
				name: 'Get Inventory Script Results',
				value: 'getInventoryScriptResults',
				description: 'Get inventory script results for a computer',
				action: 'Get inventory script results',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get many computers',
				action: 'Get many computers',
			},
			{
				name: 'Get Status',
				value: 'getStatus',
				description: 'Get status of a computer',
				action: 'Get computer status',
			},
			{
				name: 'Get User Affinities',
				value: 'getUserAffinities',
				description: 'Get user affinity data for computers',
				action: 'Get user affinities',
			},
			{
				name: 'Reinventory',
				value: 'reinventory',
				description: 'Trigger reinventory for a computer',
				action: 'Reinventory computer',
			},
			{
				name: 'Remove Tags',
				value: 'removeTags',
				description: 'Remove tags from computers',
				action: 'Remove tags from computers',
			},
			{
				name: 'Restore',
				value: 'restore',
				description: 'Restore deleted computers',
				action: 'Restore computers',
			},
			{
				name: 'Set to Needs Onboarding',
				value: 'setToNeedsOnboarding',
				description: 'Set a computer to needs onboarding status',
				action: 'Set to needs onboarding',
			},
			{
				name: 'Skip Onboarding',
				value: 'skipOnboarding',
				description: 'Skip onboarding for computers',
				action: 'Skip onboarding',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a computer',
				action: 'Update a computer',
			},
			{
				name: 'Update Additional Persons',
				value: 'updateAdditionalPersons',
				description: 'Update additional persons for a computer',
				action: 'Update additional persons',
			},
			{
				name: 'Update Primary Person',
				value: 'updatePrimaryPerson',
				description: 'Update primary person for a computer',
				action: 'Update primary person',
			},
		],
		default: 'getMany',
	},
];

export const computerFields: INodeProperties[] = [
	// Get operation
	{
		displayName: 'Computer',
		name: 'computerId',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				typeOptions: {
					searchListMethod: 'getComputers',
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
			{
				displayName: 'By URL',
				name: 'url',
				type: 'string',
				placeholder: 'https://yourtenant.immy.bot/computers/12345',
				extractValue: {
					type: 'regex',
					regex: 'computers/(\\d+)',
				},
			},
		],
		displayOptions: {
			show: {
				resource: ['computer'],
				operation: [
					'get',
					'update',
					'getStatus',
					'getEvents',
					'getDetectedSoftware',
					'getInventoryScriptResults',
					'reinventory',
					'setToNeedsOnboarding',
					'updatePrimaryPerson',
					'updateAdditionalPersons',
				],
			},
		},
	},

	// Get Many operation
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['computer'],
				operation: ['getMany', 'getInventory', 'getUserAffinities', 'getAgentStatus'],
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
				resource: ['computer'],
				operation: ['getMany', 'getInventory', 'getUserAffinities', 'getAgentStatus'],
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
				resource: ['computer'],
				operation: ['getMany'],
			},
		},
		description: '<strong>💡 Filtering Tips</strong><br>• Use filters below to reduce data at the API level<br>• For additional filtering (online/offline, maintenance status), use the <strong>Filter</strong> node after this node<br>• All computer properties are available in the response for client-side filtering',
	},

	// Filters for Get Many
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		description: 'Server-side filters to reduce data transfer. Only matching computers will be returned.',
		displayOptions: {
			show: {
				resource: ['computer'],
				operation: ['getMany'],
			},
		},
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				placeholder: 'e.g. DESKTOP, Server, {{ $json.searchTerm }}',
				description: 'Search for computers by name. Finds computers where the name contains this text (case-insensitive).',
				hint: 'Partial match - searches anywhere in computer name. Example: "DESKTOP" matches "DESKTOP-001", "MyDESKTOP", etc.',
			},
			{
				displayName: 'Tenant',
				name: 'tenantId',
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
				description: 'Filter to show only computers from a specific tenant',
				hint: 'Select a tenant to narrow results. Leave empty to show computers from all tenants.',
			},
			{
				displayName: 'Order by Updated Date',
				name: 'orderByUpdatedDate',
				type: 'boolean',
				default: false,
				description: 'Whether to sort results by most recently updated computers first',
				hint: 'When enabled, shows recently modified computers at the top of results',
			},
		],
	},

	// Update operation fields
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['computer'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Name of the computer',
			},
			{
				displayName: 'Tenant',
				name: 'tenantId',
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
					},
				],
				description: 'Tenant to assign the computer to',
			},
			{
				displayName: 'Serial Number',
				name: 'serialNumber',
				type: 'string',
				default: '',
				description: 'Serial number of the computer',
			},
			{
				displayName: 'Excluded From Maintenance',
				name: 'excludedFromMaintenance',
				type: 'boolean',
				default: false,
				description: 'Whether to exclude computer from maintenance',
			},
		],
	},

	// Add Tags operation
	{
		displayName: 'Computers',
		name: 'computerIds',
		type: 'multiOptions',
		typeOptions: {
			loadOptionsMethod: 'getComputersMulti',
		},
		default: [],
		required: true,
		displayOptions: {
			show: {
				resource: ['computer'],
				operation: ['addTags', 'removeTags', 'bulkDelete', 'restore', 'skipOnboarding', 'changeTenant'],
			},
		},
		description: 'Select one or more computers',
	},
	{
		displayName: 'Tags',
		name: 'tagIds',
		type: 'multiOptions',
		typeOptions: {
			loadOptionsMethod: 'getTagsMulti',
		},
		default: [],
		required: true,
		displayOptions: {
			show: {
				resource: ['computer'],
				operation: ['addTags', 'removeTags'],
			},
		},
		description: 'Select one or more tags to add or remove',
	},

	// Change Tenant operation
	{
		displayName: 'New Tenant',
		name: 'newTenantId',
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
			},
		],
		displayOptions: {
			show: {
				resource: ['computer'],
				operation: ['changeTenant'],
			},
		},
		description: 'New tenant to move computers to',
	},

	// Update Primary Person
	{
		displayName: 'Person',
		name: 'personId',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				typeOptions: {
					searchListMethod: 'getPersons',
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
			},
		],
		displayOptions: {
			show: {
				resource: ['computer'],
				operation: ['updatePrimaryPerson'],
			},
		},
		description: 'Person to set as primary person',
	},

	// Update Additional Persons
	{
		displayName: 'Persons',
		name: 'personIds',
		type: 'multiOptions',
		typeOptions: {
			loadOptionsMethod: 'getPersonsMulti',
		},
		default: [],
		required: true,
		displayOptions: {
			show: {
				resource: ['computer'],
				operation: ['updateAdditionalPersons'],
			},
		},
		description: 'Select one or more persons to set as additional persons',
	},

	// Get Inventory Script Results
	{
		displayName: 'Inventory Key',
		name: 'inventoryKey',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['computer'],
				operation: ['getInventoryScriptResults'],
			},
		},
		description: 'Inventory script key to retrieve results for',
	},

	// Get Events - Options
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['computer'],
				operation: ['getEvents'],
			},
		},
		options: [
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				default: 50,
				description: 'Maximum number of events to return',
			},
		],
	},
];
