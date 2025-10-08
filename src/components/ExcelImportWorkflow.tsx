import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Settings2, CheckCircle, AlertCircle, FileSpreadsheet, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ExcelProcessor } from './ExcelProcessor';
import { SettingsConfiguration } from './SettingsConfiguration';
import { AutomationMapping, ParsedExcelData, ProcessedProjectData } from '@/types/AutomationTypes';
import automationMappingData from '@/data/automation-mapping.json';

interface ExcelImportWorkflowProps {
  onProjectCreated: (projectData: ProcessedProjectData) => void;
  onBack: () => void;
}

export const ExcelImportWorkflow = ({ onProjectCreated, onBack }: ExcelImportWorkflowProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [currentStep, setCurrentStep] = useState<'upload' | 'settings' | 'processing' | 'preview' | 'complete'>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [parsedData, setParsedData] = useState<ParsedExcelData | null>(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  
  const automationMapping = automationMappingData as unknown as AutomationMapping;

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
          file.name.endsWith('.xlsx')) {
        setSelectedFile(file);
        toast({
          title: "File Selected",
          description: `Selected: ${file.name}`,
        });
      } else {
        toast({
          title: "Invalid File Type",
          description: "Please select an Excel (.xlsx) file",
          variant: "destructive",
        });
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const processFile = async () => {
    if (!selectedFile) return;

    setProcessing(true);
    setProgress(0);
    setCurrentStep('processing');

    try {
      const processor = new ExcelProcessor(automationMapping, settings);
      
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const data = await processor.parseExcelFile(selectedFile);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      setParsedData(data);
      setCurrentStep('preview');
      
      toast({
        title: "File Processed Successfully",
        description: "Excel data has been parsed and validated",
      });
    } catch (error) {
      console.error('Processing error:', error);
      toast({
        title: "Processing Error",
        description: "Failed to process the Excel file. Please check the format.",
        variant: "destructive",
      });
      setCurrentStep('upload');
    } finally {
      setProcessing(false);
    }
  };

  const handleCreateProject = () => {
    if (!parsedData) return;

    const processor = new ExcelProcessor(automationMapping, settings);
    const testResults = processor.runTests(parsedData);
    const maskedData = processor.maskSensitiveData(parsedData);

    const processedData: ProcessedProjectData = {
      ...maskedData,
      settings,
      testResults
    };

    onProjectCreated(processedData);
  };

  const renderUploadStep = () => (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5" />
          Upload Excel Project File
        </CardTitle>
        <CardDescription>
          Select an Excel file containing your loan application project data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center space-y-4">
          <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
          <div>
            <p className="text-lg font-medium">Drop your Excel file here or click to browse</p>
            <p className="text-sm text-muted-foreground">Supports .xlsx files up to 20MB</p>
          </div>
          <Button onClick={handleUploadClick} className="mt-4">
            Select Excel File
          </Button>
          <Input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {selectedFile && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              File selected: <strong>{selectedFile.name}</strong> ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
            </AlertDescription>
          </Alert>
        )}

        <div className="flex justify-between">
          <Button variant="outline" onClick={onBack}>
            Back to Dashboard
          </Button>
          
          <div className="space-x-3">
            <Button 
              variant="outline" 
              onClick={() => setShowSettings(true)}
              disabled={!selectedFile}
            >
              <Settings2 className="h-4 w-4 mr-2" />
              Configure Settings
            </Button>
            <Button 
              onClick={processFile} 
              disabled={!selectedFile}
              className="bg-gradient-to-r from-primary to-primary-light"
            >
              Process File
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderProcessingStep = () => (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Processing Excel File</CardTitle>
        <CardDescription>
          Parsing data and running validations...
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Progress value={progress} className="w-full" />
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              {progress < 30 && "Reading Excel file..."}
              {progress >= 30 && progress < 60 && "Extracting business data..."}
              {progress >= 60 && progress < 90 && "Calculating financial projections..."}
              {progress >= 90 && "Finalizing data..."}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderPreviewStep = () => {
    if (!parsedData) return null;

    return (
      <div className="w-full max-w-6xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Project Data Preview</CardTitle>
            <CardDescription>
              Review the extracted data before creating the project
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="business" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="business">Business Info</TabsTrigger>
                <TabsTrigger value="machinery">Machinery</TabsTrigger>
                <TabsTrigger value="working">Working Capital</TabsTrigger>
                <TabsTrigger value="sales">Sales</TabsTrigger>
              </TabsList>
              
              <TabsContent value="business" className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Shop Name</Label>
                    <p className="text-sm text-muted-foreground">{parsedData.businessInfo.shopName}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Proprietor</Label>
                    <p className="text-sm text-muted-foreground">{parsedData.businessInfo.proprietorName}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Business Type</Label>
                    <p className="text-sm text-muted-foreground">{parsedData.businessInfo.proposedBusiness}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Loan Scheme</Label>
                    <p className="text-sm text-muted-foreground">{parsedData.businessInfo.loanScheme}</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="machinery">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Particulars</TableHead>
                      <TableHead>Rate</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead>Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {parsedData.machineryItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.particulars}</TableCell>
                        <TableCell>₹{item.rate.toLocaleString()}</TableCell>
                        <TableCell>{item.qty}</TableCell>
                        <TableCell>₹{item.amount.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
              
              <TabsContent value="working">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Particulars</TableHead>
                      <TableHead>Rate</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>GST</TableHead>
                      <TableHead>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {parsedData.workingCapitalItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.particulars}</TableCell>
                        <TableCell>₹{item.rate.toLocaleString()}</TableCell>
                        <TableCell>{item.qty}</TableCell>
                        <TableCell>₹{item.amount.toLocaleString()}</TableCell>
                        <TableCell>₹{Math.round(item.gstAmount).toLocaleString()}</TableCell>
                        <TableCell>₹{Math.round(item.amount + item.gstAmount).toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
              
              <TabsContent value="sales">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Particulars</TableHead>
                      <TableHead>Rate</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead>Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {parsedData.salesProjections.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.particulars}</TableCell>
                        <TableCell>₹{item.rate.toLocaleString()}</TableCell>
                        <TableCell>{item.qty.toLocaleString()}</TableCell>
                        <TableCell>₹{item.amount.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Financial Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-primary">₹{parsedData.financialSummary.totalProjectCost.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Total Project Cost</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-success">₹{Math.round(parsedData.financialSummary.monthlySales).toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Monthly Sales</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-warning">₹{Math.round(parsedData.financialSummary.monthlyProfit).toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Monthly Profit</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-info">{parsedData.financialSummary.dscr.toFixed(2)}</div>
                <div className="text-sm text-muted-foreground">DSCR</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button variant="outline" onClick={() => setCurrentStep('upload')}>
            Back to Upload
          </Button>
          <Button 
            onClick={handleCreateProject}
            className="bg-gradient-to-r from-success to-success-light"
          >
            Create Project
            <CheckCircle className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/10">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Excel-Based Project Creation
          </h1>
          <p className="text-muted-foreground">
            Import your loan application data from Excel and generate comprehensive reports
          </p>
        </div>

        {currentStep === 'upload' && renderUploadStep()}
        {currentStep === 'processing' && renderProcessingStep()}
        {currentStep === 'preview' && renderPreviewStep()}

        {showSettings && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <SettingsConfiguration
              settingsSchema={automationMapping.settings_schema}
              initialSettings={settings}
              onSettingsChange={setSettings}
              onClose={() => setShowSettings(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
};