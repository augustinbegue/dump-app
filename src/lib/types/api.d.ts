import type { Follows, User } from "@prisma/client";

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
    followers: Follows[];
}

export interface FollowingOutput {
    following: Follows[];
}