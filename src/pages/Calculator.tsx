import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Calculator, TrendingUp, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CalculatorPage = () => {
  const navigate = useNavigate();
  const [loanAmount, setLoanAmount] = useState<number>(0);
  const [interestRate, setInterestRate] = useState<number>(0);
  const [loanTerm, setLoanTerm] = useState<number>(0);
  const [monthlyIncome, setMonthlyIncome] = useState<number>(0);
  const [monthlyExpenses, setMonthlyExpenses] = useState<number>(0);

  // Calculate EMI
  const calculateEMI = () => {
    const principal = loanAmount;
    const rate = interestRate / 100 / 12;
    const tenure = loanTerm * 12;
    
    if (rate === 0) return principal / tenure;
    
    const emi = (principal * rate * Math.pow(1 + rate, tenure)) / (Math.pow(1 + rate, tenure) - 1);
    return emi;
  };

  const emi = calculateEMI();
  const totalAmount = emi * loanTerm * 12;
  const totalInterest = totalAmount - loanAmount;
  const debtToIncomeRatio = monthlyIncome > 0 ? (emi / monthlyIncome) * 100 : 0;
  const disposableIncome = monthlyIncome - monthlyExpenses - emi;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/50 to-accent/20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Financial Calculator
            </h1>
            <p className="text-muted-foreground">
              Calculate loan EMI and financial ratios
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Loan Details
              </CardTitle>
              <CardDescription>
                Enter your loan and financial information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="loanAmount">Loan Amount (₹)</Label>
                <Input
                  id="loanAmount"
                  type="number"
                  value={loanAmount || ''}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  placeholder="Enter loan amount"
                />
              </div>
              
              <div>
                <Label htmlFor="interestRate">Interest Rate (%)</Label>
                <Input
                  id="interestRate"
                  type="number"
                  step="0.1"
                  value={interestRate || ''}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  placeholder="Enter interest rate"
                />
              </div>
              
              <div>
                <Label htmlFor="loanTerm">Loan Term (Years)</Label>
                <Input
                  id="loanTerm"
                  type="number"
                  value={loanTerm || ''}
                  onChange={(e) => setLoanTerm(Number(e.target.value))}
                  placeholder="Enter loan term"
                />
              </div>
              
              <div>
                <Label htmlFor="monthlyIncome">Monthly Income (₹)</Label>
                <Input
                  id="monthlyIncome"
                  type="number"
                  value={monthlyIncome || ''}
                  onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                  placeholder="Enter monthly income"
                />
              </div>
              
              <div>
                <Label htmlFor="monthlyExpenses">Monthly Expenses (₹)</Label>
                <Input
                  id="monthlyExpenses"
                  type="number"
                  value={monthlyExpenses || ''}
                  onChange={(e) => setMonthlyExpenses(Number(e.target.value))}
                  placeholder="Enter monthly expenses"
                />
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  EMI Calculation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span>Monthly EMI:</span>
                    <span className="text-lg font-semibold">₹{Math.round(emi).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span>Total Amount:</span>
                    <span className="text-lg font-semibold">₹{Math.round(totalAmount).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span>Total Interest:</span>
                    <span className="text-lg font-semibold text-warning">₹{Math.round(totalInterest).toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Financial Ratios
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span>Debt-to-Income Ratio:</span>
                    <span className={`text-lg font-semibold ${debtToIncomeRatio > 40 ? 'text-destructive' : 'text-success'}`}>
                      {debtToIncomeRatio.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span>Disposable Income:</span>
                    <span className={`text-lg font-semibold ${disposableIncome < 0 ? 'text-destructive' : 'text-success'}`}>
                      ₹{Math.round(disposableIncome).toLocaleString()}
                    </span>
                  </div>
                  
                  {debtToIncomeRatio > 0 && (
                    <div className="mt-4 p-4 bg-accent/10 rounded-lg">
                      <h4 className="font-semibold mb-2">Assessment:</h4>
                      <p className="text-sm text-muted-foreground">
                        {debtToIncomeRatio <= 25 ? "Excellent - Low debt burden" :
                         debtToIncomeRatio <= 40 ? "Good - Manageable debt burden" :
                         "High - Consider reducing debt or increasing income"}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalculatorPage;