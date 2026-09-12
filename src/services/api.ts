import type {
  Listing,
  AiMatch,
  DigitalPassport,
  LogisticsRoute,
  LogisticsRouteNode,
  ClaimTransaction,
  NotificationItem,
  PlatformStats,
  CarbonStatsDetail
} from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Generic helper for executing HTTP fetch requests to the Express backend API.
 */
async function fetchJson<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    let errorMessage = `API Error ${response.status}: ${response.statusText}`;
    try {
      const errorBody = await response.json();
      if (errorBody && errorBody.error) {
        errorMessage = errorBody.error;
      }
    } catch {
      // Fall back to default error string if JSON parsing fails
    }
    throw new Error(errorMessage);
  }

  return response.json() as Promise<T>;
}

// ==========================================
// 1. MATERIAL LISTINGS API
// ==========================================

export async function getListings(params?: { category?: string; search?: string }): Promise<Listing[]> {
  const queryParams = new URLSearchParams();
  if (params?.category) queryParams.append('category', params.category);
  if (params?.search) queryParams.append('search', params.search);
  const queryStr = queryParams.toString() ? `?${queryParams.toString()}` : '';
  return fetchJson<Listing[]>(`/listings${queryStr}`);
}

export async function getListing(id: string): Promise<Listing> {
  return fetchJson<Listing>(`/listings/${encodeURIComponent(id)}`);
}

export async function createListing(data: Partial<Listing> & { title: string; category: string; quantity: number; unit: string; location: string; cityState: string }): Promise<Listing> {
  return fetchJson<Listing>('/listings', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

// ==========================================
// 2. AI MATCHMAKER API
// ==========================================

export async function getMatches(params?: { listingId?: string; status?: string }): Promise<AiMatch[]> {
  const queryParams = new URLSearchParams();
  if (params?.listingId) queryParams.append('listingId', params.listingId);
  if (params?.status) queryParams.append('status', params.status);
  const queryStr = queryParams.toString() ? `?${queryParams.toString()}` : '';
  return fetchJson<AiMatch[]>(`/matches${queryStr}`);
}

export async function getMatch(id: string): Promise<AiMatch> {
  return fetchJson<AiMatch>(`/matches/${encodeURIComponent(id)}`);
}

export async function acceptMatch(id: string): Promise<AiMatch> {
  return fetchJson<AiMatch>(`/matches/${encodeURIComponent(id)}/accept`, {
    method: 'POST'
  });
}

// ==========================================
// 3. DIGITAL PASSPORTS API
// ==========================================

export async function getPassports(): Promise<DigitalPassport[]> {
  return fetchJson<DigitalPassport[]>('/passports');
}

export async function getPassport(id: string): Promise<DigitalPassport> {
  return fetchJson<DigitalPassport>(`/passports/${encodeURIComponent(id)}`);
}

export async function getPassportByListing(listingId: string): Promise<DigitalPassport> {
  return fetchJson<DigitalPassport>(`/passports/listing/${encodeURIComponent(listingId)}`);
}

export async function verifyPassport(id: string): Promise<DigitalPassport> {
  return fetchJson<DigitalPassport>(`/passports/${encodeURIComponent(id)}/verify`, {
    method: 'POST'
  });
}

// ==========================================
// 4. LOGISTICS ROUTES API
// ==========================================

export async function getLogisticsRoutes(params?: { status?: string }): Promise<LogisticsRoute[]> {
  const queryStr = params?.status ? `?status=${encodeURIComponent(params.status)}` : '';
  return fetchJson<LogisticsRoute[]>(`/logistics${queryStr}`);
}

export async function getLogisticsRoute(id: string): Promise<LogisticsRoute> {
  return fetchJson<LogisticsRoute>(`/logistics/${encodeURIComponent(id)}`);
}

export async function createLogisticsRoute(data: Partial<LogisticsRoute> & { routeName: string; carrierName: string; vehicleType: string; originHub: string; destinationHub: string; totalDistanceKm: number }): Promise<LogisticsRoute> {
  return fetchJson<LogisticsRoute>('/logistics', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function addLogisticsNode(id: string, data: { name: string; type?: string; lat: number; lng: number; address: string; demandQuantity?: string }): Promise<LogisticsRouteNode> {
  return fetchJson<LogisticsRouteNode>(`/logistics/${encodeURIComponent(id)}/nodes`, {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function dispatchRoute(id: string): Promise<LogisticsRoute> {
  return fetchJson<LogisticsRoute>(`/logistics/${encodeURIComponent(id)}/dispatch`, {
    method: 'POST'
  });
}

// ==========================================
// 5. CLAIMS TRANSACTION API
// ==========================================

export async function getClaims(params?: { listingId?: string; buyerId?: string; status?: string }): Promise<ClaimTransaction[]> {
  const queryParams = new URLSearchParams();
  if (params?.listingId) queryParams.append('listingId', params.listingId);
  if (params?.buyerId) queryParams.append('buyerId', params.buyerId);
  if (params?.status) queryParams.append('status', params.status);
  const queryStr = queryParams.toString() ? `?${queryParams.toString()}` : '';
  return fetchJson<ClaimTransaction[]>(`/claims${queryStr}`);
}

export async function getClaim(id: string): Promise<ClaimTransaction> {
  return fetchJson<ClaimTransaction>(`/claims/${encodeURIComponent(id)}`);
}

export async function createClaim(data: { listingId: string; buyerId: string; claimedQuantity?: number; unit?: string; logisticsMode?: string; co2SavedKg?: number; costSavingsInr?: number; status?: string; routeId?: string }): Promise<ClaimTransaction> {
  return fetchJson<ClaimTransaction>('/claims', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function updateClaimStatus(id: string, status: string): Promise<ClaimTransaction> {
  return fetchJson<ClaimTransaction>(`/claims/${encodeURIComponent(id)}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  });
}

// ==========================================
// 6. NOTIFICATIONS API
// ==========================================

export async function getNotifications(params?: { userId?: string; companyId?: string; unread?: boolean }): Promise<NotificationItem[]> {
  const queryParams = new URLSearchParams();
  if (params?.userId) queryParams.append('userId', params.userId);
  if (params?.companyId) queryParams.append('companyId', params.companyId);
  if (params?.unread !== undefined) queryParams.append('unread', String(params.unread));
  const queryStr = queryParams.toString() ? `?${queryParams.toString()}` : '';
  return fetchJson<NotificationItem[]>(`/notifications${queryStr}`);
}

export async function getNotification(id: string): Promise<NotificationItem> {
  return fetchJson<NotificationItem>(`/notifications/${encodeURIComponent(id)}`);
}

export async function createNotification(data: { title: string; message: string; targetTab: string; type: string; userId?: string; companyId?: string; unread?: boolean }): Promise<NotificationItem> {
  return fetchJson<NotificationItem>('/notifications', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function markNotificationRead(id: string): Promise<NotificationItem> {
  return fetchJson<NotificationItem>(`/notifications/${encodeURIComponent(id)}/read`, {
    method: 'PATCH'
  });
}

// ==========================================
// 7. STATS & ANALYTICS API
// ==========================================

export async function getStats(): Promise<PlatformStats> {
  return fetchJson<PlatformStats>('/stats');
}

export async function getCarbonStats(): Promise<CarbonStatsDetail> {
  return fetchJson<CarbonStatsDetail>('/stats/carbon');
}
