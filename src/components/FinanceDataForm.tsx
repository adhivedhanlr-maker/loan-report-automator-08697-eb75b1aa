import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, ArrowLeft, ArrowRight } from "lucide-react";
import { FinanceData, FixedAsset, SalesMixItem, MaterialInput } from "@/types/AutomationTypes";
import { validateFinanceData } from "@/utils/validationRules";
import { useToast } from "@/hooks/use-toast";
import { calculateAssetDepreciation } from "@/utils/depreciationCalculations";

interface FinanceDataFormProps {
  data?: FinanceData;
  onUpdate: (data: FinanceData) => void;
  onNext: () => void;
  onBack: () => void;
}

export const FinanceDataForm = ({ data, onUpdate, onNext, onBack }: FinanceDataFormProps) => {
  const { toast } = useToast();

  // Load default depreciation rate from settings
  const getDefaultDepreciationRate = () => {
    const saved = localStorage.getItem('calculationSettings');
    if (saved) {
      const settings = JSON.parse(saved);
      return settings.defaultDepreciationRate ?? 10;
    }
    return 10;
  };

  const defaultDepreciationRate = getDefaultDepreciationRate();

  const [loanAmount, setLoanAmount] = useState(data?.loanAmount ?? 0);
  const [equity, setEquity] = useState(data?.equity ?? 0);
  const [growthRate, setGrowthRate] = useState(data?.growthRate ?? 0);
  
  const [fixedAssets, setFixedAssets] = useState<FixedAsset[]>(
    data?.fixedAssets || [
      { name: "", cost: 0, depreciationRate: defaultDepreciationRate, annualDepreciation: 0 }
    ]
  );
  
  const [salesMix, setSalesMix] = useState<SalesMixItem[]>(
    data?.salesMix || [
      { product: "", units: 0, rate: 0, monthlyRevenue: 0 }
    ]
  );
  
  const [materials, setMaterials] = useState<MaterialInput[]>(
    data?.materials || [
      { material: "", units: 0, rate: 0, monthlyCost: 0 }
    ]
  );
  
  const [fixedOPEX, setFixedOPEX] = useState<Array<{ label: string; amount: number }>>(
    data?.fixedOPEX || [
      { label: "Rent", amount: 0 },
      { label: "Salaries", amount: 0 },
      { label: "Utilities", amount: 0 },
      { label: "Maintenance", amount: 0 },
    ]
  );

  // Update parent on changes
  useEffect(() => {
    onUpdate({
      loanAmount,
      equity,
      growthRate,
      fixedAssets,
      salesMix,
      materials,
      fixedOPEX,
    });
  }, [loanAmount, equity, growthRate, fixedAssets, salesMix, materials, fixedOPEX]);

  // Fixed Asset handlers
  const updateFixedAsset = (index: number, field: keyof FixedAsset, value: any) => {
    const updated = [...fixedAssets];
    updated[index] = { ...updated[index], [field]: value };
    
    // Auto-calculate depreciation
    if (field === 'cost' || field === 'depreciationRate') {
      updated[index].annualDepreciation = calculateAssetDepreciation(
        updated[index].cost,
        updated[index].depreciationRate
      );
    }
    
    setFixedAssets(updated);
  };

  const addFixedAsset = () => {
    setFixedAssets([
      ...fixedAssets,
      { name: "", cost: 0, depreciationRate: defaultDepreciationRate, annualDepreciation: 0 }
    ]);
  };

  const removeFixedAsset = (index: number) => {
    setFixedAssets(fixedAssets.filter((_, i) => i !== index));
  };

  // Sales Mix handlers
  const updateSalesMix = (index: number, field: keyof SalesMixItem, value: any) => {
    const updated = [...salesMix];
    updated[index] = { ...updated[index], [field]: value };
    
    // Auto-calculate monthly revenue
    if (field === 'units' || field === 'rate') {
      updated[index].monthlyRevenue = updated[index].units * updated[index].rate;
    }
    
    setSalesMix(updated);
  };

  const addSalesMixItem = () => {
    setSalesMix([...salesMix, { product: "", units: 0, rate: 0, monthlyRevenue: 0 }]);
  };

  const removeSalesMixItem = (index: number) => {
    setSalesMix(salesMix.filter((_, i) => i !== index));
  };

  // Material handlers
  const updateMaterial = (index: number, field: keyof MaterialInput, value: any) => {
    const updated = [...materials];
    updated[index] = { ...updated[index], [field]: value };
    
    // Auto-calculate monthly cost
    if (field === 'units' || field === 'rate') {
      updated[index].monthlyCost = updated[index].units * updated[index].rate;
    }
    
    setMaterials(updated);
  };

  const addMaterial = () => {
    setMaterials([...materials, { material: "", units: 0, rate: 0, monthlyCost: 0 }]);
  };

  const removeMaterial = (index: number) => {
    setMaterials(materials.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    const financeData: FinanceData = {
      loanAmount,
      equity,
      growthRate,
      fixedAssets,
      salesMix,
      materials,
      fixedOPEX,
    };

    const validation = validateFinanceData(financeData);
    
    if (!validation.isValid) {
      toast({
        title: "Validation Error",
        description: validation.errors[0],
        variant: "destructive",
      });
      return;
    }

    onNext();
  };

  // Fixed OPEX handlers
  const updateFixedOPEX = (index: number, field: 'label' | 'amount', value: any) => {
    const updated = [...fixedOPEX];
    updated[index] = { ...updated[index], [field]: value };
    setFixedOPEX(updated);
  };

  const addFixedOPEX = () => {
    setFixedOPEX([...fixedOPEX, { label: "", amount: 0 }]);
  };

  const removeFixedOPEX = (index: number) => {
    setFixedOPEX(fixedOPEX.filter((_, i) => i !== index));
  };

  // Calculate totals
  const totalFixedAssets = fixedAssets.reduce((sum, asset) => sum + asset.cost, 0);
  const totalMonthlyRevenue = salesMix.reduce((sum, item) => sum + item.monthlyRevenue, 0);
  const totalMonthlyCOGS = materials.reduce((sum, item) => sum + item.monthlyCost, 0);
  const totalMonthlyOPEX = fixedOPEX.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Card className="border-primary/20 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
          <CardTitle className="text-2xl">Step 2: Finance Data</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-8">
          {/* Basic Finance Info */}
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="loanAmount">Loan Amount (₹)</Label>
              <Input
                id="loanAmount"
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value === '' ? 0 : Number(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="equity">Equity / Own Contribution (₹)</Label>
              <Input
                id="equity"
                type="number"
                value={equity}
                onChange={(e) => setEquity(e.target.value === '' ? 0 : Number(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="growthRate">Growth Rate (%)</Label>
              <Input
                id="growthRate"
                type="number"
                value={growthRate}
                onChange={(e) => setGrowthRate(e.target.value === '' ? 0 : Number(e.target.value))}
              />
            </div>
          </div>

          {/* Fixed Assets */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Fixed Assets (Machinery & Equipment)</h3>
              <Button onClick={addFixedAsset} size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Asset
              </Button>
            </div>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="p-3 text-left">Asset Name</th>
                    <th className="p-3 text-left">Cost (₹)</th>
                    <th className="p-3 text-left">Depreciation (%)</th>
                    <th className="p-3 text-left">Annual Depreciation</th>
                    <th className="p-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {fixedAssets.map((asset, index) => (
                    <tr key={index} className="border-t">
                      <td className="p-2">
                        <Input
                          value={asset.name}
                          onChange={(e) => updateFixedAsset(index, 'name', e.target.value)}
                          placeholder="Asset name"
                        />
                      </td>
                      <td className="p-2">
                        <Input
                          type="number"
                          value={asset.cost}
                          onChange={(e) => updateFixedAsset(index, 'cost', Number(e.target.value))}
                        />
                      </td>
                      <td className="p-2">
                        <Input
                          type="number"
                          value={asset.depreciationRate}
                          onChange={(e) => updateFixedAsset(index, 'depreciationRate', Number(e.target.value))}
                        />
                      </td>
                      <td className="p-2 text-center">
                        ₹{asset.annualDepreciation.toLocaleString()}
                      </td>
                      <td className="p-2 text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFixedAsset(index)}
                          disabled={fixedAssets.length === 1}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-muted/50">
                  <tr>
                    <td colSpan={3} className="p-3 text-right font-semibold">Total Fixed Assets:</td>
                    <td colSpan={2} className="p-3 font-bold">₹{totalFixedAssets.toLocaleString()}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Sales Mix */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Sales Mix (Monthly)</h3>
              <Button onClick={addSalesMixItem} size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </div>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="p-3 text-left">Product</th>
                    <th className="p-3 text-left">Units</th>
                    <th className="p-3 text-left">Rate (₹)</th>
                    <th className="p-3 text-left">Monthly Revenue</th>
                    <th className="p-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {salesMix.map((item, index) => (
                    <tr key={index} className="border-t">
                      <td className="p-2">
                        <Input
                          value={item.product}
                          onChange={(e) => updateSalesMix(index, 'product', e.target.value)}
                          placeholder="Product name"
                        />
                      </td>
                      <td className="p-2">
                        <Input
                          type="number"
                          value={item.units}
                          onChange={(e) => updateSalesMix(index, 'units', Number(e.target.value))}
                        />
                      </td>
                      <td className="p-2">
                        <Input
                          type="number"
                          value={item.rate}
                          onChange={(e) => updateSalesMix(index, 'rate', Number(e.target.value))}
                        />
                      </td>
                      <td className="p-2 text-center">
                        ₹{item.monthlyRevenue.toLocaleString()}
                      </td>
                      <td className="p-2 text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSalesMixItem(index)}
                          disabled={salesMix.length === 1}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-muted/50">
                  <tr>
                    <td colSpan={3} className="p-3 text-right font-semibold">Total Monthly Revenue:</td>
                    <td colSpan={2} className="p-3 font-bold">₹{totalMonthlyRevenue.toLocaleString()}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Materials/COGS */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Materials / COGS (Monthly)</h3>
              <Button onClick={addMaterial} size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Material
              </Button>
            </div>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="p-3 text-left">Material</th>
                    <th className="p-3 text-left">Units</th>
                    <th className="p-3 text-left">Rate (₹)</th>
                    <th className="p-3 text-left">Monthly Cost</th>
                    <th className="p-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {materials.map((item, index) => (
                    <tr key={index} className="border-t">
                      <td className="p-2">
                        <Input
                          value={item.material}
                          onChange={(e) => updateMaterial(index, 'material', e.target.value)}
                          placeholder="Material name"
                        />
                      </td>
                      <td className="p-2">
                        <Input
                          type="number"
                          value={item.units}
                          onChange={(e) => updateMaterial(index, 'units', Number(e.target.value))}
                        />
                      </td>
                      <td className="p-2">
                        <Input
                          type="number"
                          value={item.rate}
                          onChange={(e) => updateMaterial(index, 'rate', Number(e.target.value))}
                        />
                      </td>
                      <td className="p-2 text-center">
                        ₹{item.monthlyCost.toLocaleString()}
                      </td>
                      <td className="p-2 text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeMaterial(index)}
                          disabled={materials.length === 1}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-muted/50">
                  <tr>
                    <td colSpan={3} className="p-3 text-right font-semibold">Total Monthly COGS:</td>
                    <td colSpan={2} className="p-3 font-bold">₹{totalMonthlyCOGS.toLocaleString()}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Fixed OPEX */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Fixed Operating Expenses (Monthly)</h3>
              <Button onClick={addFixedOPEX} size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Expense
              </Button>
            </div>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="p-3 text-left">Expense Type</th>
                    <th className="p-3 text-left">Monthly Amount (₹)</th>
                    <th className="p-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {fixedOPEX.map((item, index) => (
                    <tr key={index} className="border-t">
                      <td className="p-2">
                        <Input
                          value={item.label}
                          onChange={(e) => updateFixedOPEX(index, 'label', e.target.value)}
                          placeholder="Expense type"
                        />
                      </td>
                      <td className="p-2">
                        <Input
                          type="number"
                          value={item.amount}
                          onChange={(e) => updateFixedOPEX(index, 'amount', Number(e.target.value))}
                        />
                      </td>
                      <td className="p-2 text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFixedOPEX(index)}
                          disabled={fixedOPEX.length === 1}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-muted/50">
                  <tr>
                    <td className="p-3 text-right font-semibold">Total Monthly OPEX:</td>
                    <td colSpan={2} className="p-3 font-bold">₹{totalMonthlyOPEX.toLocaleString()}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between pt-6">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button onClick={handleNext}>
              Next to Depreciation
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
