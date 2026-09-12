import { Router, Request, Response } from 'express';
import { prisma } from '../db';
import { formatCompanyType } from '../utils/serializers';
import type { CompanyType } from '@prisma/client';

export const companiesRouter = Router();

// Helper to serialize Prisma Company model for API response
function serializeCompany(company: any) {
  return {
    id: company.id,
    name: company.name,
    type: formatCompanyType(company.type),
    rating: company.rating,
    location: company.location,
    cityState: company.cityState,
    createdAt: company.createdAt ? new Date(company.createdAt).toISOString() : new Date().toISOString()
  };
}

// GET /api/companies - Fetch all registered enterprise companies
companiesRouter.get('/', async (req: Request, res: Response) => {
  try {
    const { type, search } = req.query;

    const whereClause: any = {};
    if (type && typeof type === 'string') {
      whereClause.type = type.toUpperCase().replace(/\s+/g, '_') as CompanyType;
    }
    if (search && typeof search === 'string') {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
        { cityState: { contains: search, mode: 'insensitive' } }
      ];
    }

    const companies = await prisma.company.findMany({
      where: whereClause,
      orderBy: {
        name: 'asc'
      }
    });

    const serialized = companies.map(serializeCompany);
    res.json(serialized);
  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).json({ error: 'Failed to fetch company directory' });
  }
});

// GET /api/companies/:id - Fetch single company by ID
companiesRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const company = await prisma.company.findUnique({
      where: { id },
      include: {
        listings: true,
        claims: true,
        users: true
      }
    });

    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    res.json({
      ...serializeCompany(company),
      listingsCount: company.listings.length,
      claimsCount: company.claims.length,
      usersCount: company.users.length
    });
  } catch (error) {
    console.error(`Error fetching company ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to fetch company details' });
  }
});
