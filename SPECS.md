## `/` Landing Page

## `/feed` Feed

## `/user` User Section

### `/user/[username]` User Page

- `/user/login` Login Page
- `/user/register` Register Page

#### `/user/[username]/posts` User Posts

- `/user/[username]/posts/new` New post
  - a new post is created with a description, content and optional metadata
- `/user/[username]/posts/[postId]` Post Page

#### `/user/[username]/collections` User Collections

- Collections are a set of posts created by the user or generated automatically.
- They have privacy options on which can access them that are set by the user and can be modified later.
- `/user/[username]/collections/new` New collection
  - A new collection is created with a name, a description and a set of posts from the user.
- `/user/[username]/collections/[collectionId]` Collection Page

## `/api` API
