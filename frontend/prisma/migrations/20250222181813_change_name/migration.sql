/*
  Warnings:

  - You are about to drop the column `commit_Hash` on the `security_test_results` table. All the data in the column will be lost.
  - You are about to drop the column `projectId` on the `security_test_results` table. All the data in the column will be lost.
  - You are about to drop the column `testCategory` on the `security_test_results` table. All the data in the column will be lost.
  - You are about to drop the column `testName` on the `security_test_results` table. All the data in the column will be lost.
  - You are about to drop the column `testType` on the `security_test_results` table. All the data in the column will be lost.
  - You are about to drop the column `vulnerabilityFound` on the `security_test_results` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[commit_hash]` on the table `security_test_results` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `commit_hash` to the `security_test_results` table without a default value. This is not possible if the table is not empty.
  - Added the required column `project_id` to the `security_test_results` table without a default value. This is not possible if the table is not empty.
  - Added the required column `test_category` to the `security_test_results` table without a default value. This is not possible if the table is not empty.
  - Added the required column `test_name` to the `security_test_results` table without a default value. This is not possible if the table is not empty.
  - Added the required column `test_type` to the `security_test_results` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vulnerability_found` to the `security_test_results` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "assertions" DROP CONSTRAINT "assertions_commit_hash_fkey";

-- DropIndex
DROP INDEX "security_test_results_commit_Hash_key";

-- AlterTable
ALTER TABLE "security_test_results" DROP COLUMN "commit_Hash",
DROP COLUMN "projectId",
DROP COLUMN "testCategory",
DROP COLUMN "testName",
DROP COLUMN "testType",
DROP COLUMN "vulnerabilityFound",
ADD COLUMN     "commit_hash" TEXT NOT NULL,
ADD COLUMN     "project_id" TEXT NOT NULL,
ADD COLUMN     "test_category" TEXT NOT NULL,
ADD COLUMN     "test_name" TEXT NOT NULL,
ADD COLUMN     "test_type" TEXT NOT NULL,
ADD COLUMN     "vulnerability_found" BOOLEAN NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "security_test_results_commit_hash_key" ON "security_test_results"("commit_hash");

-- AddForeignKey
ALTER TABLE "assertions" ADD CONSTRAINT "assertions_commit_hash_fkey" FOREIGN KEY ("commit_hash") REFERENCES "security_test_results"("commit_hash") ON DELETE CASCADE ON UPDATE CASCADE;
