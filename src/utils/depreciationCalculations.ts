import { FixedAsset, DepreciationSchedule } from "@/types/AutomationTypes";

/**
 * Calculate annual depreciation for a single asset
 */
export function calculateAssetDepreciation(
  cost: number,
  depreciationRate: number
): number {
  return (cost * depreciationRate) / 100;
}

/**
 * Generate complete depreciation schedule from fixed assets
 */
export function generateDepreciationSchedule(
  fixedAssets: FixedAsset[]
): DepreciationSchedule {
  const assets = fixedAssets.map((asset) => ({
    assetName: asset.name,
    cost: asset.cost,
    depreciationRate: asset.depreciationRate,
    annualDepreciation: calculateAssetDepreciation(
      asset.cost,
      asset.depreciationRate
    ),
  }));

  const totalAnnualDepreciation = assets.reduce(
    (sum, asset) => sum + asset.annualDepreciation,
    0
  );

  return {
    assets,
    totalAnnualDepreciation,
  };
}

/**
 * Calculate depreciation for a specific year
 * (Straight-line depreciation)
 */
export function calculateYearlyDepreciation(
  fixedAssets: FixedAsset[],
  year: number
): number {
  // For straight-line depreciation, it's the same each year
  return fixedAssets.reduce(
    (sum, asset) => sum + asset.annualDepreciation,
    0
  );
}
