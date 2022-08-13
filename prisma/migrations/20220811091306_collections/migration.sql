/*
  Warnings:

  - You are about to drop the `Follows` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "PrivacySetting" AS ENUM ('PUBLIC', 'PRIVATE');

-- DropForeignKey
ALTER TABLE "Follows" DROP CONSTRAINT "Follows_followerUid_fkey";

-- DropForeignKey
ALTER TABLE "Follows" DROP CONSTRAINT "Follows_followingUid_fkey";

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "collectionCid" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "privacy" "PrivacySetting" NOT NULL DEFAULT 'PUBLIC';

-- DropTable
DROP TABLE "Follows";

-- CreateTable
CREATE TABLE "Follow" (
    "followerUid" TEXT NOT NULL,
    "followingUid" TEXT NOT NULL,
    "since" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Follow_pkey" PRIMARY KEY ("followerUid","followingUid")
);

-- CreateTable
CREATE TABLE "Collection" (
    "cid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "authorUid" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "postsCount" INTEGER NOT NULL DEFAULT 0,
    "privacy" "PrivacySetting" NOT NULL DEFAULT 'PUBLIC',

    CONSTRAINT "Collection_pkey" PRIMARY KEY ("cid")
);

-- CreateTable
CREATE TABLE "_CollectionToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Collection_cid_key" ON "Collection"("cid");

-- CreateIndex
CREATE UNIQUE INDEX "_CollectionToUser_AB_unique" ON "_CollectionToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_CollectionToUser_B_index" ON "_CollectionToUser"("B");

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_followerUid_fkey" FOREIGN KEY ("followerUid") REFERENCES "User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_followingUid_fkey" FOREIGN KEY ("followingUid") REFERENCES "User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_collectionCid_fkey" FOREIGN KEY ("collectionCid") REFERENCES "Collection"("cid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Collection" ADD CONSTRAINT "Collection_authorUid_fkey" FOREIGN KEY ("authorUid") REFERENCES "User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CollectionToUser" ADD CONSTRAINT "_CollectionToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Collection"("cid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CollectionToUser" ADD CONSTRAINT "_CollectionToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("uid") ON DELETE CASCADE ON UPDATE CASCADE;
