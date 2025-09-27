// Automation mapping types based on the JSON structure
export interface SettingsSchema {
  id: string;
  label: string;
  type: 'number' | 'boolean' | 'string';
  default: any;
  ui: 'number_input' | 'toggle' | 'text_input' | 'select';
  options?: string[];
}

export interface TableMapping {
  id: string;
  label: string;
  sheet: string;
  anchor: string;
  header_row: number;
  columns: any[];
  row_rule: string;
  is_variable_length: boolean;
  sample_rows: any[][];
}

export interface DerivedField {
  id: string;
  description: string;
  excel_formula: string;
  normalized_js: string;
  depends_on: string[];
  is_example: boolean;
}

export interface SchemeRule {
  id: string;
  label: string;
  condition: string;
  action: string;
  priority: number;
}

export interface TestCase {
  id: string;
  description: string;
  input: Record<string, any>;
  expected: Record<string, any>;
  tolerance?: number;
}

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
  scheme_rules: Record<string, any>;
  calculation_graph: any;
  tests: TestCase[];
  raw_analysis_reference: string;
}

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
  buildingLandmark: string;
  buildingNo: string;
  gstNo: string;
  monthlyRent: number;
  village: string;
  municipality: string;
  postOffice: string;
  taluk: string;
  block: string;
  district: string;
  pinCode: string;
  gender: string;
  proprietorName: string;
  fatherName: string;
  houseName: string;
  contactNumber: string;
  dateOfBirth: string;
  panNo: string;
  aadhaarNo: string;
  lineOfActivity: string;
  unitStatus: string;
  qualification: string;
  experience: number;
  proposedBusiness: string;
  loanScheme: string;
  loanYears: number;
  bankName: string;
  bankBranch: string;
}

export interface MachineryItem {
  id: string;
  particulars: string;
  rate: number;
  qty: number;
  amount: number;
}

export interface WorkingCapitalItem {
  id: string;
  particulars: string;
  rate: number;
  qty: number;
  amount: number;
  gstAmount: number;
}

export interface SalesProjection {
  id: string;
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

export interface ProcessedProjectData {
  businessInfo: BusinessInfo;
  machineryItems: MachineryItem[];
  workingCapitalItems: WorkingCapitalItem[];
  salesProjections: SalesProjection[];
  financialSummary: FinancialSummary;
  settings: Record<string, any>;
  testResults: TestResult[];
}

export interface TestResult {
  id: string;
  status: 'PASS' | 'FAIL';
  trace: Record<string, any>;
  inputs: Record<string, any>;
  expectedOutputs: Record<string, any>;
  actualOutputs: Record<string, any>;
}