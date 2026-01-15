import type { INodeProperties } from 'n8n-workflow';

export const userOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['user'],
			},
		},
		options: [
			{
				name: 'Add Roles',
				value: 'addRoles',
				description: 'Add roles to a user',
				action: 'Add roles to user',
			},
			{
				name: 'Bulk Delete',
				value: 'bulkDelete',
				description: 'Delete multiple users',
				action: 'Bulk delete users',
			},
			{
				name: 'Create from Person',
				value: 'createFromPerson',
				description: 'Create a user from a person record',
				action: 'Create user from person',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a user',
				action: 'Delete a user',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a user by ID',
				action: 'Get a user',
			},
			{
				name: 'Get Claims',
				value: 'getClaims',
				description: 'Get user claims',
				action: 'Get user claims',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get many users',
				action: 'Get many users',
			},
			{
				name: 'Grant Access',
				value: 'grantAccess',
				description: 'Grant access to a user',
				action: 'Grant access to user',
			},
			{
				name: 'Invalidate Cache',
				value: 'invalidateCache',
				description: 'Invalidate user cache',
				action: 'Invalidate user cache',
			},
			{
				name: 'Remove Roles',
				value: 'removeRoles',
				description: 'Remove roles from a user',
				action: 'Remove roles from user',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a user',
				action: 'Update a user',
			},
			{
				name: 'Update Expiration',
				value: 'updateExpiration',
				description: 'Update user access expiration',
				action: 'Update user expiration',
			},
		],
		default: 'getMany',
	},
];

export const userFields: INodeProperties[] = [
	// Get, Update, Delete operations
	{
		displayName: 'User',
		name: 'userId',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				typeOptions: {
					searchListMethod: 'getUsers',
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
							regex: '^[0-9a-fA-F-]+$',
							errorMessage: 'Must be a valid user ID (GUID)',
						},
					},
				],
				placeholder: '12345678-1234-1234-1234-123456789abc',
			},
		],
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['get', 'update', 'delete'],
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
				resource: ['user'],
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
				resource: ['user'],
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

	// Update Fields
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				default: '',
				description: 'Email address of the user',
			},
			{
				displayName: 'First Name',
				name: 'firstName',
				type: 'string',
				default: '',
				description: 'First name of the user',
			},
			{
				displayName: 'Last Name',
				name: 'lastName',
				type: 'string',
				default: '',
				description: 'Last name of the user',
			},
		],
	},

	// Create from Person
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
				resource: ['user'],
				operation: ['createFromPerson'],
			},
		},
		description: 'Person to create user from',
	},

	// Bulk Delete
	{
		displayName: 'User IDs',
		name: 'userIds',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['bulkDelete'],
			},
		},
		description: 'Comma-separated list of user IDs (GUIDs)',
		placeholder: '12345678-1234-1234-1234-123456789abc,87654321-4321-4321-4321-cba987654321',
	},

	// Add/Remove Roles
	{
		displayName: 'User Email',
		name: 'userEmail',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['addRoles', 'removeRoles', 'grantAccess', 'updateExpiration'],
			},
		},
		description: 'Email address of the user',
	},
	{
		displayName: 'Role Names',
		name: 'roleNames',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['addRoles', 'removeRoles'],
			},
		},
		description: 'Comma-separated list of role names',
		placeholder: 'Admin,Technician',
	},

	// Grant Access
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
			},
		],
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['grantAccess'],
			},
		},
		description: 'Tenant to grant access to',
	},

	// Update Expiration
	{
		displayName: 'Expiration Date',
		name: 'expirationDate',
		type: 'dateTime',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['updateExpiration'],
			},
		},
		description: 'Expiration date for user access',
	},
];
