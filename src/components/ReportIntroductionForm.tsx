import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight, FileText } from "lucide-react";
import { ReportIntroduction } from "@/types/AutomationTypes";

interface ReportIntroductionFormProps {
  businessName: string;
  data?: ReportIntroduction;
  onUpdate: (data: ReportIntroduction) => void;
  onNext: () => void;
  onBack: () => void;
}

export const ReportIntroductionForm = ({
  businessName,
  data,
  onUpdate,
  onNext,
  onBack,
}: ReportIntroductionFormProps) => {
  const defaultNarrative = `This comprehensive loan application report presents a detailed financial analysis for ${businessName}. The business seeks financing to support its operational expansion and growth objectives. This report includes complete financial projections, depreciation schedules, loan amortization details, and a comprehensive profit & loss statement spanning five years.

The analysis demonstrates the business's financial viability, highlighting key performance indicators, profitability metrics, and debt servicing capabilities. All projections are based on realistic market assumptions and industry standards, providing a clear picture of the business's potential for success.`;

  const defaultObjectives = [
    "Secure adequate financing for business establishment and growth",
    "Demonstrate strong financial viability and repayment capacity",
    "Establish a sustainable and profitable business operation",
    "Create employment opportunities and contribute to local economy",
    "Achieve breakeven within the first year of operations",
  ];

  const [narrative, setNarrative] = useState(data?.narrative || defaultNarrative);
  const [objectives, setObjectives] = useState(
    data?.objectives?.join('\n') || defaultObjectives.join('\n')
  );

  useEffect(() => {
    onUpdate({
      businessName,
      narrative,
      objectives: objectives.split('\n').filter((obj) => obj.trim()),
    });
  }, [narrative, objectives, businessName]);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Card className="border-primary/20 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-primary" />
            <CardTitle className="text-2xl">Step 6: Report Introduction</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <p className="text-muted-foreground">
            Customize the introduction and objectives for your loan application report. This will
            appear at the beginning of the final report.
          </p>

          {/* Business Name Display */}
          <div>
            <Label className="text-lg">Business Name</Label>
            <div className="mt-2 p-4 bg-muted rounded-lg">
              <p className="text-xl font-semibold text-primary">{businessName}</p>
            </div>
          </div>

          {/* Narrative */}
          <div className="space-y-2">
            <Label htmlFor="narrative" className="text-lg">
              Report Narrative
            </Label>
            <Textarea
              id="narrative"
              value={narrative}
              onChange={(e) => setNarrative(e.target.value)}
              rows={8}
              className="resize-y"
              placeholder="Enter the introduction narrative for your report..."
            />
            <p className="text-sm text-muted-foreground">
              This narrative will introduce your business and the purpose of the loan application.
            </p>
          </div>

          {/* Objectives */}
          <div className="space-y-2">
            <Label htmlFor="objectives" className="text-lg">
              Project Objectives
            </Label>
            <Textarea
              id="objectives"
              value={objectives}
              onChange={(e) => setObjectives(e.target.value)}
              rows={6}
              className="resize-y"
              placeholder="Enter one objective per line..."
            />
            <p className="text-sm text-muted-foreground">
              List your key business objectives (one per line). These will be displayed as bullet
              points in the report.
            </p>
          </div>

          {/* Preview Card */}
          <Card className="bg-muted/30">
            <CardHeader>
              <CardTitle className="text-lg">Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-primary mb-3">{businessName}</h3>
                <p className="text-sm whitespace-pre-wrap">{narrative}</p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Project Objectives:</h4>
                <ul className="list-disc list-inside space-y-1">
                  {objectives
                    .split('\n')
                    .filter((obj) => obj.trim())
                    .map((obj, index) => (
                      <li key={index} className="text-sm">
                        {obj.trim()}
                      </li>
                    ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between pt-6">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to P&L
            </Button>
            <Button onClick={onNext}>
              Next to Final Report
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
