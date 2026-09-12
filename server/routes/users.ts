import { Router, Request, Response } from 'express';
import { prisma } from '../db';
import { formatCompanyType } from '../utils/serializers';
import type { UserRole } from '@prisma/client';

export const usersRouter = Router();

// Helper to format Prisma UserRole enum into user-friendly string
function formatUserRole(role: UserRole): string {
  const map: Record<UserRole, string> = {
    MANUFACTURER: 'Manufacturer',
    BUYER_RECYCLER: 'Buyer / Recycler',
    LOGISTICS_FLEET: 'Logistics Fleet'
  };
  return map[role] || role;
}

// Helper to serialize Prisma User model (excluding passwordHash)
function serializeUser(user: any) {
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    role: formatUserRole(user.role),
    companyId: user.companyId,
    companyName: user.company ? user.company.name : undefined,
    companyType: user.company ? formatCompanyType(user.company.type) : undefined,
    createdAt: user.createdAt ? new Date(user.createdAt).toISOString() : new Date().toISOString()
  };
}

// GET /api/users - Fetch registered users with company relationships
usersRouter.get('/', async (req: Request, res: Response) => {
  try {
    const { companyId, role } = req.query;

    const whereClause: any = {};
    if (companyId && typeof companyId === 'string') {
      whereClause.companyId = companyId;
    }
    if (role && typeof role === 'string') {
      whereClause.role = role.toUpperCase().replace(/\s+/g, '_') as UserRole;
    }

    const users = await prisma.user.findMany({
      where: whereClause,
      include: {
        company: true
      },
      orderBy: {
        fullName: 'asc'
      }
    });

    const serialized = users.map(serializeUser);
    res.json(serialized);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch user directory' });
  }
});

// GET /api/users/:id - Fetch a single user profile by ID
usersRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        company: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(serializeUser(user));
  } catch (error) {
    console.error(`Error fetching user ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to fetch user details' });
  }
});
