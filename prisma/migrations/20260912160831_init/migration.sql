-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('MANUFACTURER', 'BUYER_RECYCLER', 'LOGISTICS_FLEET');

-- CreateEnum
CREATE TYPE "CompanyType" AS ENUM ('MANUFACTURER', 'RETAILER', 'RECYCLER', 'DISTRIBUTION_HUB', 'LOGISTICS_FLEET');

-- CreateEnum
CREATE TYPE "MaterialCategory" AS ENUM ('CARDBOARD', 'HDPE_PLASTICS', 'WOODEN_PALLETS', 'STEEL_DRUMS', 'BIO_FOAM');

-- CreateEnum
CREATE TYPE "MaterialGrade" AS ENUM ('GRADE_A_LIKE_NEW', 'CLEAN_RECYCLABLE', 'REFURBISHED', 'INDUSTRIAL_BULK');

-- CreateEnum
CREATE TYPE "RecyclabilityRating" AS ENUM ('RECYCLABLE_100', 'COMPOSTABLE', 'REUSABLE_CIRCULAR');

-- CreateEnum
CREATE TYPE "MatchStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DISPATCHED', 'NEGOTIATING');

-- CreateEnum
CREATE TYPE "ClaimStatus" AS ENUM ('PENDING', 'COMPLETED', 'DISPATCHED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "LogisticsMode" AS ENUM ('SHARED_BACKHAUL_LOOP', 'DIRECT_EV_COURIER', 'RAIL_FREIGHT_LOOP');

-- CreateEnum
CREATE TYPE "RouteStatus" AS ENUM ('OPTIMIZED_SCHEDULED', 'IN_TRANSIT', 'COMPLETED');

-- CreateEnum
CREATE TYPE "NodeType" AS ENUM ('PICKUP_SUPPLIER', 'PROCESSING_HUB', 'DROPOFF_BUYER');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('MATCH', 'ROUTE', 'PASSPORT', 'REQUEST', 'CARBON');

-- CreateTable
CREATE TABLE "companies" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "CompanyType" NOT NULL DEFAULT 'MANUFACTURER',
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 5.0,
    "location" TEXT NOT NULL,
    "cityState" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'MANUFACTURER',
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "listings" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" "MaterialCategory" NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,
    "weightPerUnitKg" DOUBLE PRECISION NOT NULL,
    "location" TEXT NOT NULL,
    "cityState" TEXT NOT NULL,
    "distanceKm" DOUBLE PRECISION NOT NULL,
    "pricePerUnitInr" DOUBLE PRECISION NOT NULL,
    "condition" "MaterialGrade" NOT NULL,
    "sellerId" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT true,
    "description" TEXT NOT NULL,
    "compositionPercent" TEXT NOT NULL,
    "dimensions" TEXT,
    "loadCapacityKg" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "listings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "claim_transactions" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "buyerId" TEXT NOT NULL,
    "claimedQuantity" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,
    "logisticsMode" "LogisticsMode" NOT NULL DEFAULT 'SHARED_BACKHAUL_LOOP',
    "co2SavedKg" DOUBLE PRECISION NOT NULL,
    "costSavingsInr" DOUBLE PRECISION NOT NULL,
    "status" "ClaimStatus" NOT NULL DEFAULT 'COMPLETED',
    "claimedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "routeId" TEXT,

    CONSTRAINT "claim_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_matches" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "buyerId" TEXT,
    "buyerName" TEXT NOT NULL,
    "buyerType" TEXT NOT NULL,
    "distanceKm" DOUBLE PRECISION NOT NULL,
    "matchScorePercent" DOUBLE PRECISION NOT NULL,
    "materialCompatibilityScore" DOUBLE PRECISION NOT NULL,
    "carbonBenefitScore" DOUBLE PRECISION NOT NULL,
    "availabilityTimeScore" DOUBLE PRECISION NOT NULL,
    "quantityFitScore" DOUBLE PRECISION NOT NULL,
    "priceScore" DOUBLE PRECISION NOT NULL,
    "distanceScore" DOUBLE PRECISION NOT NULL,
    "co2SavingsTotalKg" DOUBLE PRECISION NOT NULL,
    "costSavingsTotalInr" DOUBLE PRECISION NOT NULL,
    "suggestedPricePerUnitInr" DOUBLE PRECISION NOT NULL,
    "status" "MatchStatus" NOT NULL DEFAULT 'PENDING',
    "logisticsMode" "LogisticsMode" NOT NULL DEFAULT 'SHARED_BACKHAUL_LOOP',
    "matchReasoning" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_matches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "digital_passports" (
    "id" TEXT NOT NULL,
    "serialNumber" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "materialName" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,
    "originCompany" TEXT NOT NULL,
    "manufacturingLocation" TEXT NOT NULL,
    "rawMaterialSource" TEXT NOT NULL,
    "recycledContentPercent" DOUBLE PRECISION NOT NULL,
    "virginContentPercent" DOUBLE PRECISION NOT NULL,
    "carbonFootprintKgPerKg" DOUBLE PRECISION NOT NULL,
    "netCo2SavedKg" DOUBLE PRECISION NOT NULL,
    "aiMatchScorePercent" DOUBLE PRECISION,
    "recyclabilityRating" "RecyclabilityRating" NOT NULL DEFAULT 'RECYCLABLE_100',
    "certifications" TEXT[],
    "qrData" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "digital_passports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "passport_audit_logs" (
    "id" TEXT NOT NULL,
    "passportId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "stage" TEXT NOT NULL,
    "actor" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "verificationHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "passport_audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "logistics_routes" (
    "id" TEXT NOT NULL,
    "routeName" TEXT NOT NULL,
    "carrierId" TEXT,
    "carrierName" TEXT NOT NULL,
    "vehicleType" TEXT NOT NULL,
    "originHub" TEXT NOT NULL,
    "destinationHub" TEXT NOT NULL,
    "totalDistanceKm" DOUBLE PRECISION NOT NULL,
    "linearRouteDistanceKm" DOUBLE PRECISION NOT NULL,
    "distanceSavedKm" DOUBLE PRECISION NOT NULL,
    "linearEmissionsKg" DOUBLE PRECISION NOT NULL,
    "loopEmissionsKg" DOUBLE PRECISION NOT NULL,
    "emissionsSavedKg" DOUBLE PRECISION NOT NULL,
    "estimatedCostSavedInr" DOUBLE PRECISION NOT NULL,
    "backhaulOpportunityPercent" DOUBLE PRECISION NOT NULL,
    "vehicleCapacityPercent" DOUBLE PRECISION NOT NULL,
    "status" "RouteStatus" NOT NULL DEFAULT 'OPTIMIZED_SCHEDULED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "logistics_routes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "route_nodes" (
    "id" TEXT NOT NULL,
    "routeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "NodeType" NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "address" TEXT NOT NULL,
    "demandQuantity" TEXT NOT NULL,
    "sequenceOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "route_nodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "companyId" TEXT,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "unread" BOOLEAN NOT NULL DEFAULT true,
    "targetTab" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "digital_passports_serialNumber_key" ON "digital_passports"("serialNumber");

-- CreateIndex
CREATE UNIQUE INDEX "digital_passports_listingId_key" ON "digital_passports"("listingId");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "listings" ADD CONSTRAINT "listings_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claim_transactions" ADD CONSTRAINT "claim_transactions_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "listings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claim_transactions" ADD CONSTRAINT "claim_transactions_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claim_transactions" ADD CONSTRAINT "claim_transactions_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "logistics_routes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_matches" ADD CONSTRAINT "ai_matches_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "listings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_matches" ADD CONSTRAINT "ai_matches_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "digital_passports" ADD CONSTRAINT "digital_passports_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "listings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "passport_audit_logs" ADD CONSTRAINT "passport_audit_logs_passportId_fkey" FOREIGN KEY ("passportId") REFERENCES "digital_passports"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logistics_routes" ADD CONSTRAINT "logistics_routes_carrierId_fkey" FOREIGN KEY ("carrierId") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "route_nodes" ADD CONSTRAINT "route_nodes_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "logistics_routes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
