import type { INodeProperties } from 'n8n-workflow';

export const personOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['person'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get a person by ID',
				action: 'Get a person',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get many persons',
				action: 'Get many persons',
			},
		],
		default: 'getMany',
	},
];

export const personFields: INodeProperties[] = [
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
				placeholder: '12345',
			},
		],
		displayOptions: {
			show: {
				resource: ['person'],
				operation: ['get'],
			},
		},
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['person'],
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
				resource: ['person'],
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
				resource: ['person'],
				operation: ['getMany'],
			},
		},
		description:
			'<strong>💡 Filtering Tips</strong><br>• Use filters below to reduce data at the API level<br>• Combine filters to find specific people (e.g., by name and tenant)<br>• All person properties are available in the response for additional filtering',
	},

	// Filters for Get Many
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		description: 'Server-side filters to reduce data transfer. Only matching persons will be returned.',
		displayOptions: {
			show: {
				resource: ['person'],
				operation: ['getMany'],
			},
		},
		options: [
			{
				displayName: 'First Name',
				name: 'firstName',
				type: 'string',
				default: '',
				placeholder: 'e.g. John, {{ $json.firstName }}',
				description:
					'Search for persons by first name. Finds persons where the first name contains this text (case-insensitive).',
				hint: 'Partial match - searches anywhere in first name. Example: "Jon" matches "Jonathan", "Jon", etc.',
			},
			{
				displayName: 'Last Name',
				name: 'lastName',
				type: 'string',
				default: '',
				placeholder: 'e.g. Smith, {{ $json.lastName }}',
				description:
					'Search for persons by last name. Finds persons where the last name contains this text (case-insensitive).',
				hint: 'Partial match - searches anywhere in last name.',
			},
			{
				displayName: 'Email Address',
				name: 'emailAddress',
				type: 'string',
				default: '',
				placeholder: 'e.g. john@company.com, {{ $json.email }}',
				description:
					'Search for persons by email address. Finds persons where the email contains this text (case-insensitive).',
				hint: 'Partial match - searches anywhere in email. Example: "company.com" matches all persons from that domain.',
			},
			{
				displayName: 'Display Name',
				name: 'displayName',
				type: 'string',
				default: '',
				placeholder: 'e.g. John Smith, {{ $json.displayName }}',
				description:
					'Search for persons by display name. Finds persons where the display name contains this text (case-insensitive).',
				hint: 'Partial match - searches anywhere in display name.',
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
				description: 'Filter to show only persons from a specific tenant',
				hint: 'Narrow results to persons belonging to a particular organization or tenant.',
			},
			{
				displayName: 'Sort By',
				name: 'sortBy',
				type: 'options',
				options: [
					{
						name: 'First Name (A-Z)',
						value: 'firstName',
					},
					{
						name: 'First Name (Z-A)',
						value: '-firstName',
					},
					{
						name: 'Last Name (A-Z)',
						value: 'lastName',
					},
					{
						name: 'Last Name (Z-A)',
						value: '-lastName',
					},
					{
						name: 'Display Name (A-Z)',
						value: 'displayName',
					},
					{
						name: 'Display Name (Z-A)',
						value: '-displayName',
					},
					{
						name: 'Email (A-Z)',
						value: 'emailAddress',
					},
					{
						name: 'Email (Z-A)',
						value: '-emailAddress',
					},
					{
						name: 'Created Date (Oldest First)',
						value: 'createdDate',
					},
					{
						name: 'Created Date (Newest First)',
						value: '-createdDate',
					},
				],
				default: 'lastName',
				description: 'Sort results by a specific field',
				hint: 'Choose how to order the results. Prefix with "-" means descending order.',
			},
		],
	},
];
