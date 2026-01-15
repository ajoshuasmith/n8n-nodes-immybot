import type {
	ICredentialType,
	INodeProperties,
	ICredentialTestRequest,
	ICredentialDataDecryptedObject,
	IHttpRequestOptions,
} from 'n8n-workflow';

export class ImmyDotBotOAuth2Api implements ICredentialType {
	name = 'immyDotBotOAuth2Api';

	displayName = 'Immy.Bot OAuth2 API';

	documentationUrl = 'https://docs.immy.bot/Documentation/Reference/api-documentation.html';

	properties: INodeProperties[] = [
		{
			displayName: 'Azure AD Tenant ID',
			name: 'tenantId',
			type: 'string',
			default: '',
			description: 'The Azure AD Tenant ID from your Microsoft Entra ID',
			required: true,
		},
		{
			displayName: 'Client ID',
			name: 'clientId',
			type: 'string',
			default: '',
			description: 'Application (Client) ID from your Azure App Registration',
			required: true,
		},
		{
			displayName: 'Client Secret',
			name: 'clientSecret',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description: 'Client secret value generated in Azure App Registration → Certificates & Secrets',
			required: true,
		},
		{
			displayName: 'ImmyBot Subdomain',
			name: 'subdomain',
			type: 'string',
			default: '',
			description: 'Your ImmyBot subdomain (e.g., "yourcompany" for yourcompany.immy.bot)',
			required: true,
		},
	];

	async authenticate(
		credentials: ICredentialDataDecryptedObject,
		requestOptions: IHttpRequestOptions,
	): Promise<IHttpRequestOptions> {
		// Get OAuth2 token from Azure AD
		const tokenUrl = `https://login.microsoftonline.com/${credentials.tenantId}/oauth2/v2.0/token`;
		const scope = `https://${credentials.subdomain}.immy.bot/.default`;

		const tokenBody = new URLSearchParams({
			grant_type: 'client_credentials',
			client_id: credentials.clientId as string,
			client_secret: credentials.clientSecret as string,
			scope: scope,
		});

		// Make token request using this.helpers if available, otherwise use fetch
		let tokenResponse;
		try {
			// Try to use n8n helpers if available
			if ((this as any).helpers?.httpRequest) {
				tokenResponse = await (this as any).helpers.httpRequest({
					method: 'POST',
					url: tokenUrl,
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
					},
					body: tokenBody.toString(),
				});
			} else {
				// Fallback to fetch
				const response = await fetch(tokenUrl, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
					},
					body: tokenBody.toString(),
				});
				tokenResponse = await response.json();
			}
		} catch (error) {
			throw new Error(`Failed to acquire OAuth2 token: ${(error as Error).message}`);
		}

		// Set base URL from subdomain
		requestOptions.baseURL = `https://${credentials.subdomain}.immy.bot`;

		// Add Bearer token to request
		if (!requestOptions.headers) {
			requestOptions.headers = {};
		}

		requestOptions.headers['Authorization'] = `Bearer ${tokenResponse.access_token}`;

		return requestOptions;
	}

	test: ICredentialTestRequest = {
		request: {
			url: '/api/v1/tenants',
			method: 'GET',
		},
	};
}
