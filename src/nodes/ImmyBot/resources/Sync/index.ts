import type { INodeProperties } from 'n8n-workflow';

export const syncOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['sync'],
			},
		},
		options: [
			{
				name: 'Trigger Azure User Sync',
				value: 'triggerAzureUserSync',
				description: 'Trigger Azure user synchronization',
				action: 'Trigger azure user sync',
			},
			{
				name: 'Trigger User Affinity Sync',
				value: 'triggerUserAffinitySync',
				description: 'Trigger user affinity synchronization',
				action: 'Trigger user affinity sync',
			},
		],
		default: 'triggerUserAffinitySync',
	},
];

export const syncFields: INodeProperties[] = [
	{
		displayName: 'Tenant',
		name: 'tenantId',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: false,
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
				resource: ['sync'],
				operation: ['triggerAzureUserSync', 'triggerUserAffinitySync'],
			},
		},
		description: 'Optional tenant to sync. If not specified, syncs all tenants.',
	},
];
