'use strict';

import * as db from './index';
import { ObjectId } from 'mongodb';
import toObjectId from '../lib/misc/toobjectid';
import { CredentialPlatform } from '../lib/struct/credentials';

export type TokenExchangeMethod = 'post' | 'basic';

export type Credential = {
	_id?: ObjectId;
	orgId: ObjectId;
	teamId: ObjectId;
	platform: CredentialPlatform;
	credentials: {
		key?: string;
		endpointURL?: string;
		clientId?: string;
		clientSecret?: string;
		authURL?: string;
		tokenURL?: string;
		scope?: string;
		tokenExchangeMethod?: TokenExchangeMethod;
	};
    name: string;
    createdDate: Date;
}

export function CredentialCollection() {
	return db.db().collection('credentials');
}

export function getCredentialById(teamId: db.IdOrStr, credentialId: db.IdOrStr): Promise<Credential> {
	return CredentialCollection().findOne({
		_id: toObjectId(credentialId),
		teamId: toObjectId(teamId),
	}, {
		projection: {
			credentials: 0,
		}
	});
}

export function getCredentialsByTeam(teamId: db.IdOrStr): Promise<Credential> {
	return CredentialCollection().find({
		teamId: toObjectId(teamId),
	}, {
		projection: {
			credentials: 0,
		}
	}).toArray();
}

export async function addCredential(credential: Credential): Promise<db.InsertResult> {
	return CredentialCollection().insertOne(credential);
}

export function deleteCredentialById(teamId: db.IdOrStr, credentialId: db.IdOrStr): Promise<any> {
	return CredentialCollection().deleteOne({
		_id: toObjectId(credentialId),
		teamId: toObjectId(teamId),
	});
}
