import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, DollarSign, TrendingUp, Calculator } from "lucide-react";
import { FinancialProjections } from "@/types/AutomationTypes";
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
    rent: data?.monthlyExpenses.rent ?? 5500,
    salaries: data?.monthlyExpenses.salaries ?? 32000,
    utilities: data?.monthlyExpenses.utilities ?? 1400,
    maintenance: data?.monthlyExpenses.maintenance ?? 500,
    other: data?.monthlyExpenses.other ?? 46610,
    total: data?.monthlyExpenses.total ?? 0
  });

  const [salesProjections, setSalesProjections] = useState(
    data?.monthlySales ?? [
      { id: '1', particulars: 'PRINTING CHARGES (STICKERS)', rate: 15, qty: 15000, amount: 225000 },
      { id: '2', particulars: 'PRINTING CHARGES (VINYL)', rate: 25, qty: 2500, amount: 62500 },
      { id: '3', particulars: 'DESIGNING CHARGES', rate: 250, qty: 300, amount: 75000 },
      { id: '4', particulars: 'MOMENTOS', rate: 500, qty: 50, amount: 25000 }
    ]
  );

  useEffect(() => {
    if (data) {
      setMonthlyExpenses({
        rent: data.monthlyExpenses.rent ?? 0,
        salaries: data.monthlyExpenses.salaries ?? 0,
        utilities: data.monthlyExpenses.utilities ?? 0,
        maintenance: data.monthlyExpenses.maintenance ?? 0,
        other: data.monthlyExpenses.other ?? 0,
        total: data.monthlyExpenses.total
      });
      setSalesProjections(data.monthlySales.map((item, index) => ({
        ...item,
        id: item.id || String(index + 1)
      })));
    }
  }, [data]);

  useEffect(() => {
    // Calculate total expenses
    const total = (monthlyExpenses.rent || 0) + 
                  (monthlyExpenses.salaries || 0) + 
                  (monthlyExpenses.utilities || 0) + 
                  (monthlyExpenses.maintenance || 0) + 
                  (monthlyExpenses.other || 0);
    
    setMonthlyExpenses(prev => ({ ...prev, total }));
  }, [monthlyExpenses.rent, monthlyExpenses.salaries, monthlyExpenses.utilities, monthlyExpenses.maintenance, monthlyExpenses.other]);

  const handleExpenseChange = (field: keyof typeof monthlyExpenses, value: number) => {
    const updatedExpenses = { ...monthlyExpenses, [field]: value };
    setMonthlyExpenses(updatedExpenses);
    
    const totalSales = salesProjections.reduce((sum, item) => sum + item.amount, 0);
    const totalExpenses = updatedExpenses.total;
    
    const projections: FinancialProjections = {
      monthlyExpenses: updatedExpenses,
      monthlySales: salesProjections,
      totalMonthlySales: totalSales,
      monthlyProfit: totalSales - totalExpenses
    };
    onUpdate(projections);
  };

  const handleSalesChange = (index: number, field: 'rate' | 'qty', value: number) => {
    const updatedSales = [...salesProjections];
    updatedSales[index] = {
      ...updatedSales[index],
      [field]: value,
      amount: field === 'rate' ? value * updatedSales[index].qty : updatedSales[index].rate * value
    };
    setSalesProjections(updatedSales);
    
    const totalSales = updatedSales.reduce((sum, item) => sum + item.amount, 0);
    const totalExpenses = monthlyExpenses.total;
    
    const projections: FinancialProjections = {
      monthlyExpenses,
      monthlySales: updatedSales,
      totalMonthlySales: totalSales,
      monthlyProfit: totalSales - totalExpenses
    };
    onUpdate(projections);
  };

  const totalMonthlyExpenses = monthlyExpenses.total;
  const totalMonthlySales = salesProjections.reduce((sum, item) => sum + item.amount, 0);
  const monthlyProfit = totalMonthlySales - totalMonthlyExpenses;

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
            <Label htmlFor="rent">Rent (₹)</Label>
            <Input
              id="rent"
              type="number"
              value={monthlyExpenses.rent}
              onChange={(e) => handleExpenseChange('rent', parseInt(e.target.value) || 0)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="salaries">Salaries & Wages (₹)</Label>
            <Input
              id="salaries"
              type="number"
              value={monthlyExpenses.salaries}
              onChange={(e) => handleExpenseChange('salaries', parseInt(e.target.value) || 0)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="utilities">Utilities (Electricity, Water, etc.) (₹)</Label>
            <Input
              id="utilities"
              type="number"
              value={monthlyExpenses.utilities}
              onChange={(e) => handleExpenseChange('utilities', parseInt(e.target.value) || 0)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="maintenance">Maintenance & Repairs (₹)</Label>
            <Input
              id="maintenance"
              type="number"
              value={monthlyExpenses.maintenance}
              onChange={(e) => handleExpenseChange('maintenance', parseInt(e.target.value) || 0)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="other">Other Expenses (₹)</Label>
            <Input
              id="other"
              type="number"
              value={monthlyExpenses.other}
              onChange={(e) => handleExpenseChange('other', parseInt(e.target.value) || 0)}
              required
            />
          </div>
          
          <div className="space-y-2 bg-muted/50 p-3 rounded-lg">
            <Label>Total Monthly Expenses</Label>
            <div className="text-2xl font-bold text-error">
              ₹{totalMonthlyExpenses.toLocaleString()}
            </div>
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
          {salesProjections.map((item, index) => (
            <div key={item.id} className="grid md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
              <div>
                <Label>Service/Product</Label>
                <div className="p-2 bg-background rounded border font-medium">
                  {item.particulars}
                </div>
              </div>
              <div>
                <Label htmlFor={`rate-${index}`}>Rate (₹)</Label>
                <Input
                  id={`rate-${index}`}
                  type="number"
                  value={item.rate}
                  onChange={(e) => handleSalesChange(index, 'rate', parseInt(e.target.value) || 0)}
                  required
                />
              </div>
              <div>
                <Label htmlFor={`qty-${index}`}>Quantity</Label>
                <Input
                  id={`qty-${index}`}
                  type="number"
                  value={item.qty}
                  onChange={(e) => handleSalesChange(index, 'qty', parseInt(e.target.value) || 0)}
                  required
                />
              </div>
              <div>
                <Label>Amount (₹)</Label>
                <div className="p-2 bg-background rounded border font-medium">
                  ₹{item.amount.toLocaleString()}
                </div>
              </div>
            </div>
          ))}
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
          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-background/50 rounded-lg">
              <div className="text-sm text-muted-foreground">Total Monthly Expenses</div>
              <div className="text-xl font-bold text-error">₹{totalMonthlyExpenses.toLocaleString()}</div>
            </div>
            <div className="p-4 bg-background/50 rounded-lg">
              <div className="text-sm text-muted-foreground">Total Monthly Sales</div>
              <div className="text-xl font-bold text-success">₹{totalMonthlySales.toLocaleString()}</div>
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