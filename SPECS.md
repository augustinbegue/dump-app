## `/` Landing Page/Feed

## `/auth` Authentication

- ## `/auth/login` Login Page

- ## `/auth/register` Register Page

## `[username]` User Page

  ## `[username]/posts` User Posts

  - ### `/posts/[postId]` Post Page

  ## `[username]/collections` User Collections

  Collections are a set of posts created by the user or generated automatically.
  They have privacy options on which can access them that are set by the user and can be modified later.

  - ### `/collections/[collectionId]` Collection Page

  - ### `/collections/[collectionId]/edit` Collection Edit Page

  - ### `/collections/[collectionId]/add` Collection Page to Add Posts

## `/new` Creation Routes

  - ### `/new/post` New Post

  A new post is created with a description, content and optional metadata

  - ### `/new/collections` New collection

  A new collection is created with a name, a description and a set of posts from the user.

## `/api` API

- ## Response Format

  ### Error

  - Status: 4xx
  - Body: `{ "message": "error message" }`

- ## `/api/posts` Posts

  - ### POST `/api/posts/new` Create a Post

    - Requires authentication

  - ### GET `/api/posts/[pId]` Get a Post

  - ### GET `/api/posts/[pId]` Update a Post

    - Requires authentication

  - ### DELETE `/api/posts/[pId]` Delete a Post

    - Requires authentication

- ## `/api/collections` Collections

  - ### POST `/api/collections/new` Create a Collection

    - Requires authentication

  - ### GET `/api/collections/[cId]` Get a Collection

    - Requires authentication

  - ### POST `/api/collections/[cId]` Update a Collection

    - Requires authentication

  - ### DELETE `/api/collections/[cId]` Delete a Collection

    - Requires authentication

- ## `/api/users` Users

  - ### POST `/api/users/[uid]` Create a User

    - Requires firebase authentication

  - ### GET `/api/users/[uid]` Get a User by firebase UID

    - ### GET `/api/users/username/[uid]/posts` Get a User's Posts

    - ### GET `/api/users/username/[uid]/collections` Get a User's Collections

      - Requires authentication to access potentially private collections

    - ### GET `/api/users/username/[uid]/followers` Get a User's Followers

      - Requires authentication

    - ### POST `/api/users/username/[uidToFollow]/followers` Follow a User

      - Requires authentication

    - ### GET `/api/users/username/[uid]/following` Get a User's Following

      - Requires authentication

    - ### GET `/api/users/username/[uid]/following/[uidToCheck]` Check if a User is Following another User

      - Requires authentication

  - ### GET `/api/users/username/[username]` Get a User by username
