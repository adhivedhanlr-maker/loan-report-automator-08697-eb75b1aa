import { BusinessInfo, MachineryItem, WorkingCapitalItem, SalesProjection } from "@/types/AutomationTypes";

export interface BusinessTemplate {
  id: string;
  name: string;
  category: string;
  keywords: string[];
  description: string;
  defaultBusinessInfo: Partial<BusinessInfo>;
  machineryItems: MachineryItem[];
  workingCapitalItems: WorkingCapitalItem[];
  salesProjections: SalesProjection[];
  financialRatios: {
    profitMargin: number;
    dscr: number;
    workingCapitalPercentage: number;
  };
}

export const businessTemplates: BusinessTemplate[] = [
  {
    id: "digital-printing",
    name: "Digital Printing Service",
    category: "Service",
    keywords: ["printing", "digital", "graphics", "design", "offset", "banner"],
    description: "Digital printing and design services for commercial and personal use",
    defaultBusinessInfo: {
      lineOfActivity: "SERVICE",
      proposedBusiness: "DIGITAL PRINTING",
      loanScheme: "MUDRA",
      loanYears: 5
    },
    machineryItems: [
      {
        particulars: "Digital Printing Machine",
        qty: 1,
        rate: 250000,
        amount: 250000
      },
      {
        particulars: "Computer System",
        qty: 2,
        rate: 45000,
        amount: 90000
      },
      {
        particulars: "Lamination Machine",
        qty: 1,
        rate: 35000,
        amount: 35000
      },
      {
        particulars: "Paper Cutting Machine",
        qty: 1,
        rate: 25000,
        amount: 25000
      },
      {
        particulars: "UPS & Stabilizer",
        qty: 1,
        rate: 15000,
        amount: 15000
      }
    ],
    workingCapitalItems: [
      {
        particulars: "Paper Stock",
        qty: 1,
        rate: 30000,
        amount: 30000
      },
      {
        particulars: "Ink Cartridges",
        qty: 1,
        rate: 25000,
        amount: 25000
      },
      {
        particulars: "Lamination Film",
        qty: 1,
        rate: 10000,
        amount: 10000
      },
      {
        particulars: "Miscellaneous Supplies",
        qty: 1,
        rate: 15000,
        amount: 15000
      }
    ],
    salesProjections: [
      {
        particulars: "Printing Services",
        qty: 30,
        rate: 2500,
        amount: 75000
      },
      {
        particulars: "Design Services",
        qty: 20,
        rate: 1500,
        amount: 30000
      }
    ],
    financialRatios: {
      profitMargin: 0.35,
      dscr: 1.25,
      workingCapitalPercentage: 0.25
    }
  },
  {
    id: "restaurant",
    name: "Restaurant/Food Service",
    category: "Food & Beverage",
    keywords: ["restaurant", "food", "dining", "cafe", "eatery", "catering"],
    description: "Restaurant and food service business",
    defaultBusinessInfo: {
      lineOfActivity: "TRADE",
      proposedBusiness: "RESTAURANT",
      loanScheme: "MUDRA",
      loanYears: 7
    },
    machineryItems: [
      {
        particulars: "Kitchen Equipment Set",
        qty: 1,
        rate: 150000,
        amount: 150000
      },
      {
        particulars: "Refrigerator/Freezer",
        qty: 2,
        rate: 40000,
        amount: 80000
      },
      {
        particulars: "Dining Tables & Chairs",
        qty: 10,
        rate: 5000,
        amount: 50000
      },
      {
        particulars: "Cash Counter",
        qty: 1,
        rate: 25000,
        amount: 25000
      }
    ],
    workingCapitalItems: [
      {
        particulars: "Food Ingredients",
        qty: 1,
        rate: 40000,
        amount: 40000
      },
      {
        particulars: "Spices & Condiments",
        qty: 1,
        rate: 15000,
        amount: 15000
      },
      {
        particulars: "Packaging Materials",
        qty: 1,
        rate: 10000,
        amount: 10000
      }
    ],
    salesProjections: [
      {
        particulars: "Food Sales",
        qty: 1500,
        rate: 150,
        amount: 225000
      }
    ],
    financialRatios: {
      profitMargin: 0.25,
      dscr: 1.15,
      workingCapitalPercentage: 0.30
    }
  },
  {
    id: "retail-store",
    name: "Retail Store",
    category: "Retail",
    keywords: ["retail", "store", "shop", "grocery", "general", "merchant"],
    description: "General retail store or grocery business",
    defaultBusinessInfo: {
      lineOfActivity: "TRADE",
      proposedBusiness: "RETAIL STORE",
      loanScheme: "MUDRA",
      loanYears: 5
    },
    machineryItems: [
      {
        particulars: "Display Racks",
        qty: 10,
        rate: 3000,
        amount: 30000
      },
      {
        particulars: "Cash Counter",
        qty: 1,
        rate: 20000,
        amount: 20000
      },
      {
        particulars: "Weighing Scale",
        qty: 2,
        rate: 3000,
        amount: 6000
      },
      {
        particulars: "Refrigerator",
        qty: 1,
        rate: 35000,
        amount: 35000
      }
    ],
    workingCapitalItems: [
      {
        particulars: "Initial Stock",
        qty: 1,
        rate: 100000,
        amount: 100000
      },
      {
        particulars: "Packaging Materials",
        qty: 1,
        rate: 5000,
        amount: 5000
      }
    ],
    salesProjections: [
      {
        particulars: "Retail Sales",
        qty: 1,
        rate: 180000,
        amount: 180000
      }
    ],
    financialRatios: {
      profitMargin: 0.15,
      dscr: 1.10,
      workingCapitalPercentage: 0.40
    }
  },
  {
    id: "tailoring",
    name: "Tailoring/Garment",
    category: "Service",
    keywords: ["tailor", "garment", "clothes", "dress", "alteration", "sewing"],
    description: "Tailoring and garment making services",
    defaultBusinessInfo: {
      lineOfActivity: "SERVICE",
      proposedBusiness: "TAILORING",
      loanScheme: "MUDRA",
      loanYears: 5
    },
    machineryItems: [
      {
        particulars: "Sewing Machine",
        qty: 3,
        rate: 25000,
        amount: 75000
      },
      {
        particulars: "Overlock Machine",
        qty: 1,
        rate: 35000,
        amount: 35000
      },
      {
        particulars: "Cutting Table",
        qty: 2,
        rate: 8000,
        amount: 16000
      },
      {
        particulars: "Iron & Press",
        qty: 2,
        rate: 5000,
        amount: 10000
      }
    ],
    workingCapitalItems: [
      {
        particulars: "Fabric Stock",
        qty: 1,
        rate: 30000,
        amount: 30000
      },
      {
        particulars: "Threads & Accessories",
        qty: 1,
        rate: 10000,
        amount: 10000
      },
      {
        particulars: "Buttons & Zippers",
        qty: 1,
        rate: 8000,
        amount: 8000
      }
    ],
    salesProjections: [
      {
        particulars: "Tailoring Services",
        qty: 100,
        rate: 800,
        amount: 80000
      }
    ],
    financialRatios: {
      profitMargin: 0.40,
      dscr: 1.30,
      workingCapitalPercentage: 0.20
    }
  }
];

/**
 * Enhanced detection with fuzzy matching and custom template support
 */
export const detectBusinessType = (proposedBusiness: string): BusinessTemplate | null => {
  const searchText = proposedBusiness.toLowerCase().trim();
  
  if (!searchText) return null;
  
  // First, check custom templates
  try {
    const customTemplatesStr = localStorage.getItem('customBusinessTemplates');
    if (customTemplatesStr) {
      const customTemplates = JSON.parse(customTemplatesStr);
      for (const template of Object.values(customTemplates) as BusinessTemplate[]) {
        const matches = template.keywords.some(keyword => 
          searchText.includes(keyword.toLowerCase()) || 
          keyword.toLowerCase().includes(searchText)
        );
        if (matches) {
          return template;
        }
        // Check if template name matches
        if (template.name.toLowerCase().includes(searchText) || 
            searchText.includes(template.name.toLowerCase())) {
          return template;
        }
      }
    }
  } catch (error) {
    console.error('Error checking custom templates:', error);
  }
  
  // Then check predefined templates with enhanced matching
  for (const template of businessTemplates) {
    // Exact keyword match
    const exactMatch = template.keywords.some(keyword => 
      searchText.includes(keyword.toLowerCase())
    );
    if (exactMatch) {
      return template;
    }
    
    // Fuzzy match - check if any keyword is contained in search text
    const fuzzyMatch = template.keywords.some(keyword => {
      const keywordLower = keyword.toLowerCase();
      // Check for partial matches (minimum 3 characters)
      if (keywordLower.length >= 3 && searchText.includes(keywordLower)) {
        return true;
      }
      // Check reverse - if search text is contained in keyword
      if (searchText.length >= 3 && keywordLower.includes(searchText)) {
        return true;
      }
      return false;
    });
    
    if (fuzzyMatch) {
      return template;
    }
    
    // Check template name match
    if (template.name.toLowerCase().includes(searchText) || 
        searchText.includes(template.name.toLowerCase())) {
      return template;
    }
  }
  
  return null;
};

export const getBusinessTemplateById = (id: string): BusinessTemplate | null => {
  return businessTemplates.find(template => template.id === id) || null;
};