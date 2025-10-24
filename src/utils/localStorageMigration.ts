import { supabase } from '@/integrations/supabase/client';

/**
 * Migrate localStorage data to database for authenticated users
 * This preserves existing user data during the security upgrade
 */
export const migrateLocalStorageToDatabase = async (userId: string) => {
  try {
    // Check if migration has already been done
    const migrationKey = `migration_completed_${userId}`;
    if (localStorage.getItem(migrationKey)) {
      return { success: true, migrated: 0 };
    }

    const savedProjects = localStorage.getItem('savedLoanProjects');
    if (!savedProjects) {
      localStorage.setItem(migrationKey, 'true');
      return { success: true, migrated: 0 };
    }

    const projects = JSON.parse(savedProjects);
    let migratedCount = 0;

    for (const project of projects) {
      try {
        // Create project
        const { data: newProject, error: projectError } = await supabase
          .from('loan_projects')
          .insert({
            user_id: userId,
            project_name: project.projectName || 'Imported Project',
            status: 'draft',
            created_at: project.timestamp || new Date().toISOString(),
          })
          .select()
          .single();

        if (projectError) throw projectError;

        // Insert business_info if exists
        if (project.businessInfo) {
          await supabase.from('business_info').insert({
            project_id: newProject.id,
            ...project.businessInfo,
          });
        }

        // Insert finance_data if exists
        if (project.financeData) {
          await supabase.from('finance_data').insert({
            project_id: newProject.id,
            loan_amount: project.financeData.loanAmount || 0,
            equity: project.financeData.equity || 0,
            growth_rate: project.financeData.growthRate || 0,
            fixed_assets: project.financeData.fixedAssets || [],
            sales_mix: project.financeData.salesMix || [],
            materials: project.financeData.materials || [],
            fixed_opex: project.financeData.fixedOPEX || [],
          });
        }

        // Insert depreciation schedule if exists
        if (project.depreciationSchedule) {
          await supabase.from('depreciation_schedules').insert({
            project_id: newProject.id,
            schedule_data: project.depreciationSchedule,
          });
        }

        // Insert loan amortization if exists
        if (project.loanAmortization) {
          await supabase.from('loan_amortizations').insert({
            project_id: newProject.id,
            amortization_data: project.loanAmortization,
          });
        }

        // Insert profit/loss statement if exists
        if (project.profitAndLoss) {
          await supabase.from('profit_loss_statements').insert({
            project_id: newProject.id,
            statement_data: project.profitAndLoss,
          });
        }

        migratedCount++;
      } catch (error) {
        // Continue with other projects even if one fails
        continue;
      }
    }

    // Mark migration as complete and clear old data
    localStorage.setItem(migrationKey, 'true');
    localStorage.removeItem('savedLoanProjects');
    localStorage.removeItem('loanApplicationProjectData');
    localStorage.removeItem('completedProjects');

    return { success: true, migrated: migratedCount };
  } catch (error) {
    return { success: false, migrated: 0, error };
  }
};

/**
 * Clean up sensitive data from localStorage
 * Keep only non-sensitive UI preferences
 */
export const cleanupSensitiveLocalStorage = () => {
  const keysToRemove = [
    'savedLoanProjects',
    'loanApplicationProjectData',
    'sampleProjectData',
    'completedProjects',
  ];

  keysToRemove.forEach(key => {
    localStorage.removeItem(key);
  });
};
