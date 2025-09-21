import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, FileText, Download, Calculator, TrendingUp, CheckCircle, AlertTriangle } from "lucide-react";
import { ProjectData } from "@/pages/NewProject";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface ReportGenerationProps {
  projectData: ProjectData;
  onBack: () => void;
}

export const ReportGeneration = ({ projectData, onBack }: ReportGenerationProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);

  // Calculate key financial metrics
  const totalMonthlyExpenses = Object.values(projectData.financialProjections.monthlyExpenses).reduce((sum, expense) => sum + expense, 0);
  const totalQuarterlySales = Object.values(projectData.financialProjections.salesProjections).reduce((sum, item) => sum + item.amount, 0);
  const monthlySales = totalQuarterlySales / 3;
  const monthlyProfit = monthlySales - totalMonthlyExpenses;
  const annualProfit = monthlyProfit * 12;
  
  // Loan calculations
  const loanAmount = projectData.projectCost.totalProjectCost * 0.75; // 75% financing
  const ownContribution = projectData.projectCost.totalProjectCost * 0.25; // 25% own fund
  
  // Financial ratios
  const profitMargin = (monthlyProfit / monthlySales) * 100;
  const breakEvenSales = totalMonthlyExpenses;
  const currentRatio = 2.5; // Example ratio
  const debtEquityRatio = 0.8; // Example ratio

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    
    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false);
      toast({
        title: "Report Generated Successfully!",
        description: "Your comprehensive loan application report is ready.",
      });
    }, 2000);
  };

  const handleSaveAndContinue = () => {
    navigate('/');
    toast({
      title: "Project Saved",
      description: "Your loan application project has been saved successfully.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Project Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Project Report Summary
          </CardTitle>
          <CardDescription>
            Comprehensive loan application report for {projectData.businessInfo.shopName}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-2">Business Information</h4>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p><span className="font-medium">Proprietor:</span> {projectData.businessInfo.proprietorName}</p>
              <p><span className="font-medium">Business:</span> {projectData.businessInfo.proposedBusiness}</p>
              <p><span className="font-medium">Location:</span> {projectData.businessInfo.village}, {projectData.businessInfo.district}</p>
              <p><span className="font-medium">Experience:</span> {projectData.businessInfo.experience} years</p>
              <p><span className="font-medium">Loan Scheme:</span> {projectData.businessInfo.loanScheme}</p>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Financial Highlights</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Total Project Cost:</span>
                <span className="font-medium">₹{projectData.projectCost.totalProjectCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Loan Amount Required:</span>
                <span className="font-medium">₹{Math.round(loanAmount).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Own Contribution:</span>
                <span className="font-medium">₹{Math.round(ownContribution).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Monthly Profit:</span>
                <span className={`font-medium ${monthlyProfit > 0 ? 'text-success' : 'text-error'}`}>
                  ₹{Math.round(monthlyProfit).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Financial Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-success" />
              <div className="text-sm text-muted-foreground">Profit Margin</div>
              <div className="text-xl font-bold text-success">{profitMargin.toFixed(1)}%</div>
            </div>
            
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <Calculator className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-sm text-muted-foreground">Current Ratio</div>
              <div className="text-xl font-bold text-primary">{currentRatio.toFixed(2)}:1</div>
            </div>
            
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <FileText className="h-8 w-8 mx-auto mb-2 text-warning" />
              <div className="text-sm text-muted-foreground">Debt-Equity Ratio</div>
              <div className="text-xl font-bold text-warning">{debtEquityRatio.toFixed(2)}:1</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Project Cost Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Project Cost Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Amount (₹)</TableHead>
                <TableHead className="text-right">Percentage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Fixed Assets & Machinery</TableCell>
                <TableCell className="text-right">₹{projectData.projectCost.totalFixedInvestment.toLocaleString()}</TableCell>
                <TableCell className="text-right">
                  {((projectData.projectCost.totalFixedInvestment / projectData.projectCost.totalProjectCost) * 100).toFixed(1)}%
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Working Capital</TableCell>
                <TableCell className="text-right">₹{Math.round(projectData.projectCost.totalWorkingCapital).toLocaleString()}</TableCell>
                <TableCell className="text-right">
                  {((projectData.projectCost.totalWorkingCapital / projectData.projectCost.totalProjectCost) * 100).toFixed(1)}%
                </TableCell>
              </TableRow>
              <TableRow className="border-t-2">
                <TableCell className="font-bold">Total Project Cost</TableCell>
                <TableCell className="text-right font-bold">₹{projectData.projectCost.totalProjectCost.toLocaleString()}</TableCell>
                <TableCell className="text-right font-bold">100%</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Financing Structure */}
      <Card>
        <CardHeader>
          <CardTitle>Source of Finance</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Source</TableHead>
                <TableHead className="text-right">Amount (₹)</TableHead>
                <TableHead className="text-right">Percentage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Own Funds</TableCell>
                <TableCell className="text-right">₹{Math.round(ownContribution).toLocaleString()}</TableCell>
                <TableCell className="text-right">25%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Bank Loan ({projectData.businessInfo.bankName})</TableCell>
                <TableCell className="text-right">₹{Math.round(loanAmount).toLocaleString()}</TableCell>
                <TableCell className="text-right">75%</TableCell>
              </TableRow>
              <TableRow className="border-t-2">
                <TableCell className="font-bold">Total Financing</TableCell>
                <TableCell className="text-right font-bold">₹{projectData.projectCost.totalProjectCost.toLocaleString()}</TableCell>
                <TableCell className="text-right font-bold">100%</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Project Viability */}
      <Card className="bg-gradient-to-r from-success/5 to-primary/5 border-success/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {monthlyProfit > 0 ? (
              <CheckCircle className="h-5 w-5 text-success" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-warning" />
            )}
            Project Viability Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Strengths</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-success text-success">
                    ✓ Positive Cash Flow
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-success text-success">
                    ✓ {projectData.businessInfo.experience}+ Years Experience
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-success text-success">
                    ✓ Growing Market Demand
                  </Badge>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Key Metrics</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Break-even Sales:</span>
                  <span className="font-medium">₹{Math.round(breakEvenSales).toLocaleString()}/month</span>
                </div>
                <div className="flex justify-between">
                  <span>Projected Sales:</span>
                  <span className="font-medium">₹{Math.round(monthlySales).toLocaleString()}/month</span>
                </div>
                <div className="flex justify-between">
                  <span>Safety Margin:</span>
                  <span className="font-medium text-success">{(((monthlySales - breakEvenSales) / monthlySales) * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Projections
        </Button>
        
        <div className="space-x-3">
          <Button
            variant="outline"
            onClick={handleGenerateReport}
            disabled={isGenerating}
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            {isGenerating ? (
              <>
                <Calculator className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Generate PDF
              </>
            )}
          </Button>
          
          <Button
            onClick={handleSaveAndContinue}
            className="bg-gradient-to-r from-success to-success-light hover:from-success-light hover:to-success"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Save & Complete
          </Button>
        </div>
      </div>
    </div>
  );
};