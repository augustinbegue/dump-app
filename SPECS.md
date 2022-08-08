## `/` Landing Page/Feed

## `/auth` Authentication

- ## `/auth/login` Login Page

- ## `/auth/register` Register Page

## `[username]` User Page

- ## `[username]/posts` User Posts

  - ### `[username]/posts/[postId]` Post Page

- ## `[username]/collections` User Collections

  Collections are a set of posts created by the user or generated automatically.
  They have privacy options on which can access them that are set by the user and can be modified later.

  - ### `[username]/collections/[collectionId]` Collection Page

- ## `[username]/new` Creation Routes

  - ### `[username]/new/post` New Post

  A new post is created with a description, content and optional metadata

  - ### `[username]/new/collections` New collection

  A new collection is created with a name, a description and a set of posts from the user.

## `/api` API

- ## Response Format

  ### Error

  - Status: 4xx
  - Body: `{ "message": "error message" }`

- ## `/api/posts` Posts

  - ### POST `/api/posts/new` Create a Post

  - ### GET `/api/posts/[postId]` Get a Post

- ## `/api/posts` Collections

  - ### POST `/api/posts/new` Create a Collection

  - ### GET `/api/posts/[postId]` Get a Collection
