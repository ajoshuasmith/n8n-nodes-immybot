import type { INodeProperties } from 'n8n-workflow';

export const maintenanceActionOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['maintenanceAction'],
			},
		},
		options: [
			{
				name: 'Get Latest for Computer',
				value: 'getLatestForComputer',
				description: 'Get latest maintenance action for a computer',
				action: 'Get latest maintenance action for computer',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get many maintenance actions',
				action: 'Get many maintenance actions',
			},
		],
		default: 'getMany',
	},
];

export const maintenanceActionFields: INodeProperties[] = [
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
			},
		],
		displayOptions: {
			show: {
				resource: ['maintenanceAction'],
				operation: ['getLatestForComputer'],
			},
		},
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['maintenanceAction'],
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
				resource: ['maintenanceAction'],
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
