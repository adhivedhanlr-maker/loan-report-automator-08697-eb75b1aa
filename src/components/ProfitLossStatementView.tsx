import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, TrendingUp } from "lucide-react";
import { ProfitAndLossStatement } from "@/types/AutomationTypes";

interface ProfitLossStatementViewProps {
  statement: ProfitAndLossStatement;
  onNext: () => void;
  onBack: () => void;
}

export const ProfitLossStatementView = ({
  statement,
  onNext,
  onBack,
}: ProfitLossStatementViewProps) => {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <Card className="border-primary/20 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-primary" />
            <CardTitle className="text-2xl">Step 5: Profit & Loss Projection (5 Years)</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Summary Cards */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5">
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground">Total Net Profit (5 Years)</div>
                <div className="text-2xl font-bold text-green-600">
                  ₹{statement.summary.totalNetProfit.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5">
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground">Average Net Profit</div>
                <div className="text-2xl font-bold text-blue-600">
                  ₹{statement.summary.averageNetProfit.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5">
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground">Total Sales Revenue</div>
                <div className="text-2xl font-bold text-purple-600">
                  ₹{statement.summary.totalSalesRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* P&L Table */}
          <div className="border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="p-3 text-left sticky left-0 bg-muted z-10">Particulars</th>
                    {statement.years.map((year) => (
                      <th key={year.year} className="p-3 text-right whitespace-nowrap">
                        Year {year.year}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Sales Revenue */}
                  <tr className="border-t font-semibold bg-green-50 dark:bg-green-950/20">
                    <td className="p-3 sticky left-0 bg-green-50 dark:bg-green-950/20 z-10">
                      Sales Revenue
                    </td>
                    {statement.years.map((year) => (
                      <td key={year.year} className="p-3 text-right text-green-600">
                        ₹{year.salesRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      </td>
                    ))}
                  </tr>

                  {/* Raw Material Cost */}
                  <tr className="border-t">
                    <td className="p-3 sticky left-0 bg-background z-10">Raw Material Cost (COGS)</td>
                    {statement.years.map((year) => (
                      <td key={year.year} className="p-3 text-right text-red-600">
                        ₹{year.rawMaterialCost.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      </td>
                    ))}
                  </tr>

                  {/* Gross Profit */}
                  <tr className="border-t font-semibold bg-blue-50 dark:bg-blue-950/20">
                    <td className="p-3 sticky left-0 bg-blue-50 dark:bg-blue-950/20 z-10">
                      Gross Profit
                    </td>
                    {statement.years.map((year) => (
                      <td key={year.year} className="p-3 text-right text-blue-600">
                        ₹{year.grossProfit.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      </td>
                    ))}
                  </tr>

                  {/* OPEX */}
                  <tr className="border-t">
                    <td className="p-3 sticky left-0 bg-background z-10 pl-6">Fixed OPEX</td>
                    {statement.years.map((year) => (
                      <td key={year.year} className="p-3 text-right">
                        ₹{year.fixedOPEX.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-t">
                    <td className="p-3 sticky left-0 bg-background z-10 pl-6">Variable OPEX</td>
                    {statement.years.map((year) => (
                      <td key={year.year} className="p-3 text-right">
                        ₹{year.variableOPEX.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-t font-semibold">
                    <td className="p-3 sticky left-0 bg-background z-10">Total OPEX</td>
                    {statement.years.map((year) => (
                      <td key={year.year} className="p-3 text-right text-orange-600">
                        ₹{year.totalOPEX.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      </td>
                    ))}
                  </tr>

                  {/* EBITDA */}
                  <tr className="border-t font-semibold bg-purple-50 dark:bg-purple-950/20">
                    <td className="p-3 sticky left-0 bg-purple-50 dark:bg-purple-950/20 z-10">
                      EBITDA
                    </td>
                    {statement.years.map((year) => (
                      <td key={year.year} className="p-3 text-right text-purple-600">
                        ₹{year.ebitda.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      </td>
                    ))}
                  </tr>

                  {/* Depreciation */}
                  <tr className="border-t">
                    <td className="p-3 sticky left-0 bg-background z-10">Depreciation</td>
                    {statement.years.map((year) => (
                      <td key={year.year} className="p-3 text-right text-red-600">
                        ₹{year.depreciation.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      </td>
                    ))}
                  </tr>

                  {/* Interest Expense */}
                  <tr className="border-t">
                    <td className="p-3 sticky left-0 bg-background z-10">Interest Expense</td>
                    {statement.years.map((year) => (
                      <td key={year.year} className="p-3 text-right text-red-600">
                        ₹{year.interestExpense.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      </td>
                    ))}
                  </tr>

                  {/* EBT */}
                  <tr className="border-t font-semibold">
                    <td className="p-3 sticky left-0 bg-background z-10">EBT (Earnings Before Tax)</td>
                    {statement.years.map((year) => (
                      <td
                        key={year.year}
                        className={`p-3 text-right ${
                          year.ebt >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        ₹{year.ebt.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      </td>
                    ))}
                  </tr>

                  {/* Tax */}
                  <tr className="border-t">
                    <td className="p-3 sticky left-0 bg-background z-10">Tax (30%)</td>
                    {statement.years.map((year) => (
                      <td key={year.year} className="p-3 text-right">
                        ₹{year.tax.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      </td>
                    ))}
                  </tr>

                  {/* Net Profit */}
                  <tr className="border-t-2 font-bold bg-gradient-to-r from-primary/10 to-accent/10">
                    <td className="p-4 sticky left-0 bg-gradient-to-r from-primary/10 to-accent/10 z-10 text-lg">
                      Net Profit
                    </td>
                    {statement.years.map((year) => (
                      <td
                        key={year.year}
                        className={`p-4 text-right text-lg ${
                          year.netProfit >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        ₹{year.netProfit.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Info Card */}
          <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-4">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                📊 Financial Projection Methodology
              </h4>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>• Sales Revenue and COGS compound annually at the specified growth rate</li>
                <li>• Fixed OPEX remains constant; Variable OPEX is 5% of sales revenue</li>
                <li>• Depreciation is calculated using straight-line method</li>
                <li>• Interest expense decreases as principal is repaid</li>
                <li>• Tax is applied at 30% on positive EBT only</li>
              </ul>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between pt-6">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Loan
            </Button>
            <Button onClick={onNext}>
              Next to Report Introduction
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
