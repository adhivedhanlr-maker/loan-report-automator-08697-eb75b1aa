import { ProjectData } from "@/pages/NewProject";

export const generateSampleProjectData = (): ProjectData => {
  return {
    businessInfo: {
      shopName: "Modern Electronics & Appliances",
      buildingLandmark: "Near City Mall",
      buildingNo: "A-123",
      gstNo: "03ABCDE1234F1Z5",
      monthlyRent: 35000,
      village: "Model Town",
      municipality: "Ludhiana Municipal Corporation",
      postOffice: "Model Town",
      taluk: "Ludhiana",
      block: "Ludhiana-I",
      district: "Ludhiana",
      pinCode: "141001",
      gender: "Male",
      proprietorName: "Rajesh Kumar Sharma",
      fatherName: "Ramesh Kumar Sharma",
      houseName: "Sharma House",
      contactNumber: "9876543210",
      dateOfBirth: "1985-03-15",
      panNo: "ABCDE1234F",
      aadhaarNo: "123456789012",
      lineOfActivity: "Electronics & Electrical Appliances Retail",
      unitStatus: "New",
      qualification: "B.Com",
      experience: 8,
      proposedBusiness: "Electronics & Electrical Appliances Retail Store",
      loanScheme: "PMEGP (Prime Minister's Employment Generation Programme)",
      loanYears: 7,
      bankName: "State Bank of India",
      bankBranch: "Model Town Branch"
    },
    projectCost: {
      machineryItems: [
        {
          id: "1",
          particulars: "Display Refrigerator for Cold Drinks",
          rate: 35000,
          qty: 2,
          amount: 70000
        },
        {
          id: "2", 
          particulars: "Air Conditioner (Split AC 1.5 Ton)",
          rate: 45000,
          qty: 3,
          amount: 135000
        },
        {
          id: "3",
          particulars: "LED TV Display Units (55 inch)",
          rate: 28000,
          qty: 4,
          amount: 112000
        },
        {
          id: "4",
          particulars: "Cash Counter with Computer System",
          rate: 85000,
          qty: 1,
          amount: 85000
        },
        {
          id: "5",
          particulars: "Storage Racks and Display Shelving",
          rate: 12000,
          qty: 8,
          amount: 96000
        }
      ],
      workingCapitalItems: [
        {
          id: "1",
          particulars: "Electronics Inventory (Smartphones, Tablets)",
          rate: 800000,
          qty: 1,
          amount: 800000,
          gstAmount: 144000
        },
        {
          id: "2",
          particulars: "Home Appliances Stock (Washing Machines, Fridges)",
          rate: 600000,
          qty: 1,
          amount: 600000,
          gstAmount: 108000
        },
        {
          id: "3",
          particulars: "Small Electronics & Accessories",
          rate: 250000,
          qty: 1,
          amount: 250000,
          gstAmount: 45000
        },
        {
          id: "4",
          particulars: "Initial Marketing & Advertisement",
          rate: 80000,
          qty: 1,
          amount: 80000,
          gstAmount: 14400
        }
      ],
      totalFixedInvestment: 498000,
      totalWorkingCapital: 2061400,
      totalProjectCost: 2559400
    },
    financialProjections: {
      monthlyExpenses: {
        rawMaterials: 450000,
        salaryWages: 75000,
        transportation: 10000,
        electricity: 12000,
        printingStationary: 5000,
        telephone: 3000,
        repairs: 8000,
        advertisement: 15000,
        miscellaneous: 8000,
        interestBankCharges: 25000,
        depreciation: 15000,
        gstPaid: 45000,
        cessPaid: 2000,
        auditFee: 5000,
        rent: 35000
      },
      salesProjections: {
        printingChargesStickers: { rate: 50, qty: 1500, amount: 75000 },
        printingChargesVinyl: { rate: 150, qty: 800, amount: 120000 },
        designingCharges: { rate: 500, qty: 200, amount: 100000 },
        momentos: { rate: 80, qty: 500, amount: 40000 }
      }
    }
  };
};

export const loadSampleProject = () => {
  const sampleData = generateSampleProjectData();
  
  // Save sample data to localStorage
  localStorage.setItem('loanApplicationProjectData', JSON.stringify(sampleData));
  localStorage.setItem('loanApplicationCurrentStep', '3'); // Set to report generation step
  
  return sampleData;
};