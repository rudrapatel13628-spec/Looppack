import type { MaterialCategory, CarbonCalculationDetails, AiFactorBreakdown } from '../types';

export const EMISSION_FACTORS: Record<MaterialCategory, { baselineFactor: number; circularFactor: number; defaultWeightKg: number }> = {
  'Cardboard': { baselineFactor: 0.9, circularFactor: 0.2, defaultWeightKg: 1.0 },
  'HDPE Plastics': { baselineFactor: 2.5, circularFactor: 0.4, defaultWeightKg: 12.0 },
  'Wooden Pallets': { baselineFactor: 1.8, circularFactor: 0.3, defaultWeightKg: 20.0 },
  'Steel Drums': { baselineFactor: 3.2, circularFactor: 0.5, defaultWeightKg: 18.0 },
  'Bio-Foam': { baselineFactor: 1.4, circularFactor: 0.25, defaultWeightKg: 0.4 },
};

export function calculateExactCarbonSaved(
  category: MaterialCategory,
  quantity: number,
  weightPerUnitKg?: number,
  distanceKm: number = 30
): CarbonCalculationDetails {
  const factors = EMISSION_FACTORS[category] || EMISSION_FACTORS['Cardboard'];
  const unitWeight = weightPerUnitKg || factors.defaultWeightKg;
  const materialWeightKg = quantity * unitWeight;

  const baselineTotalCo2Kg = Math.round(materialWeightKg * factors.baselineFactor * 10) / 10;
  const circularTotalCo2Kg = Math.round(materialWeightKg * factors.circularFactor * 10) / 10;
  const transportEmissionsKg = Math.round((materialWeightKg / 1000) * distanceKm * 0.15 * 10) / 10;

  const netCo2SavedKg = Math.max(0, Math.round((baselineTotalCo2Kg - circularTotalCo2Kg - transportEmissionsKg) * 10) / 10);

  return {
    materialWeightKg,
    baselineEmissionFactor: factors.baselineFactor,
    circularEmissionFactor: factors.circularFactor,
    transportEmissionsKg,
    baselineTotalCo2Kg,
    circularTotalCo2Kg,
    netCo2SavedKg
  };
}

export function calculateDeterministicAiScore(
  compatibility: number,
  carbonBenefit: number,
  quantityFit: number,
  priceScore: number,
  distanceScore: number,
  availabilityTime: number
): { totalScore: number; factors: AiFactorBreakdown } {
  const factors: AiFactorBreakdown = {
    materialCompatibilityScore: Math.min(100, Math.max(0, compatibility)),
    carbonBenefitScore: Math.min(100, Math.max(0, carbonBenefit)),
    quantityFitScore: Math.min(100, Math.max(0, quantityFit)),
    priceScore: Math.min(100, Math.max(0, priceScore)),
    distanceScore: Math.min(100, Math.max(0, distanceScore)),
    availabilityTimeScore: Math.min(100, Math.max(0, availabilityTime)),
  };

  const totalScore = Math.round(
    factors.materialCompatibilityScore * 0.30 +
    factors.carbonBenefitScore * 0.20 +
    factors.quantityFitScore * 0.15 +
    factors.priceScore * 0.15 +
    factors.distanceScore * 0.15 +
    factors.availabilityTimeScore * 0.05
  );

  return { totalScore, factors };
}

export function calculateEquivalents(co2Kg: number) {
  const co2Tons = co2Kg / 1000;
  const treesPlantedEquivalent = Math.round(co2Kg / 22);
  const carDaysOffRoad = Math.round(co2Kg / 12.6);
  const landfillVolumeM3 = Math.round(co2Tons * 4.8 * 10) / 10;

  return {
    co2Tons: Math.round(co2Tons * 100) / 100,
    treesPlantedEquivalent,
    carDaysOffRoad,
    landfillVolumeM3
  };
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}
