// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { InitiateAuthCommand, SignUpCommand } from '@aws-sdk/client-cognito-identity-provider';

export type Command = SignUpCommand | InitiateAuthCommand; // TODO: add more commands when adding more fucntions to auth
