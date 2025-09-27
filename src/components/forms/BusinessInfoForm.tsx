import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, Building2, User } from "lucide-react";
import { BusinessInfo } from "@/types/LegacyTypes";

interface BusinessInfoFormProps {
  data?: BusinessInfo;
  onUpdate: (data: BusinessInfo) => void;
  onNext: () => void;
}

export const BusinessInfoForm = ({ data, onUpdate, onNext }: BusinessInfoFormProps) => {
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
    gender: "",
    proprietorName: "",
    fatherName: "",
    houseName: "",
    contactNumber: "",
    dateOfBirth: "",
    panNo: "",
    aadhaarNo: "",
    lineOfActivity: "",
    unitStatus: "",
    qualification: "",
    experience: 0,
    proposedBusiness: "",
    loanScheme: "",
    loanYears: 0,
    bankName: "",
    bankBranch: "",
    ...data
  });

  useEffect(() => {
    if (data) {
      setFormData(data);
    }
  }, [data]);

  const handleInputChange = (field: keyof BusinessInfo, value: string | number) => {
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);
    onUpdate(updatedData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Business Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Business Information
          </CardTitle>
          <CardDescription>
            Enter details about your business and location
          </CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="shopName">Name of Shop *</Label>
            <Input
              id="shopName"
              value={formData.shopName}
              onChange={(e) => handleInputChange('shopName', e.target.value)}
              placeholder="M/S. Business Name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="buildingLandmark">Building & Landmark</Label>
            <Input
              id="buildingLandmark"
              value={formData.buildingLandmark}
              onChange={(e) => handleInputChange('buildingLandmark', e.target.value)}
              placeholder="Near Post Office, Location"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="buildingNo">Building No.</Label>
            <Input
              id="buildingNo"
              value={formData.buildingNo}
              onChange={(e) => handleInputChange('buildingNo', e.target.value)}
              placeholder="W-III/1022"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gstNo">GST No.</Label>
            <Input
              id="gstNo"
              value={formData.gstNo}
              onChange={(e) => handleInputChange('gstNo', e.target.value)}
              placeholder="GST Registration Number"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="monthlyRent">Monthly Rent (₹)</Label>
            <Input
              id="monthlyRent"
              type="number"
              value={formData.monthlyRent || ''}
              onChange={(e) => handleInputChange('monthlyRent', parseInt(e.target.value) || 0)}
              placeholder="5500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="village">Village</Label>
            <Input
              id="village"
              value={formData.village}
              onChange={(e) => handleInputChange('village', e.target.value)}
              placeholder="Village Name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="municipality">Municipality</Label>
            <Input
              id="municipality"
              value={formData.municipality}
              onChange={(e) => handleInputChange('municipality', e.target.value)}
              placeholder="Municipality"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="postOffice">Post Office</Label>
            <Input
              id="postOffice"
              value={formData.postOffice}
              onChange={(e) => handleInputChange('postOffice', e.target.value)}
              placeholder="Post Office"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="taluk">Taluk</Label>
            <Input
              id="taluk"
              value={formData.taluk}
              onChange={(e) => handleInputChange('taluk', e.target.value)}
              placeholder="Taluk"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="block">Block</Label>
            <Input
              id="block"
              value={formData.block}
              onChange={(e) => handleInputChange('block', e.target.value)}
              placeholder="Block"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="district">District</Label>
            <Input
              id="district"
              value={formData.district}
              onChange={(e) => handleInputChange('district', e.target.value)}
              placeholder="District"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pinCode">PIN Code</Label>
            <Input
              id="pinCode"
              value={formData.pinCode}
              onChange={(e) => handleInputChange('pinCode', e.target.value)}
              placeholder="671314"
              maxLength={6}
            />
          </div>
        </CardContent>
      </Card>

      {/* Proprietor Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Proprietor Information
          </CardTitle>
          <CardDescription>
            Personal details of the business owner
          </CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MALE">Male</SelectItem>
                <SelectItem value="FEMALE">Female</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="proprietorName">Name of Proprietor *</Label>
            <Input
              id="proprietorName"
              value={formData.proprietorName}
              onChange={(e) => handleInputChange('proprietorName', e.target.value)}
              placeholder="Full Name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fatherName">Father's Name</Label>
            <Input
              id="fatherName"
              value={formData.fatherName}
              onChange={(e) => handleInputChange('fatherName', e.target.value)}
              placeholder="Father's Name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="houseName">House Name</Label>
            <Input
              id="houseName"
              value={formData.houseName}
              onChange={(e) => handleInputChange('houseName', e.target.value)}
              placeholder="House Name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactNumber">Contact Number *</Label>
            <Input
              id="contactNumber"
              value={formData.contactNumber}
              onChange={(e) => handleInputChange('contactNumber', e.target.value)}
              placeholder="9847599008"
              maxLength={10}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">Date of Birth</Label>
            <Input
              id="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="panNo">PAN No.</Label>
            <Input
              id="panNo"
              value={formData.panNo}
              onChange={(e) => handleInputChange('panNo', e.target.value)}
              placeholder="EVOPS0533P"
              maxLength={10}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="aadhaarNo">Aadhaar No.</Label>
            <Input
              id="aadhaarNo"
              value={formData.aadhaarNo}
              onChange={(e) => handleInputChange('aadhaarNo', e.target.value)}
              placeholder="3616 3601 1234"
              maxLength={14}
            />
          </div>
        </CardContent>
      </Card>

      {/* Business Details */}
      <Card>
        <CardHeader>
          <CardTitle>Business Details & Loan Information</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="lineOfActivity">Line of Activity</Label>
            <Select value={formData.lineOfActivity} onValueChange={(value) => handleInputChange('lineOfActivity', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Activity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SERVICE">Service</SelectItem>
                <SelectItem value="MANUFACTURING">Manufacturing</SelectItem>
                <SelectItem value="TRADING">Trading</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="unitStatus">Status of Unit</Label>
            <Select value={formData.unitStatus} onValueChange={(value) => handleInputChange('unitStatus', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FRESH">Fresh</SelectItem>
                <SelectItem value="EXISTING">Existing</SelectItem>
                <SelectItem value="EXPANSION">Expansion</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="qualification">Qualification</Label>
            <Input
              id="qualification"
              value={formData.qualification}
              onChange={(e) => handleInputChange('qualification', e.target.value)}
              placeholder="SSLC"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="experience">Experience (Years)</Label>
            <Input
              id="experience"
              type="number"
              value={formData.experience || ''}
              onChange={(e) => handleInputChange('experience', parseInt(e.target.value) || 0)}
              placeholder="12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="proposedBusiness">Proposed Business *</Label>
            <Input
              id="proposedBusiness"
              value={formData.proposedBusiness}
              onChange={(e) => handleInputChange('proposedBusiness', e.target.value)}
              placeholder="DIGITAL PRINTING"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="loanScheme">Loan Scheme</Label>
            <Select value={formData.loanScheme} onValueChange={(value) => handleInputChange('loanScheme', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Scheme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MUDRA">MUDRA</SelectItem>
                <SelectItem value="PMEGP">PMEGP</SelectItem>
                <SelectItem value="STAND UP INDIA">Stand Up India</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="loanYears">Loan Period (Years)</Label>
            <Input
              id="loanYears"
              type="number"
              value={formData.loanYears || ''}
              onChange={(e) => handleInputChange('loanYears', parseInt(e.target.value) || 0)}
              placeholder="5"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bankName">Bank Name</Label>
            <Input
              id="bankName"
              value={formData.bankName}
              onChange={(e) => handleInputChange('bankName', e.target.value)}
              placeholder="FEDERAL BANK"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="bankBranch">Bank Branch</Label>
            <Input
              id="bankBranch"
              value={formData.bankBranch}
              onChange={(e) => handleInputChange('bankBranch', e.target.value)}
              placeholder="Branch Name"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button 
          type="submit" 
          className="bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary"
        >
          Continue to Project Cost
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </form>
  );
};