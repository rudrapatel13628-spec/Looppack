import { Router, Request, Response } from 'express';
import { prisma } from '../db';
import {
  formatMatchStatus,
  formatLogisticsMode
} from '../utils/serializers';
import type { MatchStatus, LogisticsMode } from '@prisma/client';

export const matchesRouter = Router();

// Helper to serialize Prisma AiMatch to Frontend AiMatch format
function serializeAiMatch(match: any) {
  return {
    id: match.id,
    listingId: match.listingId,
    listingTitle: match.listing ? match.listing.title : 'Packaging Surplus Listing',
    buyerId: match.buyerId || undefined,
    buyerName: match.buyerName,
    buyerType: match.buyerType,
    distanceKm: match.distanceKm,
    matchScorePercent: match.matchScorePercent,
    factors: {
      materialCompatibilityScore: match.materialCompatibilityScore,
      carbonBenefitScore: match.carbonBenefitScore,
      availabilityTimeScore: match.availabilityTimeScore,
      quantityFitScore: match.quantityFitScore,
      priceScore: match.priceScore,
      distanceScore: match.distanceScore
    },
    co2SavingsTotalKg: match.co2SavingsTotalKg,
    costSavingsTotalInr: match.costSavingsTotalInr,
    suggestedPricePerUnitInr: match.suggestedPricePerUnitInr,
    status: formatMatchStatus(match.status),
    logisticsMode: formatLogisticsMode(match.logisticsMode),
    matchReasoning: match.matchReasoning || []
  };
}

// GET /api/matches - Fetch AI matches from PostgreSQL with optional filters
matchesRouter.get('/', async (req: Request, res: Response) => {
  try {
    const { listingId, status } = req.query;

    const whereClause: any = {};
    if (listingId && typeof listingId === 'string') {
      whereClause.listingId = listingId;
    }
    if (status && typeof status === 'string') {
      whereClause.status = status.toUpperCase() as MatchStatus;
    }

    const matches = await prisma.aiMatch.findMany({
      where: whereClause,
      include: {
        listing: true,
        buyer: true
      },
      orderBy: {
        matchScorePercent: 'desc'
      }
    });

    const serialized = matches.map(serializeAiMatch);
    res.json(serialized);
  } catch (error) {
    console.error('Error fetching AI matches:', error);
    res.status(500).json({ error: 'Failed to fetch AI matches' });
  }
});

// GET /api/matches/:id - Fetch a single AI match proposal by ID
matchesRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const match = await prisma.aiMatch.findUnique({
      where: { id },
      include: {
        listing: {
          include: { seller: true }
        },
        buyer: true
      }
    });

    if (!match) {
      return res.status(404).json({ error: 'AI Match proposal not found' });
    }

    res.json(serializeAiMatch(match));
  } catch (error) {
    console.error(`Error fetching AI match ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to fetch AI match details' });
  }
});

// POST /api/matches - Create a new AI buyer match recommendation
matchesRouter.post('/', async (req: Request, res: Response) => {
  try {
    const {
      listingId,
      buyerId,
      buyerName,
      buyerType,
      distanceKm,
      matchScorePercent,
      materialCompatibilityScore,
      carbonBenefitScore,
      availabilityTimeScore,
      quantityFitScore,
      priceScore,
      distanceScore,
      co2SavingsTotalKg,
      costSavingsTotalInr,
      suggestedPricePerUnitInr,
      status,
      logisticsMode,
      matchReasoning
    } = req.body;

    if (!listingId || !buyerName || !buyerType || distanceKm === undefined || matchScorePercent === undefined) {
      return res.status(400).json({
        error: 'Missing required fields: listingId, buyerName, buyerType, distanceKm, and matchScorePercent are required.'
      });
    }

    // Check if listing exists
    const listingExists = await prisma.listing.findUnique({
      where: { id: listingId }
    });

    if (!listingExists) {
      return res.status(404).json({ error: 'Listing not found for this AI Match proposal.' });
    }

    const newMatch = await prisma.aiMatch.create({
      data: {
        listingId,
        buyerId: buyerId || null,
        buyerName,
        buyerType,
        distanceKm: Number(distanceKm),
        matchScorePercent: Number(matchScorePercent),
        materialCompatibilityScore: Number(materialCompatibilityScore || 90),
        carbonBenefitScore: Number(carbonBenefitScore || 90),
        availabilityTimeScore: Number(availabilityTimeScore || 90),
        quantityFitScore: Number(quantityFitScore || 90),
        priceScore: Number(priceScore || 90),
        distanceScore: Number(distanceScore || 90),
        co2SavingsTotalKg: Number(co2SavingsTotalKg || 1000),
        costSavingsTotalInr: Number(costSavingsTotalInr || 50000),
        suggestedPricePerUnitInr: Number(suggestedPricePerUnitInr || 0),
        status: (status ? status.toUpperCase() : 'PENDING') as MatchStatus,
        logisticsMode: (logisticsMode ? logisticsMode.toUpperCase().replace(/\s+/g, '_') : 'SHARED_BACKHAUL_LOOP') as LogisticsMode,
        matchReasoning: Array.isArray(matchReasoning) ? matchReasoning : ['High circular material compatibility score']
      },
      include: {
        listing: true,
        buyer: true
      }
    });

    res.status(201).json(serializeAiMatch(newMatch));
  } catch (error) {
    console.error('Error creating AI match:', error);
    res.status(500).json({ error: 'Failed to create AI match proposal' });
  }
});

// POST /api/matches/:id/accept - Accept an AI match proposal
matchesRouter.post('/:id/accept', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const matchExists = await prisma.aiMatch.findUnique({
      where: { id }
    });

    if (!matchExists) {
      return res.status(404).json({ error: 'AI Match proposal not found' });
    }

    const updatedMatch = await prisma.aiMatch.update({
      where: { id },
      data: {
        status: 'ACCEPTED'
      },
      include: {
        listing: true,
        buyer: true
      }
    });

    res.json(serializeAiMatch(updatedMatch));
  } catch (error) {
    console.error(`Error accepting AI match ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to accept AI match proposal' });
  }
});
