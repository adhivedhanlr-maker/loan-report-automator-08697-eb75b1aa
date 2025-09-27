import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ExcelImportWorkflow } from "@/components/ExcelImportWorkflow";
import { ReportGeneration } from "@/components/ReportGeneration";
import { ProcessedProjectData } from "@/types/AutomationTypes";

const NewProject = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<'import' | 'report'>('import');
  const [projectData, setProjectData] = useState<ProcessedProjectData | null>(null);

  const handleProjectCreated = (data: ProcessedProjectData) => {
    setProjectData(data);
    setCurrentStep('report');
  };

  const handleBackToDashboard = () => {
    navigate('/');
  };

  const handleBackToImport = () => {
    setCurrentStep('import');
    setProjectData(null);
  };

  // Convert ProcessedProjectData to the legacy ProjectData format for ReportGeneration
  const convertToLegacyFormat = (data: ProcessedProjectData) => {
    return {
      businessInfo: data.businessInfo,
      projectCost: {
        machineryItems: data.machineryItems,
        workingCapitalItems: data.workingCapitalItems,
        totalFixedInvestment: data.financialSummary.totalFixedInvestment,
        totalWorkingCapital: data.financialSummary.totalWorkingCapital,
        totalProjectCost: data.financialSummary.totalProjectCost
      },
      financialProjections: {
        monthlyExpenses: {
          rawMaterials: Math.round(data.financialSummary.monthlyExpenses * 0.4),
          salaryWages: Math.round(data.financialSummary.monthlyExpenses * 0.25),
          transportation: 900,
          electricity: 400,
          printingStationary: 100,
          telephone: 100,
          repairs: 500,
          advertisement: 600,
          miscellaneous: 1000,
          interestBankCharges: Math.round(data.financialSummary.monthlyExpenses * 0.1),
          depreciation: Math.round(data.financialSummary.monthlyExpenses * 0.05),
          gstPaid: Math.round(data.financialSummary.monthlyExpenses * 0.1),
          cessPaid: 161,
          auditFee: 500,
          rent: data.businessInfo.monthlyRent || 5500
        },
        salesProjections: {
          printingChargesStickers: { 
            rate: data.salesProjections[0]?.rate || 15, 
            qty: data.salesProjections[0]?.qty || 15000, 
            amount: data.salesProjections[0]?.amount || 225000 
          },
          printingChargesVinyl: { 
            rate: data.salesProjections[1]?.rate || 25, 
            qty: data.salesProjections[1]?.qty || 2500, 
            amount: data.salesProjections[1]?.amount || 62500 
          },
          designingCharges: { 
            rate: data.salesProjections[2]?.rate || 250, 
            qty: data.salesProjections[2]?.qty || 300, 
            amount: data.salesProjections[2]?.amount || 75000 
          },
          momentos: { 
            rate: data.salesProjections[3]?.rate || 500, 
            qty: data.salesProjections[3]?.qty || 50, 
            amount: data.salesProjections[3]?.amount || 25000 
          }
        }
      }
    };
  };

  return (
    <>
      {currentStep === 'import' && (
        <ExcelImportWorkflow
          onProjectCreated={handleProjectCreated}
          onBack={handleBackToDashboard}
        />
      )}
      
      {currentStep === 'report' && projectData && (
        <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/10">
          <div className="container mx-auto px-4 py-8">
            <ReportGeneration
              projectData={convertToLegacyFormat(projectData)}
              onBack={handleBackToImport}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default NewProject;