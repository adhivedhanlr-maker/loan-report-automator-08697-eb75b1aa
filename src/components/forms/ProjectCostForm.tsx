import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowRight, ArrowLeft, Plus, Trash2, Wrench, Briefcase } from "lucide-react";
import { ProjectCost, MachineryItem, WorkingCapitalItem } from "@/pages/NewProject";
import { useToast } from "@/hooks/use-toast";

interface ProjectCostFormProps {
  data?: ProjectCost;
  onUpdate: (data: ProjectCost) => void;
  onNext: () => void;
  onBack: () => void;
}

export const ProjectCostForm = ({ data, onUpdate, onNext, onBack }: ProjectCostFormProps) => {
  const { toast } = useToast();
  const [machineryItems, setMachineryItems] = useState<MachineryItem[]>([
    { id: '1', particulars: '', rate: 0, qty: 1, amount: 0 }
  ]);
  
  const [workingCapitalItems, setWorkingCapitalItems] = useState<WorkingCapitalItem[]>([
    { id: '1', particulars: '', rate: 0, qty: 1, amount: 0, gstAmount: 0 }
  ]);

  useEffect(() => {
    if (data) {
      setMachineryItems(data.machineryItems);
      setWorkingCapitalItems(data.workingCapitalItems);
    }
  }, [data]);

  const updateProjectData = () => {
    const totalFixedInvestment = machineryItems.reduce((sum, item) => sum + item.amount, 0);
    const totalWorkingCapital = workingCapitalItems.reduce((sum, item) => sum + (item.amount + item.gstAmount), 0);
    
    const projectCost: ProjectCost = {
      machineryItems,
      workingCapitalItems,
      totalFixedInvestment,
      totalWorkingCapital,
      totalProjectCost: totalFixedInvestment + totalWorkingCapital
    };
    
    onUpdate(projectCost);
  };

  useEffect(() => {
    updateProjectData();
  }, [machineryItems, workingCapitalItems]);

  const addMachineryItem = () => {
    const newItem: MachineryItem = {
      id: Date.now().toString(),
      particulars: '',
      rate: 0,
      qty: 1,
      amount: 0
    };
    setMachineryItems([...machineryItems, newItem]);
  };

  const removeMachineryItem = (id: string) => {
    if (machineryItems.length > 1) {
      setMachineryItems(machineryItems.filter(item => item.id !== id));
    }
  };

  const updateMachineryItem = (id: string, field: keyof MachineryItem, value: string | number) => {
    setMachineryItems(items => items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'rate' || field === 'qty') {
          updatedItem.amount = updatedItem.rate * updatedItem.qty;
        }
        return updatedItem;
      }
      return item;
    }));
  };

  const addWorkingCapitalItem = () => {
    const newItem: WorkingCapitalItem = {
      id: Date.now().toString(),
      particulars: '',
      rate: 0,
      qty: 1,
      amount: 0,
      gstAmount: 0
    };
    setWorkingCapitalItems([...workingCapitalItems, newItem]);
  };

  const removeWorkingCapitalItem = (id: string) => {
    if (workingCapitalItems.length > 1) {
      setWorkingCapitalItems(workingCapitalItems.filter(item => item.id !== id));
    }
  };

  const updateWorkingCapitalItem = (id: string, field: keyof WorkingCapitalItem, value: string | number) => {
    setWorkingCapitalItems(items => items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'rate' || field === 'qty') {
          updatedItem.amount = updatedItem.rate * updatedItem.qty;
          updatedItem.gstAmount = updatedItem.amount * 0.18; // 18% GST
        }
        return updatedItem;
      }
      return item;
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const hasEmptyMachinery = machineryItems.some(item => !item.particulars.trim());
    const hasEmptyWorkingCapital = workingCapitalItems.some(item => !item.particulars.trim());
    
    if (hasEmptyMachinery || hasEmptyWorkingCapital) {
      toast({
        title: "Incomplete Information",
        description: "Please fill in all item details before proceeding.",
        variant: "destructive",
      });
      return;
    }
    
    onNext();
  };

  const totalFixedInvestment = machineryItems.reduce((sum, item) => sum + item.amount, 0);
  const totalWorkingCapital = workingCapitalItems.reduce((sum, item) => sum + (item.amount + item.gstAmount), 0);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Machinery & Fixed Assets */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            Machinery & Fixed Assets
          </CardTitle>
          <CardDescription>
            List all machinery, equipment, and fixed assets required for the project
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Particulars</TableHead>
                  <TableHead className="w-32">Rate (₹)</TableHead>
                  <TableHead className="w-20">Qty</TableHead>
                  <TableHead className="w-32">Amount (₹)</TableHead>
                  <TableHead className="w-16">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {machineryItems.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Input
                        value={item.particulars}
                        onChange={(e) => updateMachineryItem(item.id, 'particulars', e.target.value)}
                        placeholder="Item description"
                        required
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={item.rate || ''}
                        onChange={(e) => updateMachineryItem(item.id, 'rate', parseInt(e.target.value) || 0)}
                        placeholder="Rate"
                        required
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={item.qty || ''}
                        onChange={(e) => updateMachineryItem(item.id, 'qty', parseInt(e.target.value) || 1)}
                        min="1"
                        required
                      />
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">₹{item.amount.toLocaleString()}</div>
                    </TableCell>
                    <TableCell>
                      {machineryItems.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeMachineryItem(item.id)}
                          className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            <div className="flex justify-between items-center">
              <Button
                type="button"
                variant="outline"
                onClick={addMachineryItem}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Item
              </Button>
              
              <div className="text-lg font-semibold">
                Total Fixed Investment: ₹{totalFixedInvestment.toLocaleString()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Working Capital */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Working Capital Requirements
          </CardTitle>
          <CardDescription>
            Raw materials, inventory, and other working capital items (GST @ 18% auto-calculated)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Particulars</TableHead>
                  <TableHead className="w-24">Rate (₹)</TableHead>
                  <TableHead className="w-20">Qty</TableHead>
                  <TableHead className="w-28">Amount (₹)</TableHead>
                  <TableHead className="w-28">GST (₹)</TableHead>
                  <TableHead className="w-28">Total (₹)</TableHead>
                  <TableHead className="w-16">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workingCapitalItems.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Input
                        value={item.particulars}
                        onChange={(e) => updateWorkingCapitalItem(item.id, 'particulars', e.target.value)}
                        placeholder="Item description"
                        required
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={item.rate || ''}
                        onChange={(e) => updateWorkingCapitalItem(item.id, 'rate', parseInt(e.target.value) || 0)}
                        placeholder="Rate"
                        required
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={item.qty || ''}
                        onChange={(e) => updateWorkingCapitalItem(item.id, 'qty', parseInt(e.target.value) || 1)}
                        min="1"
                        required
                      />
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">₹{item.amount.toLocaleString()}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-muted-foreground">₹{Math.round(item.gstAmount).toLocaleString()}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">₹{Math.round(item.amount + item.gstAmount).toLocaleString()}</div>
                    </TableCell>
                    <TableCell>
                      {workingCapitalItems.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeWorkingCapitalItem(item.id)}
                          className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            <div className="flex justify-between items-center">
              <Button
                type="button"
                variant="outline"
                onClick={addWorkingCapitalItem}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Item
              </Button>
              
              <div className="text-lg font-semibold">
                Total Working Capital: ₹{Math.round(totalWorkingCapital).toLocaleString()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Project Summary */}
      <Card className="bg-gradient-to-r from-primary/5 to-success/5 border-primary/20">
        <CardHeader>
          <CardTitle>Project Cost Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-background/50 rounded-lg">
              <div className="text-sm text-muted-foreground">Fixed Investment</div>
              <div className="text-2xl font-bold text-primary">₹{totalFixedInvestment.toLocaleString()}</div>
            </div>
            <div className="p-4 bg-background/50 rounded-lg">
              <div className="text-sm text-muted-foreground">Working Capital</div>
              <div className="text-2xl font-bold text-success">₹{Math.round(totalWorkingCapital).toLocaleString()}</div>
            </div>
            <div className="p-4 bg-background/50 rounded-lg border-2 border-primary/20">
              <div className="text-sm text-muted-foreground">Total Project Cost</div>
              <div className="text-2xl font-bold text-foreground">₹{Math.round(totalFixedInvestment + totalWorkingCapital).toLocaleString()}</div>
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
          Continue to Financial Projections
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </form>
  );
};