import type { Follow, PrivacySetting, User, Collection, Post } from '@prisma/client';

export interface UserOutput {
	user: User;
}

export interface CreateOrUpdateUserInput {
	username: string;
	name: string;
}

export interface UpdateProfilePhotoInput {
	dataUrl: string;
}

export interface PostsOutput {
	posts: Post[];
}

export interface UserCollectionsOutput {
	collections: Collection[];
}

export interface FollowersOutput {
	followers: Follow[];
}

export interface FollowingOutput {
	following: Follow[];
}

export interface CreateOrUpdatePostInput {
	title: string;
	description: string;
	metadataKeys: string[];
	metadataValues: string[];
	showInFeed: boolean;
	collectionCid: string | null;
}

export interface PostOutput {
	post:
		| (Post & {
				author: User;
		  })
		| null;
}

export interface CreateOrUpdateCollectionInput {
	name?: string;
	description?: string;
	privacy?: PrivacySetting;
	allowedUids?: string[];
}

export interface CollectionOutput {
	collection: Collection & {
		author: User;
		posts: {
			pid: string;
		}[];
		allowedUsers: {
			uid: string;
		}[];
	};
}

export interface AlertMessage {
	type: 'success' | 'error' | 'warning' | 'info';
	message: string;
}

export interface UploadImageInput {
	pid: string;
	dataUrl: string;
}
