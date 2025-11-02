import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BusinessTypeDetection } from "@/components/BusinessTypeDetection";
import { SmartBusinessInfoForm } from "@/components/SmartBusinessInfoForm";
import { FinanceDataForm } from "@/components/FinanceDataForm";
import { DepreciationScheduleView } from "@/components/DepreciationScheduleView";
import { LoanAmortizationView } from "@/components/LoanAmortizationView";
import { ProfitLossStatementView } from "@/components/ProfitLossStatementView";
import { ReportIntroductionForm } from "@/components/ReportIntroductionForm";
import { ReportGeneration } from "@/components/ReportGeneration";
import { 
  BusinessInfo, 
  FinanceData,
  DepreciationSchedule,
  LoanAmortizationSchedule,
  ProfitAndLossStatement,
  ReportIntroduction,
  CompleteProjectData
} from "@/types/AutomationTypes";
import { BusinessTemplate } from "@/data/business-templates";
import { generateDepreciationSchedule } from "@/utils/depreciationCalculations";
import { generateLoanAmortization, getLoanSchemeDetails } from "@/utils/loanCalculations";
import { generateProfitAndLossStatement } from "@/utils/plCalculations";
import { useLoanProjects } from "@/hooks/useLoanProjects";
import { useToast } from "@/hooks/use-toast";

type ProjectStep = 'detection' | 'business' | 'finance' | 'depreciation' | 'loan' | 'pl' | 'introduction' | 'report';

// Helpers: map DB rows (snake_case) to app types (camelCase)
const mapDbToBusinessInfo = (db: any): BusinessInfo => ({
  shopName: db?.shop_name ?? '',
  buildingLandmark: db?.building_landmark ?? undefined,
  buildingNo: db?.building_no ?? undefined,
  gstNo: db?.gst_no ?? undefined,
  monthlyRent: typeof db?.monthly_rent === 'number' ? db.monthly_rent : Number(db?.monthly_rent ?? 0),
  village: db?.village ?? undefined,
  municipality: db?.municipality ?? undefined,
  postOffice: db?.post_office ?? undefined,
  taluk: db?.taluk ?? undefined,
  block: db?.block ?? undefined,
  district: db?.district ?? '',
  pinCode: db?.pin_code ?? '',
  gender: db?.gender ?? undefined,
  proprietorName: db?.proprietor_name ?? '',
  fatherName: db?.father_name ?? undefined,
  houseName: db?.house_name ?? undefined,
  contactNumber: db?.contact_number ?? '',
  dateOfBirth: db?.date_of_birth ?? undefined,
  panNo: db?.pan_no ?? undefined,
  aadhaarNo: db?.aadhaar_no ?? undefined,
  lineOfActivity: db?.line_of_activity ?? undefined,
  unitStatus: db?.unit_status ?? undefined,
  qualification: db?.qualification ?? undefined,
  experience: typeof db?.experience === 'number' ? db.experience : Number(db?.experience ?? 0),
  proposedBusiness: db?.proposed_business ?? '',
  loanScheme: db?.loan_scheme ?? undefined,
  loanYears: typeof db?.loan_years === 'number' ? db.loan_years : Number(db?.loan_years ?? 0),
  bankName: db?.bank_name ?? undefined,
  bankBranch: db?.bank_branch ?? undefined,
});

const mapDbToFinanceData = (db: any): FinanceData => ({
  loanAmount: typeof db?.loan_amount === 'number' ? db.loan_amount : Number(db?.loan_amount ?? 0),
  equity: typeof db?.equity === 'number' ? db.equity : Number(db?.equity ?? 0),
  growthRate: typeof db?.growth_rate === 'number' ? db.growth_rate : Number(db?.growth_rate ?? 0),
  fixedAssets: Array.isArray(db?.fixed_assets) ? db.fixed_assets : [],
  salesMix: Array.isArray(db?.sales_mix) ? db.sales_mix : [],
  materials: Array.isArray(db?.materials) ? db.materials : [],
  fixedOPEX: Array.isArray(db?.fixed_opex) ? db.fixed_opex : [],
});

const NewProject = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getProjectDetails } = useLoanProjects();
  const [currentStep, setCurrentStep] = useState<ProjectStep>('detection');
  const [isViewingExisting, setIsViewingExisting] = useState(false);
  
  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep]);
  const [selectedTemplate, setSelectedTemplate] = useState<BusinessTemplate | null>(null);
  const [customBusiness, setCustomBusiness] = useState<string>("");
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo | undefined>();
  const [financeData, setFinanceData] = useState<FinanceData | undefined>();
  const [depreciationSchedule, setDepreciationSchedule] = useState<DepreciationSchedule | undefined>();
  const [loanAmortization, setLoanAmortization] = useState<LoanAmortizationSchedule | undefined>();
  const [profitAndLoss, setProfitAndLoss] = useState<ProfitAndLossStatement | undefined>();
  const [reportIntroduction, setReportIntroduction] = useState<ReportIntroduction | undefined>();

  const [viewingProjectId, setViewingProjectId] = useState<string | undefined>();
  const { toast } = useToast();

  // Load existing project data if viewing
  useEffect(() => {
    const loadProjectData = async () => {
      // First check URL parameter
      if (id) {
        try {
          const data = await getProjectDetails(id);
          if (data) {
            const bi = mapDbToBusinessInfo(data.business_info || {});
            const fd = data.finance_data ? mapDbToFinanceData(data.finance_data) : undefined;
            setBusinessInfo(bi);
            if (fd) setFinanceData(fd);
            const hasDep = !!data.depreciation_schedule;
            const hasLoan = !!data.loan_amortization;
            const hasPL = !!data.profit_loss;
            if (hasDep) {
              setDepreciationSchedule(data.depreciation_schedule as unknown as DepreciationSchedule);
            }
            if (hasLoan) {
              setLoanAmortization(data.loan_amortization as unknown as LoanAmortizationSchedule);
            }
            if (hasPL) {
              setProfitAndLoss(data.profit_loss as unknown as ProfitAndLossStatement);
            }
            // Default report introduction
            setReportIntroduction({
              businessName: bi.shopName || '',
              narrative: '',
              objectives: []
            });
            setIsViewingExisting(true);
            setViewingProjectId(id);
            const hasAll = !!(bi && fd && hasDep && hasLoan && hasPL);
            if (hasAll) {
              setCurrentStep('report');
            } else {
              setCurrentStep('detection');
              toast({
                title: 'No saved data found',
                description: 'This project has no saved details yet. Start by selecting a template.',
              });
            }
          }
        } catch (error) {
          console.error('Error loading project from URL:', error);
        }
        return;
      }

      // Otherwise check localStorage
      const viewingId = localStorage.getItem('viewingProjectId');
      const viewingData = localStorage.getItem('viewingProjectData');
      
      if (viewingId && viewingData) {
        try {
          const data: CompleteProjectData = JSON.parse(viewingData);
          setBusinessInfo(data.businessInfo);
          setFinanceData(data.financeData);
          setDepreciationSchedule(data.depreciationSchedule);
          setLoanAmortization(data.loanAmortization);
          setProfitAndLoss(data.profitAndLoss);
          setReportIntroduction(data.reportIntroduction);
          setCurrentStep('report');
          setIsViewingExisting(true);
          setViewingProjectId(viewingId);
        } catch (error) {
          console.error('Error loading project from localStorage:', error);
        }
      }
    };

    loadProjectData();
  }, [id]);

  // Cleanup when component unmounts
  useEffect(() => {
    return () => {
      localStorage.removeItem('viewingProjectId');
      localStorage.removeItem('viewingProjectData');
    };
  }, []);

  // Auto-generate schedules when finance data changes
  useEffect(() => {
    if (!financeData || isViewingExisting) return;
    const assets = Array.isArray(financeData.fixedAssets) ? financeData.fixedAssets : [];
    const depSchedule = generateDepreciationSchedule(assets);
    setDepreciationSchedule(depSchedule);
    const loanScheme = getLoanSchemeDetails('MUDRA');
    const loanAmt = Number(financeData.loanAmount || 0);
    const loanSched = generateLoanAmortization(loanAmt, loanScheme);
    setLoanAmortization(loanSched);
  }, [financeData, isViewingExisting]);

  // Auto-generate P&L when all required data is available
  useEffect(() => {
    if (!financeData || !loanAmortization || !depreciationSchedule) return;
    if (isViewingExisting && profitAndLoss) return;
    const pl = generateProfitAndLossStatement(financeData, loanAmortization, depreciationSchedule);
    setProfitAndLoss(pl);
  }, [financeData, loanAmortization, depreciationSchedule, isViewingExisting, profitAndLoss]);

  const handleBusinessTypeSelected = (template: BusinessTemplate | null, customBusinessName?: string) => {
    setSelectedTemplate(template);
    setCustomBusiness(customBusinessName || "");
    setCurrentStep('business');
  };

  const handleBusinessInfoNext = () => setCurrentStep('finance');
  const handleFinanceNext = () => setCurrentStep('depreciation');
  const handleDepreciationNext = () => setCurrentStep('loan');
  const handleLoanNext = () => setCurrentStep('pl');
  const handlePLNext = () => setCurrentStep('introduction');
  const handleIntroductionNext = () => setCurrentStep('report');

  const handleBackToDashboard = () => {
    navigate('/');
  };

  const handleBackFromBusiness = () => setCurrentStep('detection');
  const handleBackFromFinance = () => setCurrentStep('business');
  const handleBackFromDepreciation = () => setCurrentStep('finance');
  const handleBackFromLoan = () => setCurrentStep('depreciation');
  const handleBackFromPL = () => setCurrentStep('loan');
  const handleBackFromIntroduction = () => setCurrentStep('pl');
  const handleBackFromReport = () => {
    if (isViewingExisting) {
      localStorage.removeItem('viewingProjectId');
      localStorage.removeItem('viewingProjectData');
      navigate('/');
    } else {
      setCurrentStep('introduction');
    }
  };

  const getCompleteProjectData = (): CompleteProjectData | null => {
    if (!businessInfo || !financeData || !depreciationSchedule || !loanAmortization || !profitAndLoss || !reportIntroduction) {
      return null;
    }
    return {
      businessInfo,
      financeData,
      depreciationSchedule,
      loanAmortization,
      profitAndLoss,
      reportIntroduction
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/10">
      <div className="container mx-auto px-4 py-8">
        {currentStep === 'detection' && (
          <BusinessTypeDetection
            onBusinessTypeSelected={handleBusinessTypeSelected}
            onBack={handleBackToDashboard}
          />
        )}
        
        {currentStep === 'business' && (
          <SmartBusinessInfoForm
            selectedTemplate={selectedTemplate}
            customBusiness={customBusiness}
            data={businessInfo}
            onUpdate={setBusinessInfo}
            onNext={handleBusinessInfoNext}
            onBack={handleBackFromBusiness}
          />
        )}
        
        {currentStep === 'finance' && (
          <FinanceDataForm
            data={financeData}
            onUpdate={setFinanceData}
            onNext={handleFinanceNext}
            onBack={handleBackFromFinance}
          />
        )}
        
        {currentStep === 'depreciation' && depreciationSchedule && (
          <DepreciationScheduleView
            schedule={depreciationSchedule}
            onNext={handleDepreciationNext}
            onBack={handleBackFromDepreciation}
          />
        )}
        
        {currentStep === 'loan' && financeData && (
          <LoanAmortizationView
            loanAmount={financeData.loanAmount}
            initialSchedule={loanAmortization}
            onUpdate={setLoanAmortization}
            onNext={handleLoanNext}
            onBack={handleBackFromLoan}
          />
        )}
        
        {currentStep === 'pl' && profitAndLoss && (
          <ProfitLossStatementView
            statement={profitAndLoss}
            onNext={handlePLNext}
            onBack={handleBackFromPL}
          />
        )}
        
        {currentStep === 'introduction' && businessInfo && (
          <ReportIntroductionForm
            businessName={businessInfo.shopName}
            data={reportIntroduction}
            onUpdate={setReportIntroduction}
            onNext={handleIntroductionNext}
            onBack={handleBackFromIntroduction}
          />
        )}
        
        {currentStep === 'report' && getCompleteProjectData() && (
          <ReportGeneration
            projectData={getCompleteProjectData()!}
            onBack={handleBackFromReport}
            isViewingExisting={isViewingExisting}
            projectId={viewingProjectId}
          />
        )}
      </div>
    </div>
  );
};

export default NewProject;