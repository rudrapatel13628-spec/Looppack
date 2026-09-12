import { Router, Request, Response } from 'express';
import { prisma } from '../db';
import { formatLogisticsMode } from '../utils/serializers';
import type { ClaimStatus, LogisticsMode } from '@prisma/client';

export const claimsRouter = Router();

// Helper to format Prisma ClaimStatus enum to display string
function formatClaimStatus(status: ClaimStatus): string {
  const map: Record<ClaimStatus, string> = {
    PENDING: 'Pending',
    COMPLETED: 'Completed',
    DISPATCHED: 'Dispatched',
    CANCELLED: 'Cancelled'
  };
  return map[status] || status;
}

// Helper to parse input string into Prisma ClaimStatus enum
function parseClaimStatus(statusStr: string): ClaimStatus | null {
  if (!statusStr || typeof statusStr !== 'string') return null;
  const normalized = statusStr.trim().toUpperCase().replace(/\s+/g, '_');
  if (['PENDING', 'COMPLETED', 'DISPATCHED', 'CANCELLED'].includes(normalized)) {
    return normalized as ClaimStatus;
  }
  return null;
}

// Helper to serialize Prisma ClaimTransaction to Frontend-compatible JSON
function serializeClaim(claim: any) {
  return {
    id: claim.id,
    listingId: claim.listingId,
    listingTitle: claim.listing ? claim.listing.title : 'Surplus Packaging Listing',
    sellerId: claim.listing ? claim.listing.sellerId : undefined,
    sellerName: claim.listing && claim.listing.seller ? claim.listing.seller.name : undefined,
    buyerId: claim.buyerId,
    buyerName: claim.buyer ? claim.buyer.name : 'Unknown Buyer',
    buyerLocation: claim.buyer ? `${claim.buyer.location}, ${claim.buyer.cityState}` : undefined,
    claimedQuantity: claim.claimedQuantity,
    unit: claim.unit,
    logisticsMode: formatLogisticsMode(claim.logisticsMode),
    co2SavedKg: claim.co2SavedKg,
    costSavingsInr: claim.costSavingsInr,
    status: formatClaimStatus(claim.status),
    claimedAt: claim.claimedAt ? new Date(claim.claimedAt).toISOString() : new Date().toISOString(),
    routeId: claim.routeId || undefined,
    logisticsRouteName: claim.logisticsRoute ? claim.logisticsRoute.routeName : undefined,
    passport: claim.listing && claim.listing.passport ? {
      id: claim.listing.passport.id,
      serialNumber: claim.listing.passport.serialNumber
    } : undefined
  };
}

// GET /api/claims - Fetch all claim transactions
claimsRouter.get('/', async (req: Request, res: Response) => {
  try {
    const { listingId, buyerId, status } = req.query;

    const whereClause: any = {};
    if (listingId && typeof listingId === 'string') {
      whereClause.listingId = listingId;
    }
    if (buyerId && typeof buyerId === 'string') {
      whereClause.buyerId = buyerId;
    }
    if (status && typeof status === 'string') {
      const parsed = parseClaimStatus(status);
      if (parsed) {
        whereClause.status = parsed;
      }
    }

    const claims = await prisma.claimTransaction.findMany({
      where: whereClause,
      include: {
        listing: {
          include: {
            seller: true,
            passport: true
          }
        },
        buyer: true,
        logisticsRoute: true
      },
      orderBy: {
        claimedAt: 'desc'
      }
    });

    const serialized = claims.map(serializeClaim);
    res.json(serialized);
  } catch (error) {
    console.error('Error fetching claim transactions:', error);
    res.status(500).json({ error: 'Failed to fetch claim transactions' });
  }
});

// GET /api/claims/:id - Fetch a single claim transaction by ID
claimsRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const claim = await prisma.claimTransaction.findUnique({
      where: { id },
      include: {
        listing: {
          include: {
            seller: true,
            passport: true
          }
        },
        buyer: true,
        logisticsRoute: true
      }
    });

    if (!claim) {
      return res.status(404).json({ error: 'Claim transaction not found' });
    }

    res.json(serializeClaim(claim));
  } catch (error) {
    console.error(`Error fetching claim ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to fetch claim transaction details' });
  }
});

// POST /api/claims - Create a new material claim transaction
claimsRouter.post('/', async (req: Request, res: Response) => {
  try {
    const {
      listingId,
      buyerId,
      claimedQuantity,
      unit,
      logisticsMode,
      co2SavedKg,
      costSavingsInr,
      status,
      routeId
    } = req.body;

    if (!listingId || !buyerId) {
      return res.status(400).json({
        error: 'Missing required fields: listingId and buyerId are required.'
      });
    }

    // Verify listing exists
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      include: { seller: true, passport: true }
    });

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found for claim transaction.' });
    }

    // Verify buyer company exists
    const buyer = await prisma.company.findUnique({
      where: { id: buyerId }
    });

    if (!buyer) {
      return res.status(404).json({ error: 'Buyer company not found for claim transaction.' });
    }

    // Optional route verification
    if (routeId) {
      const routeExists = await prisma.logisticsRoute.findUnique({ where: { id: routeId } });
      if (!routeExists) {
        return res.status(404).json({ error: 'Specified logistics route does not exist.' });
      }
    }

    const qty = Number(claimedQuantity !== undefined ? claimedQuantity : listing.quantity);
    const finalUnit = unit || listing.unit;
    const finalCo2SavedKg = Number(co2SavedKg !== undefined ? co2SavedKg : qty * listing.weightPerUnitKg * 0.7);
    const finalCostSavingsInr = Number(costSavingsInr !== undefined ? costSavingsInr : qty * (listing.pricePerUnitInr || 45));

    const finalLogisticsMode = (logisticsMode
      ? logisticsMode.toUpperCase().replace(/\s+/g, '_')
      : 'SHARED_BACKHAUL_LOOP') as LogisticsMode;

    const finalStatus = (status ? parseClaimStatus(status) || 'COMPLETED' : 'COMPLETED') as ClaimStatus;

    const newClaim = await prisma.claimTransaction.create({
      data: {
        listingId,
        buyerId,
        claimedQuantity: qty,
        unit: finalUnit,
        logisticsMode: finalLogisticsMode,
        co2SavedKg: finalCo2SavedKg,
        costSavingsInr: finalCostSavingsInr,
        status: finalStatus,
        routeId: routeId || null
      },
      include: {
        listing: {
          include: {
            seller: true,
            passport: true
          }
        },
        buyer: true,
        logisticsRoute: true
      }
    });

    res.status(201).json(serializeClaim(newClaim));
  } catch (error) {
    console.error('Error creating claim transaction:', error);
    res.status(500).json({ error: 'Failed to create claim transaction' });
  }
});

// PATCH /api/claims/:id/status - Update claim status
claimsRouter.patch('/:id/status', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Field "status" is required.' });
    }

    const parsedStatus = parseClaimStatus(status);
    if (!parsedStatus) {
      return res.status(400).json({
        error: 'Invalid status value. Valid options: PENDING, COMPLETED, DISPATCHED, CANCELLED.'
      });
    }

    const claimExists = await prisma.claimTransaction.findUnique({
      where: { id }
    });

    if (!claimExists) {
      return res.status(404).json({ error: 'Claim transaction not found' });
    }

    const updatedClaim = await prisma.claimTransaction.update({
      where: { id },
      data: {
        status: parsedStatus
      },
      include: {
        listing: {
          include: {
            seller: true,
            passport: true
          }
        },
        buyer: true,
        logisticsRoute: true
      }
    });

    res.json(serializeClaim(updatedClaim));
  } catch (error) {
    console.error(`Error updating claim status for ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to update claim status' });
  }
});
