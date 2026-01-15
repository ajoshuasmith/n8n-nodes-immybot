import type { INodeProperties } from 'n8n-workflow';

export const softwareOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['software'],
			},
		},
		options: [
			{
				name: 'Get Global Software',
				value: 'getGlobal',
				description: 'Get a global software by identifier',
				action: 'Get global software',
			},
			{
				name: 'Get Local Software',
				value: 'getLocal',
				description: 'Get a local software by identifier',
				action: 'Get local software',
			},
			{
				name: 'Get Many Global',
				value: 'getManyGlobal',
				description: 'Get many global software items',
				action: 'Get many global software items',
			},
			{
				name: 'Get Many Local',
				value: 'getManyLocal',
				description: 'Get many local software items',
				action: 'Get many local software items',
			},
			{
				name: 'Create Global Software',
				value: 'createGlobal',
				description: 'Create a new global software item',
				action: 'Create global software',
			},
			{
				name: 'Create Local Software',
				value: 'createLocal',
				description: 'Create a new local software item',
				action: 'Create local software',
			},
			{
				name: 'Delete Global Software',
				value: 'deleteGlobal',
				description: 'Delete a global software item',
				action: 'Delete global software',
			},
			{
				name: 'Delete Local Software',
				value: 'deleteLocal',
				description: 'Delete a local software item',
				action: 'Delete local software',
			},
		],
		default: 'getManyLocal',
	},
];

export const softwareFields: INodeProperties[] = [
	// Software Identifier for get/delete operations
	{
		displayName: 'Software Identifier',
		name: 'softwareIdentifier',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['software'],
				operation: ['getLocal', 'getGlobal', 'deleteLocal', 'deleteGlobal'],
			},
		},
		description: 'The unique identifier for the software (e.g., "google-chrome", "mozilla-firefox")',
		placeholder: 'google-chrome',
	},

	// Get Many operations
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['software'],
				operation: ['getManyLocal', 'getManyGlobal'],
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
				resource: ['software'],
				operation: ['getManyLocal', 'getManyGlobal'],
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

	// Create operations
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['software'],
				operation: ['createLocal', 'createGlobal'],
			},
		},
		description: 'Name of the software',
	},
	{
		displayName: 'Software Identifier',
		name: 'softwareIdentifier',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['software'],
				operation: ['createLocal', 'createGlobal'],
			},
		},
		description: 'Unique identifier for the software (e.g., "google-chrome")',
		placeholder: 'google-chrome',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['software'],
				operation: ['createLocal', 'createGlobal'],
			},
		},
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Description of the software',
			},
			{
				displayName: 'Publisher',
				name: 'publisher',
				type: 'string',
				default: '',
				description: 'Software publisher/vendor',
			},
		],
	},
];
