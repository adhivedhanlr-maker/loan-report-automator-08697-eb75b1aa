import { LoanScheme, LoanSchemeDetails, LoanAmortizationSchedule } from "@/types/AutomationTypes";

/**
 * Get loan scheme details based on scheme type
 */
export function getLoanSchemeDetails(
  scheme: LoanScheme,
  customDetails?: { name: string; interestRate: number; tenureYears: number }
): LoanSchemeDetails {
  switch (scheme) {
    case 'MUDRA':
      return {
        scheme: 'MUDRA',
        interestRate: 10,
        tenureYears: 7,
      };
    case 'SME_TERM':
      return {
        scheme: 'SME_TERM',
        interestRate: 12,
        tenureYears: 5,
      };
    case 'CUSTOM':
      return {
        scheme: 'CUSTOM',
        interestRate: customDetails?.interestRate || 10,
        tenureYears: customDetails?.tenureYears || 5,
        customDetails,
      };
    default:
      return {
        scheme: 'MUDRA',
        interestRate: 10,
        tenureYears: 7,
      };
  }
}

/**
 * Calculate monthly EMI
 * Formula: EMI = [P x R x (1+R)^N]/[(1+R)^N-1]
 * where P = loan amount, R = monthly interest rate, N = number of months
 */
export function calculateEMI(
  principal: number,
  annualInterestRate: number,
  tenureYears: number
): number {
  const monthlyRate = annualInterestRate / 100 / 12;
  const numMonths = tenureYears * 12;

  if (monthlyRate === 0) return principal / numMonths;

  const emi =
    (principal *
      monthlyRate *
      Math.pow(1 + monthlyRate, numMonths)) /
    (Math.pow(1 + monthlyRate, numMonths) - 1);

  return emi;
}

/**
 * Generate loan amortization schedule with Year 1 monthly breakdown
 */
export function generateLoanAmortization(
  loanAmount: number,
  loanScheme: LoanSchemeDetails
): LoanAmortizationSchedule {
  const monthlyEMI = calculateEMI(
    loanAmount,
    loanScheme.interestRate,
    loanScheme.tenureYears
  );

  const year1Breakdown = [];
  let balance = loanAmount;
  const monthlyRate = loanScheme.interestRate / 100 / 12;

  // Generate 12 months breakdown for Year 1
  for (let month = 1; month <= 12; month++) {
    const interest = balance * monthlyRate;
    const principal = monthlyEMI - interest;
    balance = balance - principal;

    year1Breakdown.push({
      month,
      emi: monthlyEMI,
      interest,
      principal,
      balance: Math.max(0, balance),
    });
  }

  return {
    loanScheme,
    monthlyEMI,
    year1Breakdown,
  };
}

/**
 * Calculate interest expense for a specific year
 */
export function calculateYearlyInterest(
  loanAmount: number,
  loanScheme: LoanSchemeDetails,
  year: number
): number {
  const monthlyEMI = calculateEMI(
    loanAmount,
    loanScheme.interestRate,
    loanScheme.tenureYears
  );

  let balance = loanAmount;
  const monthlyRate = loanScheme.interestRate / 100 / 12;
  let yearlyInterest = 0;

  const startMonth = (year - 1) * 12 + 1;
  const endMonth = year * 12;

  // Calculate interest for each month in the year
  for (let month = 1; month <= endMonth; month++) {
    const interest = balance * monthlyRate;
    const principal = monthlyEMI - interest;
    balance = Math.max(0, balance - principal);

    if (month >= startMonth && month <= endMonth) {
      yearlyInterest += interest;
    }

    if (balance <= 0) break;
  }

  return yearlyInterest;
}
