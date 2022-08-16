# dump-app

Photography oriented sharing app

## TODO: MVP

### misc:

- [ ] write the readme

### general: client

- [ ] fully load images before displaying them
- [ ] write a boilerplate on top of the fetch api for type safety + body parsing ect
- [ ] write UI tests

### general: backend

- [ ] move upload endpoints to a separate media server
      OR move the upload logic to the client (🤮) (maybe this can be done preperly using firebase rules)
- [ ] refactor typing system w. custom typeguards to ensure type checking on inputs and outputs

### feature: auth

- [ ] use query params to redirect to specific page after login/register
- [ ] check for password complexity
- [ ] check for correct username

### feature: profile edition

- [x] allow an account to change its email
- [x] allow an account to change its password

### feature: posts

- [x] Write tests
- [x] Allow a post to be created
- [x] Allow a post to be edited
- [x] Allow a post to be deleted

### feature: collections

- [x] Allow a collection to be created
- [x] Allow a collection to be edited
- [x] Allow a collection to be deleted

### feature: feed

- [ ] Design feed algorithm
- [ ] Allow a user to see their own feed
- [ ] Allow a user to see a feed for a specific profile/topic

### feature: image processing

- [ ] Compress images before uploading them to firebase
  - [ ] decide what compression algorithm and resolution to use
- [ ] Create a thumbnail for each image
  - [ ] decide which resolution to use

## TODO: Next

- [ ] Opt in paid features (going discord style business model 😎)
- [ ] Connections to other sm (twitter, instagram, etc) to share posts ect
- [ ] Allow an account to add connections (google, instagram, etc)
- [ ] Notifications
