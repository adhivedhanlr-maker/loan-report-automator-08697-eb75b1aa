import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Calculator, FileText, BarChart3, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/50 to-accent/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Loan Application System
          </h1>
          <p className="text-lg text-muted-foreground">
            Professional project reports for loan approval requests
          </p>
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

          <Card className="hover:shadow-medium transition-all duration-300 cursor-pointer group">
            <CardHeader className="text-center pb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-success to-success-light rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                <Calculator className="h-6 w-6 text-success-foreground" />
              </div>
              <CardTitle className="text-lg">Calculator</CardTitle>
              <CardDescription>Financial calculations & ratios</CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-medium transition-all duration-300 cursor-pointer group">
            <CardHeader className="text-center pb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-warning to-amber-400 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                <FileText className="h-6 w-6 text-warning-foreground" />
              </div>
              <CardTitle className="text-lg">Reports</CardTitle>
              <CardDescription>Generated project reports</CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-medium transition-all duration-300 cursor-pointer group">
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
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-lg mb-2">No projects yet</p>
              <p className="mb-4">Create your first loan application project to get started</p>
              <Button onClick={() => navigate('/new-project')} className="bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary text-primary-foreground">
                <Plus className="h-4 w-4 mr-2" />
                Create New Project
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;