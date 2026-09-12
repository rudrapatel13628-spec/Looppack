import express from 'express';
import cors from 'cors';
import { prisma } from './db';

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Mount Route Handlers
import { listingsRouter } from './routes/listings';
import { matchesRouter } from './routes/matches';
import { passportsRouter } from './routes/passports';
import { logisticsRouter } from './routes/logistics';
import { claimsRouter } from './routes/claims';
import { notificationsRouter } from './routes/notifications';
import { statsRouter } from './routes/stats';
import { companiesRouter } from './routes/companies';
import { usersRouter } from './routes/users';

app.use('/api/listings', listingsRouter);
app.use('/api/matches', matchesRouter);
app.use('/api/passports', passportsRouter);
app.use('/api/logistics', logisticsRouter);
app.use('/api/claims', claimsRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/stats', statsRouter);
app.use('/api/companies', companiesRouter);
app.use('/api/users', usersRouter);

// Health Check Endpoint
app.get('/api/health', async (_req, res) => {
  try {
    // Ping DB to verify database connection in health check
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', database: 'connected', timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ status: 'error', database: 'disconnected', error: String(error) });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 LoopPack Backend Express Server listening on http://localhost:${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
});

export default app;
