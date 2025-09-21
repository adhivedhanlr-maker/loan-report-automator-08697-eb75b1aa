import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, DollarSign, TrendingUp, Calculator } from "lucide-react";
import { FinancialProjections } from "@/pages/NewProject";
import { useToast } from "@/hooks/use-toast";

interface FinancialProjectionsFormProps {
  data?: FinancialProjections;
  onUpdate: (data: FinancialProjections) => void;
  onNext: () => void;
  onBack: () => void;
}

export const FinancialProjectionsForm = ({ data, onUpdate, onNext, onBack }: FinancialProjectionsFormProps) => {
  const { toast } = useToast();
  
  const [monthlyExpenses, setMonthlyExpenses] = useState({
    rawMaterials: 46610,
    salaryWages: 32000,
    transportation: 900,
    electricity: 400,
    printingStationary: 100,
    telephone: 100,
    repairs: 500,
    advertisement: 600,
    miscellaneous: 1000,
    interestBankCharges: 5563,
    depreciation: 6508,
    gstPaid: 16140,
    cessPaid: 161,
    auditFee: 500,
    rent: 5500
  });

  const [salesProjections, setSalesProjections] = useState({
    printingChargesStickers: { rate: 15, qty: 15000, amount: 225000 },
    printingChargesVinyl: { rate: 25, qty: 2500, amount: 62500 },
    designingCharges: { rate: 250, qty: 300, amount: 75000 },
    momentos: { rate: 500, qty: 50, amount: 25000 }
  });

  useEffect(() => {
    if (data) {
      setMonthlyExpenses(data.monthlyExpenses);
      setSalesProjections(data.salesProjections);
    }
  }, [data]);

  useEffect(() => {
    // Auto-calculate amounts for sales projections
    const updatedSales = { ...salesProjections };
    Object.keys(updatedSales).forEach(key => {
      const item = updatedSales[key as keyof typeof updatedSales];
      item.amount = item.rate * item.qty;
    });
    
    const projections: FinancialProjections = {
      monthlyExpenses,
      salesProjections: updatedSales
    };
    
    onUpdate(projections);
  }, [monthlyExpenses, salesProjections]);

  const handleExpenseChange = (field: keyof typeof monthlyExpenses, value: number) => {
    setMonthlyExpenses(prev => ({ ...prev, [field]: value }));
  };

  const handleSalesChange = (category: keyof typeof salesProjections, field: 'rate' | 'qty', value: number) => {
    setSalesProjections(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value,
        amount: field === 'rate' ? value * prev[category].qty : prev[category].rate * value
      }
    }));
  };

  const totalMonthlyExpenses = Object.values(monthlyExpenses).reduce((sum, expense) => sum + expense, 0);
  const totalQuarterlySales = Object.values(salesProjections).reduce((sum, item) => sum + item.amount, 0);
  const monthlySales = totalQuarterlySales / 3; // Quarterly to monthly
  const monthlyProfit = monthlySales - totalMonthlyExpenses;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (monthlyProfit <= 0) {
      toast({
        title: "Financial Warning",
        description: "Current projections show negative or zero profit. Please review your figures.",
        variant: "destructive",
      });
    }
    
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Monthly Expenses */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Monthly Operating Expenses
          </CardTitle>
          <CardDescription>
            Enter your estimated monthly operational costs
          </CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="rawMaterials">Raw Materials (₹)</Label>
            <Input
              id="rawMaterials"
              type="number"
              value={monthlyExpenses.rawMaterials}
              onChange={(e) => handleExpenseChange('rawMaterials', parseInt(e.target.value) || 0)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="salaryWages">Salary & Wages (₹)</Label>
            <Input
              id="salaryWages"
              type="number"
              value={monthlyExpenses.salaryWages}
              onChange={(e) => handleExpenseChange('salaryWages', parseInt(e.target.value) || 0)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="transportation">Transportation (₹)</Label>
            <Input
              id="transportation"
              type="number"
              value={monthlyExpenses.transportation}
              onChange={(e) => handleExpenseChange('transportation', parseInt(e.target.value) || 0)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="electricity">Electricity (₹)</Label>
            <Input
              id="electricity"
              type="number"
              value={monthlyExpenses.electricity}
              onChange={(e) => handleExpenseChange('electricity', parseInt(e.target.value) || 0)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="printingStationary">Printing & Stationery (₹)</Label>
            <Input
              id="printingStationary"
              type="number"
              value={monthlyExpenses.printingStationary}
              onChange={(e) => handleExpenseChange('printingStationary', parseInt(e.target.value) || 0)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="telephone">Telephone & Internet (₹)</Label>
            <Input
              id="telephone"
              type="number"
              value={monthlyExpenses.telephone}
              onChange={(e) => handleExpenseChange('telephone', parseInt(e.target.value) || 0)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="repairs">Repairs & Maintenance (₹)</Label>
            <Input
              id="repairs"
              type="number"
              value={monthlyExpenses.repairs}
              onChange={(e) => handleExpenseChange('repairs', parseInt(e.target.value) || 0)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="advertisement">Advertisement (₹)</Label>
            <Input
              id="advertisement"
              type="number"
              value={monthlyExpenses.advertisement}
              onChange={(e) => handleExpenseChange('advertisement', parseInt(e.target.value) || 0)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="miscellaneous">Miscellaneous (₹)</Label>
            <Input
              id="miscellaneous"
              type="number"
              value={monthlyExpenses.miscellaneous}
              onChange={(e) => handleExpenseChange('miscellaneous', parseInt(e.target.value) || 0)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="interestBankCharges">Interest & Bank Charges (₹)</Label>
            <Input
              id="interestBankCharges"
              type="number"
              value={monthlyExpenses.interestBankCharges}
              onChange={(e) => handleExpenseChange('interestBankCharges', parseInt(e.target.value) || 0)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="depreciation">Depreciation (₹)</Label>
            <Input
              id="depreciation"
              type="number"
              value={monthlyExpenses.depreciation}
              onChange={(e) => handleExpenseChange('depreciation', parseInt(e.target.value) || 0)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gstPaid">GST Paid (₹)</Label>
            <Input
              id="gstPaid"
              type="number"
              value={monthlyExpenses.gstPaid}
              onChange={(e) => handleExpenseChange('gstPaid', parseInt(e.target.value) || 0)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cessPaid">Cess Paid (₹)</Label>
            <Input
              id="cessPaid"
              type="number"
              value={monthlyExpenses.cessPaid}
              onChange={(e) => handleExpenseChange('cessPaid', parseInt(e.target.value) || 0)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="auditFee">Audit Fee & Legal Charges (₹)</Label>
            <Input
              id="auditFee"
              type="number"
              value={monthlyExpenses.auditFee}
              onChange={(e) => handleExpenseChange('auditFee', parseInt(e.target.value) || 0)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rent">Rent (₹)</Label>
            <Input
              id="rent"
              type="number"
              value={monthlyExpenses.rent}
              onChange={(e) => handleExpenseChange('rent', parseInt(e.target.value) || 0)}
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Sales Projections */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Quarterly Sales Projections
          </CardTitle>
          <CardDescription>
            Enter your projected sales for various services (3-month period)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
            <div>
              <Label htmlFor="stickersRate">Printing (Stickers) - Rate per unit (₹)</Label>
              <Input
                id="stickersRate"
                type="number"
                value={salesProjections.printingChargesStickers.rate}
                onChange={(e) => handleSalesChange('printingChargesStickers', 'rate', parseInt(e.target.value) || 0)}
                required
              />
            </div>
            <div>
              <Label htmlFor="stickersQty">Quantity (units)</Label>
              <Input
                id="stickersQty"
                type="number"
                value={salesProjections.printingChargesStickers.qty}
                onChange={(e) => handleSalesChange('printingChargesStickers', 'qty', parseInt(e.target.value) || 0)}
                required
              />
            </div>
            <div>
              <Label>Amount (₹)</Label>
              <div className="p-2 bg-background rounded border font-medium">
                ₹{salesProjections.printingChargesStickers.amount.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
            <div>
              <Label htmlFor="vinylRate">Printing (Vinyl) - Rate per unit (₹)</Label>
              <Input
                id="vinylRate"
                type="number"
                value={salesProjections.printingChargesVinyl.rate}
                onChange={(e) => handleSalesChange('printingChargesVinyl', 'rate', parseInt(e.target.value) || 0)}
                required
              />
            </div>
            <div>
              <Label htmlFor="vinylQty">Quantity (units)</Label>
              <Input
                id="vinylQty"
                type="number"
                value={salesProjections.printingChargesVinyl.qty}
                onChange={(e) => handleSalesChange('printingChargesVinyl', 'qty', parseInt(e.target.value) || 0)}
                required
              />
            </div>
            <div>
              <Label>Amount (₹)</Label>
              <div className="p-2 bg-background rounded border font-medium">
                ₹{salesProjections.printingChargesVinyl.amount.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
            <div>
              <Label htmlFor="designRate">Designing - Rate per design (₹)</Label>
              <Input
                id="designRate"
                type="number"
                value={salesProjections.designingCharges.rate}
                onChange={(e) => handleSalesChange('designingCharges', 'rate', parseInt(e.target.value) || 0)}
                required
              />
            </div>
            <div>
              <Label htmlFor="designQty">Quantity (designs)</Label>
              <Input
                id="designQty"
                type="number"
                value={salesProjections.designingCharges.qty}
                onChange={(e) => handleSalesChange('designingCharges', 'qty', parseInt(e.target.value) || 0)}
                required
              />
            </div>
            <div>
              <Label>Amount (₹)</Label>
              <div className="p-2 bg-background rounded border font-medium">
                ₹{salesProjections.designingCharges.amount.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
            <div>
              <Label htmlFor="momentosRate">Momentos with Printing - Rate per piece (₹)</Label>
              <Input
                id="momentosRate"
                type="number"
                value={salesProjections.momentos.rate}
                onChange={(e) => handleSalesChange('momentos', 'rate', parseInt(e.target.value) || 0)}
                required
              />
            </div>
            <div>
              <Label htmlFor="momentosQty">Quantity (pieces)</Label>
              <Input
                id="momentosQty"
                type="number"
                value={salesProjections.momentos.qty}
                onChange={(e) => handleSalesChange('momentos', 'qty', parseInt(e.target.value) || 0)}
                required
              />
            </div>
            <div>
              <Label>Amount (₹)</Label>
              <div className="p-2 bg-background rounded border font-medium">
                ₹{salesProjections.momentos.amount.toLocaleString()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Summary */}
      <Card className={`${monthlyProfit > 0 ? 'bg-gradient-to-r from-success/5 to-primary/5 border-success/20' : 'bg-gradient-to-r from-error/5 to-warning/5 border-error/20'}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Financial Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-background/50 rounded-lg">
              <div className="text-sm text-muted-foreground">Total Monthly Expenses</div>
              <div className="text-xl font-bold text-error">₹{totalMonthlyExpenses.toLocaleString()}</div>
            </div>
            <div className="p-4 bg-background/50 rounded-lg">
              <div className="text-sm text-muted-foreground">Quarterly Sales</div>
              <div className="text-xl font-bold text-primary">₹{totalQuarterlySales.toLocaleString()}</div>
            </div>
            <div className="p-4 bg-background/50 rounded-lg">
              <div className="text-sm text-muted-foreground">Monthly Sales</div>
              <div className="text-xl font-bold text-success">₹{Math.round(monthlySales).toLocaleString()}</div>
            </div>
            <div className={`p-4 bg-background/50 rounded-lg border-2 ${monthlyProfit > 0 ? 'border-success/20' : 'border-error/20'}`}>
              <div className="text-sm text-muted-foreground">Monthly Profit</div>
              <div className={`text-xl font-bold ${monthlyProfit > 0 ? 'text-success' : 'text-error'}`}>
                ₹{Math.round(monthlyProfit).toLocaleString()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" type="button" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        
        <Button 
          type="submit"
          className="bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary"
        >
          Generate Report
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </form>
  );
};