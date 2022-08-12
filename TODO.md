# dump-app

Content oriented sharing app

## TODO: MVP

### general: client

- [ ] Find a way to fully load images before displaying them

### general: backend

- [ ] move backend/upload endpoints to a separate server

### feature: profile edition

- [ ] allow an account to change its email
- [ ] allow an account to change its password
- [ ] allow an account to add connections (google, instagram, etc)

### feature: posts

- [ ] Write tests
- [x] Allow a post to be created
- [ ] Allow a post to be edited
  - [x] Api endpoints
  - [ ] Client pages
- [ ] Allow a post to be deleted
  - [ ] Api endpoints
  - [ ] Client pages

### feature: collections

- [x] Write tests
- [x] Allow a collection to be created
- [x] Allow a collection to be edited
- [ ] Allow a collection to be deleted
  - [ ] Api endpoints
  - [ ] Client pages

### feature: feed

- [ ] Design feed algorithm
- [ ] Allow a user to see their own feed
- [ ] Allow a user to see a feed for a specific profile

### feature: image processing

- [ ] Compress images before uploading them to firebase
  - [ ] decide what compression algorithm and resolution to use
- [ ] Create a thumbnail for each image
  - [ ] decide which resolution to use
- [ ] Opt in paid feature to keep full size images
