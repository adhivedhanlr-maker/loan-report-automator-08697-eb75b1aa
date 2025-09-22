import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BusinessInfoForm } from "@/components/forms/BusinessInfoForm";
import { ProjectCostForm } from "@/components/forms/ProjectCostForm";
import { FinancialProjectionsForm } from "@/components/forms/FinancialProjectionsForm";
import { ReportGeneration } from "@/components/ReportGeneration";

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

const steps = [
  { id: 1, title: "Business Information", description: "Enter business and proprietor details" },
  { id: 2, title: "Project Cost", description: "Machinery and working capital requirements" },
  { id: 3, title: "Financial Projections", description: "Income and expense projections" },
  { id: 4, title: "Generate Report", description: "Create comprehensive project report" },
];

// localStorage utility functions
const PROJECT_DATA_KEY = 'loanApplicationProjectData';
const CURRENT_STEP_KEY = 'loanApplicationCurrentStep';

const saveToLocalStorage = (data: Partial<ProjectData>, step: number) => {
  try {
    localStorage.setItem(PROJECT_DATA_KEY, JSON.stringify(data));
    localStorage.setItem(CURRENT_STEP_KEY, step.toString());
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

const loadFromLocalStorage = (): { data: Partial<ProjectData>; step: number } => {
  try {
    const data = localStorage.getItem(PROJECT_DATA_KEY);
    const step = localStorage.getItem(CURRENT_STEP_KEY);
    return {
      data: data ? JSON.parse(data) : {},
      step: step ? parseInt(step) : 1
    };
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return { data: {}, step: 1 };
  }
};

const clearLocalStorage = () => {
  try {
    localStorage.removeItem(PROJECT_DATA_KEY);
    localStorage.removeItem(CURRENT_STEP_KEY);
  } catch (error) {
    console.error('Failed to clear localStorage:', error);
  }
};

const NewProject = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [projectData, setProjectData] = useState<Partial<ProjectData>>({});

  // Load data from localStorage on component mount
  useEffect(() => {
    const { data, step } = loadFromLocalStorage();
    if (Object.keys(data).length > 0) {
      setProjectData(data);
      setCurrentStep(step);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < steps.length) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      saveToLocalStorage(projectData, newStep);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      const newStep = currentStep - 1;
      setCurrentStep(newStep);
      saveToLocalStorage(projectData, newStep);
    }
  };

  const updateProjectData = (stepData: any, step: keyof ProjectData) => {
    const updatedData = {
      ...projectData,
      [step]: stepData
    };
    setProjectData(updatedData);
    saveToLocalStorage(updatedData, currentStep);
  };

  const handleClearData = () => {
    clearLocalStorage();
    setProjectData({});
    setCurrentStep(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/10">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <Button
              variant="outline"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            
            {Object.keys(projectData).length > 0 && (
              <Button
                variant="destructive"
                onClick={handleClearData}
                size="sm"
              >
                Clear Saved Data
              </Button>
            )}
          </div>
          
          <h1 className="text-3xl font-bold text-foreground mb-2">
            New Loan Application Project
          </h1>
          <p className="text-muted-foreground">
            Create a comprehensive project report for loan approval
            {Object.keys(projectData).length > 0 && (
              <span className="text-success ml-2">• Data saved locally</span>
            )}
          </p>
        </div>

        {/* Progress Steps */}
        <Card className="mb-8 shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                    currentStep > step.id 
                      ? 'bg-success border-success text-success-foreground' 
                      : currentStep === step.id
                      ? 'bg-primary border-primary text-primary-foreground'
                      : 'bg-background border-border text-muted-foreground'
                  }`}>
                    {currentStep > step.id ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      step.id
                    )}
                  </div>
                  
                  {index < steps.length - 1 && (
                    <div className={`w-24 h-0.5 transition-all duration-300 ${
                      currentStep > step.id ? 'bg-success' : 'bg-border'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-foreground">
                {steps[currentStep - 1].title}
              </h3>
              <p className="text-muted-foreground">
                {steps[currentStep - 1].description}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Form Content */}
        <Card className="shadow-medium">
          <CardContent className="p-6">
            {currentStep === 1 && (
              <BusinessInfoForm
                data={projectData.businessInfo}
                onUpdate={(data) => updateProjectData(data, 'businessInfo')}
                onNext={handleNext}
              />
            )}
            
            {currentStep === 2 && (
              <ProjectCostForm
                data={projectData.projectCost}
                onUpdate={(data) => updateProjectData(data, 'projectCost')}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}
            
            {currentStep === 3 && (
              <FinancialProjectionsForm
                data={projectData.financialProjections}
                onUpdate={(data) => updateProjectData(data, 'financialProjections')}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}
            
            {currentStep === 4 && (
              <ReportGeneration
                projectData={projectData as ProjectData}
                onBack={handleBack}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NewProject;