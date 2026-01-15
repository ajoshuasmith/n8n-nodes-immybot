import type { INodeProperties } from 'n8n-workflow';

export const scriptOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['script'],
			},
		},
		options: [
			{
				name: 'Get Global Script',
				value: 'getGlobal',
				description: 'Get a global script by ID',
				action: 'Get global script',
			},
			{
				name: 'Get Local Script',
				value: 'getLocal',
				description: 'Get a local script by ID',
				action: 'Get local script',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get many scripts',
				action: 'Get many scripts',
			},
		],
		default: 'getMany',
	},
];

export const scriptFields: INodeProperties[] = [
	{
		displayName: 'Script ID',
		name: 'scriptId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['script'],
				operation: ['getLocal', 'getGlobal'],
			},
		},
		description: 'The ID of the script',
		placeholder: '12345',
	},
	{
		displayName: 'Database Type',
		name: 'databaseType',
		type: 'options',
		options: [
			{
				name: 'Global',
				value: 'Global',
			},
			{
				name: 'Local',
				value: 'Local',
			},
			{
				name: 'Both',
				value: 'Both',
			},
		],
		default: 'Local',
		displayOptions: {
			show: {
				resource: ['script'],
				operation: ['getMany'],
			},
		},
		description: 'Type of scripts to retrieve',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['script'],
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
				resource: ['script'],
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
