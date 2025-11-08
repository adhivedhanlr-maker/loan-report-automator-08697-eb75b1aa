import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { BusinessTemplate } from "@/data/business-templates";
import { CompleteProjectData } from "@/types/AutomationTypes";
import { saveCustomTemplate } from "@/utils/customTemplateManager";
import { Sparkles, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TemplateRecommendationProps {
  projectData: CompleteProjectData;
  onSave: (saved: boolean) => void;
  onSkip: () => void;
}

export const TemplateRecommendation = ({ projectData, onSave, onSkip }: TemplateRecommendationProps) => {
  const { toast } = useToast();
  const [templateName, setTemplateName] = useState("");
  const [category, setCategory] = useState("");
  const [keywords, setKeywords] = useState<string>("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  const categories = [
    "Service",
    "Trade",
    "Manufacturing",
    "Food & Beverage",
    "Retail",
    "Professional Services",
    "Other"
  ];

  // Auto-populate with project data
  useEffect(() => {
    if (projectData.businessInfo.proposedBusiness) {
      setTemplateName(projectData.businessInfo.proposedBusiness);
      // Generate keywords from business name
      const words = projectData.businessInfo.proposedBusiness
        .toLowerCase()
        .split(/\s+/)
        .filter(w => w.length > 2);
      setKeywords(words.join(", "));
    }

    // Set category based on line of activity
    const lineOfActivity = projectData.businessInfo.lineOfActivity;
    if (lineOfActivity === "SERVICE") {
      setCategory("Service");
    } else if (lineOfActivity === "TRADE") {
      setCategory("Trade");
    } else if (lineOfActivity === "MANUFACTURING") {
      setCategory("Manufacturing");
    }
  }, [projectData]);

  const handleSaveTemplate = () => {
    if (!templateName.trim()) {
      toast({
        title: "Template name required",
        description: "Please enter a name for this template",
        variant: "destructive"
      });
      return;
    }

    if (!category) {
      toast({
        title: "Category required",
        description: "Please select a category for this template",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);

    try {
      // Create template ID from name
      const templateId = `custom-${templateName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;

      // Extract financial ratios from P&L statement
      const profitMargin = projectData.profitAndLoss?.years?.[0]?.netProfit 
        ? projectData.profitAndLoss.years[0].netProfit / (projectData.profitAndLoss.years[0].salesRevenue || 1)
        : 0.25;

      const workingCapitalTotal = projectData.financeData.materials.reduce((sum, item) => sum + item.monthlyCost, 0);
      const totalProjectCost = projectData.financeData.fixedAssets.reduce((sum, item) => sum + item.cost, 0) + workingCapitalTotal;
      const workingCapitalPercentage = totalProjectCost > 0 ? workingCapitalTotal / totalProjectCost : 0.25;

      // Parse keywords
      const keywordArray = keywords
        .split(',')
        .map(k => k.trim())
        .filter(k => k.length > 0);

      const newTemplate: Omit<BusinessTemplate, 'isCustom' | 'createdAt' | 'usageCount'> = {
        id: templateId,
        name: templateName,
        category: category,
        keywords: keywordArray,
        description: description || `Custom template for ${templateName}`,
        defaultBusinessInfo: {
          lineOfActivity: projectData.businessInfo.lineOfActivity,
          proposedBusiness: templateName,
          loanScheme: projectData.businessInfo.loanScheme,
          loanYears: projectData.businessInfo.loanYears
        },
        machineryItems: projectData.financeData.fixedAssets.map(asset => ({
          particulars: asset.name,
          qty: 1,
          rate: asset.cost,
          amount: asset.cost
        })),
        workingCapitalItems: projectData.financeData.materials.map(item => ({
          particulars: item.material,
          qty: item.units,
          rate: item.rate,
          amount: item.monthlyCost
        })),
        salesProjections: projectData.financeData.salesMix.map(sale => ({
          particulars: sale.product,
          qty: sale.units,
          rate: sale.rate,
          amount: sale.monthlyRevenue
        })),
        financialRatios: {
          profitMargin: profitMargin,
          dscr: 1.25,
          workingCapitalPercentage: workingCapitalPercentage
        }
      };

      saveCustomTemplate(newTemplate);

      toast({
        title: "Template Saved!",
        description: `${templateName} has been saved for future projects`,
      });

      onSave(true);
    } catch (error) {
      console.error('Error saving template:', error);
      toast({
        title: "Error",
        description: "Failed to save template. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="border-primary/30 bg-gradient-to-br from-card to-primary/5">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <CardTitle>Save as Template</CardTitle>
        </div>
        <CardDescription>
          Would you like to save this business configuration as a template for future projects?
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-muted/50 rounded-lg space-y-2">
          <p className="text-sm font-medium">This template will include:</p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{projectData.financeData.fixedAssets.length} Machinery Items</Badge>
            <Badge variant="outline">{projectData.financeData.materials.length} Working Capital Items</Badge>
            <Badge variant="outline">{projectData.financeData.salesMix.length} Sales Projections</Badge>
            <Badge variant="outline">Financial Ratios</Badge>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="templateName">Template Name *</Label>
            <Input
              id="templateName"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="e.g., Screen Printing Shop"
            />
          </div>

          <div>
            <Label htmlFor="category">Category *</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="keywords">Keywords (comma-separated)</Label>
            <Input
              id="keywords"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="e.g., printing, screen, textile, design"
            />
            <p className="text-xs text-muted-foreground mt-1">
              These help detect this business type in future projects
            </p>
          </div>

          <div>
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of this business type..."
              rows={3}
            />
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <Button
            onClick={handleSaveTemplate}
            disabled={saving}
            className="flex-1"
          >
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Saving..." : "Save Template"}
          </Button>
          <Button
            variant="outline"
            onClick={() => onSkip()}
            disabled={saving}
          >
            <X className="mr-2 h-4 w-4" />
            Skip
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
