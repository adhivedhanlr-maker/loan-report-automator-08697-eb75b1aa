import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BusinessInfoForm } from "@/components/forms/BusinessInfoForm";
import { ProjectCostForm } from "@/components/forms/ProjectCostForm";
import { FinancialProjectionsForm } from "@/components/forms/FinancialProjectionsForm";
import { ReportGeneration } from "@/components/ReportGeneration";
import { BusinessInfo, ProjectCost, FinancialProjections } from "@/types/LegacyTypes";

const NewProject = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<'business' | 'cost' | 'projections' | 'report'>('business');
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo | undefined>();
  const [projectCost, setProjectCost] = useState<ProjectCost | undefined>();
  const [financialProjections, setFinancialProjections] = useState<FinancialProjections | undefined>();

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
        {currentStep === 'business' && (
          <BusinessInfoForm
            data={businessInfo}
            onUpdate={setBusinessInfo}
            onNext={handleBusinessInfoNext}
          />
        )}
        
        {currentStep === 'cost' && (
          <ProjectCostForm
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