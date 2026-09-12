import { Router, Request, Response } from 'express';
import { prisma } from '../db';
import {
  formatRouteStatus,
  formatNodeType
} from '../utils/serializers';
import type { RouteStatus, NodeType } from '@prisma/client';

export const logisticsRouter = Router();

// Helper to serialize Prisma LogisticsRoute to Frontend LogisticsRoute format
function serializeLogisticsRoute(route: any) {
  return {
    id: route.id,
    routeName: route.routeName,
    carrierName: route.carrierName,
    vehicleType: route.vehicleType,
    originHub: route.originHub,
    destinationHub: route.destinationHub,
    totalDistanceKm: route.totalDistanceKm,
    linearRouteDistanceKm: route.linearRouteDistanceKm,
    distanceSavedKm: route.distanceSavedKm,
    linearEmissionsKg: route.linearEmissionsKg,
    loopEmissionsKg: route.loopEmissionsKg,
    emissionsSavedKg: route.emissionsSavedKg,
    estimatedCostSavedInr: route.estimatedCostSavedInr,
    backhaulOpportunityPercent: route.backhaulOpportunityPercent,
    vehicleCapacityPercent: route.vehicleCapacityPercent,
    status: formatRouteStatus(route.status),
    nodes: (route.nodes || []).map((node: any) => ({
      id: node.id,
      name: node.name,
      type: formatNodeType(node.type),
      lat: node.lat,
      lng: node.lng,
      address: node.address,
      demandQuantity: node.demandQuantity
    }))
  };
}

function parseNodeType(typeStr: string): NodeType {
  if (typeStr.includes('Pickup') || typeStr === 'PICKUP_SUPPLIER') return 'PICKUP_SUPPLIER';
  if (typeStr.includes('Dropoff') || typeStr === 'DROPOFF_BUYER') return 'DROPOFF_BUYER';
  return 'PROCESSING_HUB';
}

// GET /api/logistics - Fetch all commercial EV backhaul route loops
logisticsRouter.get('/', async (req: Request, res: Response) => {
  try {
    const { status } = req.query;

    const whereClause: any = {};
    if (status && typeof status === 'string') {
      whereClause.status = status.toUpperCase() as RouteStatus;
    }

    const routes = await prisma.logisticsRoute.findMany({
      where: whereClause,
      include: {
        carrier: true,
        nodes: {
          orderBy: { sequenceOrder: 'asc' }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const serialized = routes.map(serializeLogisticsRoute);
    res.json(serialized);
  } catch (error) {
    console.error('Error fetching logistics routes:', error);
    res.status(500).json({ error: 'Failed to fetch eco-logistics routes' });
  }
});

// GET /api/logistics/:id - Fetch a single logistics route by ID
logisticsRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const route = await prisma.logisticsRoute.findUnique({
      where: { id },
      include: {
        carrier: true,
        nodes: {
          orderBy: { sequenceOrder: 'asc' }
        },
        claims: true
      }
    });

    if (!route) {
      return res.status(404).json({ error: 'Logistics route not found' });
    }

    res.json(serializeLogisticsRoute(route));
  } catch (error) {
    console.error(`Error fetching logistics route ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to fetch logistics route details' });
  }
});

// POST /api/logistics - Create a new commercial EV backhaul route loop
logisticsRouter.post('/', async (req: Request, res: Response) => {
  try {
    const {
      routeName,
      carrierId,
      carrierName,
      vehicleType,
      originHub,
      destinationHub,
      totalDistanceKm,
      linearRouteDistanceKm,
      linearEmissionsKg,
      loopEmissionsKg,
      estimatedCostSavedInr,
      backhaulOpportunityPercent,
      vehicleCapacityPercent,
      status,
      nodes
    } = req.body;

    if (!routeName || !carrierName || !vehicleType || !originHub || !destinationHub || totalDistanceKm === undefined) {
      return res.status(400).json({
        error: 'Missing required fields: routeName, carrierName, vehicleType, originHub, destinationHub, and totalDistanceKm are required.'
      });
    }

    const totalDist = Number(totalDistanceKm);
    const linearDist = Number(linearRouteDistanceKm || totalDist * 2);
    const distSaved = Math.max(0, linearDist - totalDist);

    const linearEm = Number(linearEmissionsKg || Math.round(linearDist * 1.45));
    const loopEm = Number(loopEmissionsKg || Math.round(totalDist * 0.65));
    const emSaved = Math.max(0, linearEm - loopEm);

    const newRoute = await prisma.logisticsRoute.create({
      data: {
        routeName,
        carrierId: carrierId || null,
        carrierName,
        vehicleType,
        originHub,
        destinationHub,
        totalDistanceKm: totalDist,
        linearRouteDistanceKm: linearDist,
        distanceSavedKm: distSaved,
        linearEmissionsKg: linearEm,
        loopEmissionsKg: loopEm,
        emissionsSavedKg: emSaved,
        estimatedCostSavedInr: Number(estimatedCostSavedInr || distSaved * 180),
        backhaulOpportunityPercent: Number(backhaulOpportunityPercent || 90),
        vehicleCapacityPercent: Number(vehicleCapacityPercent || 92),
        status: (status ? status.toUpperCase().replace(/\s+/g, '_') : 'OPTIMIZED_SCHEDULED') as RouteStatus,
        nodes: Array.isArray(nodes) && nodes.length > 0 ? {
          create: nodes.map((node: any, idx: number) => ({
            name: node.name,
            type: parseNodeType(node.type || 'PROCESSING_HUB'),
            lat: Number(node.lat || 18.5204),
            lng: Number(node.lng || 73.8567),
            address: node.address || originHub,
            demandQuantity: node.demandQuantity || 'Packaging Transport',
            sequenceOrder: idx + 1
          }))
        } : undefined
      },
      include: {
        nodes: {
          orderBy: { sequenceOrder: 'asc' }
        }
      }
    });

    res.status(201).json(serializeLogisticsRoute(newRoute));
  } catch (error) {
    console.error('Error creating logistics route:', error);
    res.status(500).json({ error: 'Failed to create eco-logistics route' });
  }
});

// POST /api/logistics/:id/nodes - Add a waypoint node to an existing route
logisticsRouter.post('/:id/nodes', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, type, lat, lng, address, demandQuantity } = req.body;

    if (!name || !address || lat === undefined || lng === undefined) {
      return res.status(400).json({ error: 'Missing required node fields: name, address, lat, and lng are required.' });
    }

    const routeExists = await prisma.logisticsRoute.findUnique({
      where: { id },
      include: { nodes: true }
    });

    if (!routeExists) {
      return res.status(404).json({ error: 'Logistics route not found' });
    }

    const nodeCount = routeExists.nodes.length;
    const newNode = await prisma.routeNode.create({
      data: {
        routeId: id,
        name,
        type: parseNodeType(type || 'PROCESSING_HUB'),
        lat: Number(lat),
        lng: Number(lng),
        address,
        demandQuantity: demandQuantity || 'Staging & Cargo Inspection',
        sequenceOrder: nodeCount + 1
      }
    });

    res.status(201).json({
      id: newNode.id,
      name: newNode.name,
      type: formatNodeType(newNode.type),
      lat: newNode.lat,
      lng: newNode.lng,
      address: newNode.address,
      demandQuantity: newNode.demandQuantity
    });
  } catch (error) {
    console.error(`Error adding node to route ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to add route node waypoint' });
  }
});

// POST /api/logistics/:id/dispatch - Dispatch route (updates status to IN_TRANSIT)
logisticsRouter.post('/:id/dispatch', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const routeExists = await prisma.logisticsRoute.findUnique({ where: { id } });
    if (!routeExists) {
      return res.status(404).json({ error: 'Logistics route not found' });
    }

    const updatedRoute = await prisma.logisticsRoute.update({
      where: { id },
      data: {
        status: 'IN_TRANSIT'
      },
      include: {
        nodes: {
          orderBy: { sequenceOrder: 'asc' }
        }
      }
    });

    res.json(serializeLogisticsRoute(updatedRoute));
  } catch (error) {
    console.error(`Error dispatching logistics route ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to dispatch logistics route' });
  }
});
