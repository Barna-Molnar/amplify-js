import type {
	GetCredentialsForIdentityCommandInput,
	GetCredentialsForIdentityCommandOutput,
	Credentials,
} from '@aws-sdk/client-cognito-identity';
import {
	buildHttpRpcRequest,
	cognitoIdentityTransferHandler,
	defaultConfigs,
	sharedHeaders,
} from './base';
import { composeServiceApi } from '../../clients/internal/composeApiHandler';
import { Endpoint, HttpRequest, HttpResponse } from '../../clients/types';
import {
	parseJsonBody,
	throwJsonError,
	expectString,
	parseEpochTimestamp,
	parseMetadata,
} from '../../clients/serde';

export type {
	GetCredentialsForIdentityCommandInput,
	GetCredentialsForIdentityCommandOutput,
} from '@aws-sdk/client-cognito-identity';

const getCredentialsForIdentitySerializer = (
	input: GetCredentialsForIdentityCommandInput,
	endpoint: Endpoint
): HttpRequest => {
	const headers = sharedHeaders('GetCredentialsForIdentity');
	const body = JSON.stringify(input);
	return buildHttpRpcRequest(endpoint, headers, body);
};

const getCredentialsForIdentityDeserializer = async (
	response: HttpResponse
): Promise<GetCredentialsForIdentityCommandOutput> => {
	if (response.statusCode >= 300) {
		await throwJsonError(response);
	} else {
		const body = await parseJsonBody(response);
		return {
			$metadata: parseMetadata(response),
			Credentials: de_Credentials(body.Credentials),
			IdentityId: expectString(body.IdentityId),
		};
	}
};

const de_Credentials = (output: unknown = {}): Credentials => ({
	AccessKeyId: expectString(output['AccessKeyId']),
	Expiration: parseEpochTimestamp(output['Expiration']),
	SecretKey: expectString(output['SecretKey']),
	SessionToken: expectString(output['SessionToken']),
});

export const getCredentialsForIdentity = composeServiceApi(
	cognitoIdentityTransferHandler,
	getCredentialsForIdentitySerializer,
	getCredentialsForIdentityDeserializer,
	defaultConfigs
);
