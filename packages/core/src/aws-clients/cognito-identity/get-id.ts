import type {
	GetIdCommandInput,
	GetIdCommandOutput,
} from '@aws-sdk/client-cognito-identity';
import { cognitoIdentityTransferClient, defaultConfigs } from './base';
import {
	composeServiceApi,
	Endpoint,
	HttpRequest,
	HttpResponse,
	parseBody,
	throwError,
} from '../../clients';

export type {
	GetIdCommandInput,
	GetIdCommandOutput,
} from '@aws-sdk/client-cognito-identity';

const getIdSerializer = async (
	input: GetIdCommandInput,
	endpoint: Endpoint
): Promise<HttpRequest> => {
	return {
		headers: {
			'content-type': 'application/x-amz-json-1.1',
			'x-amz-target': 'AWSCognitoIdentityService.GetId',
		},
		method: 'POST',
		destination: endpoint.url,
		body: JSON.stringify(input),
	};
};

const getIdDeserializer = async (
	response: HttpResponse
): Promise<GetIdCommandOutput> => {
	if (response.statusCode >= 300) {
		throw await throwError(response);
	} else {
		const body = await parseBody(response);
		return body as GetIdCommandOutput;
	}
};

export const getId = composeServiceApi(
	cognitoIdentityTransferClient,
	getIdSerializer,
	getIdDeserializer,
	defaultConfigs
);
