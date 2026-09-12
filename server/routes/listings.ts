import { Router, Request, Response } from 'express';
import { prisma } from '../db';
import {
  formatMaterialCategory,
  formatMaterialGrade,
  formatCompanyType,
  parseMaterialCategory,
  parseMaterialGrade
} from '../utils/serializers';
import { calculateExactCarbonSaved } from '../../src/utils/carbonCalculator';
import type { MaterialCategory } from '../../src/types';

export const listingsRouter = Router();

// Helper to format Prisma Listing to Frontend Listing
function serializeListing(listing: any) {
  const categoryDisplay = formatMaterialCategory(listing.category) as MaterialCategory;
  const conditionDisplay = formatMaterialGrade(listing.condition);
  const sellerTypeDisplay = listing.seller ? formatCompanyType(listing.seller.type) : 'Manufacturer';

  // Calculate carbon details dynamically based on quantity, category & distance
  const carbonCalc = calculateExactCarbonSaved(
    categoryDisplay,
    listing.quantity,
    listing.weightPerUnitKg,
    listing.distanceKm
  );

  return {
    id: listing.id,
    title: listing.title,
    category: categoryDisplay,
    quantity: listing.quantity,
    unit: listing.unit,
    weightPerUnitKg: listing.weightPerUnitKg,
    location: listing.location,
    cityState: listing.cityState,
    distanceKm: listing.distanceKm,
    pricePerUnitInr: listing.pricePerUnitInr,
    condition: conditionDisplay,
    sellerName: listing.seller ? listing.seller.name : 'Unknown Seller',
    sellerRating: listing.seller ? listing.seller.rating : 5.0,
    sellerType: sellerTypeDisplay,
    image: listing.image,
    verified: listing.verified,
    description: listing.description,
    compositionPercent: listing.compositionPercent,
    dimensions: listing.dimensions || undefined,
    loadCapacityKg: listing.loadCapacityKg || undefined,
    postedDate: listing.createdAt ? new Date(listing.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Recently',
    carbonCalc
  };
}

// GET /api/listings - Get all surplus material listings (with optional filtering)
listingsRouter.get('/', async (req: Request, res: Response) => {
  try {
    const { category, search } = req.query;

    const whereClause: any = {};

    if (category && typeof category === 'string' && category !== 'All') {
      whereClause.category = parseMaterialCategory(category);
    }

    if (search && typeof search === 'string') {
      whereClause.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { cityState: { contains: search, mode: 'insensitive' } }
      ];
    }

    const listings = await prisma.listing.findMany({
      where: whereClause,
      include: {
        seller: true,
        passport: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const serialized = listings.map(serializeListing);
    res.json(serialized);
  } catch (error) {
    console.error('Error fetching listings:', error);
    res.status(500).json({ error: 'Failed to fetch material listings' });
  }
});

// GET /api/listings/:id - Get a single material listing by ID
listingsRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const listing = await prisma.listing.findUnique({
      where: { id },
      include: {
        seller: true,
        passport: {
          include: {
            movementHistory: {
              orderBy: { timestamp: 'asc' }
            }
          }
        },
        aiMatches: true
      }
    });

    if (!listing) {
      return res.status(404).json({ error: 'Material listing not found' });
    }

    const serialized = serializeListing(listing);
    res.json({
      ...serialized,
      passport: listing.passport || null,
      aiMatches: listing.aiMatches || []
    });
  } catch (error) {
    console.error(`Error fetching listing ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to fetch listing details' });
  }
});

// POST /api/listings - Create a new surplus packaging material listing
listingsRouter.post('/', async (req: Request, res: Response) => {
  try {
    const {
      title,
      category,
      quantity,
      unit,
      weightPerUnitKg,
      location,
      cityState,
      distanceKm,
      pricePerUnitInr,
      condition,
      sellerId,
      image,
      description,
      compositionPercent,
      dimensions,
      loadCapacityKg
    } = req.body;

    // Validate required fields
    if (!title || !category || quantity === undefined || !unit || !location || !cityState) {
      return res.status(400).json({
        error: 'Missing required fields: title, category, quantity, unit, location, and cityState are required.'
      });
    }

    // Default or resolve sellerId
    let effectiveSellerId = sellerId;
    if (!effectiveSellerId) {
      const defaultSeller = await prisma.company.findFirst({
        where: { type: 'MANUFACTURER' }
      });
      effectiveSellerId = defaultSeller ? defaultSeller.id : undefined;
    }

    if (!effectiveSellerId) {
      return res.status(400).json({ error: 'Valid sellerId is required to post a listing.' });
    }

    const prismaCategory = parseMaterialCategory(category);
    const prismaCondition = parseMaterialGrade(condition || 'Clean Recyclable');

    const newListing = await prisma.listing.create({
      data: {
        title,
        category: prismaCategory,
        quantity: Number(quantity),
        unit,
        weightPerUnitKg: Number(weightPerUnitKg || 1.0),
        location,
        cityState,
        distanceKm: Number(distanceKm || 20.0),
        pricePerUnitInr: Number(pricePerUnitInr || 0),
        condition: prismaCondition,
        sellerId: effectiveSellerId,
        image: image || 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80',
        verified: true,
        description: description || title,
        compositionPercent: compositionPercent || '100% Recyclable Material',
        dimensions: dimensions || null,
        loadCapacityKg: loadCapacityKg ? Number(loadCapacityKg) : null
      },
      include: {
        seller: true
      }
    });

    // Auto-create initial Digital Passport for the new listing
    const serialNum = `LP-2026-IN-${prismaCategory.substring(0, 3)}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newPassport = await prisma.digitalPassport.create({
      data: {
        serialNumber: serialNum,
        listingId: newListing.id,
        materialName: newListing.title,
        quantity: newListing.quantity,
        unit: newListing.unit,
        originCompany: newListing.seller.name,
        manufacturingLocation: `${newListing.location}, ${newListing.cityState}`,
        rawMaterialSource: newListing.compositionPercent,
        recycledContentPercent: 90,
        virginContentPercent: 10,
        carbonFootprintKgPerKg: 0.20,
        netCo2SavedKg: Math.round(newListing.quantity * newListing.weightPerUnitKg * 0.7),
        aiMatchScorePercent: 95,
        recyclabilityRating: 'RECYCLABLE_100',
        certifications: ['ISO 14040 Lifecycle Assessment Verified', 'LoopPack Verified Stream'],
        qrData: `https://looppack.in/passport/${newListing.id}`,
        movementHistory: {
          create: [
            {
              stage: 'Surplus Stream Published',
              actor: newListing.seller.name,
              location: newListing.cityState,
              verificationHash: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`
            }
          ]
        }
      }
    });

    const serialized = serializeListing(newListing);
    res.status(201).json({
      ...serialized,
      passport: newPassport
    });
  } catch (error) {
    console.error('Error creating listing:', error);
    res.status(500).json({ error: 'Failed to create surplus listing' });
  }
});
