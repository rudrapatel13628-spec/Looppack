import { Router, Request, Response } from 'express';
import { prisma } from '../db';
import { formatNotificationType } from '../utils/serializers';
import type { NotificationType } from '@prisma/client';

export const notificationsRouter = Router();

// Helper to parse string input into NotificationType Prisma Enum
function parseNotificationType(typeStr: string): NotificationType {
  if (!typeStr || typeof typeStr !== 'string') return 'MATCH';
  const normalized = typeStr.trim().toUpperCase();
  if (['MATCH', 'ROUTE', 'PASSPORT', 'REQUEST', 'CARBON'].includes(normalized)) {
    return normalized as NotificationType;
  }
  return 'MATCH';
}

// Helper to serialize Prisma Notification to Frontend NotificationItem format
function serializeNotification(notif: any) {
  return {
    id: notif.id,
    userId: notif.userId || undefined,
    companyId: notif.companyId || undefined,
    title: notif.title,
    message: notif.message,
    time: notif.createdAt ? new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now',
    createdAt: notif.createdAt ? new Date(notif.createdAt).toISOString() : new Date().toISOString(),
    unread: notif.unread,
    targetTab: notif.targetTab,
    type: formatNotificationType(notif.type),
    user: notif.user ? {
      id: notif.user.id,
      fullName: notif.user.fullName,
      email: notif.user.email
    } : undefined,
    company: notif.company ? {
      id: notif.company.id,
      name: notif.company.name
    } : undefined
  };
}

// GET /api/notifications - Fetch notifications with optional filters
notificationsRouter.get('/', async (req: Request, res: Response) => {
  try {
    const { userId, companyId, unread } = req.query;

    const whereClause: any = {};
    if (userId && typeof userId === 'string') {
      whereClause.userId = userId;
    }
    if (companyId && typeof companyId === 'string') {
      whereClause.companyId = companyId;
    }
    if (unread !== undefined) {
      whereClause.unread = unread === 'true';
    }

    const notifications = await prisma.notification.findMany({
      where: whereClause,
      include: {
        user: true,
        company: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const serialized = notifications.map(serializeNotification);
    res.json(serialized);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// GET /api/notifications/:id - Fetch a single notification by ID
notificationsRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const notif = await prisma.notification.findUnique({
      where: { id },
      include: {
        user: true,
        company: true
      }
    });

    if (!notif) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json(serializeNotification(notif));
  } catch (error) {
    console.error(`Error fetching notification ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to fetch notification details' });
  }
});

// POST /api/notifications - Create a new notification
notificationsRouter.post('/', async (req: Request, res: Response) => {
  try {
    const {
      title,
      message,
      targetTab,
      type,
      userId,
      companyId,
      unread
    } = req.body;

    if (!title || !message || !targetTab || !type) {
      return res.status(400).json({
        error: 'Missing required fields: title, message, targetTab, and type are required.'
      });
    }

    // Verify user exists if userId is provided
    if (userId) {
      const userExists = await prisma.user.findUnique({ where: { id: userId } });
      if (!userExists) {
        return res.status(404).json({ error: 'Specified user does not exist.' });
      }
    }

    // Verify company exists if companyId is provided
    if (companyId) {
      const companyExists = await prisma.company.findUnique({ where: { id: companyId } });
      if (!companyExists) {
        return res.status(404).json({ error: 'Specified company does not exist.' });
      }
    }

    const newNotif = await prisma.notification.create({
      data: {
        title,
        message,
        targetTab,
        type: parseNotificationType(type),
        userId: userId || null,
        companyId: companyId || null,
        unread: unread !== undefined ? Boolean(unread) : true
      },
      include: {
        user: true,
        company: true
      }
    });

    res.status(201).json(serializeNotification(newNotif));
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ error: 'Failed to create notification' });
  }
});

// PATCH /api/notifications/:id/read - Mark notification as read
notificationsRouter.patch('/:id/read', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const notifExists = await prisma.notification.findUnique({ where: { id } });
    if (!notifExists) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    const updatedNotif = await prisma.notification.update({
      where: { id },
      data: { unread: false },
      include: {
        user: true,
        company: true
      }
    });

    res.json(serializeNotification(updatedNotif));
  } catch (error) {
    console.error(`Error marking notification ${req.params.id} as read:`, error);
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
});
