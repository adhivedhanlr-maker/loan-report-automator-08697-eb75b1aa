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

type ProjectStep = 'detection' | 'business' | 'finance' | 'depreciation' | 'loan' | 'pl' | 'introduction' | 'report';

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

  // Load existing project data if viewing
  useEffect(() => {
    const loadProjectData = async () => {
      // First check URL parameter
      if (id) {
        try {
          const data = await getProjectDetails(id);
          if (data) {
            setBusinessInfo(data.business_info as unknown as BusinessInfo);
            setFinanceData(data.finance_data as unknown as FinanceData);
            setDepreciationSchedule(data.depreciation_schedule as unknown as DepreciationSchedule);
            setLoanAmortization(data.loan_amortization as unknown as LoanAmortizationSchedule);
            setProfitAndLoss(data.profit_loss as unknown as ProfitAndLossStatement);
            // Set default report introduction if not available
            setReportIntroduction({
              businessName: data.business_info?.shop_name || '',
              narrative: '',
              objectives: []
            });
            setCurrentStep('report');
            setIsViewingExisting(true);
            setViewingProjectId(id);
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
  }, [id, getProjectDetails]);

  // Cleanup when component unmounts
  useEffect(() => {
    return () => {
      localStorage.removeItem('viewingProjectId');
      localStorage.removeItem('viewingProjectData');
    };
  }, []);

  // Auto-generate schedules when finance data changes
  useEffect(() => {
    if (financeData) {
      const depSchedule = generateDepreciationSchedule(financeData.fixedAssets);
      setDepreciationSchedule(depSchedule);
      
      const loanScheme = getLoanSchemeDetails('MUDRA');
      const loanSched = generateLoanAmortization(financeData.loanAmount, loanScheme);
      setLoanAmortization(loanSched);
    }
  }, [financeData]);

  // Auto-generate P&L when all required data is available
  useEffect(() => {
    if (financeData && loanAmortization && depreciationSchedule) {
      const pl = generateProfitAndLossStatement(financeData, loanAmortization, depreciationSchedule);
      setProfitAndLoss(pl);
    }
  }, [financeData, loanAmortization, depreciationSchedule]);

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