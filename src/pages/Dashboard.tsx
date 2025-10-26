import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Calculator, FileText, BarChart3, TrendingUp, Calendar, ArrowRight, Trash2, Settings, LogOut, User } from "lucide-react";
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

// No longer using localStorage - all data now stored in secure database

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, role, signOut } = useAuth();
  const { hasPermission } = usePermissions();
  const { projects, loading, deleteProject: deleteProjectFromDb, fetchProjects } = useLoanProjects();
  const [migrationComplete, setMigrationComplete] = useState(false);

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

  const handleDeleteProject = async (projectId: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      await deleteProjectFromDb(projectId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/50 to-accent/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 relative">
          {/* User controls - positioned absolutely on larger screens */}
          <div className="flex flex-wrap items-center justify-end gap-2 mb-4 lg:absolute lg:right-0 lg:top-0 lg:mb-0">
            <Button
              onClick={() => navigate('/settings')}
              variant="ghost"
              size="sm"
              className="h-8 md:h-9 gap-2"
            >
              <User className="h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden sm:inline truncate max-w-[120px] md:max-w-none">
                {user?.user_metadata?.username || user?.email?.split('@')[0] || 'User'}
              </span>
              <Badge variant={role === 'manager' ? 'default' : 'secondary'} className="text-xs">
                {role}
              </Badge>
            </Button>
            <Button
              onClick={() => navigate('/settings')}
              variant="outline"
              size="sm"
              className="h-8 md:h-9"
            >
              <Settings className="h-3 w-3 md:h-4 md:w-4 md:mr-2" />
              <span className="hidden md:inline">Settings</span>
            </Button>
            <Button
              onClick={signOut}
              variant="outline"
              size="sm"
              className="h-8 md:h-9"
            >
              <LogOut className="h-3 w-3 md:h-4 md:w-4 md:mr-2" />
              <span className="hidden md:inline">Logout</span>
            </Button>
          </div>
          
          {/* Centered Firm Header */}
          <div className="flex justify-center">
            <FirmHeader />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-medium transition-all duration-300 cursor-pointer group" 
                onClick={() => navigate('/new-project')}>
            <CardHeader className="text-center pb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-light rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                <Plus className="h-6 w-6 text-primary-foreground" />
              </div>
              <CardTitle className="text-lg">New Project</CardTitle>
              <CardDescription>Create a new loan application</CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-medium transition-all duration-300 cursor-pointer group" 
                onClick={() => navigate('/calculator')}>
            <CardHeader className="text-center pb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-success to-success-light rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                <Calculator className="h-6 w-6 text-success-foreground" />
              </div>
              <CardTitle className="text-lg">Calculator</CardTitle>
              <CardDescription>Financial calculations & ratios</CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-medium transition-all duration-300 cursor-pointer group" 
                onClick={() => navigate('/reports')}>
            <CardHeader className="text-center pb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-warning to-amber-400 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                <FileText className="h-6 w-6 text-warning-foreground" />
              </div>
              <CardTitle className="text-lg">Reports</CardTitle>
              <CardDescription>Generated project reports</CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-medium transition-all duration-300 cursor-pointer group" 
                onClick={() => navigate('/analytics')}>
            <CardHeader className="text-center pb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-lg">Analytics</CardTitle>
              <CardDescription>Project performance metrics</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Recent Projects */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Recent Projects
            </CardTitle>
            <CardDescription>
              Your latest loan application projects
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Loading projects...</p>
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-lg mb-2">No projects yet</p>
                <p className="mb-4">Create your first loan application project to get started</p>
                <div className="flex gap-3 justify-center">
                  <Button onClick={() => navigate('/new-project')} className="bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary text-primary-foreground">
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
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Load Sample Project
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {projects.slice(0, 5).map((project) => (
                  <div key={project.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{project.project_name}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(project.created_at).toLocaleDateString()}
                        </span>
                        <Badge variant={project.status === 'draft' ? 'secondary' : 'default'}>
                          {project.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/project/${project.id}`)}
                      >
                        View Project
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
                          className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                
                {projects.length > 5 && (
                  <div className="text-center pt-4">
                    <Button variant="outline" onClick={() => navigate('/reports')}>
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