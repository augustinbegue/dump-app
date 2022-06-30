## `/` Landing Page

## `/feed` Feed

## `/auth` Authentication

- `/auth/login` Login Page
- `/auth/register` Register Page

### `[username]` User Page

#### `[username]/posts` User Posts

- `[username]/posts/new` New post
  - a new post is created with a description, content and optional metadata
- `[username]/posts/[postId]` Post Page

#### `[username]/collections` User Collections

- Collections are a set of posts created by the user or generated automatically.
- They have privacy options on which can access them that are set by the user and can be modified later.
- `[username]/collections/new` New collection
  - A new collection is created with a name, a description and a set of posts from the user.
- `[username]/collections/[collectionId]` Collection Page

## `/api` API
