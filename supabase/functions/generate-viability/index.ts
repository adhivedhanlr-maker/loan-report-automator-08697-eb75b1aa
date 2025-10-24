import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Comprehensive validation schemas matching client-side rules
const BusinessInfoSchema = z.object({
  shopName: z.string().trim().min(1, "Shop Name is required").max(200),
  proprietorName: z.string().trim().min(1, "Proprietor Name is required").max(200),
  contactNumber: z.string().regex(/^\d{10}$/, "Contact Number must be 10 digits"),
  district: z.string().trim().min(1, "District is required").max(100),
  pinCode: z.string().regex(/^\d{6}$/, "Pin Code must be 6 digits"),
  proposedBusiness: z.string().trim().min(1, "Proposed Business is required").max(500),
  panNo: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]$/, "Invalid PAN format").optional().or(z.literal('')),
  aadhaarNo: z.string().regex(/^\d{12}$/, "Aadhaar must be 12 digits").optional().or(z.literal('')),
});

const FinanceDataSchema = z.object({
  loanAmount: z.number().positive("Loan Amount must be greater than 0").finite(),
  equity: z.number().min(0, "Equity cannot be negative").finite(),
  growthRate: z.number().min(0).max(100, "Growth Rate must be between 0 and 100").finite(),
  totalProjectCost: z.number().positive().finite(),
});

const RequestSchema = z.object({
  businessInfo: BusinessInfoSchema,
  financeData: FinanceDataSchema,
  totalNetProfit: z.number().finite(),
  averageNetProfit: z.number().finite(),
}).refine(
  (data) => data.financeData.loanAmount <= data.financeData.totalProjectCost,
  {
    message: "Loan Amount cannot exceed Total Project Cost",
    path: ["financeData", "loanAmount"],
  }
);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Check authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Parse and validate request body with comprehensive validation
    const body = await req.json();
    const validated = RequestSchema.parse(body);
    const { businessInfo, financeData, totalNetProfit, averageNetProfit } = validated;
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const prompt = `Analyze this business loan application and provide a concise viability assessment:

Business: ${businessInfo.shopName}
Proprietor: ${businessInfo.proprietorName}
Proposed Business: ${businessInfo.proposedBusiness}
District: ${businessInfo.district}
Total Project Cost: ₹${financeData.totalProjectCost.toLocaleString('en-IN')}
Loan Amount: ₹${financeData.loanAmount.toLocaleString('en-IN')}
Equity: ₹${financeData.equity.toLocaleString('en-IN')}
5-Year Total Net Profit: ₹${totalNetProfit.toLocaleString('en-IN')}
Average Annual Net Profit: ₹${averageNetProfit.toLocaleString('en-IN')}

Provide:
1. A brief viability summary (2-3 sentences)
2. Risk assessment (Low/Medium/High)
3. Recommendation for loan approval
4. Key strengths and concerns`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'You are a financial analyst specializing in business loan viability assessment. Provide clear, professional analysis.' },
          { role: 'user', content: prompt }
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const analysis = data.choices[0].message.content;

    return new Response(JSON.stringify({ analysis }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify({ error: 'Invalid input data', details: error.errors }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
