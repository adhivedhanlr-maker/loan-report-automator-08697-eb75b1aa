-- Create permissions enum
CREATE TYPE public.permission_type AS ENUM (
  'view_firm_details',
  'view_general_settings',
  'view_calculations_settings',
  'view_users_tab',
  'view_data_tab',
  'delete_projects'
);

-- Create user_permissions table
CREATE TABLE public.user_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  permission permission_type NOT NULL,
  granted_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, permission)
);

-- Enable RLS
ALTER TABLE public.user_permissions ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check permissions
CREATE OR REPLACE FUNCTION public.has_permission(_user_id UUID, _permission permission_type)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  -- Managers have all permissions by default
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = 'manager'
  ) OR EXISTS (
    SELECT 1 FROM public.user_permissions WHERE user_id = _user_id AND permission = _permission
  )
$$;

-- RLS Policies for user_permissions
CREATE POLICY "Users can view their own permissions"
ON public.user_permissions
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Managers can view all permissions"
ON public.user_permissions
FOR SELECT
USING (has_role(auth.uid(), 'manager'));

CREATE POLICY "Managers can insert permissions"
ON public.user_permissions
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'manager'));

CREATE POLICY "Managers can update permissions"
ON public.user_permissions
FOR UPDATE
USING (has_role(auth.uid(), 'manager'));

CREATE POLICY "Managers can delete permissions"
ON public.user_permissions
FOR DELETE
USING (has_role(auth.uid(), 'manager'));