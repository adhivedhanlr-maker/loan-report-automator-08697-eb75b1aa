import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BarChart3, TrendingUp, DollarSign, FileText, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ProjectData } from "@/types/LegacyTypes";

interface SavedProject {
  id: string;
  name: string;
  data: ProjectData;
  createdAt: string;
  updatedAt: string;
}

const AnalyticsPage = () => {
  const navigate = useNavigate();
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>([]);

  useEffect(() => {
    try {
      const projects = localStorage.getItem('savedLoanProjects');
      setSavedProjects(projects ? JSON.parse(projects) : []);
    } catch (error) {
      console.error('Failed to load projects:', error);
    }
  }, []);

  // Calculate analytics
  const totalProjects = savedProjects.length;
  const totalProjectValue = savedProjects.reduce((sum, project) => 
    sum + (project.data.projectCost?.totalProjectCost || 0), 0
  );
  
  const avgProjectValue = totalProjects > 0 ? totalProjectValue / totalProjects : 0;
  
  const businessTypes = savedProjects.reduce((acc, project) => {
    const business = project.data.businessInfo?.proposedBusiness || 'Unknown';
    acc[business] = (acc[business] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const projectsByMonth = savedProjects.reduce((acc, project) => {
    const month = new Date(project.createdAt).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short' 
    });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const recentActivity = savedProjects
    .slice(0, 5)
    .map(project => ({
      name: project.name,
      date: new Date(project.createdAt).toLocaleDateString(),
      value: project.data.projectCost?.totalProjectCost || 0
    }));

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
              Analytics Dashboard
            </h1>
            <p className="text-muted-foreground">
              Insights and statistics from your loan applications
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProjects}</div>
              <p className="text-xs text-muted-foreground">
                Projects created to date
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{Math.round(totalProjectValue).toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Combined project costs
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Value</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{Math.round(avgProjectValue).toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Per project average
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {projectsByMonth[new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short' })] || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Projects created
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Business Types
              </CardTitle>
              <CardDescription>Distribution of business categories</CardDescription>
            </CardHeader>
            <CardContent>
              {Object.keys(businessTypes).length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No data available
                </div>
              ) : (
                <div className="space-y-3">
                  {Object.entries(businessTypes)
                    .sort(([,a], [,b]) => b - a)
                    .map(([business, count]) => (
                      <div key={business} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{business}</span>
                        <div className="flex items-center gap-2">
                          <div className="h-2 bg-muted rounded-full flex-1 w-20">
                            <div 
                              className="h-2 bg-primary rounded-full" 
                              style={{ width: `${(count / totalProjects) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground w-8 text-right">{count}</span>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>Latest project submissions</CardDescription>
            </CardHeader>
            <CardContent>
              {recentActivity.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No recent activity
                </div>
              ) : (
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{activity.name}</p>
                        <p className="text-xs text-muted-foreground">{activity.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-sm">₹{activity.value.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Monthly Trends
              </CardTitle>
              <CardDescription>Projects created by month</CardDescription>
            </CardHeader>
            <CardContent>
              {Object.keys(projectsByMonth).length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No data available
                </div>
              ) : (
                <div className="space-y-3">
                  {Object.entries(projectsByMonth)
                    .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
                    .map(([month, count]) => (
                      <div key={month} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{month}</span>
                        <div className="flex items-center gap-2">
                          <div className="h-2 bg-muted rounded-full flex-1 w-20">
                            <div 
                              className="h-2 bg-success rounded-full" 
                              style={{ width: `${(count / Math.max(...Object.values(projectsByMonth))) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground w-8 text-right">{count}</span>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Highest Project Value:</span>
                  <span className="font-medium">
                    ₹{savedProjects.length > 0 ? 
                      Math.max(...savedProjects.map(p => p.data.projectCost?.totalProjectCost || 0)).toLocaleString() : 
                      '0'
                    }
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Lowest Project Value:</span>
                  <span className="font-medium">
                    ₹{savedProjects.length > 0 ? 
                      Math.min(...savedProjects.map(p => p.data.projectCost?.totalProjectCost || 0)).toLocaleString() : 
                      '0'
                    }
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Most Common Business:</span>
                  <span className="font-medium">
                    {Object.keys(businessTypes).length > 0 ? 
                      Object.entries(businessTypes).sort(([,a], [,b]) => b - a)[0][0] : 
                      'N/A'
                    }
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;