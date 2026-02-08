-- CreateTable
CREATE TABLE "Team" (
    "id" SERIAL NOT NULL,
    "nhlId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "abbreviation" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "division" TEXT NOT NULL,
    "conference" TEXT NOT NULL,
    "logoUrl" TEXT,
    "primaryColor" TEXT,
    "secondaryColor" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamSeasonStats" (
    "id" SERIAL NOT NULL,
    "teamId" INTEGER NOT NULL,
    "season" TEXT NOT NULL,
    "gameType" TEXT NOT NULL DEFAULT 'regular',
    "gamesPlayed" INTEGER NOT NULL DEFAULT 0,
    "wins" INTEGER NOT NULL DEFAULT 0,
    "losses" INTEGER NOT NULL DEFAULT 0,
    "otLosses" INTEGER NOT NULL DEFAULT 0,
    "points" INTEGER NOT NULL DEFAULT 0,
    "pointsPct" DOUBLE PRECISION,
    "goalsFor" INTEGER NOT NULL DEFAULT 0,
    "goalsAgainst" INTEGER NOT NULL DEFAULT 0,
    "goalDiff" INTEGER NOT NULL DEFAULT 0,
    "ppPct" DOUBLE PRECISION,
    "pkPct" DOUBLE PRECISION,
    "shotsForPerGame" DOUBLE PRECISION,
    "shotsAgainstPerGame" DOUBLE PRECISION,
    "faceoffPct" DOUBLE PRECISION,
    "corsiForPct" DOUBLE PRECISION,
    "xGoalsForPct" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TeamSeasonStats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Player" (
    "id" SERIAL NOT NULL,
    "nhlId" INTEGER NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "teamId" INTEGER,
    "position" TEXT NOT NULL,
    "shootsCatches" TEXT,
    "height" INTEGER,
    "weight" INTEGER,
    "birthDate" TIMESTAMP(3),
    "birthCity" TEXT,
    "birthCountry" TEXT,
    "draftYear" INTEGER,
    "draftRound" INTEGER,
    "draftPick" INTEGER,
    "headshotUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayerSeasonStats" (
    "id" SERIAL NOT NULL,
    "playerId" INTEGER NOT NULL,
    "season" TEXT NOT NULL,
    "gameType" TEXT NOT NULL DEFAULT 'regular',
    "gamesPlayed" INTEGER NOT NULL DEFAULT 0,
    "goals" INTEGER NOT NULL DEFAULT 0,
    "assists" INTEGER NOT NULL DEFAULT 0,
    "points" INTEGER NOT NULL DEFAULT 0,
    "plusMinus" INTEGER NOT NULL DEFAULT 0,
    "pim" INTEGER NOT NULL DEFAULT 0,
    "ppGoals" INTEGER NOT NULL DEFAULT 0,
    "ppAssists" INTEGER NOT NULL DEFAULT 0,
    "ppPoints" INTEGER NOT NULL DEFAULT 0,
    "shGoals" INTEGER NOT NULL DEFAULT 0,
    "shAssists" INTEGER NOT NULL DEFAULT 0,
    "shPoints" INTEGER NOT NULL DEFAULT 0,
    "gameWinningGoals" INTEGER NOT NULL DEFAULT 0,
    "overtimeGoals" INTEGER NOT NULL DEFAULT 0,
    "firstGoals" INTEGER NOT NULL DEFAULT 0,
    "shots" INTEGER NOT NULL DEFAULT 0,
    "shootingPct" DOUBLE PRECISION,
    "missedShots" INTEGER NOT NULL DEFAULT 0,
    "toi" INTEGER NOT NULL DEFAULT 0,
    "toiPerGame" DOUBLE PRECISION,
    "evToi" INTEGER NOT NULL DEFAULT 0,
    "ppToi" INTEGER NOT NULL DEFAULT 0,
    "shToi" INTEGER NOT NULL DEFAULT 0,
    "hits" INTEGER NOT NULL DEFAULT 0,
    "blocks" INTEGER NOT NULL DEFAULT 0,
    "takeaways" INTEGER NOT NULL DEFAULT 0,
    "giveaways" INTEGER NOT NULL DEFAULT 0,
    "faceoffPct" DOUBLE PRECISION,
    "faceoffsWon" INTEGER NOT NULL DEFAULT 0,
    "faceoffsLost" INTEGER NOT NULL DEFAULT 0,
    "corsiFor" INTEGER,
    "corsiAgainst" INTEGER,
    "corsiForPct" DOUBLE PRECISION,
    "corsiRelPct" DOUBLE PRECISION,
    "fenwickFor" INTEGER,
    "fenwickAgainst" INTEGER,
    "fenwickForPct" DOUBLE PRECISION,
    "xGoalsFor" DOUBLE PRECISION,
    "xGoalsAgainst" DOUBLE PRECISION,
    "xGoalsForPct" DOUBLE PRECISION,
    "xGoalsDiff" DOUBLE PRECISION,
    "individualXG" DOUBLE PRECISION,
    "pdo" DOUBLE PRECISION,
    "onIceShPct" DOUBLE PRECISION,
    "onIceSvPct" DOUBLE PRECISION,
    "ozStartPct" DOUBLE PRECISION,
    "dzStartPct" DOUBLE PRECISION,
    "nzStartPct" DOUBLE PRECISION,
    "hdCorsiForPct" DOUBLE PRECISION,
    "hdGoalsFor" INTEGER,
    "hdGoalsAgainst" INTEGER,
    "goalsForPer60" DOUBLE PRECISION,
    "goalsAgainstPer60" DOUBLE PRECISION,
    "corsiForPer60" DOUBLE PRECISION,
    "corsiAgainstPer60" DOUBLE PRECISION,
    "offensiveGAR" DOUBLE PRECISION,
    "defensiveGAR" DOUBLE PRECISION,
    "gar" DOUBLE PRECISION,
    "war" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlayerSeasonStats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayerGameLog" (
    "id" SERIAL NOT NULL,
    "playerId" INTEGER NOT NULL,
    "gameId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "opponent" TEXT NOT NULL,
    "homeAway" TEXT NOT NULL,
    "goals" INTEGER NOT NULL DEFAULT 0,
    "assists" INTEGER NOT NULL DEFAULT 0,
    "points" INTEGER NOT NULL DEFAULT 0,
    "plusMinus" INTEGER NOT NULL DEFAULT 0,
    "shots" INTEGER NOT NULL DEFAULT 0,
    "toi" INTEGER NOT NULL DEFAULT 0,
    "hits" INTEGER NOT NULL DEFAULT 0,
    "blocks" INTEGER NOT NULL DEFAULT 0,
    "pim" INTEGER NOT NULL DEFAULT 0,
    "ppGoals" INTEGER NOT NULL DEFAULT 0,
    "shGoals" INTEGER NOT NULL DEFAULT 0,
    "faceoffPct" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlayerGameLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GoalieSeasonStats" (
    "id" SERIAL NOT NULL,
    "playerId" INTEGER NOT NULL,
    "season" TEXT NOT NULL,
    "gameType" TEXT NOT NULL DEFAULT 'regular',
    "gamesPlayed" INTEGER NOT NULL DEFAULT 0,
    "gamesStarted" INTEGER NOT NULL DEFAULT 0,
    "wins" INTEGER NOT NULL DEFAULT 0,
    "losses" INTEGER NOT NULL DEFAULT 0,
    "otLosses" INTEGER NOT NULL DEFAULT 0,
    "savePercentage" DOUBLE PRECISION,
    "goalsAgainstAvg" DOUBLE PRECISION,
    "shutouts" INTEGER NOT NULL DEFAULT 0,
    "saves" INTEGER NOT NULL DEFAULT 0,
    "shotsAgainst" INTEGER NOT NULL DEFAULT 0,
    "goalsAgainst" INTEGER NOT NULL DEFAULT 0,
    "toi" INTEGER NOT NULL DEFAULT 0,
    "qualityStarts" INTEGER,
    "qualityStartsPct" DOUBLE PRECISION,
    "goalsSavedAboveAverage" DOUBLE PRECISION,
    "xGoalsAgainst" DOUBLE PRECISION,
    "goalsPrevented" DOUBLE PRECISION,
    "evSavePercentage" DOUBLE PRECISION,
    "ppSavePercentage" DOUBLE PRECISION,
    "shSavePercentage" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GoalieSeasonStats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Team_nhlId_key" ON "Team"("nhlId");

-- CreateIndex
CREATE UNIQUE INDEX "Team_abbreviation_key" ON "Team"("abbreviation");

-- CreateIndex
CREATE INDEX "Team_division_idx" ON "Team"("division");

-- CreateIndex
CREATE INDEX "Team_conference_idx" ON "Team"("conference");

-- CreateIndex
CREATE INDEX "TeamSeasonStats_season_idx" ON "TeamSeasonStats"("season");

-- CreateIndex
CREATE INDEX "TeamSeasonStats_points_idx" ON "TeamSeasonStats"("points");

-- CreateIndex
CREATE INDEX "TeamSeasonStats_wins_idx" ON "TeamSeasonStats"("wins");

-- CreateIndex
CREATE UNIQUE INDEX "TeamSeasonStats_teamId_season_gameType_key" ON "TeamSeasonStats"("teamId", "season", "gameType");

-- CreateIndex
CREATE UNIQUE INDEX "Player_nhlId_key" ON "Player"("nhlId");

-- CreateIndex
CREATE INDEX "Player_teamId_idx" ON "Player"("teamId");

-- CreateIndex
CREATE INDEX "Player_position_idx" ON "Player"("position");

-- CreateIndex
CREATE INDEX "Player_lastName_idx" ON "Player"("lastName");

-- CreateIndex
CREATE INDEX "Player_isActive_idx" ON "Player"("isActive");

-- CreateIndex
CREATE INDEX "PlayerSeasonStats_season_idx" ON "PlayerSeasonStats"("season");

-- CreateIndex
CREATE INDEX "PlayerSeasonStats_points_idx" ON "PlayerSeasonStats"("points");

-- CreateIndex
CREATE INDEX "PlayerSeasonStats_goals_idx" ON "PlayerSeasonStats"("goals");

-- CreateIndex
CREATE INDEX "PlayerSeasonStats_assists_idx" ON "PlayerSeasonStats"("assists");

-- CreateIndex
CREATE INDEX "PlayerSeasonStats_gamesPlayed_idx" ON "PlayerSeasonStats"("gamesPlayed");

-- CreateIndex
CREATE INDEX "PlayerSeasonStats_war_idx" ON "PlayerSeasonStats"("war");

-- CreateIndex
CREATE INDEX "PlayerSeasonStats_corsiForPct_idx" ON "PlayerSeasonStats"("corsiForPct");

-- CreateIndex
CREATE INDEX "PlayerSeasonStats_xGoalsForPct_idx" ON "PlayerSeasonStats"("xGoalsForPct");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerSeasonStats_playerId_season_gameType_key" ON "PlayerSeasonStats"("playerId", "season", "gameType");

-- CreateIndex
CREATE INDEX "PlayerGameLog_gameId_idx" ON "PlayerGameLog"("gameId");

-- CreateIndex
CREATE INDEX "PlayerGameLog_date_idx" ON "PlayerGameLog"("date");

-- CreateIndex
CREATE INDEX "PlayerGameLog_playerId_date_idx" ON "PlayerGameLog"("playerId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerGameLog_playerId_gameId_key" ON "PlayerGameLog"("playerId", "gameId");

-- CreateIndex
CREATE INDEX "GoalieSeasonStats_season_idx" ON "GoalieSeasonStats"("season");

-- CreateIndex
CREATE INDEX "GoalieSeasonStats_savePercentage_idx" ON "GoalieSeasonStats"("savePercentage");

-- CreateIndex
CREATE INDEX "GoalieSeasonStats_goalsAgainstAvg_idx" ON "GoalieSeasonStats"("goalsAgainstAvg");

-- CreateIndex
CREATE INDEX "GoalieSeasonStats_wins_idx" ON "GoalieSeasonStats"("wins");

-- CreateIndex
CREATE UNIQUE INDEX "GoalieSeasonStats_playerId_season_gameType_key" ON "GoalieSeasonStats"("playerId", "season", "gameType");

-- AddForeignKey
ALTER TABLE "TeamSeasonStats" ADD CONSTRAINT "TeamSeasonStats_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerSeasonStats" ADD CONSTRAINT "PlayerSeasonStats_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerGameLog" ADD CONSTRAINT "PlayerGameLog_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoalieSeasonStats" ADD CONSTRAINT "GoalieSeasonStats_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;
