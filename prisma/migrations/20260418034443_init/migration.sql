-- CreateTable
CREATE TABLE "Tool" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "shortDescription" TEXT,
    "longDescription" TEXT,
    "websiteUrl" TEXT,
    "githubUrl" TEXT,
    "githubOwner" TEXT,
    "githubRepoName" TEXT,
    "githubStars" INTEGER NOT NULL DEFAULT 0,
    "githubForks" INTEGER NOT NULL DEFAULT 0,
    "githubOpenIssues" INTEGER NOT NULL DEFAULT 0,
    "githubLicense" TEXT,
    "githubLanguage" TEXT,
    "githubLastPushedAt" DATETIME,
    "packageInfo" TEXT,
    "documentationUrl" TEXT,
    "demoUrl" TEXT,
    "pricingModel" TEXT,
    "businessModel" TEXT NOT NULL DEFAULT 'unknown',
    "sourceReferenceCount" INTEGER NOT NULL DEFAULT 0,
    "distinctSourceCount" INTEGER NOT NULL DEFAULT 0,
    "firstDiscoveredAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastEnrichedAt" DATETIME,
    "popularityScore" REAL NOT NULL DEFAULT 0,
    "trendScore" REAL NOT NULL DEFAULT 0,
    "confidenceScore" REAL NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "extractionNotes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SourceReference" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "toolId" TEXT,
    "sourceType" TEXT NOT NULL,
    "sourceName" TEXT NOT NULL,
    "sourceAccount" TEXT,
    "sourceDomain" TEXT,
    "sourceUrl" TEXT NOT NULL,
    "rawTitle" TEXT,
    "rawText" TEXT,
    "normalizedToolName" TEXT,
    "extractedUrls" TEXT,
    "discoveredAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "publishedAt" DATETIME,
    "engagement" TEXT,
    "confidenceScore" REAL NOT NULL DEFAULT 0,
    "processedStatus" TEXT NOT NULL DEFAULT 'new',
    "rawPayload" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SourceReference_toolId_fkey" FOREIGN KEY ("toolId") REFERENCES "Tool" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "ToolCategory" (
    "toolId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY ("toolId", "categoryId"),
    CONSTRAINT "ToolCategory_toolId_fkey" FOREIGN KEY ("toolId") REFERENCES "Tool" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ToolCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ToolTag" (
    "toolId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    PRIMARY KEY ("toolId", "tagId"),
    CONSTRAINT "ToolTag_toolId_fkey" FOREIGN KEY ("toolId") REFERENCES "Tool" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ToolTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UseCase" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ToolUseCase" (
    "toolId" TEXT NOT NULL,
    "useCaseId" TEXT NOT NULL,

    PRIMARY KEY ("toolId", "useCaseId"),
    CONSTRAINT "ToolUseCase_toolId_fkey" FOREIGN KEY ("toolId") REFERENCES "Tool" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ToolUseCase_useCaseId_fkey" FOREIGN KEY ("useCaseId") REFERENCES "UseCase" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ScoreHistory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "toolId" TEXT NOT NULL,
    "popularityScore" REAL NOT NULL,
    "trendScore" REAL NOT NULL,
    "confidenceScore" REAL NOT NULL,
    "calculatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ScoreHistory_toolId_fkey" FOREIGN KEY ("toolId") REFERENCES "Tool" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Tool_slug_key" ON "Tool"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Tool_websiteUrl_key" ON "Tool"("websiteUrl");

-- CreateIndex
CREATE UNIQUE INDEX "Tool_githubUrl_key" ON "Tool"("githubUrl");

-- CreateIndex
CREATE INDEX "Tool_name_idx" ON "Tool"("name");

-- CreateIndex
CREATE INDEX "Tool_status_idx" ON "Tool"("status");

-- CreateIndex
CREATE INDEX "Tool_popularityScore_idx" ON "Tool"("popularityScore");

-- CreateIndex
CREATE INDEX "Tool_trendScore_idx" ON "Tool"("trendScore");

-- CreateIndex
CREATE INDEX "SourceReference_toolId_idx" ON "SourceReference"("toolId");

-- CreateIndex
CREATE INDEX "SourceReference_sourceType_idx" ON "SourceReference"("sourceType");

-- CreateIndex
CREATE INDEX "SourceReference_sourceDomain_idx" ON "SourceReference"("sourceDomain");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_slug_key" ON "Tag"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "UseCase_name_key" ON "UseCase"("name");

-- CreateIndex
CREATE UNIQUE INDEX "UseCase_slug_key" ON "UseCase"("slug");

-- CreateIndex
CREATE INDEX "ScoreHistory_toolId_idx" ON "ScoreHistory"("toolId");
