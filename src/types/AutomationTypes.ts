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

// Processed project data types
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