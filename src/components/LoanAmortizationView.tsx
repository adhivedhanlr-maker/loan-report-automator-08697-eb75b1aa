import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, ArrowRight, DollarSign } from "lucide-react";
import { LoanAmortizationSchedule, LoanScheme } from "@/types/AutomationTypes";
import { generateLoanAmortization, getLoanSchemeDetails } from "@/utils/loanCalculations";

interface LoanAmortizationViewProps {
  loanAmount: number;
  initialSchedule?: LoanAmortizationSchedule;
  onUpdate: (schedule: LoanAmortizationSchedule) => void;
  onNext: () => void;
  onBack: () => void;
}

export const LoanAmortizationView = ({
  loanAmount,
  initialSchedule,
  onUpdate,
  onNext,
  onBack,
}: LoanAmortizationViewProps) => {
  const [selectedScheme, setSelectedScheme] = useState<LoanScheme>(
    initialSchedule?.loanScheme.scheme || 'MUDRA'
  );
  const [customRate, setCustomRate] = useState(10);
  const [customTenure, setCustomTenure] = useState(5);

  // Generate schedule based on current selection
  const schemeDetails = getLoanSchemeDetails(
    selectedScheme,
    selectedScheme === 'CUSTOM'
      ? { name: 'Custom Scheme', interestRate: customRate, tenureYears: customTenure }
      : undefined
  );
  const schedule = generateLoanAmortization(loanAmount, schemeDetails);

  // Update parent
  const handleSchemeChange = (scheme: LoanScheme) => {
    setSelectedScheme(scheme);
    const newDetails = getLoanSchemeDetails(
      scheme,
      scheme === 'CUSTOM'
        ? { name: 'Custom Scheme', interestRate: customRate, tenureYears: customTenure }
        : undefined
    );
    const newSchedule = generateLoanAmortization(loanAmount, newDetails);
    onUpdate(newSchedule);
  };

  const handleCustomChange = () => {
    if (selectedScheme === 'CUSTOM') {
      const newDetails = getLoanSchemeDetails('CUSTOM', {
        name: 'Custom Scheme',
        interestRate: customRate,
        tenureYears: customTenure,
      });
      const newSchedule = generateLoanAmortization(loanAmount, newDetails);
      onUpdate(newSchedule);
    }
  };

  const handleNext = () => {
    onUpdate(schedule);
    onNext();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Card className="border-primary/20 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
          <div className="flex items-center gap-3">
            <DollarSign className="w-6 h-6 text-primary" />
            <CardTitle className="text-2xl">Step 4: Loan Amortization Schedule</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Loan Scheme Selection */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label>Select Loan Scheme</Label>
              <Select value={selectedScheme} onValueChange={handleSchemeChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MUDRA">MUDRA (10%, 7 years)</SelectItem>
                  <SelectItem value="SME_TERM">SME Term Loan (12%, 5 years)</SelectItem>
                  <SelectItem value="CUSTOM">Custom Scheme</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {selectedScheme === 'CUSTOM' && (
              <>
                <div>
                  <Label>Interest Rate (%)</Label>
                  <Input
                    type="number"
                    value={customRate}
                    onChange={(e) => {
                      setCustomRate(Number(e.target.value));
                      handleCustomChange();
                    }}
                    onBlur={handleCustomChange}
                  />
                </div>
                <div>
                  <Label>Tenure (Years)</Label>
                  <Input
                    type="number"
                    value={customTenure}
                    onChange={(e) => {
                      setCustomTenure(Number(e.target.value));
                      handleCustomChange();
                    }}
                    onBlur={handleCustomChange}
                  />
                </div>
              </>
            )}
          </div>

          {/* Loan Summary */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground">Loan Amount</div>
                <div className="text-2xl font-bold text-primary">
                  ₹{loanAmount.toLocaleString('en-IN')}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5">
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground">Interest Rate</div>
                <div className="text-2xl font-bold text-blue-600">
                  {schedule.loanScheme.interestRate}%
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5">
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground">Tenure</div>
                <div className="text-2xl font-bold text-green-600">
                  {schedule.loanScheme.tenureYears} Years
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-orange-500/10 to-orange-500/5">
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground">Monthly EMI</div>
                <div className="text-2xl font-bold text-orange-600">
                  ₹{schedule.monthlyEMI.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Year 1 Monthly Breakdown */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Year 1 Monthly Breakdown</h3>
            <div className="border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="p-3 text-left">Month</th>
                      <th className="p-3 text-right">EMI (₹)</th>
                      <th className="p-3 text-right">Interest (₹)</th>
                      <th className="p-3 text-right">Principal (₹)</th>
                      <th className="p-3 text-right">Balance (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schedule.year1Breakdown.map((month) => (
                      <tr key={month.month} className="border-t hover:bg-muted/50 transition-colors">
                        <td className="p-3 font-medium">Month {month.month}</td>
                        <td className="p-3 text-right">
                          ₹{month.emi.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                        </td>
                        <td className="p-3 text-right text-red-600">
                          ₹{month.interest.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                        </td>
                        <td className="p-3 text-right text-green-600">
                          ₹{month.principal.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                        </td>
                        <td className="p-3 text-right font-semibold">
                          ₹{month.balance.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-primary/10 border-t-2">
                    <tr>
                      <td className="p-3 font-bold">Year 1 Total</td>
                      <td className="p-3 text-right font-bold">
                        ₹
                        {(schedule.monthlyEMI * 12).toLocaleString('en-IN', {
                          maximumFractionDigits: 0,
                        })}
                      </td>
                      <td className="p-3 text-right font-bold text-red-600">
                        ₹
                        {schedule.year1Breakdown
                          .reduce((sum, m) => sum + m.interest, 0)
                          .toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      </td>
                      <td className="p-3 text-right font-bold text-green-600">
                        ₹
                        {schedule.year1Breakdown
                          .reduce((sum, m) => sum + m.principal, 0)
                          .toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      </td>
                      <td className="p-3 text-right font-bold">
                        ₹
                        {schedule.year1Breakdown[11].balance.toLocaleString('en-IN', {
                          maximumFractionDigits: 0,
                        })}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between pt-6">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Depreciation
            </Button>
            <Button onClick={handleNext}>
              Next to P&L Projection
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
