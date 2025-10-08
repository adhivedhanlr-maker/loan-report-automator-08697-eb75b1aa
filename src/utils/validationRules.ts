import { BusinessInfo, FinanceData } from "@/types/AutomationTypes";

/**
 * Validation Rule 1: Business Information
 * All required identity fields must be filled
 */
export function validateBusinessInfo(businessInfo: BusinessInfo): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Required fields validation
  if (!businessInfo.shopName?.trim()) {
    errors.push("Shop Name is required");
  }
  
  if (!businessInfo.proprietorName?.trim()) {
    errors.push("Proprietor Name is required");
  }
  
  if (!businessInfo.contactNumber?.trim()) {
    errors.push("Contact Number is required");
  }
  
  if (!businessInfo.district?.trim()) {
    errors.push("District is required");
  }
  
  if (!businessInfo.pinCode?.trim()) {
    errors.push("Pin Code is required");
  }
  
  if (!businessInfo.proposedBusiness?.trim()) {
    errors.push("Proposed Business is required");
  }

  // Contact number format validation (10 digits)
  if (businessInfo.contactNumber && !/^\d{10}$/.test(businessInfo.contactNumber)) {
    errors.push("Contact Number must be 10 digits");
  }

  // Pin code format validation (6 digits)
  if (businessInfo.pinCode && !/^\d{6}$/.test(businessInfo.pinCode)) {
    errors.push("Pin Code must be 6 digits");
  }

  // PAN format validation (if provided)
  if (businessInfo.panNo && !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(businessInfo.panNo)) {
    errors.push("PAN Number format is invalid");
  }

  // Aadhaar format validation (if provided)
  if (businessInfo.aadhaarNo && !/^\d{12}$/.test(businessInfo.aadhaarNo)) {
    errors.push("Aadhaar Number must be 12 digits");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validation Rule 2: Finance Data
 * Ensure all financial inputs are valid and loan amount <= total project cost
 */
export function validateFinanceData(financeData: FinanceData): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Loan amount validation
  if (financeData.loanAmount <= 0) {
    errors.push("Loan Amount must be greater than 0");
  }

  // Equity validation
  if (financeData.equity < 0) {
    errors.push("Equity cannot be negative");
  }

  // Growth rate validation
  if (financeData.growthRate < 0 || financeData.growthRate > 100) {
    errors.push("Growth Rate must be between 0 and 100");
  }

  // Fixed assets validation
  if (financeData.fixedAssets.length === 0) {
    errors.push("At least one Fixed Asset is required");
  }

  financeData.fixedAssets.forEach((asset, index) => {
    if (!asset.name?.trim()) {
      errors.push(`Fixed Asset ${index + 1}: Name is required`);
    }
    if (asset.cost <= 0) {
      errors.push(`Fixed Asset ${index + 1}: Cost must be greater than 0`);
    }
    if (asset.depreciationRate < 0 || asset.depreciationRate > 100) {
      errors.push(`Fixed Asset ${index + 1}: Depreciation Rate must be between 0 and 100`);
    }
  });

  // Sales mix validation
  if (financeData.salesMix.length === 0) {
    errors.push("At least one Sales Mix item is required");
  }

  financeData.salesMix.forEach((item, index) => {
    if (!item.product?.trim()) {
      errors.push(`Sales Mix ${index + 1}: Product name is required`);
    }
    if (item.units <= 0) {
      errors.push(`Sales Mix ${index + 1}: Units must be greater than 0`);
    }
    if (item.rate <= 0) {
      errors.push(`Sales Mix ${index + 1}: Rate must be greater than 0`);
    }
  });

  // Materials validation
  if (financeData.materials.length === 0) {
    errors.push("At least one Material/COGS item is required");
  }

  financeData.materials.forEach((item, index) => {
    if (!item.material?.trim()) {
      errors.push(`Material ${index + 1}: Material name is required`);
    }
    if (item.units <= 0) {
      errors.push(`Material ${index + 1}: Units must be greater than 0`);
    }
    if (item.rate <= 0) {
      errors.push(`Material ${index + 1}: Rate must be greater than 0`);
    }
  });

  // Calculate total project cost
  const totalFixedAssets = financeData.fixedAssets.reduce(
    (sum, asset) => sum + asset.cost,
    0
  );
  const totalProjectCost = totalFixedAssets + financeData.equity;

  // Validation Rule 2: Loan amount should not exceed total project cost
  if (financeData.loanAmount > totalProjectCost) {
    errors.push(
      `Loan Amount (₹${financeData.loanAmount.toLocaleString()}) cannot exceed Total Project Cost (₹${totalProjectCost.toLocaleString()})`
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
