import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Calculator, FileText, BarChart3, TrendingUp, Calendar, ArrowRight, Trash2, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ProjectData } from "./NewProject";

// localStorage utility for saved projects
const SAVED_PROJECTS_KEY = 'savedLoanProjects';

interface SavedProject {
  id: string;
  name: string;
  data: ProjectData;
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
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>([]);

  useEffect(() => {
    setSavedProjects(getSavedProjects());
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
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Loan Application System
            </h1>
            <p className="text-lg text-muted-foreground">
              Professional project reports for loan approval requests
            </p>
          </div>
        <div className="flex items-center space-x-4">
          <Button
            onClick={() => {
              // Load sample project and navigate to new project page
              const sampleData = {
                businessInfo: {
                  shopName: "Modern Electronics & Appliances",
                  buildingLandmark: "Near City Mall",
                  buildingNo: "A-123",
                  gstNo: "03ABCDE1234F1Z5",
                  monthlyRent: 35000,
                  village: "Model Town",
                  municipality: "Ludhiana Municipal Corporation",
                  postOffice: "Model Town",
                  taluk: "Ludhiana",
                  block: "Ludhiana-I",
                  district: "Ludhiana",
                  pinCode: "141001",
                  gender: "Male",
                  proprietorName: "Rajesh Kumar Sharma",
                  fatherName: "Ramesh Kumar Sharma",
                  houseName: "Sharma House",
                  contactNumber: "9876543210",
                  dateOfBirth: "1985-03-15",
                  panNo: "ABCDE1234F",
                  aadhaarNo: "123456789012",
                  lineOfActivity: "Electronics & Electrical Appliances Retail",
                  unitStatus: "New",
                  qualification: "B.Com",
                  experience: 8,
                  proposedBusiness: "Electronics & Electrical Appliances Retail Store",
                  loanScheme: "PMEGP (Prime Minister's Employment Generation Programme)",
                  loanYears: 7,
                  bankName: "State Bank of India",
                  bankBranch: "Model Town Branch"
                },
                projectCost: {
                  machineryItems: [
                    {
                      id: "1",
                      particulars: "Display Refrigerator for Cold Drinks",
                      rate: 35000,
                      qty: 2,
                      amount: 70000
                    },
                    {
                      id: "2", 
                      particulars: "Air Conditioner (Split AC 1.5 Ton)",
                      rate: 45000,
                      qty: 3,
                      amount: 135000
                    }
                  ],
                  workingCapitalItems: [
                    {
                      id: "1",
                      particulars: "Electronics Inventory",
                      rate: 800000,
                      qty: 1,
                      amount: 800000,
                      gstAmount: 144000
                    }
                  ],
                  totalFixedInvestment: 205000,
                  totalWorkingCapital: 944000,
                  totalProjectCost: 1149000
                },
                financialProjections: {
                  monthlyExpenses: {
                    rawMaterials: 450000,
                    salaryWages: 75000,
                    transportation: 10000,
                    electricity: 12000,
                    printingStationary: 5000,
                    telephone: 3000,
                    repairs: 8000,
                    advertisement: 15000,
                    miscellaneous: 8000,
                    interestBankCharges: 25000,
                    depreciation: 15000,
                    gstPaid: 45000,
                    cessPaid: 2000,
                    auditFee: 5000,
                    rent: 35000
                  },
                  salesProjections: {
                    printingChargesStickers: { rate: 50, qty: 1500, amount: 75000 },
                    printingChargesVinyl: { rate: 150, qty: 800, amount: 120000 },
                    designingCharges: { rate: 500, qty: 200, amount: 100000 },
                    momentos: { rate: 80, qty: 500, amount: 40000 }
                  }
                }
              };
              
              localStorage.setItem('loanApplicationProjectData', JSON.stringify(sampleData));
              localStorage.setItem('loanApplicationCurrentStep', '3');
              navigate("/new-project");
            }}
            variant="outline"
            size="sm"
            className="text-sm"
          >
            <FileText className="h-4 w-4 mr-2" />
            Load Sample Project
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
                <Button onClick={() => navigate('/new-project')} className="bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary text-primary-foreground">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Project
                </Button>
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
                        <span>Total Project Cost: ₹{project.data.projectCost?.totalProjectCost?.toLocaleString() || '0'}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          // Load project data and navigate to continue editing
                          localStorage.setItem('loanApplicationProjectData', JSON.stringify(project.data));
                          localStorage.setItem('loanApplicationCurrentStep', '4'); // Go to report generation
                          navigate('/new-project');
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