-- CreateTable
CREATE TABLE "User" (
    "uid" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "photoUrl" TEXT NOT NULL DEFAULT '/images/default-user-photo.png',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "Follows" (
    "followerUid" TEXT NOT NULL,
    "followingUid" TEXT NOT NULL,
    "since" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Follows_pkey" PRIMARY KEY ("followerUid","followingUid")
);

-- CreateTable
CREATE TABLE "Post" (
    "pid" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "authorUid" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadataKeys" TEXT[],
    "metadataValues" TEXT[],

    CONSTRAINT "Post_pkey" PRIMARY KEY ("pid")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_uid_key" ON "User"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Post_pid_key" ON "Post"("pid");

-- AddForeignKey
ALTER TABLE "Follows" ADD CONSTRAINT "Follows_followerUid_fkey" FOREIGN KEY ("followerUid") REFERENCES "User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follows" ADD CONSTRAINT "Follows_followingUid_fkey" FOREIGN KEY ("followingUid") REFERENCES "User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorUid_fkey" FOREIGN KEY ("authorUid") REFERENCES "User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;
