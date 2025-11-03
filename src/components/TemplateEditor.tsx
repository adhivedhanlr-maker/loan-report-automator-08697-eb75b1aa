import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Save } from "lucide-react";
import { BusinessTemplate } from "@/data/business-templates";
import { MachineryItem, WorkingCapitalItem, SalesProjection } from "@/types/AutomationTypes";

interface TemplateEditorProps {
  template: BusinessTemplate;
  customData: any;
  onSave: (data: any) => void;
}

export const TemplateEditor = ({ template, customData, onSave }: TemplateEditorProps) => {
  const [machineryItems, setMachineryItems] = useState<MachineryItem[]>(
    customData?.machineryItems || template.machineryItems
  );
  
  const [workingCapitalItems, setWorkingCapitalItems] = useState<WorkingCapitalItem[]>(
    customData?.workingCapitalItems || template.workingCapitalItems
  );
  
  const [salesProjections, setSalesProjections] = useState<SalesProjection[]>(
    customData?.salesProjections || template.salesProjections
  );

  const updateMachineryItem = (index: number, field: keyof MachineryItem, value: any) => {
    const updated = [...machineryItems];
    updated[index] = { ...updated[index], [field]: value };
    
    if (field === 'qty' || field === 'rate') {
      updated[index].amount = updated[index].qty * updated[index].rate;
    }
    
    setMachineryItems(updated);
  };

  const addMachineryItem = () => {
    setMachineryItems([...machineryItems, { particulars: "", qty: 0, rate: 0, amount: 0 }]);
  };

  const removeMachineryItem = (index: number) => {
    setMachineryItems(machineryItems.filter((_, i) => i !== index));
  };

  const updateWorkingCapital = (index: number, field: keyof WorkingCapitalItem, value: any) => {
    const updated = [...workingCapitalItems];
    updated[index] = { ...updated[index], [field]: value };
    
    if (field === 'qty' || field === 'rate') {
      updated[index].amount = updated[index].qty * updated[index].rate;
    }
    
    setWorkingCapitalItems(updated);
  };

  const addWorkingCapitalItem = () => {
    setWorkingCapitalItems([...workingCapitalItems, { particulars: "", qty: 0, rate: 0, amount: 0 }]);
  };

  const removeWorkingCapitalItem = (index: number) => {
    setWorkingCapitalItems(workingCapitalItems.filter((_, i) => i !== index));
  };

  const updateSalesProjection = (index: number, field: keyof SalesProjection, value: any) => {
    const updated = [...salesProjections];
    updated[index] = { ...updated[index], [field]: value };
    
    if (field === 'qty' || field === 'rate') {
      updated[index].amount = updated[index].qty * updated[index].rate;
    }
    
    setSalesProjections(updated);
  };

  const addSalesProjection = () => {
    setSalesProjections([...salesProjections, { particulars: "", qty: 0, rate: 0, amount: 0 }]);
  };

  const removeSalesProjection = (index: number) => {
    setSalesProjections(salesProjections.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onSave({
      machineryItems,
      workingCapitalItems,
      salesProjections
    });
  };

  return (
    <div className="space-y-6">
      {/* Machinery Items */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Fixed Assets / Machinery</CardTitle>
            <Button onClick={addMachineryItem} size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {machineryItems.map((item, index) => (
              <div key={index} className="grid grid-cols-5 gap-3 items-end p-3 bg-muted/50 rounded-lg">
                <div className="col-span-2">
                  <Label>Item</Label>
                  <Input
                    value={item.particulars}
                    onChange={(e) => updateMachineryItem(index, 'particulars', e.target.value)}
                    placeholder="Item name"
                  />
                </div>
                <div>
                  <Label>Qty</Label>
                  <Input
                    type="number"
                    value={item.qty}
                    onChange={(e) => updateMachineryItem(index, 'qty', Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Rate (₹)</Label>
                  <Input
                    type="number"
                    value={item.rate}
                    onChange={(e) => updateMachineryItem(index, 'rate', Number(e.target.value))}
                  />
                </div>
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <Label>Amount</Label>
                    <div className="p-2 bg-background rounded border text-sm font-semibold">
                      ₹{item.amount.toLocaleString()}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeMachineryItem(index)}
                    disabled={machineryItems.length === 1}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Working Capital */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Working Capital</CardTitle>
            <Button onClick={addWorkingCapitalItem} size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {workingCapitalItems.map((item, index) => (
              <div key={index} className="grid grid-cols-5 gap-3 items-end p-3 bg-muted/50 rounded-lg">
                <div className="col-span-2">
                  <Label>Item</Label>
                  <Input
                    value={item.particulars}
                    onChange={(e) => updateWorkingCapital(index, 'particulars', e.target.value)}
                    placeholder="Item name"
                  />
                </div>
                <div>
                  <Label>Qty</Label>
                  <Input
                    type="number"
                    value={item.qty}
                    onChange={(e) => updateWorkingCapital(index, 'qty', Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Rate (₹)</Label>
                  <Input
                    type="number"
                    value={item.rate}
                    onChange={(e) => updateWorkingCapital(index, 'rate', Number(e.target.value))}
                  />
                </div>
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <Label>Amount</Label>
                    <div className="p-2 bg-background rounded border text-sm font-semibold">
                      ₹{item.amount.toLocaleString()}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeWorkingCapitalItem(index)}
                    disabled={workingCapitalItems.length === 1}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sales Projections */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Sales Projections (Monthly)</CardTitle>
            <Button onClick={addSalesProjection} size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {salesProjections.map((item, index) => (
              <div key={index} className="grid grid-cols-5 gap-3 items-end p-3 bg-muted/50 rounded-lg">
                <div className="col-span-2">
                  <Label>Product/Service</Label>
                  <Input
                    value={item.particulars}
                    onChange={(e) => updateSalesProjection(index, 'particulars', e.target.value)}
                    placeholder="Product/Service name"
                  />
                </div>
                <div>
                  <Label>Qty</Label>
                  <Input
                    type="number"
                    value={item.qty}
                    onChange={(e) => updateSalesProjection(index, 'qty', Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Rate (₹)</Label>
                  <Input
                    type="number"
                    value={item.rate}
                    onChange={(e) => updateSalesProjection(index, 'rate', Number(e.target.value))}
                  />
                </div>
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <Label>Amount</Label>
                    <div className="p-2 bg-background rounded border text-sm font-semibold">
                      ₹{item.amount.toLocaleString()}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeSalesProjection(index)}
                    disabled={salesProjections.length === 1}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} className="w-full" size="lg">
        <Save className="h-4 w-4 mr-2" />
        Save Template Changes
      </Button>
    </div>
  );
};