-- Create loan_projects table
CREATE TABLE public.loan_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create business_info table
CREATE TABLE public.business_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.loan_projects(id) ON DELETE CASCADE,
  shop_name TEXT NOT NULL,
  building_landmark TEXT,
  building_no TEXT,
  gst_no TEXT,
  monthly_rent DECIMAL(12,2) DEFAULT 0,
  village TEXT,
  municipality TEXT,
  post_office TEXT,
  taluk TEXT,
  block TEXT,
  district TEXT NOT NULL,
  pin_code TEXT NOT NULL,
  gender TEXT,
  proprietor_name TEXT NOT NULL,
  father_name TEXT,
  house_name TEXT,
  contact_number TEXT NOT NULL,
  date_of_birth TEXT,
  pan_no TEXT,
  aadhaar_no TEXT,
  line_of_activity TEXT,
  unit_status TEXT,
  qualification TEXT,
  experience INTEGER DEFAULT 0,
  proposed_business TEXT NOT NULL,
  loan_scheme TEXT,
  loan_years INTEGER DEFAULT 5,
  bank_name TEXT,
  bank_branch TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(project_id)
);

-- Create finance_data table
CREATE TABLE public.finance_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.loan_projects(id) ON DELETE CASCADE,
  loan_amount DECIMAL(12,2) NOT NULL,
  equity DECIMAL(12,2) NOT NULL DEFAULT 0,
  growth_rate DECIMAL(5,2) NOT NULL DEFAULT 0,
  fixed_assets JSONB NOT NULL DEFAULT '[]'::jsonb,
  sales_mix JSONB NOT NULL DEFAULT '[]'::jsonb,
  materials JSONB NOT NULL DEFAULT '[]'::jsonb,
  fixed_opex JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(project_id)
);

-- Create depreciation_schedule table
CREATE TABLE public.depreciation_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.loan_projects(id) ON DELETE CASCADE,
  schedule_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(project_id)
);

-- Create loan_amortization table
CREATE TABLE public.loan_amortizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.loan_projects(id) ON DELETE CASCADE,
  amortization_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(project_id)
);

-- Create profit_loss table
CREATE TABLE public.profit_loss_statements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.loan_projects(id) ON DELETE CASCADE,
  statement_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(project_id)
);

-- Enable RLS on all tables
ALTER TABLE public.loan_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.finance_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.depreciation_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loan_amortizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profit_loss_statements ENABLE ROW LEVEL SECURITY;

-- RLS Policies for loan_projects
CREATE POLICY "Users can view their own projects"
ON public.loan_projects
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own projects"
ON public.loan_projects
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects"
ON public.loan_projects
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects"
ON public.loan_projects
FOR DELETE
USING (auth.uid() = user_id);

CREATE POLICY "Managers can view all projects"
ON public.loan_projects
FOR SELECT
USING (has_role(auth.uid(), 'manager'::app_role));

-- RLS Policies for business_info
CREATE POLICY "Users can view their own business info"
ON public.business_info
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.loan_projects
  WHERE id = business_info.project_id
  AND user_id = auth.uid()
));

CREATE POLICY "Users can insert their own business info"
ON public.business_info
FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM public.loan_projects
  WHERE id = business_info.project_id
  AND user_id = auth.uid()
));

CREATE POLICY "Users can update their own business info"
ON public.business_info
FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM public.loan_projects
  WHERE id = business_info.project_id
  AND user_id = auth.uid()
));

CREATE POLICY "Managers can view all business info"
ON public.business_info
FOR SELECT
USING (has_role(auth.uid(), 'manager'::app_role));

-- RLS Policies for finance_data
CREATE POLICY "Users can view their own finance data"
ON public.finance_data
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.loan_projects
  WHERE id = finance_data.project_id
  AND user_id = auth.uid()
));

CREATE POLICY "Users can insert their own finance data"
ON public.finance_data
FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM public.loan_projects
  WHERE id = finance_data.project_id
  AND user_id = auth.uid()
));

CREATE POLICY "Users can update their own finance data"
ON public.finance_data
FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM public.loan_projects
  WHERE id = finance_data.project_id
  AND user_id = auth.uid()
));

CREATE POLICY "Managers can view all finance data"
ON public.finance_data
FOR SELECT
USING (has_role(auth.uid(), 'manager'::app_role));

-- RLS Policies for depreciation_schedules
CREATE POLICY "Users can view their own schedules"
ON public.depreciation_schedules
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.loan_projects
  WHERE id = depreciation_schedules.project_id
  AND user_id = auth.uid()
));

CREATE POLICY "Users can insert their own schedules"
ON public.depreciation_schedules
FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM public.loan_projects
  WHERE id = depreciation_schedules.project_id
  AND user_id = auth.uid()
));

CREATE POLICY "Users can update their own schedules"
ON public.depreciation_schedules
FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM public.loan_projects
  WHERE id = depreciation_schedules.project_id
  AND user_id = auth.uid()
));

CREATE POLICY "Managers can view all schedules"
ON public.depreciation_schedules
FOR SELECT
USING (has_role(auth.uid(), 'manager'::app_role));

-- RLS Policies for loan_amortizations
CREATE POLICY "Users can view their own amortizations"
ON public.loan_amortizations
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.loan_projects
  WHERE id = loan_amortizations.project_id
  AND user_id = auth.uid()
));

CREATE POLICY "Users can insert their own amortizations"
ON public.loan_amortizations
FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM public.loan_projects
  WHERE id = loan_amortizations.project_id
  AND user_id = auth.uid()
));

CREATE POLICY "Users can update their own amortizations"
ON public.loan_amortizations
FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM public.loan_projects
  WHERE id = loan_amortizations.project_id
  AND user_id = auth.uid()
));

CREATE POLICY "Managers can view all amortizations"
ON public.loan_amortizations
FOR SELECT
USING (has_role(auth.uid(), 'manager'::app_role));

-- RLS Policies for profit_loss_statements
CREATE POLICY "Users can view their own statements"
ON public.profit_loss_statements
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.loan_projects
  WHERE id = profit_loss_statements.project_id
  AND user_id = auth.uid()
));

CREATE POLICY "Users can insert their own statements"
ON public.profit_loss_statements
FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM public.loan_projects
  WHERE id = profit_loss_statements.project_id
  AND user_id = auth.uid()
));

CREATE POLICY "Users can update their own statements"
ON public.profit_loss_statements
FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM public.loan_projects
  WHERE id = profit_loss_statements.project_id
  AND user_id = auth.uid()
));

CREATE POLICY "Managers can view all statements"
ON public.profit_loss_statements
FOR SELECT
USING (has_role(auth.uid(), 'manager'::app_role));

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_loan_project_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Add trigger for updated_at
CREATE TRIGGER update_loan_projects_updated_at
BEFORE UPDATE ON public.loan_projects
FOR EACH ROW
EXECUTE FUNCTION public.update_loan_project_updated_at();

-- Create indexes for better performance
CREATE INDEX idx_loan_projects_user_id ON public.loan_projects(user_id);
CREATE INDEX idx_business_info_project_id ON public.business_info(project_id);
CREATE INDEX idx_finance_data_project_id ON public.finance_data(project_id);
CREATE INDEX idx_depreciation_schedules_project_id ON public.depreciation_schedules(project_id);
CREATE INDEX idx_loan_amortizations_project_id ON public.loan_amortizations(project_id);
CREATE INDEX idx_profit_loss_statements_project_id ON public.profit_loss_statements(project_id);