import type { Follow, PrivacySetting, User } from "@prisma/client";

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

export interface UserPostsOutput {
    posts: Post[];
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
    dataUrl: string;
    showInFeed: boolean;
    collectionCid: string | null;
}

export interface PostOutput {
    post: Post;
}

export interface CreateOrUpdateCollectionInput {
    name?: string;
    description?: string;
    privacy?: PrivacySetting;
    allowedUids?: string[];
}

export interface CollectionOutput {
    collection: Collection & {
        posts: string[],
        allowedUsers: string[],
    };
}