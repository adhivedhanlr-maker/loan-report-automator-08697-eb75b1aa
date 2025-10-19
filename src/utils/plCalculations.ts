import { 
  FinanceData, 
  ProfitAndLossStatement,
  LoanAmortizationSchedule,
  DepreciationSchedule
} from "@/types/AutomationTypes";
import { calculateYearlyInterest } from "./loanCalculations";
import { calculateYearlyDepreciation } from "./depreciationCalculations";

/**
 * Generate 5-year Profit & Loss Statement
 */
export function generateProfitAndLossStatement(
  financeData: FinanceData,
  loanAmortization: LoanAmortizationSchedule,
  depreciationSchedule: DepreciationSchedule
): ProfitAndLossStatement {
  const years = [];
  
  // Normalize arrays to prevent runtime errors from unexpected shapes
  const salesMixArr = Array.isArray(financeData.salesMix) ? financeData.salesMix : [];
  const materialsArr = Array.isArray(financeData.materials) ? financeData.materials : [];
  const fixedOpexArr = Array.isArray(financeData.fixedOPEX)
    ? financeData.fixedOPEX
    : (financeData.fixedOPEX && typeof financeData.fixedOPEX === 'object'
        ? Object.entries(financeData.fixedOPEX as any)
            .filter(([, v]) => typeof v === 'number' && !Number.isNaN(v as number))
            .map(([label, amount]) => ({ label, amount: amount as number }))
        : []);

  // Base monthly values (defensive defaults)
  const baseMonthlyRevenue = salesMixArr.reduce(
    (sum, item) => sum + (Number(item.monthlyRevenue) || 0),
    0
  );
  const baseMonthlyCOGS = materialsArr.reduce(
    (sum, item) => sum + (Number(item.monthlyCost) || 0),
    0
  );
  
  // Fixed OPEX (annual)
  const monthlyFixedOPEX = fixedOpexArr.reduce(
    (sum, item) => sum + (Number(item.amount) || 0),
    0
  );
  const annualFixedOPEX = monthlyFixedOPEX * 12;

  const growthRateNum = Number(financeData.growthRate) || 0;
  const growthMultiplier = 1 + growthRateNum / 100;

  for (let year = 1; year <= 5; year++) {
    // Compound growth
    const yearMultiplier = Math.pow(growthMultiplier, year - 1);
    
    // Sales Revenue (compounding)
    const salesRevenue = baseMonthlyRevenue * 12 * yearMultiplier;
    
    // Raw Material Cost (COGS, compounding)
    const rawMaterialCost = baseMonthlyCOGS * 12 * yearMultiplier;
    
    // Gross Profit
    const grossProfit = salesRevenue - rawMaterialCost;
    
    // Variable OPEX (10% of sales revenue as example)
    const variableOPEX = salesRevenue * 0.05;
    
    // Total OPEX
    const totalOPEX = annualFixedOPEX + variableOPEX;
    
    // EBITDA
    const ebitda = grossProfit - totalOPEX;
    
    // Depreciation
    const depreciation = depreciationSchedule.totalAnnualDepreciation;
    
    // Interest Expense
    const interestExpense = calculateYearlyInterest(
      financeData.loanAmount,
      loanAmortization.loanScheme,
      year
    );
    
    // EBT (Earnings Before Tax)
    const ebt = ebitda - depreciation - interestExpense;
    
    // Tax (30% if EBT > 0)
    const tax = ebt > 0 ? ebt * 0.3 : 0;
    
    // Net Profit
    const netProfit = ebt - tax;

    years.push({
      year,
      salesRevenue,
      rawMaterialCost,
      grossProfit,
      fixedOPEX: annualFixedOPEX,
      variableOPEX,
      totalOPEX,
      ebitda,
      depreciation,
      interestExpense,
      ebt,
      tax,
      netProfit,
    });
  }

  // Calculate summary
  const totalNetProfit = years.reduce((sum, year) => sum + year.netProfit, 0);
  const averageNetProfit = totalNetProfit / 5;
  const totalSalesRevenue = years.reduce((sum, year) => sum + year.salesRevenue, 0);

  return {
    years,
    summary: {
      totalNetProfit,
      averageNetProfit,
      totalSalesRevenue,
    },
  };
}

/**
 * Calculate DSCR (Debt Service Coverage Ratio)
 * DSCR = (Net Operating Income) / (Total Debt Service)
 */
export function calculateDSCR(
  netProfit: number,
  depreciation: number,
  interestExpense: number,
  principalPayment: number
): number {
  const netOperatingIncome = netProfit + depreciation + interestExpense;
  const totalDebtService = interestExpense + principalPayment;
  
  if (totalDebtService === 0) return 0;
  
  return netOperatingIncome / totalDebtService;
}

/**
 * Calculate ROI (Return on Investment)
 * ROI = (Total Net Profit / Total Investment) * 100
 */
export function calculateROI(
  totalNetProfit: number,
  totalInvestment: number
): number {
  if (totalInvestment === 0) return 0;
  return (totalNetProfit / totalInvestment) * 100;
}

/**
 * Calculate Payback Period (in years)
 */
export function calculatePaybackPeriod(
  totalInvestment: number,
  years: { netProfit: number }[]
): number {
  let cumulativeProfit = 0;
  
  for (let i = 0; i < years.length; i++) {
    cumulativeProfit += years[i].netProfit;
    if (cumulativeProfit >= totalInvestment) {
      return i + 1;
    }
  }
  
  return years.length; // If not paid back within projection period
}
