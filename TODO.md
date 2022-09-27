# dump-app

Photography oriented sharing app

## TODO: MVP

### misc:

- [ ] write the readme

#### client

- [ ] fully load images before displaying them
- [ ] write a boilerplate on top of the fetch api for type safety + body parsing ect

#### backend

- [x] move upload endpoints to a separate media server
- [x] refactor typing system w. custom typeguards to ensure type checking on inputs and outputs

#### seo

- [ ] Check which meta tags have to be used for embeds

#### ui

- [x] check for responsiveness on mobile
- [ ] create daisyui theme for light and dark mode

### feature: auth

- [x] use query params to redirect to specific page after login/register
- [x] check for password complexity
- [x] check for correct username

### feature: profile edition

- [x] allow an account to change its email
- [x] allow an account to change its password

### feature: posts

- [x] Write tests
- [x] Allow a post to be created
- [x] Allow a post to be edited
- [x] Allow a post to be deleted
- [x] Download button
- [ ] Allow users to be tagged

### feature: collections

- [x] Allow a collection to be created
- [x] Allow a collection to be edited
- [x] Allow a collection to be deleted
- [x] Post selection
- [x] Post download
- [ ] Post removal
- [ ] Invite non existing users to a collection (link discord invite style)
- [ ] Invite users to a collaborate in a collection

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
- [ ] write UI tests
