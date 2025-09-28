import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ProjectCost, MachineryItem, WorkingCapitalItem } from "@/types/AutomationTypes";
import { BusinessTemplate } from "@/data/business-templates";
import { ArrowLeft, ArrowRight, Plus, Trash2, Calculator, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SmartProjectCostFormProps {
  selectedTemplate: BusinessTemplate | null;
  data?: ProjectCost;
  onUpdate: (data: ProjectCost) => void;
  onNext: () => void;
  onBack: () => void;
}

export const SmartProjectCostForm = ({
  selectedTemplate,
  data,
  onUpdate,
  onNext,
  onBack
}: SmartProjectCostFormProps) => {
  const { toast } = useToast();
  
  const [machineryItems, setMachineryItems] = useState<MachineryItem[]>([]);
  const [workingCapitalItems, setWorkingCapitalItems] = useState<WorkingCapitalItem[]>([]);

  // Auto-populate from template when it changes
  useEffect(() => {
    if (selectedTemplate) {
      setMachineryItems(selectedTemplate.machineryItems);
      setWorkingCapitalItems(selectedTemplate.workingCapitalItems);
      
      toast({
        title: "Smart Pre-fill Active",
        description: `Pre-loaded ${selectedTemplate.machineryItems.length} machinery items and ${selectedTemplate.workingCapitalItems.length} working capital items`,
      });
    } else if (data) {
      setMachineryItems(data.machineryItems || []);
      setWorkingCapitalItems(data.workingCapitalItems || []);
    } else {
      // Default empty items if no template or data
      setMachineryItems([{ particulars: "", qty: 1, rate: 0, amount: 0 }]);
      setWorkingCapitalItems([{ particulars: "", qty: 1, rate: 0, amount: 0 }]);
    }
  }, [selectedTemplate, data, toast]);

  // Update parent component when items change
  useEffect(() => {
    const totalFixedInvestment = machineryItems.reduce((sum, item) => sum + item.amount, 0);
    const totalWorkingCapital = workingCapitalItems.reduce((sum, item) => sum + item.amount, 0);
    const totalProjectCost = totalFixedInvestment + totalWorkingCapital;
    
    const projectCost: ProjectCost = {
      machineryItems,
      workingCapitalItems,
      totalFixedInvestment,
      totalWorkingCapital,
      totalProjectCost
    };
    
    onUpdate(projectCost);
  }, [machineryItems, workingCapitalItems, onUpdate]);

  const updateMachineryItem = (index: number, field: keyof MachineryItem, value: string | number) => {
    const updatedItems = [...machineryItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    
    // Auto-calculate amount when qty or rate changes
    if (field === 'qty' || field === 'rate') {
      updatedItems[index].amount = updatedItems[index].qty * updatedItems[index].rate;
    }
    
    setMachineryItems(updatedItems);
  };

  const updateWorkingCapitalItem = (index: number, field: keyof WorkingCapitalItem, value: string | number) => {
    const updatedItems = [...workingCapitalItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    
    // Auto-calculate amount when qty or rate changes
    if (field === 'qty' || field === 'rate') {
      updatedItems[index].amount = updatedItems[index].qty * updatedItems[index].rate;
    }
    
    setWorkingCapitalItems(updatedItems);
  };

  const addMachineryItem = () => {
    setMachineryItems([...machineryItems, { particulars: "", qty: 1, rate: 0, amount: 0 }]);
  };

  const removeMachineryItem = (index: number) => {
    if (machineryItems.length > 1) {
      setMachineryItems(machineryItems.filter((_, i) => i !== index));
    }
  };

  const addWorkingCapitalItem = () => {
    setWorkingCapitalItems([...workingCapitalItems, { particulars: "", qty: 1, rate: 0, amount: 0 }]);
  };

  const removeWorkingCapitalItem = (index: number) => {
    if (workingCapitalItems.length > 1) {
      setWorkingCapitalItems(workingCapitalItems.filter((_, i) => i !== index));
    }
  };

  const totalFixedInvestment = machineryItems.reduce((sum, item) => sum + item.amount, 0);
  const totalWorkingCapital = workingCapitalItems.reduce((sum, item) => sum + item.amount, 0);
  const totalProjectCost = totalFixedInvestment + totalWorkingCapital;

  const handleNext = () => {
    // Validation
    const invalidMachinery = machineryItems.some(item => !item.particulars.trim() || item.amount <= 0);
    const invalidWorkingCapital = workingCapitalItems.some(item => !item.particulars.trim() || item.amount <= 0);
    
    if (invalidMachinery || invalidWorkingCapital) {
      toast({
        title: "Incomplete Information",
        description: "Please ensure all items have names and amounts greater than zero",
        variant: "destructive"
      });
      return;
    }
    
    onNext();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {selectedTemplate && (
        <Card className="border-success/30 bg-success/5">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-success" />
              <CardTitle className="text-success">Smart Template Active</CardTitle>
            </div>
            <CardDescription>
              Pre-loaded {selectedTemplate.name} equipment and working capital requirements
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-3">
            <div className="flex gap-2">
              <Badge variant="outline">₹{totalFixedInvestment.toLocaleString()} Fixed Investment</Badge>
              <Badge variant="outline">₹{totalWorkingCapital.toLocaleString()} Working Capital</Badge>
              <Badge variant="default">₹{totalProjectCost.toLocaleString()} Total Project Cost</Badge>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Calculator className="h-6 w-6 text-primary" />
            <CardTitle>Project Cost Details</CardTitle>
          </div>
          <CardDescription>
            Define your machinery requirements and working capital needs
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Machinery & Equipment */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold border-b pb-2 flex-1">Fixed Investment (Machinery & Equipment)</h3>
              <Button variant="outline" size="sm" onClick={addMachineryItem}>
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>
            
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40%]">Particulars</TableHead>
                    <TableHead className="w-[15%]">Quantity</TableHead>
                    <TableHead className="w-[20%]">Rate (₹)</TableHead>
                    <TableHead className="w-[20%]">Amount (₹)</TableHead>
                    <TableHead className="w-[5%]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {machineryItems.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Input
                          value={item.particulars}
                          onChange={(e) => updateMachineryItem(index, 'particulars', e.target.value)}
                          placeholder="Enter machinery/equipment name"
                          className="border-0 p-1"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="1"
                          value={item.qty}
                          onChange={(e) => updateMachineryItem(index, 'qty', Number(e.target.value))}
                          className="border-0 p-1"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="0"
                          value={item.rate}
                          onChange={(e) => updateMachineryItem(index, 'rate', Number(e.target.value))}
                          className="border-0 p-1"
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        ₹{item.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {machineryItems.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeMachineryItem(index)}
                            className="h-8 w-8 p-0"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-muted/50">
                    <TableCell colSpan={3} className="font-semibold">
                      Total Fixed Investment
                    </TableCell>
                    <TableCell className="font-bold text-lg">
                      ₹{totalFixedInvestment.toLocaleString()}
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Working Capital */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold border-b pb-2 flex-1">Working Capital Requirements</h3>
              <Button variant="outline" size="sm" onClick={addWorkingCapitalItem}>
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>
            
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40%]">Particulars</TableHead>
                    <TableHead className="w-[15%]">Quantity</TableHead>
                    <TableHead className="w-[20%]">Rate (₹)</TableHead>
                    <TableHead className="w-[20%]">Amount (₹)</TableHead>
                    <TableHead className="w-[5%]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workingCapitalItems.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Input
                          value={item.particulars}
                          onChange={(e) => updateWorkingCapitalItem(index, 'particulars', e.target.value)}
                          placeholder="Enter working capital requirement"
                          className="border-0 p-1"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="1"
                          value={item.qty}
                          onChange={(e) => updateWorkingCapitalItem(index, 'qty', Number(e.target.value))}
                          className="border-0 p-1"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="0"
                          value={item.rate}
                          onChange={(e) => updateWorkingCapitalItem(index, 'rate', Number(e.target.value))}
                          className="border-0 p-1"
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        ₹{item.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {workingCapitalItems.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeWorkingCapitalItem(index)}
                            className="h-8 w-8 p-0"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-muted/50">
                    <TableCell colSpan={3} className="font-semibold">
                      Total Working Capital
                    </TableCell>
                    <TableCell className="font-bold text-lg">
                      ₹{totalWorkingCapital.toLocaleString()}
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Project Cost Summary */}
          <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-primary">Project Cost Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-card rounded-lg border">
                  <p className="text-sm text-muted-foreground">Fixed Investment</p>
                  <p className="text-2xl font-bold text-primary">₹{totalFixedInvestment.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-card rounded-lg border">
                  <p className="text-sm text-muted-foreground">Working Capital</p>
                  <p className="text-2xl font-bold text-success">₹{totalWorkingCapital.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-card rounded-lg border border-primary">
                  <p className="text-sm text-muted-foreground">Total Project Cost</p>
                  <p className="text-3xl font-bold text-primary">₹{totalProjectCost.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between pt-6">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button onClick={handleNext} size="lg">
              Next: Financial Projections
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};