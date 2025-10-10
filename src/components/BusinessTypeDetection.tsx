import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { detectBusinessType, businessTemplates, BusinessTemplate } from "@/data/business-templates";
import { Building, Search, Sparkles, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface BusinessTypeDetectionProps {
  onBusinessTypeSelected: (template: BusinessTemplate | null, customBusiness?: string) => void;
  onBack?: () => void;
}

export const BusinessTypeDetection = ({ onBusinessTypeSelected, onBack }: BusinessTypeDetectionProps) => {
  const [proposedBusiness, setProposedBusiness] = useState("");
  const [detectedTemplate, setDetectedTemplate] = useState<BusinessTemplate | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<BusinessTemplate | null>(null);
  const [showAllTemplates, setShowAllTemplates] = useState(false);
  const [customSelected, setCustomSelected] = useState(false);

  const handleBusinessChange = (value: string) => {
    setProposedBusiness(value);
    if (value.length > 2) {
      const detected = detectBusinessType(value);
      setDetectedTemplate(detected);
    } else {
      setDetectedTemplate(null);
    }
  };

const handleTemplateSelect = (template: BusinessTemplate | null) => {
    setSelectedTemplate(template);
    setCustomSelected(false);
  };

  const handleNext = () => {
    onBusinessTypeSelected(selectedTemplate, proposedBusiness);
  };

  const groupedTemplates = businessTemplates.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = [];
    }
    acc[template.category].push(template);
    return acc;
  }, {} as Record<string, BusinessTemplate[]>);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="border-primary/20 bg-gradient-to-br from-card to-accent/30">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Building className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">Smart Loan Application System</CardTitle>
          <CardDescription className="text-lg">
            Tell us about your proposed business and we'll prepare everything for your loan application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="business" className="text-base font-medium">
              What type of business do you want to start?
            </Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Textarea
                id="business"
                placeholder="e.g., Digital Printing, Restaurant, Retail Store, Tailoring Shop..."
                value={proposedBusiness}
                onChange={(e) => handleBusinessChange(e.target.value)}
                className="pl-10 min-h-[80px] text-base"
              />
            </div>
          </div>

          {detectedTemplate && (
            <Card className="border-success/30 bg-success/5">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-success">
                  <Sparkles className="h-5 w-5" />
                  Smart Match Found!
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{detectedTemplate.name}</h3>
                      <p className="text-muted-foreground">{detectedTemplate.description}</p>
                      <Badge variant="outline" className="mt-2">{detectedTemplate.category}</Badge>
                    </div>
                    <Button
                      onClick={() => handleTemplateSelect(detectedTemplate)}
                      variant={selectedTemplate?.id === detectedTemplate.id ? "default" : "outline"}
                      size="sm"
                    >
                      {selectedTemplate?.id === detectedTemplate.id ? "Selected" : "Use This"}
                    </Button>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p><strong>Pre-configured:</strong> {detectedTemplate.machineryItems.length} machinery items, 
                    {detectedTemplate.workingCapitalItems.length} working capital items, 
                    and financial projections</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Other Business Templates</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAllTemplates(!showAllTemplates)}
              >
                {showAllTemplates ? "Show Less" : "Show All"}
              </Button>
            </div>

            {(showAllTemplates || !detectedTemplate) && (
              <div className="space-y-4">
                {Object.entries(groupedTemplates).map(([category, templates]) => (
                  <div key={category}>
                    <h4 className="font-medium text-primary mb-2">{category}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {templates.map((template) => (
                        <Card
                          key={template.id}
                          className={`cursor-pointer transition-all hover:shadow-md ${
                            selectedTemplate?.id === template.id
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          }`}
                          onClick={() => handleTemplateSelect(template)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div>
                                <h5 className="font-medium">{template.name}</h5>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {template.description}
                                </p>
                              </div>
                              {selectedTemplate?.id === template.id && (
                                <Badge variant="default">Selected</Badge>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <Card className="border-dashed">
              <CardContent className="p-4">
<Button
                  variant="outline"
                  className="w-full"
                  onClick={() => { setCustomSelected(true); setSelectedTemplate(null); }}
                >
                  <div className="text-center">
                    <p className="font-medium">Custom Business Type</p>
                    <p className="text-sm text-muted-foreground">Start with blank template</p>
                  </div>
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-between items-center pt-4">
            {onBack && (
              <Button variant="outline" onClick={onBack}>
                Back
              </Button>
            )}
            <Button 
              onClick={handleNext} 
              size="lg"
              disabled={!(proposedBusiness.trim() || selectedTemplate || customSelected)}
              className={cn(
                "min-w-32 transition-all duration-300",
                (proposedBusiness.trim() || selectedTemplate || customSelected)
                  ? "bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary shadow-md hover:shadow-lg scale-100 hover:scale-105" 
                  : ""
              )}
            >
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};