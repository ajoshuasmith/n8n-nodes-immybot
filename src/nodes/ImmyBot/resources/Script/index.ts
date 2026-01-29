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
			{
				name: 'Run Ad-Hoc Script',
				value: 'runAdHoc',
				description: 'Run a PowerShell script on a computer or tenant',
				action: 'Run ad-hoc script',
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

	// Run Ad-Hoc Script fields
	{
		displayName: 'Script Body',
		name: 'scriptBody',
		type: 'string',
		typeOptions: {
			rows: 10,
		},
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['script'],
				operation: ['runAdHoc'],
			},
		},
		description: 'The PowerShell script code to execute',
		placeholder: 'Get-Process | Select-Object -First 5',
	},
	{
		displayName: 'Target Type',
		name: 'targetType',
		type: 'options',
		options: [
			{
				name: 'Computer',
				value: 'computer',
				description: 'Run the script on a specific computer',
			},
			{
				name: 'Tenant',
				value: 'tenant',
				description: 'Run the script in tenant context (metascript)',
			},
		],
		default: 'computer',
		required: true,
		displayOptions: {
			show: {
				resource: ['script'],
				operation: ['runAdHoc'],
			},
		},
		description: 'Whether to run on a computer or in tenant context',
	},
	{
		displayName: 'Computer',
		name: 'targetComputerId',
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
				resource: ['script'],
				operation: ['runAdHoc'],
				targetType: ['computer'],
			},
		},
		description: 'The computer to run the script on',
	},
	{
		displayName: 'Tenant',
		name: 'targetTenantId',
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
				resource: ['script'],
				operation: ['runAdHoc'],
				targetType: ['tenant'],
			},
		},
		description: 'The tenant context to run the metascript in',
	},
	{
		displayName: 'Options',
		name: 'scriptOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['script'],
				operation: ['runAdHoc'],
			},
		},
		options: [
			{
				displayName: 'Script Name',
				name: 'scriptName',
				type: 'string',
				default: '',
				description: 'Optional name for the script execution',
			},
			{
				displayName: 'Execution Timeout (Seconds)',
				name: 'scriptExecutionTimeoutSeconds',
				type: 'number',
				default: 300,
				description: 'Maximum time in seconds for script execution',
			},
			{
				displayName: 'Agent Connection Timeout (Seconds)',
				name: 'agentConnectionWaitTimeoutSeconds',
				type: 'number',
				default: 120,
				description: 'Maximum time in seconds to wait for agent connection',
			},
			{
				displayName: 'Invalidate Function Script Cache',
				name: 'invalidateFunctionScriptCache',
				type: 'boolean',
				default: false,
				description: 'Whether to invalidate the function script cache before execution',
			},
		],
	},
];
