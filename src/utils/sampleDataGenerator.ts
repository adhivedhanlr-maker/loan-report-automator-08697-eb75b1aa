import { CompleteProjectData } from "@/types/AutomationTypes";

export const generateSampleProjectData = (): CompleteProjectData => {
  return {
    businessInfo: {
      shopName: "Modern Digital Printing Hub",
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
      lineOfActivity: "Digital Printing Services",
      unitStatus: "New",
      qualification: "B.Com",
      experience: 8,
      proposedBusiness: "Digital Printing Services",
      loanScheme: "MUDRA",
      loanYears: 7,
      bankName: "State Bank of India",
      bankBranch: "Model Town Branch"
    },
    financeData: {
      fixedAssets: [
        {
          id: "1",
          name: "Digital Printing Machine (Large Format)",
          cost: 450000,
          depreciationRate: 10,
          annualDepreciation: 45000
        },
        {
          id: "2",
          name: "Vinyl Cutting Plotter",
          cost: 180000,
          depreciationRate: 12.5,
          annualDepreciation: 22500
        },
        {
          id: "3",
          name: "Heat Press Machine",
          cost: 85000,
          depreciationRate: 14.29,
          annualDepreciation: 12147
        },
        {
          id: "4",
          name: "Computer & Design Software",
          cost: 120000,
          depreciationRate: 20,
          annualDepreciation: 24000
        },
        {
          id: "5",
          name: "Office Furniture & Fixtures",
          cost: 65000,
          depreciationRate: 10,
          annualDepreciation: 6500
        }
      ],
      salesMix: [
        { id: "1", product: "Banner Printing", units: 1500, rate: 50, monthlyRevenue: 75000 },
        { id: "2", product: "Vinyl Stickers", units: 800, rate: 150, monthlyRevenue: 120000 },
        { id: "3", product: "T-Shirt Printing", units: 600, rate: 200, monthlyRevenue: 120000 },
        { id: "4", product: "Business Cards", units: 200, rate: 500, monthlyRevenue: 100000 }
      ],
      materials: [
        { id: "1", material: "Printing Ink & Toner", units: 1, rate: 85000, monthlyCost: 85000 },
        { id: "2", material: "Vinyl Sheets & Papers", units: 1, rate: 120000, monthlyCost: 120000 },
        { id: "3", material: "T-Shirts (Bulk)", units: 1, rate: 60000, monthlyCost: 60000 },
        { id: "4", material: "Packaging Materials", units: 1, rate: 15000, monthlyCost: 15000 }
      ],
      fixedOPEX: {
        rent: 35000,
        salaries: 75000,
        utilities: 12000,
        marketing: 15000,
        maintenance: 8000,
        insurance: 5000,
        other: 8000
      },
      loanAmount: 900000,
      equity: 300000,
      growthRate: 10
    },
    depreciationSchedule: {
      assets: [
        {
          assetName: "Digital Printing Machine (Large Format)",
          cost: 450000,
          depreciationRate: 10,
          annualDepreciation: 45000
        },
        {
          assetName: "Vinyl Cutting Plotter",
          cost: 180000,
          depreciationRate: 12.5,
          annualDepreciation: 22500
        },
        {
          assetName: "Heat Press Machine",
          cost: 85000,
          depreciationRate: 14.29,
          annualDepreciation: 12147
        },
        {
          assetName: "Computer & Design Software",
          cost: 120000,
          depreciationRate: 20,
          annualDepreciation: 24000
        },
        {
          assetName: "Office Furniture & Fixtures",
          cost: 65000,
          depreciationRate: 10,
          annualDepreciation: 6500
        }
      ],
      totalAnnualDepreciation: 110147
    },
    loanAmortization: {
      loanScheme: {
        scheme: 'MUDRA',
        interestRate: 8.5,
        tenureYears: 7
      },
      monthlyEMI: 14850,
      year1Breakdown: Array.from({ length: 12 }, (_, i) => ({
        month: i + 1,
        emi: 14850,
        interest: 6375 - (i * 45),
        principal: 8475 + (i * 45),
        balance: 900000 - ((i + 1) * 8520)
      }))
    },
    profitAndLoss: {
      years: [
        {
          year: 1,
          salesRevenue: 4020000,
          rawMaterialCost: 3360000,
          grossProfit: 660000,
          fixedOPEX: 158000,
          variableOPEX: 280000,
          totalOPEX: 438000,
          ebitda: 222000,
          depreciation: 110147,
          interestExpense: 76500,
          ebt: 35353,
          tax: 0,
          netProfit: 35353
        },
        {
          year: 2,
          salesRevenue: 4422000,
          rawMaterialCost: 3696000,
          grossProfit: 726000,
          fixedOPEX: 173800,
          variableOPEX: 308000,
          totalOPEX: 481800,
          ebitda: 244200,
          depreciation: 110147,
          interestExpense: 68850,
          ebt: 65203,
          tax: 0,
          netProfit: 65203
        },
        {
          year: 3,
          salesRevenue: 4864200,
          rawMaterialCost: 4065600,
          grossProfit: 798600,
          fixedOPEX: 191180,
          variableOPEX: 338800,
          totalOPEX: 529980,
          ebitda: 268620,
          depreciation: 110147,
          interestExpense: 58905,
          ebt: 99568,
          tax: 0,
          netProfit: 99568
        },
        {
          year: 4,
          salesRevenue: 5350620,
          rawMaterialCost: 4472160,
          grossProfit: 878460,
          fixedOPEX: 210298,
          variableOPEX: 372680,
          totalOPEX: 582978,
          ebitda: 295482,
          depreciation: 110147,
          interestExpense: 46845,
          ebt: 138490,
          tax: 0,
          netProfit: 138490
        },
        {
          year: 5,
          salesRevenue: 5885682,
          rawMaterialCost: 4919376,
          grossProfit: 966306,
          fixedOPEX: 231328,
          variableOPEX: 409948,
          totalOPEX: 641276,
          ebitda: 325030,
          depreciation: 110147,
          interestExpense: 32175,
          ebt: 182708,
          tax: 0,
          netProfit: 182708
        }
      ],
      summary: {
        totalNetProfit: 521322,
        averageNetProfit: 104264,
        totalSalesRevenue: 24542502
      }
    },
    reportIntroduction: {
      businessName: "Modern Digital Printing Hub",
      narrative: `Modern Digital Printing Hub is a proposed venture in the digital printing sector, aiming to provide comprehensive printing solutions including banner printing, vinyl cutting, t-shirt printing, and business card services. Located in Model Town, Ludhiana, this business will cater to both individual customers and corporate clients requiring quality printing services.

The business will be equipped with modern digital printing equipment and operated by an experienced team. With growing demand for customized printing solutions in both personal and commercial segments, this venture is well-positioned to capture significant market share in the local area.`,
      objectives: [
        "Establish a modern digital printing facility with state-of-the-art equipment",
        "Provide high-quality, timely printing services to local businesses and individuals",
        "Achieve monthly revenue target of ₹3,35,000 within the first year",
        "Build a strong customer base through excellent service and competitive pricing",
        "Create employment opportunities for 3-4 skilled workers in the local community"
      ]
    }
  };
};
