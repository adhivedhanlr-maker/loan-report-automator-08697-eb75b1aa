// Auto-generated automation types for loan application processing

// Settings schema for automation mapping
export interface SettingsSchema {
  id: string;
  label: string;
  type: 'number' | 'boolean' | 'string';
  default: any;
  ui: 'number_input' | 'toggle' | 'text_input' | 'select';
  options?: string[];
}

// Table mapping configuration
export interface TableMapping {
  id: string;
  label: string;
  sheet: string;
  anchor: string;
  header_row: number;
  columns: string[];
  row_rule: string;
  is_variable_length: boolean;
  sample_rows: any[][];
}

// Derived field calculations
export interface DerivedField {
  id: string;
  label: string;
  formula: string;
  description?: string;
}

// Scheme-specific validation rules
export interface SchemeRule {
  id: string;
  condition: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

// Test case definitions
export interface TestCase {
  id: string;
  name: string;
  description: string;
  test_function: string;
  expected_outcome: any;
  severity: 'critical' | 'major' | 'minor';
}

// Main automation mapping structure
export interface AutomationMapping {
  meta: {
    file_analyzed: string;
    generated_at: string;
    sheets_count: number;
    warning: string;
  };
  settings_schema: SettingsSchema[];
  inputs: any[];
  tables: TableMapping[];
  derived_fields: DerivedField[];
  scheme_rules: SchemeRule[];
  test_cases?: TestCase[];
}

// Parsed Excel data types
export interface ParsedExcelData {
  sheets: Record<string, any[][]>;
  businessInfo: BusinessInfo;
  machineryItems: MachineryItem[];
  workingCapitalItems: WorkingCapitalItem[];
  salesProjections: SalesProjection[];
  financialSummary: FinancialSummary;
}

export interface BusinessInfo {
  shopName: string;
  buildingLandmark?: string;
  buildingNo?: string;
  gstNo?: string;
  monthlyRent?: number;
  village?: string;
  municipality?: string;
  postOffice?: string;
  taluk?: string;
  block?: string;
  district: string;
  pinCode: string;
  gender?: string;
  proprietorName: string;
  fatherName?: string;
  motherName?: string;
  spouseName?: string;
  houseName?: string;
  contactNumber: string;
  dateOfBirth?: string;
  panNo?: string;
  aadhaarNo?: string;
  lineOfActivity?: string;
  unitStatus?: string;
  qualification?: string;
  experience?: number;
  proposedBusiness: string;
  loanScheme?: string;
  loanYears?: number;
  bankName?: string;
  bankBranch?: string;
}

export interface MachineryItem {
  id?: string;
  particulars: string;
  rate: number;
  qty: number;
  amount: number;
}

export interface WorkingCapitalItem {
  id?: string;
  particulars: string;
  rate: number;
  qty: number;
  amount: number;
  gstAmount?: number;
}

export interface SalesProjection {
  id?: string;
  particulars: string;
  rate: number;
  qty: number;
  amount: number;
  gstCollected?: number;
}

export interface FinancialSummary {
  totalProjectCost: number;
  loanAmountRequired: number;
  totalFixedInvestment: number;
  totalWorkingCapital: number;
  monthlySales: number;
  monthlyExpenses: number;
  monthlyProfit: number;
  dscr: number;
}

// Project cost structure
export interface ProjectCost {
  machineryItems: MachineryItem[];
  workingCapitalItems: WorkingCapitalItem[];
  totalFixedInvestment: number;
  totalWorkingCapital: number;
  totalProjectCost: number;
}

// Financial projections structure
export interface FinancialProjections {
  monthlyExpenses: {
    rent?: number;
    salaries?: number;
    utilities?: number;
    maintenance?: number;
    other?: number;
    total: number;
  };
  monthlySales: SalesProjection[];
  totalMonthlySales: number;
  monthlyProfit: number;
}

// Loan schemes
export type LoanScheme = 'MUDRA' | 'SME_TERM' | 'CUSTOM';

export interface LoanSchemeDetails {
  scheme: LoanScheme;
  interestRate: number;
  tenureYears: number;
  customDetails?: {
    name: string;
    interestRate: number;
    tenureYears: number;
  };
}

// Fixed Asset for depreciation
export interface FixedAsset {
  id?: string;
  name: string;
  cost: number;
  depreciationRate: number; // percentage
  annualDepreciation: number;
}

// Sales Mix Item
export interface SalesMixItem {
  id?: string;
  product: string;
  units: number;
  rate: number;
  monthlyRevenue: number;
}

// Material/COGS Input
export interface MaterialInput {
  id?: string;
  material: string;
  units: number;
  rate: number;
  monthlyCost: number;
}

// Fixed OPEX structure
export interface FixedOPEXItem {
  label: string;
  amount: number;
}

export type FixedOPEX = FixedOPEXItem[];

// Finance Data (Step 2)
export interface FinanceData {
  loanAmount: number;
  equity: number;
  growthRate: number; // percentage for compounding
  fixedAssets: FixedAsset[];
  salesMix: SalesMixItem[];
  materials: MaterialInput[];
  fixedOPEX: FixedOPEX;
}

// Depreciation Schedule (Step 3)
export interface DepreciationSchedule {
  assets: {
    assetName: string;
    cost: number;
    depreciationRate: number;
    annualDepreciation: number;
  }[];
  totalAnnualDepreciation: number;
}

// Loan Amortization (Step 4)
export interface LoanAmortizationSchedule {
  loanScheme: LoanSchemeDetails;
  monthlyEMI: number;
  year1Breakdown: {
    month: number;
    emi: number;
    interest: number;
    principal: number;
    balance: number;
  }[];
}

// P&L Statement (Step 5)
export interface ProfitAndLossStatement {
  years: {
    year: number;
    salesRevenue: number;
    rawMaterialCost: number;
    grossProfit: number;
    fixedOPEX: number;
    variableOPEX: number;
    totalOPEX: number;
    ebitda: number;
    depreciation: number;
    interestExpense: number;
    ebt: number;
    tax: number;
    netProfit: number;
  }[];
  summary: {
    totalNetProfit: number;
    averageNetProfit: number;
    totalSalesRevenue: number;
  };
}

// Report Introduction (Step 6)
export interface ReportIntroduction {
  businessName: string;
  narrative: string;
  objectives: string[];
}

// Viability Analysis from LLM
export interface ViabilityAnalysis {
  summary: string;
  riskAssessment: 'Low' | 'Medium' | 'High';
  recommendation: string;
  keyMetrics: {
    dscr: number;
    roi: number;
    paybackPeriod: number;
  };
}

// Complete Project Data (all 8 steps)
export interface CompleteProjectData {
  // Step 1: Identity Data
  businessInfo: BusinessInfo;
  
  // Step 2: Finance Data
  financeData: FinanceData;
  
  // Step 3: Depreciation Schedule
  depreciationSchedule: DepreciationSchedule;
  
  // Step 4: Loan Amortization
  loanAmortization: LoanAmortizationSchedule;
  
  // Step 5: P&L Projection
  profitAndLoss: ProfitAndLossStatement;
  
  // Step 6: Report Introduction
  reportIntroduction: ReportIntroduction;
  
  // Step 7: Viability Analysis (optional, generated by LLM)
  viabilityAnalysis?: ViabilityAnalysis;
}

// Processed project data types (legacy support)
export interface TestResult {
  testName: string;
  passed: boolean;
  message: string;
  value?: any;
}

export interface ProcessedProjectData {
  businessInfo: BusinessInfo;
  projectCost: ProjectCost;
  financialProjections: FinancialProjections;
}