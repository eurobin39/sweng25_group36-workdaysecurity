/*
  Warnings:

  - You are about to drop the column `commitHash` on the `security_test_results` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[commit_Hash]` on the table `security_test_results` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `commit_Hash` to the `security_test_results` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "assertions" DROP CONSTRAINT "assertions_commit_hash_fkey";

-- DropIndex
DROP INDEX "security_test_results_commitHash_key";

-- AlterTable
ALTER TABLE "security_test_results" DROP COLUMN "commitHash",
ADD COLUMN     "commit_Hash" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "security_test_results_commit_Hash_key" ON "security_test_results"("commit_Hash");

-- AddForeignKey
ALTER TABLE "assertions" ADD CONSTRAINT "assertions_commit_hash_fkey" FOREIGN KEY ("commit_hash") REFERENCES "security_test_results"("commit_Hash") ON DELETE CASCADE ON UPDATE CASCADE;
