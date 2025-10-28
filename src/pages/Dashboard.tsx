import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Calculator, FileText, BarChart3, TrendingUp, Calendar, ArrowRight, Trash2, Settings, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { CompleteProjectData } from "@/types/AutomationTypes";
import { generateSampleProjectData } from "@/utils/sampleDataGenerator";
import { useToast } from "@/hooks/use-toast";
import { FirmHeader } from "@/components/FirmHeader";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { useLoanProjects } from "@/hooks/useLoanProjects";
import { migrateLocalStorageToDatabase } from "@/utils/localStorageMigration";
import { usePermissions } from "@/hooks/usePermissions";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";

// No longer using localStorage - all data now stored in secure database

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, role, signOut } = useAuth();
  const { hasPermission } = usePermissions();
  const { projects, loading, deleteProject: deleteProjectFromDb, fetchProjects } = useLoanProjects();
  const [migrationComplete, setMigrationComplete] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  // Migrate localStorage data to database on mount
  useEffect(() => {
    const performMigration = async () => {
      if (user && !migrationComplete) {
        const result = await migrateLocalStorageToDatabase(user.id);
        if (result.success && result.migrated > 0) {
          toast({
            title: 'Data Migration Complete',
            description: `${result.migrated} project(s) migrated to secure database storage`,
          });
          await fetchProjects();
        }
        setMigrationComplete(true);
      }
    };
    performMigration();
  }, [user, migrationComplete]);

  // Load profile for display name and avatar
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      const { data } = await supabase
        .from('profiles')
        .select('full_name, avatar_url')
        .eq('id', user.id)
        .single();

      const nameFromProfile = data?.full_name ? String(data.full_name).split(' ')[0] : undefined;
      const nameFromMeta = user.user_metadata?.full_name ? String(user.user_metadata.full_name).split(' ')[0] : undefined;
      const fallback = user.email?.split('@')[0] || 'User';

      setDisplayName(nameFromProfile || nameFromMeta || fallback);
      setAvatarUrl(data?.avatar_url || '');
    };
    loadProfile();
  }, [user]);

  const handleDeleteProject = async (projectId: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      await deleteProjectFromDb(projectId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/50 to-accent/20">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-7xl">
        {/* Mobile Header */}
        <div className="mb-6 space-y-4">
          {/* Top Bar: User + Actions */}
          <div className="flex items-center justify-between gap-2">
            <Button
              onClick={() => navigate('/settings')}
              variant="ghost"
              size="sm"
              className="h-auto py-1.5 px-2 gap-2"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={avatarUrl || ''} alt={`${displayName || 'User'} avatar`} />
                <AvatarFallback className="text-xs">{(displayName?.[0] || user?.email?.[0] || 'U').toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start gap-0.5">
                <span className="text-sm font-medium leading-none">
                  Hi, {displayName || 'User'}
                </span>
                <Badge variant={role === 'manager' ? 'default' : 'secondary'} className="text-[10px] h-4 px-1.5">
                  {role}
                </Badge>
              </div>
            </Button>

            <div className="flex items-center gap-1.5">
              <Button
                onClick={() => navigate('/settings')}
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
              >
                <Settings className="h-4 w-4" />
              </Button>
              <Button
                onClick={signOut}
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Firm Header - Centered */}
          <div className="text-center">
            <FirmHeader />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <Card className="hover:shadow-medium transition-all duration-300 cursor-pointer group" 
                onClick={() => navigate('/new-project')}>
            <CardHeader className="text-center p-3 sm:p-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary to-primary-light rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                <Plus className="h-5 w-5 sm:h-6 sm:w-6 text-primary-foreground" />
              </div>
              <CardTitle className="text-sm sm:text-base">New Project</CardTitle>
              <CardDescription className="text-xs hidden sm:block">Create a new loan application</CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-medium transition-all duration-300 cursor-pointer group" 
                onClick={() => navigate('/calculator')}>
            <CardHeader className="text-center p-3 sm:p-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-success to-success-light rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                <Calculator className="h-5 w-5 sm:h-6 sm:w-6 text-success-foreground" />
              </div>
              <CardTitle className="text-sm sm:text-base">Calculator</CardTitle>
              <CardDescription className="text-xs hidden sm:block">Financial calculations</CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-medium transition-all duration-300 cursor-pointer group" 
                onClick={() => navigate('/reports')}>
            <CardHeader className="text-center p-3 sm:p-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-warning to-amber-400 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-warning-foreground" />
              </div>
              <CardTitle className="text-sm sm:text-base">Reports</CardTitle>
              <CardDescription className="text-xs hidden sm:block">Generated reports</CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-medium transition-all duration-300 cursor-pointer group" 
                onClick={() => navigate('/analytics')}>
            <CardHeader className="text-center p-3 sm:p-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <CardTitle className="text-sm sm:text-base">Analytics</CardTitle>
              <CardDescription className="text-xs hidden sm:block">Performance metrics</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Recent Projects */}
        <Card className="shadow-soft">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
              Recent Projects
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Your latest loan application projects
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">Loading projects...</p>
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-6 sm:py-8 text-muted-foreground">
                <FileText className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 opacity-50" />
                <p className="text-base sm:text-lg mb-1 font-medium">No projects yet</p>
                <p className="text-xs sm:text-sm mb-4">Create your first loan application project to get started</p>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
                  <Button onClick={() => navigate('/new-project')} className="bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary text-primary-foreground text-sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Project
                  </Button>
                  <Button
                    onClick={() => {
                      const sampleData = generateSampleProjectData();
                      localStorage.setItem('sampleProjectLoaded', 'true');
                      localStorage.setItem('sampleProjectData', JSON.stringify(sampleData));
                      navigate("/new-project");
                    }}
                    variant="outline"
                    className="text-sm"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Load Sample Project
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {projects.slice(0, 5).map((project) => (
                  <div key={project.id} className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 sm:p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm sm:text-base text-foreground truncate">{project.project_name}</h3>
                      <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground mt-1 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(project.created_at).toLocaleDateString()}
                        </span>
                        <Badge variant={project.status === 'draft' ? 'secondary' : 'default'} className="text-[10px] sm:text-xs">
                          {project.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2 self-end sm:self-auto">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/project/${project.id}`)}
                        className="text-xs sm:text-sm flex-1 sm:flex-initial"
                      >
                        <span className="sm:hidden">View</span>
                        <span className="hidden sm:inline">View Project</span>
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                      {hasPermission('delete_projects') && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteProject(project.id);
                          }}
                          className="text-destructive hover:text-destructive-foreground hover:bg-destructive w-9 sm:w-auto p-0 sm:px-3"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                
                {projects.length > 5 && (
                  <div className="text-center pt-4">
                    <Button variant="outline" onClick={() => navigate('/reports')} className="text-sm">
                      View All Projects ({projects.length})
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;