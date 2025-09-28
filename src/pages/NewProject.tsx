import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BusinessTypeDetection } from "@/components/BusinessTypeDetection";
import { SmartBusinessInfoForm } from "@/components/SmartBusinessInfoForm";
import { SmartProjectCostForm } from "@/components/SmartProjectCostForm";
import { FinancialProjectionsForm } from "@/components/forms/FinancialProjectionsForm";
import { ReportGeneration } from "@/components/ReportGeneration";
import { BusinessInfo, ProjectCost, FinancialProjections } from "@/types/AutomationTypes";
import { BusinessTemplate } from "@/data/business-templates";

type ProjectStep = 'detection' | 'business' | 'cost' | 'projections' | 'report';

const NewProject = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<ProjectStep>('detection');
  const [selectedTemplate, setSelectedTemplate] = useState<BusinessTemplate | null>(null);
  const [customBusiness, setCustomBusiness] = useState<string>("");
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo | undefined>();
  const [projectCost, setProjectCost] = useState<ProjectCost | undefined>();
  const [financialProjections, setFinancialProjections] = useState<FinancialProjections | undefined>();

  const handleBusinessTypeSelected = (template: BusinessTemplate | null, customBusinessName?: string) => {
    setSelectedTemplate(template);
    setCustomBusiness(customBusinessName || "");
    setCurrentStep('business');
  };

  const handleBusinessInfoNext = () => {
    setCurrentStep('cost');
  };

  const handleProjectCostNext = () => {
    setCurrentStep('projections');
  };

  const handleFinancialProjectionsNext = () => {
    setCurrentStep('report');
  };

  const handleBackToDashboard = () => {
    navigate('/');
  };

  const handleBackFromBusiness = () => {
    setCurrentStep('detection');
  };

  const handleBackFromCost = () => {
    setCurrentStep('business');
  };

  const handleBackFromProjections = () => {
    setCurrentStep('cost');
  };

  const handleBackFromReport = () => {
    setCurrentStep('projections');
  };

  const getProjectData = () => {
    if (!businessInfo || !projectCost || !financialProjections) {
      return null;
    }
    return {
      businessInfo,
      projectCost,
      financialProjections
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/10">
      <div className="container mx-auto px-4 py-8">
        {currentStep === 'detection' && (
          <BusinessTypeDetection
            onBusinessTypeSelected={handleBusinessTypeSelected}
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
        
        {currentStep === 'cost' && (
          <SmartProjectCostForm
            selectedTemplate={selectedTemplate}
            data={projectCost}
            onUpdate={setProjectCost}
            onNext={handleProjectCostNext}
            onBack={handleBackFromCost}
          />
        )}
        
        {currentStep === 'projections' && (
          <FinancialProjectionsForm
            data={financialProjections}
            onUpdate={setFinancialProjections}
            onNext={handleFinancialProjectionsNext}
            onBack={handleBackFromProjections}
          />
        )}
        
        {currentStep === 'report' && getProjectData() && (
          <ReportGeneration
            projectData={getProjectData()!}
            onBack={handleBackFromReport}
          />
        )}
      </div>
    </div>
  );
};

export default NewProject;