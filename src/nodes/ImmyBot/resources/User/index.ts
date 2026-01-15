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

	// Notice about filtering
	{
		displayName: '',
		name: 'filtersNotice',
		type: 'notice',
		default: '',
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['getMany'],
			},
		},
		description:
			'<strong>💡 Filtering Tips</strong><br>• Use filters below to reduce data at the API level<br>• Combine filters to find specific users (e.g., admins in a specific tenant)<br>• All user properties are available in the response for additional filtering',
	},

	// Filters for Get Many
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		description: 'Server-side filters to reduce data transfer. Only matching users will be returned.',
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['getMany'],
			},
		},
		options: [
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				default: '',
				placeholder: 'e.g. john@company.com, {{ $json.email }}',
				description:
					'Search for users by email address. Finds users where the email contains this text (case-insensitive).',
				hint: 'Partial match - searches anywhere in email. Example: "company.com" matches all users from that domain.',
			},
			{
				displayName: 'Display Name',
				name: 'displayName',
				type: 'string',
				default: '',
				placeholder: 'e.g. John Doe, {{ $json.userName }}',
				description:
					'Search for users by display name. Finds users where the name contains this text (case-insensitive).',
				hint: 'Partial match - searches anywhere in display name. Example: "John" matches "John Doe", "Johnny Smith", etc.',
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
				description: 'Filter to show only users from a specific tenant',
				hint: 'Narrow results to users belonging to a particular organization or tenant.',
			},
			{
				displayName: 'Admin Users',
				name: 'isAdmin',
				type: 'options',
				options: [
					{
						name: 'All',
						value: '',
					},
					{
						name: 'Admins Only',
						value: 'true',
					},
					{
						name: 'Non-Admins Only',
						value: 'false',
					},
				],
				default: '',
				description: 'Filter by admin status',
				hint: 'Admin users have elevated permissions across the system.',
			},
			{
				displayName: 'Support Technicians',
				name: 'isSupportTechnician',
				type: 'options',
				options: [
					{
						name: 'All',
						value: '',
					},
					{
						name: 'Support Technicians Only',
						value: 'true',
					},
					{
						name: 'Non-Support Only',
						value: 'false',
					},
				],
				default: '',
				description: 'Filter by support technician status',
				hint: 'Support technicians have special permissions for troubleshooting and support tasks.',
			},
			{
				displayName: 'Email Confirmed',
				name: 'emailConfirmed',
				type: 'options',
				options: [
					{
						name: 'All',
						value: '',
					},
					{
						name: 'Confirmed Only',
						value: 'true',
					},
					{
						name: 'Unconfirmed Only',
						value: 'false',
					},
				],
				default: '',
				description: 'Filter by email confirmation status',
				hint: 'Users must confirm their email address before full account activation.',
			},
			{
				displayName: 'Sort By',
				name: 'sortBy',
				type: 'options',
				options: [
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
						value: 'email',
					},
					{
						name: 'Email (Z-A)',
						value: '-email',
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
				default: 'displayName',
				description: 'Sort results by a specific field',
				hint: 'Choose how to order the results. Prefix with "-" means descending order.',
			},
		],
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
