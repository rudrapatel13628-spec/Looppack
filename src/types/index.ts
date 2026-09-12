export type MaterialCategory = 
  | 'Cardboard' 
  | 'HDPE Plastics' 
  | 'Wooden Pallets' 
  | 'Steel Drums' 
  | 'Bio-Foam';

export type MaterialGrade = 
  | 'Grade A (Like New)' 
  | 'Clean Recyclable' 
  | 'Refurbished' 
  | 'Industrial Bulk';

export interface CarbonCalculationDetails {
  materialWeightKg: number;
  baselineEmissionFactor: number;
  circularEmissionFactor: number;
  transportEmissionsKg: number;
  baselineTotalCo2Kg: number;
  circularTotalCo2Kg: number;
  netCo2SavedKg: number;
}

export interface AiFactorBreakdown {
  materialCompatibilityScore: number;
  carbonBenefitScore: number;
  availabilityTimeScore: number;
  quantityFitScore: number;
  priceScore: number;
  distanceScore: number;
}

export interface Listing {
  id: string;
  title: string;
  category: MaterialCategory;
  quantity: number;
  unit: string;
  weightPerUnitKg: number;
  location: string;
  cityState: string;
  distanceKm: number;
  pricePerUnitInr: number;
  condition: MaterialGrade;
  sellerName: string;
  sellerRating: number;
  sellerType: 'Manufacturer' | 'Retailer' | 'Recycler' | 'Distribution Hub';
  image: string;
  verified: boolean;
  description: string;
  compositionPercent: string;
  dimensions?: string;
  loadCapacityKg?: number;
  postedDate: string;
  carbonCalc: CarbonCalculationDetails;
}

export interface AiMatch {
  id: string;
  listingId: string;
  listingTitle: string;
  buyerName: string;
  buyerType: string;
  distanceKm: number;
  matchScorePercent: number;
  factors: AiFactorBreakdown;
  co2SavingsTotalKg: number;
  costSavingsTotalInr: number;
  suggestedPricePerUnitInr: number;
  status: 'Pending' | 'Accepted' | 'Dispatched' | 'Negotiating';
  logisticsMode: 'Shared Backhaul Loop' | 'Direct EV Courier' | 'Rail Freight Loop';
  matchReasoning: string[];
}

export interface DigitalPassport {
  id: string;
  serialNumber: string;
  listingId: string;
  materialName: string;
  quantity: number;
  unit: string;
  originCompany: string;
  manufacturingLocation: string;
  rawMaterialSource: string;
  recycledContentPercent: number;
  virginContentPercent: number;
  carbonFootprintKgPerKg: number;
  netCo2SavedKg: number;
  aiMatchScorePercent: number;
  recyclabilityRating: '100% Recyclable' | 'Compostable' | 'Reusable Circular';
  certifications: string[];
  movementHistory: {
    timestamp: string;
    stage: string;
    actor: string;
    location: string;
    verificationHash: string;
  }[];
  qrData: string;
}

export interface LogisticsRouteNode {
  id: string;
  name: string;
  type: 'Pickup (Supplier)' | 'Processing Hub' | 'Dropoff (Buyer)';
  lat: number;
  lng: number;
  address: string;
  demandQuantity: string;
}

export interface LogisticsRoute {
  id: string;
  routeName: string;
  carrierName: string;
  vehicleType: string;
  originHub: string;
  destinationHub: string;
  totalDistanceKm: number;
  linearRouteDistanceKm: number;
  distanceSavedKm: number;
  linearEmissionsKg: number;
  loopEmissionsKg: number;
  emissionsSavedKg: number;
  estimatedCostSavedInr: number;
  backhaulOpportunityPercent: number;
  vehicleCapacityPercent: number;
  status: 'Optimized & Scheduled' | 'In Transit' | 'Completed';
  nodes: LogisticsRouteNode[];
}

export interface GlobalCarbonStats {
  totalCo2AvoidedTons: number;
  landfillWasteDivertedTons: number;
  circularEconomyRatePercent: number;
  totalCostSavingsInr: number;
  activeListingsCount: number;
  completedExchangesCount: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  unread: boolean;
  targetTab: string;
  type: 'match' | 'route' | 'passport' | 'request' | 'carbon';
}

export interface ClaimTransaction {
  id: string;
  listingId: string;
  listingTitle?: string;
  sellerId?: string;
  sellerName?: string;
  buyerId: string;
  buyerName?: string;
  buyerLocation?: string;
  claimedQuantity: number;
  unit: string;
  logisticsMode: string;
  co2SavedKg: number;
  costSavingsInr: number;
  status: string;
  claimedAt: string;
  routeId?: string;
  logisticsRouteName?: string;
  passport?: {
    id: string;
    serialNumber: string;
  };
}

export interface PlatformStats {
  summary: {
    totalListings: number;
    totalSurplusQuantity: number;
    totalAiMatches: number;
    acceptedAiMatches: number;
    totalClaims: number;
    completedClaims: number;
    totalPassports: number;
    activeRoutes: number;
    totalRoutes: number;
    totalCompanies: number;
  };
  globalCarbonStats: GlobalCarbonStats;
}

export interface CarbonStatsDetail {
  totalCo2SavedKg: number;
  totalCo2AvoidedTons: number;
  totalCostSavingsInr: number;
  equivalents: {
    co2Tons: number;
    treesPlantedEquivalent: number;
    carDaysOffRoad: number;
    landfillVolumeM3: number;
  };
  categoryBreakdown: {
    name: string;
    value: number;
    percentage: number;
    color: string;
  }[];
  partnerSavings: {
    partner: string;
    exchangeVolumeTons: number;
    co2ReductionTons: number;
    complianceScore: number;
  }[];
}
