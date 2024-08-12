/*
  Warnings:

  - You are about to drop the column `organization_id` on the `members` table. All the data in the column will be lost.
  - You are about to drop the `organizations` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[user_id,workspace_id]` on the table `members` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `workspace_id` to the `members` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "members" DROP CONSTRAINT "members_organization_id_fkey";

-- DropIndex
DROP INDEX "members_user_id_organization_id_key";

-- AlterTable
ALTER TABLE "members" DROP COLUMN "organization_id",
ADD COLUMN     "workspace_id" TEXT NOT NULL;

-- DropTable
DROP TABLE "organizations";

-- CreateTable
CREATE TABLE "workspaces" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT,
    "description" TEXT,
    "invite_code" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workspaces_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "workspaces_invite_code_key" ON "workspaces"("invite_code");

-- CreateIndex
CREATE UNIQUE INDEX "members_user_id_workspace_id_key" ON "members"("user_id", "workspace_id");

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
