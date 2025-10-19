import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Calculator, FileText, BarChart3, TrendingUp, Calendar, ArrowRight, Trash2, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { CompleteProjectData } from "@/types/AutomationTypes";
import { generateSampleProjectData } from "@/utils/sampleDataGenerator";
import { useToast } from "@/hooks/use-toast";
import { FirmHeader } from "@/components/FirmHeader";

// localStorage utility for saved projects
const SAVED_PROJECTS_KEY = 'savedLoanProjects';

interface SavedProject {
  id: string;
  name: string;
  data: CompleteProjectData;
  createdAt: string;
  updatedAt: string;
}

const getSavedProjects = (): SavedProject[] => {
  try {
    const projects = localStorage.getItem(SAVED_PROJECTS_KEY);
    return projects ? JSON.parse(projects) : [];
  } catch (error) {
    console.error('Failed to load saved projects:', error);
    return [];
  }
};

const deleteProject = (projectId: string): SavedProject[] => {
  try {
    const projects = getSavedProjects();
    const updatedProjects = projects.filter(p => p.id !== projectId);
    localStorage.setItem(SAVED_PROJECTS_KEY, JSON.stringify(updatedProjects));
    return updatedProjects;
  } catch (error) {
    console.error('Failed to delete project:', error);
    return getSavedProjects();
  }
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>([]);

  useEffect(() => {
    setSavedProjects(getSavedProjects());
  }, []);

  // Refresh list when window regains focus or localStorage changes (saves from other routes)
  useEffect(() => {
    const refresh = () => setSavedProjects(getSavedProjects());
    window.addEventListener('focus', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('focus', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  const handleDeleteProject = (projectId: string) => {
    const updatedProjects = deleteProject(projectId);
    setSavedProjects(updatedProjects);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/50 to-accent/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <FirmHeader />
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => navigate('/settings')}
              variant="outline"
              size="sm"
              className="text-sm"
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
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
            {savedProjects.length === 0 ? (
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
                      
                      // Save to localStorage for new workflow
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
                {savedProjects.slice(0, 5).map((project) => (
                  <div key={project.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{project.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(project.createdAt).toLocaleDateString()}
                        </span>
                        <span>Total Project Cost: ₹{((project.data?.financeData?.loanAmount || 0) + (project.data?.financeData?.equity || 0)).toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          try {
                            // Validate project data structure
                            if (!project.data || typeof project.data !== 'object') {
                              toast({
                                title: "Invalid Project Data",
                                description: "This project's data is corrupted or incompatible.",
                                variant: "destructive",
                              });
                              return;
                            }
                            
                            // Load project data and navigate to report view in new workflow
                            localStorage.setItem('sampleProjectLoaded', 'true');
                            localStorage.setItem('sampleProjectData', JSON.stringify(project.data));
                            navigate('/new-project');
                          } catch (error) {
                            toast({
                              title: "Error Loading Project",
                              description: "Unable to load this project. It may be corrupted.",
                              variant: "destructive",
                            });
                          }
                        }}
                      >
                        View Report
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm('Are you sure you want to delete this project?')) {
                            handleDeleteProject(project.id);
                          }
                        }}
                        className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                {savedProjects.length > 5 && (
                  <div className="text-center pt-4">
                    <Button variant="outline" onClick={() => {/* TODO: Navigate to full reports page */}}>
                      View All Projects ({savedProjects.length})
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