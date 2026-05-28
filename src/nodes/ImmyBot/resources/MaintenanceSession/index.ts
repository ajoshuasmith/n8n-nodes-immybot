import type { INodeProperties } from 'n8n-workflow';

export const maintenanceSessionOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['maintenanceSession'],
			},
		},
		options: [
			{
				name: 'Run Full Maintenance',
				value: 'runFullMaintenance',
				description: 'Run full maintenance on selected computers (applies all deployments)',
				action: 'Run full maintenance on computers',
			},
			{
				name: 'Install Software',
				value: 'installSoftware',
				description: 'Install specific software on selected computers',
				action: 'Install software on computers',
			},
		],
		default: 'runFullMaintenance',
	},
];

export const maintenanceSessionFields: INodeProperties[] = [
	// Computer selection for all operations
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
				resource: ['maintenanceSession'],
				operation: ['runFullMaintenance', 'installSoftware'],
			},
		},
		description: 'Select computers to run maintenance on',
	},

	// Software selection for installSoftware operation
	{
		displayName: 'Software',
		name: 'softwareId',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				typeOptions: {
					searchListMethod: 'getSoftware',
					searchable: true,
				},
			},
			{
				displayName: 'By ID or Identifier',
				name: 'id',
				type: 'string',
				placeholder: 'e.g., 312 or google-chrome',
			},
		],
		displayOptions: {
			show: {
				resource: ['maintenanceSession'],
				operation: ['installSoftware'],
			},
		},
		description: 'The software to install on the selected computers',
	},

	// Options for all operations
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['maintenanceSession'],
				operation: ['runFullMaintenance', 'installSoftware'],
			},
		},
		options: [
			{
				displayName: 'Reboot Preference',
				name: 'rebootPreference',
				type: 'options',
				options: [
					{
						name: 'Suppress (No Reboot)',
						value: 1,
						description: 'Suppress reboots during maintenance',
					},
					{
						name: 'Allow If Needed',
						value: 0,
						description: 'Allow reboot if required by software',
					},
					{
						name: 'Force Reboot',
						value: 2,
						description: 'Force a reboot after maintenance',
					},
				],
				default: 1,
				description: 'How to handle reboots during maintenance',
			},
			{
				displayName: 'Offline Behavior',
				name: 'offlineBehavior',
				type: 'options',
				options: [
					{
						name: 'Apply on Connect',
						value: 2,
						description: 'Queue and apply when computer comes online',
					},
					{
						name: 'Skip Offline',
						value: 0,
						description: 'Skip computers that are offline',
					},
					{
						name: 'Wait for Online',
						value: 1,
						description: 'Wait for computer to come online',
					},
				],
				default: 2,
				description: 'How to handle computers that are offline',
			},
			{
				displayName: 'Skip Background Job',
				name: 'skipBackgroundJob',
				type: 'boolean',
				default: false,
				description: 'Whether to run synchronously instead of as a background job',
			},
		],
	},

	// Additional options specific to Install Software
	{
		displayName: 'Software Options',
		name: 'softwareOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['maintenanceSession'],
				operation: ['installSoftware'],
			},
		},
		options: [
			{
				displayName: 'Desired State',
				name: 'desiredSoftwareState',
				type: 'options',
				options: [
					{
						name: 'Latest Version',
						value: 5,
						description: 'Install or update to the latest version',
					},
					{
						name: 'Any Version Installed',
						value: 1,
						description: 'Ensure software is installed (any version)',
					},
					{
						name: 'Specific Version',
						value: 3,
						description: 'Install a specific version',
					},
					{
						name: 'Not Installed',
						value: 0,
						description: 'Ensure software is not installed (uninstall)',
					},
				],
				default: 5,
				description: 'The desired state of the software after maintenance',
			},
			{
				displayName: 'Repair',
				name: 'repair',
				type: 'boolean',
				default: false,
				description: 'Whether to repair the software installation',
			},
		],
	},
];
