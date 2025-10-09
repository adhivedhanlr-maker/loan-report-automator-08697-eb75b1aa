import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type ProjectStep = 'detection' | 'business' | 'finance' | 'depreciation' | 'loan' | 'pl' | 'introduction' | 'report';

interface StepConfig {
  id: ProjectStep;
  number: number;
  label: string;
  description: string;
}

const steps: StepConfig[] = [
  { id: 'detection', number: 1, label: 'Business Type', description: 'Select your business' },
  { id: 'business', number: 2, label: 'Business Info', description: 'Basic details' },
  { id: 'finance', number: 3, label: 'Finance Data', description: 'Financial inputs' },
  { id: 'depreciation', number: 4, label: 'Depreciation', description: 'Asset schedule' },
  { id: 'loan', number: 5, label: 'Loan Details', description: 'Amortization' },
  { id: 'pl', number: 6, label: 'P&L Statement', description: '5-year projection' },
  { id: 'introduction', number: 7, label: 'Introduction', description: 'Report intro' },
  { id: 'report', number: 8, label: 'Generate Report', description: 'Final output' },
];

interface ProjectProgressStepperProps {
  currentStep: ProjectStep;
}

export const ProjectProgressStepper = ({ currentStep }: ProjectProgressStepperProps) => {
  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

  return (
    <div className="w-full bg-card border-b border-border py-4 px-4 sticky top-0 z-10 shadow-sm">
      <div className="container mx-auto">
        {/* Desktop view */}
        <div className="hidden lg:flex items-center justify-between">
          {steps.map((step, index) => {
            const isCompleted = index < currentStepIndex;
            const isCurrent = index === currentStepIndex;
            const isUpcoming = index > currentStepIndex;

            return (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300",
                      isCompleted && "bg-success text-success-foreground",
                      isCurrent && "bg-primary text-primary-foreground ring-4 ring-primary/20",
                      isUpcoming && "bg-muted text-muted-foreground"
                    )}
                  >
                    {isCompleted ? <Check className="h-5 w-5" /> : step.number}
                  </div>
                  <div className="text-center mt-2">
                    <div
                      className={cn(
                        "font-medium text-sm transition-colors",
                        isCurrent && "text-primary",
                        isCompleted && "text-success",
                        isUpcoming && "text-muted-foreground"
                      )}
                    >
                      {step.label}
                    </div>
                    <div className="text-xs text-muted-foreground hidden xl:block">
                      {step.description}
                    </div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "h-0.5 flex-1 mx-2 transition-colors duration-300",
                      index < currentStepIndex ? "bg-success" : "bg-border"
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Mobile view */}
        <div className="lg:hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">
              Step {currentStepIndex + 1} of {steps.length}
            </span>
            <span className="text-xs text-muted-foreground">
              {Math.round(((currentStepIndex + 1) / steps.length) * 100)}% Complete
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
            />
          </div>
          <div className="mt-2 text-center">
            <div className="font-medium text-primary">{steps[currentStepIndex].label}</div>
            <div className="text-xs text-muted-foreground">{steps[currentStepIndex].description}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
