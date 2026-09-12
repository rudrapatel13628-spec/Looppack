import type {
  MaterialCategory,
  MaterialGrade,
  CompanyType,
  RecyclabilityRating,
  MatchStatus,
  LogisticsMode,
  RouteStatus,
  NodeType,
  NotificationType
} from '@prisma/client';

export function formatMaterialCategory(category: MaterialCategory): string {
  const map: Record<MaterialCategory, string> = {
    CARDBOARD: 'Cardboard',
    HDPE_PLASTICS: 'HDPE Plastics',
    WOODEN_PALLETS: 'Wooden Pallets',
    STEEL_DRUMS: 'Steel Drums',
    BIO_FOAM: 'Bio-Foam'
  };
  return map[category] || category;
}

export function parseMaterialCategory(category: string): MaterialCategory {
  const map: Record<string, MaterialCategory> = {
    'Cardboard': 'CARDBOARD',
    'HDPE Plastics': 'HDPE_PLASTICS',
    'Wooden Pallets': 'WOODEN_PALLETS',
    'Steel Drums': 'STEEL_DRUMS',
    'Bio-Foam': 'BIO_FOAM'
  };
  return map[category] || ('CARDBOARD' as MaterialCategory);
}

export function formatMaterialGrade(condition: MaterialGrade): string {
  const map: Record<MaterialGrade, string> = {
    GRADE_A_LIKE_NEW: 'Grade A (Like New)',
    CLEAN_RECYCLABLE: 'Clean Recyclable',
    REFURBISHED: 'Refurbished',
    INDUSTRIAL_BULK: 'Industrial Bulk'
  };
  return map[condition] || condition;
}

export function parseMaterialGrade(condition: string): MaterialGrade {
  const map: Record<string, MaterialGrade> = {
    'Grade A (Like New)': 'GRADE_A_LIKE_NEW',
    'Clean Recyclable': 'CLEAN_RECYCLABLE',
    'Refurbished': 'REFURBISHED',
    'Industrial Bulk': 'INDUSTRIAL_BULK'
  };
  return map[condition] || ('CLEAN_RECYCLABLE' as MaterialGrade);
}

export function formatCompanyType(type: CompanyType): string {
  const map: Record<CompanyType, string> = {
    MANUFACTURER: 'Manufacturer',
    RETAILER: 'Retailer',
    RECYCLER: 'Recycler',
    DISTRIBUTION_HUB: 'Distribution Hub',
    LOGISTICS_FLEET: 'Logistics Fleet'
  };
  return map[type] || type;
}

export function formatRecyclabilityRating(rating: RecyclabilityRating): string {
  const map: Record<RecyclabilityRating, string> = {
    RECYCLABLE_100: '100% Recyclable',
    COMPOSTABLE: 'Compostable',
    REUSABLE_CIRCULAR: 'Reusable Circular'
  };
  return map[rating] || rating;
}

export function formatMatchStatus(status: MatchStatus): string {
  const map: Record<MatchStatus, string> = {
    PENDING: 'Pending',
    ACCEPTED: 'Accepted',
    DISPATCHED: 'Dispatched',
    NEGOTIATING: 'Negotiating'
  };
  return map[status] || status;
}

export function formatLogisticsMode(mode: LogisticsMode): string {
  const map: Record<LogisticsMode, string> = {
    SHARED_BACKHAUL_LOOP: 'Shared Backhaul Loop',
    DIRECT_EV_COURIER: 'Direct EV Courier',
    RAIL_FREIGHT_LOOP: 'Rail Freight Loop'
  };
  return map[mode] || mode;
}

export function formatRouteStatus(status: RouteStatus): string {
  const map: Record<RouteStatus, string> = {
    OPTIMIZED_SCHEDULED: 'Optimized & Scheduled',
    IN_TRANSIT: 'In Transit',
    COMPLETED: 'Completed'
  };
  return map[status] || status;
}

export function formatNodeType(type: NodeType): string {
  const map: Record<NodeType, string> = {
    PICKUP_SUPPLIER: 'Pickup (Supplier)',
    PROCESSING_HUB: 'Processing Hub',
    DROPOFF_BUYER: 'Dropoff (Buyer)'
  };
  return map[type] || type;
}

export function formatNotificationType(type: NotificationType): string {
  const map: Record<NotificationType, string> = {
    MATCH: 'match',
    ROUTE: 'route',
    PASSPORT: 'passport',
    REQUEST: 'request',
    CARBON: 'carbon'
  };
  return map[type] || 'match';
}
