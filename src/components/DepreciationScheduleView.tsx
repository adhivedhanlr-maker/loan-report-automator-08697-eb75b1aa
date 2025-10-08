import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Calculator } from "lucide-react";
import { DepreciationSchedule } from "@/types/AutomationTypes";

interface DepreciationScheduleViewProps {
  schedule: DepreciationSchedule;
  onNext: () => void;
  onBack: () => void;
}

export const DepreciationScheduleView = ({
  schedule,
  onNext,
  onBack,
}: DepreciationScheduleViewProps) => {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Card className="border-primary/20 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
          <div className="flex items-center gap-3">
            <Calculator className="w-6 h-6 text-primary" />
            <CardTitle className="text-2xl">Step 3: Depreciation Schedule</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <p className="text-muted-foreground">
            Annual depreciation calculated using straight-line method for all fixed assets.
          </p>

          {/* Depreciation Table */}
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="p-4 text-left">Asset Name</th>
                  <th className="p-4 text-right">Cost (₹)</th>
                  <th className="p-4 text-right">Depreciation Rate (%)</th>
                  <th className="p-4 text-right">Annual Depreciation (₹)</th>
                </tr>
              </thead>
              <tbody>
                {schedule.assets.map((asset, index) => (
                  <tr key={index} className="border-t hover:bg-muted/50 transition-colors">
                    <td className="p-4 font-medium">{asset.assetName}</td>
                    <td className="p-4 text-right">
                      ₹{asset.cost.toLocaleString('en-IN')}
                    </td>
                    <td className="p-4 text-right">{asset.depreciationRate}%</td>
                    <td className="p-4 text-right font-semibold text-primary">
                      ₹{asset.annualDepreciation.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-primary/10 border-t-2">
                <tr>
                  <td colSpan={3} className="p-4 text-right font-bold text-lg">
                    Total Annual Depreciation:
                  </td>
                  <td className="p-4 text-right font-bold text-lg text-primary">
                    ₹{schedule.totalAnnualDepreciation.toLocaleString('en-IN')}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Info Card */}
          <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-4">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                💡 About Depreciation
              </h4>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Depreciation represents the annual decrease in value of your fixed assets. This amount
                is deducted from your profits for tax purposes and is included in the financial
                projections. The straight-line method distributes the cost evenly over the asset's
                useful life.
              </p>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between pt-6">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Finance
            </Button>
            <Button onClick={onNext}>
              Next to Loan Amortization
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
