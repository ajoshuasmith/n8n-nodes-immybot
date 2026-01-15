import type { IExecuteFunctions, ILoadOptionsFunctions, IDataObject } from 'n8n-workflow';

export interface ImmyBotAuthOptions {
	baseURL: string;
	headers: {
		Authorization: string;
		'Content-Type': string;
		Accept: string;
	};
}

export async function getImmyBotAuth(
	context: IExecuteFunctions | ILoadOptionsFunctions,
): Promise<ImmyBotAuthOptions> {
	const credentials = await context.getCredentials('immyDotBotOAuth2Api');

	// Get OAuth2 token from Azure AD
	const tokenUrl = `https://login.microsoftonline.com/${credentials.tenantId}/oauth2/v2.0/token`;
	const scope = `https://${credentials.subdomain}.immy.bot/.default`;

	const tokenBody = new URLSearchParams({
		grant_type: 'client_credentials',
		client_id: credentials.clientId as string,
		client_secret: credentials.clientSecret as string,
		scope: scope,
	});

	const tokenResponse = await context.helpers.httpRequest({
		method: 'POST',
		url: tokenUrl,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		body: tokenBody.toString(),
	});

	return {
		baseURL: `https://${credentials.subdomain}.immy.bot`,
		headers: {
			Authorization: `Bearer ${(tokenResponse as IDataObject).access_token}`,
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
	};
}
