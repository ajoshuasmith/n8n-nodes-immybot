# @joshuanode/n8n-nodes-immybot

[![NPM Version](https://img.shields.io/npm/v/@joshuanode/n8n-nodes-immybot)](https://www.npmjs.com/package/@joshuanode/n8n-nodes-immybot)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![n8n Community Node](https://img.shields.io/badge/n8n-community%20node-00D4AA)](https://n8n.io)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)

This is an n8n community node for [ImmyBot](https://immy.bot), the intelligent IT automation and management platform. It enables automated workflows for computer management, software deployment, maintenance actions, and more within n8n.

## Features

| Feature | Description |
|---------|-------------|
| **Computer Management** | Complete computer lifecycle management with 20+ operations including inventory, status monitoring, and configuration |
| **Change Request Workflow** | Full change request approval workflow with approve, deny, require changes, and commenting capabilities |
| **Multi-Tenant Support** | Manage computers and resources across multiple tenants with tenant-specific operations |
| **Dynamic Dropdowns** | Resource locators with searchable dropdowns for computers, tenants, persons, tags, users, and more |
| **Multi-Select Pickers** | Visual multi-select dropdowns for bulk operations - select multiple computers, tags, or persons with dynamic API-loaded lists |
| **Server-Side Filtering** | Filter computers by name and tenant directly at the API level to reduce data transfer and improve performance |
| **Tag Management** | Bulk add/remove tags to organize and categorize computers |
| **Maintenance Operations** | Monitor and retrieve maintenance actions and session data |
| **Software Management** | Comprehensive local and global software operations including create, retrieve, and delete with pagination |
| **User Management** | Full user lifecycle including creation, roles, permissions, and access control with 12 operations |
| **Sync Operations** | Trigger Azure user sync and user affinity sync across tenants |
| **Script Management** | Query and manage deployment and inventory scripts |
| **Person Management** | Associate users with computers and manage primary/additional persons |
| **Bulk Operations** | Efficiently manage multiple computers and users with bulk delete, restore, and tenant change operations |
| **Pagination Controls** | All list operations support Return All or configurable limits (max 500) to handle large datasets efficiently |

## Installation

### Community Nodes (Recommended)

1. Open n8n and navigate to **Settings** → **Community Nodes**
2. Click **Install** and search for `@joshuanode/n8n-nodes-immybot`
3. Click **Install** to add the node to your n8n instance

### Manual Installation

```bash
npm install @joshuanode/n8n-nodes-immybot
```

## Credentials

### Setting up Immy.Bot OAuth2 API Credentials

This node uses Azure AD OAuth2 authentication. To configure:

1. **Create Azure AD App Registration**:
   - Navigate to [Microsoft Entra ID](https://portal.azure.com/#view/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/~/Overview)
   - Go to **App registrations** → **New registration**
   - Enter a name (e.g., "n8n ImmyBot Integration")
   - Use default settings and click **Register**

2. **Generate Client Secret**:
   - In your app registration, go to **Certificates & secrets**
   - Click **New client secret**
   - Add a description and expiration period
   - Copy the **Value** (not the Secret ID)

3. **Collect Required Information**:
   - **Azure AD Tenant ID**: Found in your app registration's **Overview** page
   - **Client ID**: The Application (client) ID from **Overview**
   - **Client Secret**: The value you copied in step 2
   - **ImmyBot Subdomain**: Your ImmyBot subdomain (e.g., "yourcompany" for yourcompany.immy.bot)

4. **Configure in n8n**:
   - Create a new **Immy.Bot OAuth2 API** credential
   - Enter the Azure AD Tenant ID, Client ID, Client Secret, and Subdomain
   - Test the connection

For detailed setup instructions, see the [ImmyBot API Documentation](https://docs.immy.bot/Documentation/Reference/api-documentation.html).

**Note:** The OAuth2 token is automatically acquired and refreshed by the node.

## Operations by Resource

### Change Request (7 operations)

| Operation | Description |
|-----------|-------------|
| Approve | Approve a change request |
| Deny | Deny a change request with optional reason |
| Require Changes | Request changes to a change request with comment |
| Comment | Add a comment to a change request |
| Delete | Delete a change request |
| Get Many | List change requests with status filtering and pagination |
| Get Open Count | Get count of open change requests |

### Computer (20 operations)

| Operation | Description |
|-----------|-------------|
| Get | Retrieve a single computer by ID |
| Get Many | List computers with server-side filtering by name and tenant |
| Update | Update computer properties including name, tenant, and maintenance settings |
| Get Status | Get current status and health information for a computer |
| Get Events | Retrieve event history for a computer |
| Get Detected Software | List all software detected on a computer |
| Get Inventory | Retrieve inventory data across all computers |
| Get Inventory Script Results | Get results from custom inventory scripts |
| Get User Affinities | View user affinity relationships across computers |
| Get Agent Status | Check ImmyBot agent connectivity status |
| Add Tags | Add tags to multiple computers using visual multi-select picker |
| Remove Tags | Remove tags from multiple computers using visual multi-select picker |
| Change Tenant | Move multiple computers to a different tenant with multi-select |
| Bulk Delete | Delete multiple computers at once with multi-select picker |
| Restore | Restore previously deleted computers with multi-select picker |
| Reinventory | Trigger a new inventory scan for a computer |
| Set to Needs Onboarding | Mark a computer for onboarding |
| Skip Onboarding | Skip the onboarding process for multiple computers with multi-select |
| Update Primary Person | Assign or update the primary user for a computer |
| Update Additional Persons | Manage multiple additional users with multi-select person picker |

### Tenant (5 operations)

| Operation | Description |
|-----------|-------------|
| Get | Retrieve a single tenant by ID |
| Get Many | List all tenants |
| Create | Create a new tenant |
| Update | Update tenant properties |
| Bulk Delete | Delete multiple tenants |

### Software (8 operations)

| Operation | Description |
|-----------|-------------|
| Get Global Software | Retrieve global software by identifier |
| Get Local Software | Retrieve local software by identifier |
| Get Many Global | List global software items with pagination |
| Get Many Local | List local software items with pagination |
| Create Global Software | Create a new global software item |
| Create Local Software | Create a new local software item |
| Delete Global Software | Delete a global software item |
| Delete Local Software | Delete a local software item |

### Sync (2 operations)

| Operation | Description |
|-----------|-------------|
| Trigger Azure User Sync | Trigger Azure user synchronization for tenants |
| Trigger User Affinity Sync | Trigger user affinity synchronization |

### User (12 operations)

| Operation | Description |
|-----------|-------------|
| Get | Retrieve a user by ID |
| Get Many | List users with pagination |
| Create from Person | Create a user account from a person record |
| Update | Update user details |
| Delete | Delete a user account |
| Bulk Delete | Delete multiple users at once |
| Get Claims | Retrieve user claims and permissions |
| Add Roles | Add roles to a user |
| Remove Roles | Remove roles from a user |
| Grant Access | Grant tenant access to a user |
| Update Expiration | Update user access expiration date |
| Invalidate Cache | Invalidate user cache |

### Maintenance Action (2 operations)

| Operation | Description |
|-----------|-------------|
| Get Latest for Computer | Get the most recent maintenance action for a computer |
| Get Many | List maintenance actions across all computers |

### Person (2 operations)

| Operation | Description |
|-----------|-------------|
| Get | Retrieve person details by ID |
| Get Many | List all persons |

### Script (3 operations)

| Operation | Description |
|-----------|-------------|
| Get Global Script | Retrieve a global script by ID |
| Get Local Script | Retrieve a local script by ID |
| Get Many | List scripts with database type filtering (Global, Local, or Both) and pagination |

### Tag (2 operations)

| Operation | Description |
|-----------|-------------|
| Get | Retrieve tag details by ID |
| Get Many | List all tags |

## Usage Examples

### Example 1: Monitor Computer Health

```
Trigger (Schedule) → ImmyBot (Computer: Get Many) → Filter (Status = Offline) → Send Alert
```

This workflow runs on a schedule, retrieves all computers, filters for offline devices, and sends alerts.

### Example 2: Automated Tagging

```
Webhook → ImmyBot (Computer: Get by ID) → Conditional → ImmyBot (Computer: Add Tags)
```

When a webhook is triggered, fetch computer details and automatically apply tags based on conditions.

### Example 3: Software Inventory Report

```
Schedule → ImmyBot (Computer: Get Many) → ImmyBot (Computer: Get Detected Software) → Export to CSV
```

Generate regular reports of installed software across all managed computers.

### Example 4: Bulk Tenant Migration

```
Manual Trigger → ImmyBot (Computer: Get Many, Filter by Tenant) → ImmyBot (Computer: Change Tenant)
```

Move multiple computers from one tenant to another with a single workflow execution.

## Architecture

```
┌─────────────┐         ┌──────────────┐         ┌─────────────────┐
│  n8n        │         │  ImmyBot     │         │  ImmyBot API    │
│  Workflow   │────────▶│  Node        │────────▶│  v1             │
│             │         │              │         │                 │
└─────────────┘         └──────────────┘         └─────────────────┘
                               │
                               │
                        ┌──────▼──────┐
                        │  Resource   │
                        │  Locators & │
                        │  List Search│
                        └─────────────┘
```

## Features in Detail

### Resource Locators

All ID-based parameters use resource locators with three modes:

- **From List**: Searchable dropdown populated from your ImmyBot instance
- **By ID**: Direct numeric ID input with validation
- **By URL**: Extract ID from ImmyBot URLs (for Computer resource)

### Filtering & Pagination

List operations support:

- **Return All**: Retrieve all results (use with caution for large datasets)
- **Limit**: Specify maximum number of results to return (1-500)
- **Server-Side Filters**:
  - **Name**: Filter computers by name (supports partial matching)
  - **Tenant**: Filter by specific tenant to reduce data transfer
  - **Order by Updated Date**: Sort by most recently updated computers

**Note**: For additional filtering (online/offline status, maintenance exclusion, etc.), use n8n's built-in **Filter** node after the ImmyBot node. All computer fields are available in the response data for client-side filtering.

### Multi-Select Pickers

Bulk operations now feature visual multi-select dropdowns:

- **Computer Selection**: Choose multiple computers from a searchable list loaded from your ImmyBot instance
- **Tag Selection**: Select multiple tags with real-time search and filtering
- **Person Selection**: Pick multiple persons from your organization's directory
- **Dynamic Loading**: All options are fetched from your ImmyBot API in real-time
- **Better UX**: No more comma-separated IDs - visual selection prevents typos and errors

### Error Handling

The node implements proper error handling and supports n8n's **Continue on Fail** mode, allowing workflows to proceed even when individual operations fail.

## Development

```bash
# Install dependencies
npm install

# Build the node
npm run build

# Lint the code
npm run lint

# Lint and fix issues
npm run lintfix
```

## Resources

- [ImmyBot Documentation](https://docs.immy.bot/)
- [ImmyBot API Reference](https://docs.immy.bot/api)
- [n8n Community Nodes Documentation](https://docs.n8n.io/integrations/community-nodes/)
- [n8n Node Development Guide](https://docs.n8n.io/integrations/creating-nodes/)

## Compatibility

- **n8n version**: 0.220.0 or later
- **Node.js version**: 18.17.0 or later
- **ImmyBot API**: v1

## License

[MIT](LICENSE)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues, questions, or feature requests, please:

1. Check the [ImmyBot Documentation](https://docs.immy.bot/)
2. Review existing [GitHub Issues](https://github.com/ajoshuasmith/n8n-nodes-immybot/issues)
3. Create a new issue with detailed information about your problem or request

## Acknowledgments

Built with the [n8n-node-dev](https://www.npmjs.com/package/n8n-node-dev) CLI tool.

---

**Note:** This is a community-maintained node and is not officially supported by ImmyBot or n8n.io.
