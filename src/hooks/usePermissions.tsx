import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

export type PermissionType = 
  | 'view_firm_details'
  | 'view_general_settings'
  | 'view_calculations_settings'
  | 'view_users_tab'
  | 'view_data_tab'
  | 'delete_projects';

interface UserPermissions {
  [key: string]: boolean;
}

export const usePermissions = () => {
  const { user, role } = useAuth();
  const [permissions, setPermissions] = useState<UserPermissions>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setPermissions({});
      setLoading(false);
      return;
    }

    // Managers have all permissions
    if (role === 'manager') {
      setPermissions({
        view_firm_details: true,
        view_general_settings: true,
        view_calculations_settings: true,
        view_users_tab: true,
        view_data_tab: true,
        delete_projects: true,
      });
      setLoading(false);
      return;
    }

    // Fetch user permissions from database
    const fetchPermissions = async () => {
      try {
        const { data, error } = await supabase
          .from('user_permissions')
          .select('permission')
          .eq('user_id', user.id);

        if (error) throw error;

        const perms: UserPermissions = {
          view_firm_details: false,
          view_general_settings: false,
          view_calculations_settings: false,
          view_users_tab: false,
          view_data_tab: false,
          delete_projects: false,
        };

        data?.forEach((p) => {
          perms[p.permission] = true;
        });

        setPermissions(perms);
      } catch (error) {
        console.error('Error fetching permissions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, [user, role]);

  const hasPermission = (permission: PermissionType): boolean => {
    return permissions[permission] || false;
  };

  const grantPermission = async (userId: string, permission: PermissionType) => {
    if (role !== 'manager') return false;

    try {
      const { error } = await supabase
        .from('user_permissions')
        .insert({
          user_id: userId,
          permission,
          granted_by: user?.id,
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error granting permission:', error);
      return false;
    }
  };

  const revokePermission = async (userId: string, permission: PermissionType) => {
    if (role !== 'manager') return false;

    try {
      const { error } = await supabase
        .from('user_permissions')
        .delete()
        .eq('user_id', userId)
        .eq('permission', permission);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error revoking permission:', error);
      return false;
    }
  };

  const getUserPermissions = async (userId: string): Promise<PermissionType[]> => {
    if (role !== 'manager') return [];

    try {
      const { data, error } = await supabase
        .from('user_permissions')
        .select('permission')
        .eq('user_id', userId);

      if (error) throw error;
      return data?.map((p) => p.permission as PermissionType) || [];
    } catch (error) {
      console.error('Error fetching user permissions:', error);
      return [];
    }
  };

  return {
    permissions,
    loading,
    hasPermission,
    grantPermission,
    revokePermission,
    getUserPermissions,
  };
};
