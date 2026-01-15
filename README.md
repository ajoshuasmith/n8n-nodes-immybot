# @joshuanode/n8n-nodes-immybot

[![NPM Version](https://img.shields.io/npm/v/@joshuanode/n8n-nodes-immybot)](https://www.npmjs.com/package/@joshuanode/n8n-nodes-immybot)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![n8n Community Node](https://img.shields.io/badge/n8n-community%20node-00D4AA)](https://n8n.io)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)

This is an n8n community node for [ImmyBot](https://immy.bot), the intelligent IT automation and management platform. It enables automated workflows for computer management, software deployment, maintenance actions, and more within n8n.

## Features

- **Computer Management** - 20+ operations for inventory, status monitoring, configuration, and bulk actions
- **Change Request Workflow** - Approve, deny, require changes, and comment on change requests
- **Multi-Tenant Support** - Manage resources across multiple tenants
- **Multi-Select Pickers** - Visual dropdowns for bulk operations with dynamic API-loaded lists
- **Server-Side Filtering** - Filter by name and tenant at the API level to reduce data transfer
- **Software & Script Management** - Manage global/local software and deployment scripts with pagination
- **User Management** - 12 operations for user lifecycle, roles, permissions, and access control
- **Tag & Person Management** - Organize computers with tags and associate users
- **Sync Operations** - Trigger Azure user sync and user affinity sync

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

**Monitor Computer Health**
```
Schedule → Get Many Computers → Filter (Offline) → Send Alert
```

**Software Inventory Report**
```
Schedule → Get Many Computers → Get Detected Software → Export CSV
```

**Bulk Tenant Migration**
```
Manual Trigger → Get Many Computers (Filter by Tenant) → Change Tenant
```

## Additional Details

**Resource Locators** - All ID-based parameters support three input modes: searchable dropdown (From List), direct ID entry (By ID), or URL extraction (By URL for computers).

**Server-Side Filtering** - Filter computers by name and tenant at the API level. For additional filtering (online/offline status, etc.), use n8n's Filter node after retrieving data.

**Multi-Select Pickers** - Bulk operations feature visual multi-select dropdowns for computers, tags, and persons, loaded dynamically from your ImmyBot instance.

**Pagination** - All list operations support "Return All" or configurable limits (1-500) to efficiently handle large datasets.

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
