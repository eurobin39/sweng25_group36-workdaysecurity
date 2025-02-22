-- CreateTable
CREATE TABLE "security_test_results" (
    "id" SERIAL NOT NULL,
    "commitHash" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "repository" TEXT NOT NULL,
    "branch" TEXT NOT NULL,
    "runner" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "testName" TEXT NOT NULL,
    "testType" TEXT NOT NULL,
    "testCategory" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "duration" DOUBLE PRECISION NOT NULL,
    "vulnerabilityFound" BOOLEAN NOT NULL,

    CONSTRAINT "security_test_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assertions" (
    "id" SERIAL NOT NULL,
    "commit_hash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "expected" TEXT,
    "actual" TEXT,
    "risk" TEXT DEFAULT 'NA',
    "confidence" TEXT DEFAULT 'NA',
    "message" TEXT,

    CONSTRAINT "assertions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "security_test_results_commitHash_key" ON "security_test_results"("commitHash");

-- AddForeignKey
ALTER TABLE "assertions" ADD CONSTRAINT "assertions_commit_hash_fkey" FOREIGN KEY ("commit_hash") REFERENCES "security_test_results"("commitHash") ON DELETE CASCADE ON UPDATE CASCADE;
