import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, FileText, Search, Calendar, Eye, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLoanProjects } from "@/hooks/useLoanProjects";
import { useToast } from "@/hooks/use-toast";

const ReportsPage = () => {
  const navigate = useNavigate();
  const { projects, loading, deleteProject, getProjectDetails } = useLoanProjects();
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const handleDeleteProject = async (projectId: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      const success = await deleteProject(projectId);
      if (success) {
        toast({
          title: "Project Deleted",
          description: "The project has been successfully deleted.",
        });
      } else {
        toast({
          title: "Delete Failed",
          description: "There was an error deleting the project.",
          variant: "destructive",
        });
      }
    }
  };

  const handleViewReport = async (projectId: string) => {
    const projectData = await getProjectDetails(projectId);
    if (projectData) {
      localStorage.setItem('viewingProjectId', projectId);
      localStorage.setItem('viewingProjectData', JSON.stringify(projectData));
      navigate('/new-project');
    } else {
      toast({
        title: "Error Loading Project",
        description: "Could not load project details.",
        variant: "destructive",
      });
    }
  };

  const filteredProjects = projects.filter(project =>
    project.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.business_info?.proprietor_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.business_info?.proposed_business?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/50 to-accent/20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Project Reports
            </h1>
            <p className="text-muted-foreground">
              Manage and view all your loan application reports
            </p>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="Search by project name, proprietor name, or business type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </CardContent>
        </Card>

        {loading ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">Loading projects...</p>
            </CardContent>
          </Card>
        ) : filteredProjects.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-xl font-semibold mb-2">
                {searchTerm ? 'No matching reports found' : 'No reports available'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm 
                  ? 'Try adjusting your search terms'
                  : 'Create your first loan application project to see reports here'
                }
              </p>
              {!searchTerm && (
                <Button onClick={() => navigate('/new-project')}>
                  Create New Project
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredProjects.map((project) => {
              const totalCost = (project.finance_data?.loan_amount || 0) + (project.finance_data?.equity || 0);
              return (
                <Card key={project.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{project.project_name}</CardTitle>
                        <CardDescription>
                          <div className="space-y-1 mt-2">
                            <div><span className="font-medium">Proprietor:</span> {project.business_info?.proprietor_name || 'N/A'}</div>
                            <div><span className="font-medium">Business:</span> {project.business_info?.proposed_business || 'N/A'}</div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Created: {new Date(project.created_at).toLocaleDateString()}
                            </div>
                          </div>
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewReport(project.id)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteProject(project.id)}
                          className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Cost:</span>
                        <span className="font-medium">
                          ₹{totalCost.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Location:</span>
                        <span className="font-medium">
                          {project.business_info?.village ? 
                            `${project.business_info.village}, ${project.business_info.district}` : 
                            'N/A'
                          }
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Experience:</span>
                        <span className="font-medium">
                          {project.business_info?.experience ? 
                            `${project.business_info.experience} years` : 
                            'N/A'
                          }
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;