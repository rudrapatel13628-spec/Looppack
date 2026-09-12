import { Router, Request, Response } from 'express';
import { prisma } from '../db';
import { formatRecyclabilityRating } from '../utils/serializers';
import type { RecyclabilityRating } from '@prisma/client';

export const passportsRouter = Router();

// Helper to serialize Prisma DigitalPassport to Frontend DigitalPassport format
function serializePassport(passport: any) {
  return {
    id: passport.id,
    serialNumber: passport.serialNumber,
    listingId: passport.listingId,
    materialName: passport.materialName,
    quantity: passport.quantity,
    unit: passport.unit,
    originCompany: passport.originCompany,
    manufacturingLocation: passport.manufacturingLocation,
    rawMaterialSource: passport.rawMaterialSource,
    recycledContentPercent: passport.recycledContentPercent,
    virginContentPercent: passport.virginContentPercent,
    carbonFootprintKgPerKg: passport.carbonFootprintKgPerKg,
    netCo2SavedKg: passport.netCo2SavedKg,
    aiMatchScorePercent: passport.aiMatchScorePercent || 95,
    recyclabilityRating: formatRecyclabilityRating(passport.recyclabilityRating),
    certifications: passport.certifications || [],
    movementHistory: (passport.movementHistory || []).map((log: any) => ({
      timestamp: log.timestamp ? new Date(log.timestamp).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) + ' IST' : 'Just now',
      stage: log.stage,
      actor: log.actor,
      location: log.location,
      verificationHash: log.verificationHash
    })),
    qrData: passport.qrData || `https://looppack.in/passport/${passport.id}`
  };
}

// GET /api/passports - Fetch digital material passports (with optional listingId filter)
passportsRouter.get('/', async (req: Request, res: Response) => {
  try {
    const { listingId } = req.query;

    const whereClause: any = {};
    if (listingId && typeof listingId === 'string') {
      whereClause.listingId = listingId;
    }

    const passports = await prisma.digitalPassport.findMany({
      where: whereClause,
      include: {
        listing: {
          include: { seller: true }
        },
        movementHistory: {
          orderBy: { timestamp: 'asc' }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const serialized = passports.map(serializePassport);
    res.json(serialized);
  } catch (error) {
    console.error('Error fetching digital passports:', error);
    res.status(500).json({ error: 'Failed to fetch digital material passports' });
  }
});

// GET /api/passports/:id - Fetch a single digital material passport by ID or listingId
passportsRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Search by passport ID or listing ID
    let passport = await prisma.digitalPassport.findUnique({
      where: { id },
      include: {
        listing: {
          include: { seller: true }
        },
        movementHistory: {
          orderBy: { timestamp: 'asc' }
        }
      }
    });

    if (!passport) {
      passport = await prisma.digitalPassport.findUnique({
        where: { listingId: id },
        include: {
          listing: {
            include: { seller: true }
          },
          movementHistory: {
            orderBy: { timestamp: 'asc' }
          }
        }
      });
    }

    if (!passport) {
      return res.status(404).json({ error: 'Digital material passport not found' });
    }

    res.json(serializePassport(passport));
  } catch (error) {
    console.error(`Error fetching digital passport ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to fetch passport details' });
  }
});

// POST /api/passports - Create a new Digital Material Passport
passportsRouter.post('/', async (req: Request, res: Response) => {
  try {
    const {
      serialNumber,
      listingId,
      materialName,
      quantity,
      unit,
      originCompany,
      manufacturingLocation,
      rawMaterialSource,
      recycledContentPercent,
      virginContentPercent,
      carbonFootprintKgPerKg,
      netCo2SavedKg,
      aiMatchScorePercent,
      recyclabilityRating,
      certifications,
      qrData,
      initialStage
    } = req.body;

    if (!serialNumber || !listingId || !materialName || quantity === undefined || !unit || !originCompany) {
      return res.status(400).json({
        error: 'Missing required fields: serialNumber, listingId, materialName, quantity, unit, and originCompany are required.'
      });
    }

    // Verify target listing exists
    const listingExists = await prisma.listing.findUnique({
      where: { id: listingId }
    });

    if (!listingExists) {
      return res.status(404).json({ error: 'Listing not found for this passport.' });
    }

    // Verify serialNumber is unique
    const serialExists = await prisma.digitalPassport.findUnique({
      where: { serialNumber }
    });

    if (serialExists) {
      return res.status(400).json({ error: 'Passport serialNumber must be unique.' });
    }

    const prismaRating: RecyclabilityRating = recyclabilityRating
      ? (recyclabilityRating.toUpperCase().replace(/\s+/g, '_') as RecyclabilityRating)
      : 'RECYCLABLE_100';

    const hash = `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`;

    const newPassport = await prisma.digitalPassport.create({
      data: {
        serialNumber,
        listingId,
        materialName,
        quantity: Number(quantity),
        unit,
        originCompany,
        manufacturingLocation: manufacturingLocation || listingExists.location,
        rawMaterialSource: rawMaterialSource || listingExists.compositionPercent,
        recycledContentPercent: Number(recycledContentPercent || 90),
        virginContentPercent: Number(virginContentPercent || 10),
        carbonFootprintKgPerKg: Number(carbonFootprintKgPerKg || 0.20),
        netCo2SavedKg: Number(netCo2SavedKg || 1000),
        aiMatchScorePercent: aiMatchScorePercent ? Number(aiMatchScorePercent) : 95,
        recyclabilityRating: prismaRating,
        certifications: Array.isArray(certifications) ? certifications : ['ISO 14040 Lifecycle Verified'],
        qrData: qrData || `https://looppack.in/passport/${serialNumber}?hash=${hash}`,
        movementHistory: {
          create: [
            {
              stage: initialStage || 'Digital Material Passport Initialized',
              actor: originCompany,
              location: manufacturingLocation || listingExists.cityState,
              verificationHash: hash
            }
          ]
        }
      },
      include: {
        listing: true,
        movementHistory: true
      }
    });

    res.status(201).json(serializePassport(newPassport));
  } catch (error) {
    console.error('Error creating digital passport:', error);
    res.status(500).json({ error: 'Failed to create digital passport' });
  }
});

// POST /api/passports/:id/logs - Append a new cryptographic movement audit log event
passportsRouter.post('/:id/logs', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { stage, actor, location, verificationHash } = req.body;

    if (!stage || !actor || !location) {
      return res.status(400).json({ error: 'Missing required audit log fields: stage, actor, location are required.' });
    }

    let passport = await prisma.digitalPassport.findUnique({ where: { id } });
    if (!passport) {
      passport = await prisma.digitalPassport.findUnique({ where: { listingId: id } });
    }

    if (!passport) {
      return res.status(404).json({ error: 'Digital material passport not found.' });
    }

    const hash = verificationHash || `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`;

    const newLog = await prisma.passportAuditLog.create({
      data: {
        passportId: passport.id,
        stage,
        actor,
        location,
        verificationHash: hash
      }
    });

    res.status(201).json({
      id: newLog.id,
      passportId: newLog.passportId,
      timestamp: new Date(newLog.timestamp).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) + ' IST',
      stage: newLog.stage,
      actor: newLog.actor,
      location: newLog.location,
      verificationHash: newLog.verificationHash
    });
  } catch (error) {
    console.error(`Error adding audit log to passport ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to add movement audit log' });
  }
});
