export interface MonthlyEmbodiedCarbonData {
  month: string;
  co2AvoidedTons: number;
  virginMaterialAvoidedTons: number;
  costSavedInr: number;
}

export interface MaterialCategoryBreakdown {
  name: string;
  value: number; // tons
  percentage: number;
  color: string;
}

export interface Scope3PartnerSavings {
  partner: string;
  exchangeVolumeTons: number;
  co2ReductionTons: number;
  complianceScore: number;
}

export const MONTHLY_CARBON_TRENDS: MonthlyEmbodiedCarbonData[] = [
  { month: 'Oct 2025', co2AvoidedTons: 420.5, virginMaterialAvoidedTons: 310.2, costSavedInr: 940000 },
  { month: 'Nov 2025', co2AvoidedTons: 580.2, virginMaterialAvoidedTons: 440.6, costSavedInr: 1280000 },
  { month: 'Dec 2025', co2AvoidedTons: 710.8, virginMaterialAvoidedTons: 520.1, costSavedInr: 1620000 },
  { month: 'Jan 2026', co2AvoidedTons: 940.4, virginMaterialAvoidedTons: 680.5, costSavedInr: 2150000 },
  { month: 'Feb 2026', co2AvoidedTons: 1180.6, virginMaterialAvoidedTons: 890.3, costSavedInr: 2850000 },
  { month: 'Mar 2026', co2AvoidedTons: 1428.5, virginMaterialAvoidedTons: 1045.0, costSavedInr: 3428000 },
];

export const MATERIAL_BREAKDOWN: MaterialCategoryBreakdown[] = [
  { name: 'Cardboard & Paper', value: 582, percentage: 41, color: '#10b981' },
  { name: 'HDPE Plastics', value: 340, percentage: 24, color: '#06b6d4' },
  { name: 'Wooden Pallets', value: 295, percentage: 21, color: '#f59e0b' },
  { name: 'Steel Drums', value: 142, percentage: 10, color: '#6366f1' },
  { name: 'Bio-Foam Inserts', value: 69, percentage: 4, color: '#ec4899' },
];

export const SCOPE3_PARTNERS: Scope3PartnerSavings[] = [
  { partner: 'Tata AutoComp Systems', exchangeVolumeTons: 340.5, co2ReductionTons: 480.2, complianceScore: 98 },
  { partner: 'Bosch India Logistics', exchangeVolumeTons: 280.0, co2ReductionTons: 390.4, complianceScore: 96 },
  { partner: 'Hyundai Supplier Park', exchangeVolumeTons: 195.4, co2ReductionTons: 265.1, complianceScore: 94 },
  { partner: 'Flipkart Logistics Hub', exchangeVolumeTons: 142.1, co2ReductionTons: 192.3, complianceScore: 99 },
  { partner: 'Gujarat Alkali & Chem', exchangeVolumeTons: 98.7, co2ReductionTons: 110.5, complianceScore: 92 },
];
