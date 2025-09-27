// Legacy types for backward compatibility with existing components

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

export interface ProjectCost {
  machineryItems: MachineryItem[];
  workingCapitalItems: WorkingCapitalItem[];
  totalFixedInvestment: number;
  totalWorkingCapital: number;
  totalProjectCost: number;
}

export interface FinancialProjections {
  monthlyExpenses: {
    rawMaterials: number;
    salaryWages: number;
    transportation: number;
    electricity: number;
    printingStationary: number;
    telephone: number;
    repairs: number;
    advertisement: number;
    miscellaneous: number;
    interestBankCharges: number;
    depreciation: number;
    gstPaid: number;
    cessPaid: number;
    auditFee: number;
    rent: number;
  };
  salesProjections: {
    printingChargesStickers: { rate: number; qty: number; amount: number };
    printingChargesVinyl: { rate: number; qty: number; amount: number };
    designingCharges: { rate: number; qty: number; amount: number };
    momentos: { rate: number; qty: number; amount: number };
  };
}

export interface ProjectData {
  businessInfo: BusinessInfo;
  projectCost: ProjectCost;
  financialProjections: FinancialProjections;
}