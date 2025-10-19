import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { BusinessInfo } from "@/types/AutomationTypes";
import { BusinessTemplate } from "@/data/business-templates";
import { ArrowLeft, ArrowRight, Building2, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SmartBusinessInfoFormProps {
  selectedTemplate: BusinessTemplate | null;
  customBusiness: string;
  data?: BusinessInfo;
  onUpdate: (data: BusinessInfo) => void;
  onNext: () => void;
  onBack: () => void;
}

export const SmartBusinessInfoForm = ({
  selectedTemplate,
  customBusiness,
  data,
  onUpdate,
  onNext,
  onBack
}: SmartBusinessInfoFormProps) => {
  const { toast } = useToast();
  const toastShownRef = useRef(false);
  
  // Kerala Districts
  const keralaDistricts = [
    "Thiruvananthapuram",
    "Kollam",
    "Pathanamthitta",
    "Alappuzha",
    "Kottayam",
    "Idukki",
    "Ernakulam",
    "Thrissur",
    "Palakkad",
    "Malappuram",
    "Kozhikode",
    "Wayanad",
    "Kannur",
    "Kasaragod"
  ];

  const [formData, setFormData] = useState<BusinessInfo>({
    shopName: "",
    buildingLandmark: "",
    buildingNo: "",
    gstNo: "",
    monthlyRent: 0,
    village: "",
    municipality: "",
    postOffice: "",
    taluk: "",
    block: "",
    district: "",
    pinCode: "",
    proprietorName: "",
    fatherName: "",
    spouseName: "",
    motherName: "",
    houseName: "",
    contactNumber: "",
    dateOfBirth: "",
    panNo: "",
    aadhaarNo: "",
    gender: "MALE",
    lineOfActivity: "SERVICE",
    unitStatus: "FRESH",
    qualification: "",
    experience: 0,
    proposedBusiness: "",
    loanScheme: "MUDRA",
    loanYears: 5,
    bankName: "",
    bankBranch: "",
    ...data
  });

  // State for dynamic family member fields
  const [familyMembers, setFamilyMembers] = useState<Array<{ relation: string; name: string }>>([]);

  // Auto-populate from template when it changes
  useEffect(() => {
    if (selectedTemplate) {
      setFormData(prev => ({
        ...prev,
        proposedBusiness: selectedTemplate.name,
        lineOfActivity: selectedTemplate.defaultBusinessInfo.lineOfActivity || "SERVICE",
        loanScheme: selectedTemplate.defaultBusinessInfo.loanScheme || "MUDRA",
        loanYears: selectedTemplate.defaultBusinessInfo.loanYears || 5,
      }));
      
      if (!toastShownRef.current) {
        toast({
          title: "Smart Pre-fill Active",
          description: `Form pre-populated with ${selectedTemplate.name} template data`,
        });
        toastShownRef.current = true;
      }
    } else if (customBusiness) {
      setFormData(prev => ({
        ...prev,
        proposedBusiness: customBusiness
      }));
    }
  }, [selectedTemplate, customBusiness]);

  // Update parent component when form data changes
  useEffect(() => {
    onUpdate(formData);
  }, [formData, onUpdate]);

  const handleInputChange = (field: keyof BusinessInfo, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    // Basic validation
    const requiredFields = [
      'shopName', 'proprietorName', 'contactNumber', 'proposedBusiness',
      'district', 'pinCode', 'panNo'
    ];
    
    const missingFields = requiredFields.filter(field => 
      !formData[field as keyof BusinessInfo] || 
      String(formData[field as keyof BusinessInfo]).trim() === ''
    );

    if (missingFields.length > 0) {
      toast({
        title: "Missing Information",
        description: `Please fill in: ${missingFields.join(', ')}`,
        variant: "destructive"
      });
      return;
    }

    onNext();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {selectedTemplate && (
        <Card className="border-success/30 bg-success/5">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-success" />
              <CardTitle className="text-success">Smart Template Active</CardTitle>
            </div>
            <CardDescription>
              Using {selectedTemplate.name} template with pre-configured settings
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-3">
            <div className="flex gap-2">
              <Badge variant="outline">{selectedTemplate.category}</Badge>
              <Badge variant="outline">{selectedTemplate.machineryItems.length} Machinery Items</Badge>
              <Badge variant="outline">{selectedTemplate.workingCapitalItems.length} Working Capital Items</Badge>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-primary" />
            <CardTitle>Business Information</CardTitle>
          </div>
          <CardDescription>
            Provide your business details for the loan application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Business Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Business Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="shopName">Shop/Business Name *</Label>
                <Input
                  id="shopName"
                  value={formData.shopName}
                  onChange={(e) => handleInputChange('shopName', e.target.value)}
                  placeholder="Enter business name"
                />
              </div>
              <div>
                <Label htmlFor="proposedBusiness">Type of Business *</Label>
                <Input
                  id="proposedBusiness"
                  value={formData.proposedBusiness}
                  onChange={(e) => handleInputChange('proposedBusiness', e.target.value)}
                  placeholder="e.g., Digital Printing"
                />
              </div>
              <div>
                <Label htmlFor="lineOfActivity">Line of Activity</Label>
                <Select value={formData.lineOfActivity} onValueChange={(value) => handleInputChange('lineOfActivity', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SERVICE">Service</SelectItem>
                    <SelectItem value="TRADE">Trade</SelectItem>
                    <SelectItem value="MANUFACTURING">Manufacturing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="gstNo">GST Number</Label>
                <Input
                  id="gstNo"
                  value={formData.gstNo}
                  onChange={(e) => handleInputChange('gstNo', e.target.value)}
                  placeholder="GST registration number"
                />
              </div>
            </div>
          </div>

          {/* Proprietor Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Proprietor Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="proprietorName">Proprietor Name *</Label>
                <Input
                  id="proprietorName"
                  value={formData.proprietorName}
                  onChange={(e) => handleInputChange('proprietorName', e.target.value)}
                  placeholder="Full name as per documents"
                />
              </div>
              <div>
                <Label htmlFor="fatherName">Father's Name</Label>
                <Input
                  id="fatherName"
                  value={formData.fatherName}
                  onChange={(e) => handleInputChange('fatherName', e.target.value)}
                  placeholder="Father's full name"
                />
              </div>
              <div>
                <Label htmlFor="motherName">Mother's Name</Label>
                <Input
                  id="motherName"
                  value={formData.motherName || ""}
                  onChange={(e) => handleInputChange('motherName', e.target.value)}
                  placeholder="Mother's full name"
                />
              </div>
              <div>
                <Label htmlFor="spouseName">Spouse Name</Label>
                <Input
                  id="spouseName"
                  value={formData.spouseName || ""}
                  onChange={(e) => handleInputChange('spouseName', e.target.value)}
                  placeholder="Spouse's full name (if applicable)"
                />
              </div>
              <div>
                <Label htmlFor="gender">Gender</Label>
                <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MALE">Male</SelectItem>
                    <SelectItem value="FEMALE">Female</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="contactNumber">Contact Number *</Label>
                <Input
                  id="contactNumber"
                  value={formData.contactNumber}
                  onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                  placeholder="10-digit mobile number"
                />
              </div>
              <div>
                <Label htmlFor="qualification">Educational Qualification</Label>
                <Input
                  id="qualification"
                  value={formData.qualification}
                  onChange={(e) => handleInputChange('qualification', e.target.value)}
                  placeholder="e.g., SSLC, Plus Two, Graduate"
                />
              </div>
              <div>
                <Label htmlFor="experienceYears">Experience (Years)</Label>
                <Input
                  id="experienceYears"
                  type="number"
                  min="0"
                  value={formData.experience || 0}
                  onChange={(e) => handleInputChange('experience', Number(e.target.value))}
                  placeholder="Years of experience in this field"
                />
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Address Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="houseName">House Name/Number</Label>
                <Input
                  id="houseName"
                  value={formData.houseName}
                  onChange={(e) => handleInputChange('houseName', e.target.value)}
                  placeholder="House name or number"
                />
              </div>
              <div>
                <Label htmlFor="buildingLandmark">Building/Landmark</Label>
                <Input
                  id="buildingLandmark"
                  value={formData.buildingLandmark}
                  onChange={(e) => handleInputChange('buildingLandmark', e.target.value)}
                  placeholder="Nearby landmark"
                />
              </div>
              <div>
                <Label htmlFor="village">
                  Village <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="village"
                  value={formData.village}
                  onChange={(e) => handleInputChange('village', e.target.value)}
                  placeholder="Village name"
                />
              </div>
              <div>
                <Label htmlFor="municipality">
                  Panchayath/Municipality <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="municipality"
                  value={formData.municipality}
                  onChange={(e) => handleInputChange('municipality', e.target.value)}
                  placeholder="Panchayath or Municipality"
                />
              </div>
              <div>
                <Label htmlFor="postOffice">Post Office</Label>
                <Input
                  id="postOffice"
                  value={formData.postOffice}
                  onChange={(e) => handleInputChange('postOffice', e.target.value)}
                  placeholder="Post office name"
                />
              </div>
              <div>
                <Label htmlFor="district">
                  District <span className="text-destructive">*</span>
                </Label>
                <Select value={formData.district} onValueChange={(value) => handleInputChange('district', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select District" />
                  </SelectTrigger>
                  <SelectContent className="bg-background z-50">
                    {keralaDistricts.map((district) => (
                      <SelectItem key={district} value={district}>
                        {district}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="pinCode">PIN Code *</Label>
                <Input
                  id="pinCode"
                  value={formData.pinCode}
                  onChange={(e) => handleInputChange('pinCode', e.target.value)}
                  placeholder="6-digit PIN code"
                />
              </div>
            </div>
          </div>

          {/* Document Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Document Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="panNo">PAN Number *</Label>
                <Input
                  id="panNo"
                  value={formData.panNo}
                  onChange={(e) => handleInputChange('panNo', e.target.value)}
                  placeholder="10-character PAN number"
                />
              </div>
              <div>
                <Label htmlFor="aadhaarNo">Aadhaar Number</Label>
                <Input
                  id="aadhaarNo"
                  value={formData.aadhaarNo}
                  onChange={(e) => handleInputChange('aadhaarNo', e.target.value)}
                  placeholder="12-digit Aadhaar number"
                />
              </div>
            </div>
          </div>

          {/* Loan Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Loan Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="loanScheme">Loan Scheme</Label>
                <Select value={formData.loanScheme} onValueChange={(value) => handleInputChange('loanScheme', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MUDRA">MUDRA</SelectItem>
                    <SelectItem value="PMMY">PMMY</SelectItem>
                    <SelectItem value="STAND UP INDIA">Stand Up India</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="loanYears">Loan Period (Years)</Label>
                <Select value={String(formData.loanYears)} onValueChange={(value) => handleInputChange('loanYears', Number(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 Years</SelectItem>
                    <SelectItem value="5">5 Years</SelectItem>
                    <SelectItem value="7">7 Years</SelectItem>
                    <SelectItem value="10">10 Years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="bankName">Preferred Bank</Label>
                <Input
                  id="bankName"
                  value={formData.bankName}
                  onChange={(e) => handleInputChange('bankName', e.target.value)}
                  placeholder="Bank name for loan application"
                />
              </div>
              <div>
                <Label htmlFor="branchName">Branch Name</Label>
                <Input
                  id="branchName"
                  value={formData.bankBranch || ""}
                  onChange={(e) => handleInputChange('bankBranch', e.target.value)}
                  placeholder="Branch name"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-6">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button onClick={handleSubmit} size="lg">
              Next: Project Costs
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};