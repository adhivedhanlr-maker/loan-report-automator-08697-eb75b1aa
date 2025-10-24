import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';

export interface LoanProject {
  id: string;
  user_id: string;
  project_name: string;
  status: string;
  created_at: string;
  updated_at: string;
  business_info?: any;
  finance_data?: any;
  depreciation_schedule?: any;
  loan_amortization?: any;
  profit_loss?: any;
}

export const useLoanProjects = () => {
  const [projects, setProjects] = useState<LoanProject[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchProjects = async () => {
    if (!user) {
      setProjects([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('loan_projects')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error: any) {
      toast({
        title: 'Error loading projects',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (projectName: string, businessInfo: any, financeData: any) => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to create a project',
        variant: 'destructive',
      });
      return null;
    }

    try {
      // Create project
      const { data: project, error: projectError } = await supabase
        .from('loan_projects')
        .insert({
          user_id: user.id,
          project_name: projectName,
          status: 'draft',
        })
        .select()
        .single();

      if (projectError) throw projectError;

      // Create business_info
      const { error: businessError } = await supabase
        .from('business_info')
        .insert({
          project_id: project.id,
          ...businessInfo,
        });

      if (businessError) throw businessError;

      // Create finance_data
      const { error: financeError } = await supabase
        .from('finance_data')
        .insert({
          project_id: project.id,
          ...financeData,
        });

      if (financeError) throw financeError;

      toast({
        title: 'Project created',
        description: 'Your loan project has been saved successfully',
      });

      await fetchProjects();
      return project.id;
    } catch (error: any) {
      toast({
        title: 'Error creating project',
        description: error.message,
        variant: 'destructive',
      });
      return null;
    }
  };

  const updateProject = async (
    projectId: string,
    businessInfo?: any,
    financeData?: any,
    scheduleData?: any,
    amortizationData?: any,
    profitLossData?: any
  ) => {
    try {
      if (businessInfo) {
        const { error } = await supabase
          .from('business_info')
          .upsert({
            project_id: projectId,
            ...businessInfo,
          });
        if (error) throw error;
      }

      if (financeData) {
        const { error } = await supabase
          .from('finance_data')
          .upsert({
            project_id: projectId,
            ...financeData,
          });
        if (error) throw error;
      }

      if (scheduleData) {
        const { error } = await supabase
          .from('depreciation_schedules')
          .upsert({
            project_id: projectId,
            schedule_data: scheduleData,
          });
        if (error) throw error;
      }

      if (amortizationData) {
        const { error } = await supabase
          .from('loan_amortizations')
          .upsert({
            project_id: projectId,
            amortization_data: amortizationData,
          });
        if (error) throw error;
      }

      if (profitLossData) {
        const { error } = await supabase
          .from('profit_loss_statements')
          .upsert({
            project_id: projectId,
            statement_data: profitLossData,
          });
        if (error) throw error;
      }

      await fetchProjects();
      return true;
    } catch (error: any) {
      toast({
        title: 'Error updating project',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    }
  };

  const deleteProject = async (projectId: string) => {
    try {
      const { error } = await supabase
        .from('loan_projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;

      toast({
        title: 'Project deleted',
        description: 'The project has been removed successfully',
      });

      await fetchProjects();
      return true;
    } catch (error: any) {
      toast({
        title: 'Error deleting project',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    }
  };

  const getProjectDetails = async (projectId: string) => {
    try {
      const { data: project, error: projectError } = await supabase
        .from('loan_projects')
        .select('*')
        .eq('id', projectId)
        .single();

      if (projectError) throw projectError;

      const { data: businessInfo } = await supabase
        .from('business_info')
        .select('*')
        .eq('project_id', projectId)
        .maybeSingle();

      const { data: financeData } = await supabase
        .from('finance_data')
        .select('*')
        .eq('project_id', projectId)
        .maybeSingle();

      const { data: scheduleData } = await supabase
        .from('depreciation_schedules')
        .select('*')
        .eq('project_id', projectId)
        .maybeSingle();

      const { data: amortizationData } = await supabase
        .from('loan_amortizations')
        .select('*')
        .eq('project_id', projectId)
        .maybeSingle();

      const { data: profitLossData } = await supabase
        .from('profit_loss_statements')
        .select('*')
        .eq('project_id', projectId)
        .maybeSingle();

      return {
        ...project,
        business_info: businessInfo,
        finance_data: financeData,
        depreciation_schedule: scheduleData?.schedule_data,
        loan_amortization: amortizationData?.amortization_data,
        profit_loss: profitLossData?.statement_data,
      };
    } catch (error: any) {
      toast({
        title: 'Error loading project',
        description: error.message,
        variant: 'destructive',
      });
      return null;
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [user]);

  return {
    projects,
    loading,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
    getProjectDetails,
  };
};
