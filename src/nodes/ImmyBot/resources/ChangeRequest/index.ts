import type { INodeProperties } from 'n8n-workflow';

export const changeRequestOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['changeRequest'],
			},
		},
		options: [
			{
				name: 'Approve',
				value: 'approve',
				description: 'Approve a change request',
				action: 'Approve change request',
			},
			{
				name: 'Comment',
				value: 'comment',
				description: 'Add a comment to a change request',
				action: 'Comment on change request',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a change request',
				action: 'Delete change request',
			},
			{
				name: 'Deny',
				value: 'deny',
				description: 'Deny a change request',
				action: 'Deny change request',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get many change requests',
				action: 'Get many change requests',
			},
			{
				name: 'Get Open Count',
				value: 'getOpenCount',
				description: 'Get count of open change requests',
				action: 'Get open change request count',
			},
			{
				name: 'Require Changes',
				value: 'requireChanges',
				description: 'Request changes to a change request',
				action: 'Require changes to change request',
			},
		],
		default: 'getMany',
	},
];

export const changeRequestFields: INodeProperties[] = [
	// Change Request ID for operations
	{
		displayName: 'Change Request ID',
		name: 'changeRequestId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['changeRequest'],
				operation: ['approve', 'deny', 'requireChanges', 'comment', 'delete'],
			},
		},
		description: 'The ID of the change request',
		placeholder: '12345',
	},

	// Comment operation
	{
		displayName: 'Comment',
		name: 'comment',
		type: 'string',
		typeOptions: {
			rows: 4,
		},
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['changeRequest'],
				operation: ['comment', 'requireChanges'],
			},
		},
		description: 'Comment text to add',
	},

	// Deny reason
	{
		displayName: 'Reason',
		name: 'reason',
		type: 'string',
		typeOptions: {
			rows: 4,
		},
		default: '',
		required: false,
		displayOptions: {
			show: {
				resource: ['changeRequest'],
				operation: ['deny'],
			},
		},
		description: 'Reason for denying the change request',
	},

	// Get Many operation
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['changeRequest'],
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
				resource: ['changeRequest'],
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

	// Filters for Get Many
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['changeRequest'],
				operation: ['getMany'],
			},
		},
		options: [
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{
						name: 'Open',
						value: 'open',
					},
					{
						name: 'Approved',
						value: 'approved',
					},
					{
						name: 'Denied',
						value: 'denied',
					},
					{
						name: 'Changes Required',
						value: 'changesRequired',
					},
				],
				default: 'open',
				description: 'Filter by change request status',
			},
		],
	},
];
