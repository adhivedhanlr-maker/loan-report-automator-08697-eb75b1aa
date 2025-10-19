import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Users, 
  Shield, 
  Palette, 
  Calculator, 
  Bell, 
  Download,
  Upload,
  Trash2,
  Settings as SettingsIcon
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

interface CalculationSettings {
  defaultMargin: number;
  defaultTaxRate: number;
  currency: string;
  includeTaxInCalculations: boolean;
}

interface AccountSettings {
  firmName: string;
  logoUrl: string;
}

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Load settings from localStorage
  const [calculationSettings, setCalculationSettings] = useState<CalculationSettings>(() => {
    const saved = localStorage.getItem('calculationSettings');
    return saved ? JSON.parse(saved) : {
      defaultMargin: 20,
      defaultTaxRate: 18,
      currency: 'INR',
      includeTaxInCalculations: true
    };
  });

  const [accountSettings, setAccountSettings] = useState<AccountSettings>(() => {
    const saved = localStorage.getItem('accountSettings');
    return saved ? JSON.parse(saved) : {
      firmName: '',
      logoUrl: ''
    };
  });

  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'system');
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: false,
    projectReminders: true
  });

  const saveCalculationSettings = () => {
    localStorage.setItem('calculationSettings', JSON.stringify(calculationSettings));
    toast({
      title: "Settings Saved",
      description: "Calculation settings have been updated successfully.",
    });
  };

  const saveAccountSettings = () => {
    localStorage.setItem('accountSettings', JSON.stringify(accountSettings));
    toast({
      title: "Account Settings Saved",
      description: "Your firm details have been updated successfully.",
    });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please upload an image smaller than 2MB.",
          variant: "destructive"
        });
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setAccountSettings(prev => ({
          ...prev,
          logoUrl: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const exportData = () => {
    const projects = JSON.parse(localStorage.getItem('completedProjects') || '[]');
    const settings = {
      calculationSettings,
      theme,
      notifications
    };
    
    const data = { projects, settings };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `business-report-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Data Exported",
      description: "Your data has been exported successfully.",
    });
  };

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      localStorage.removeItem('completedProjects');
      localStorage.removeItem('calculationSettings');
      localStorage.removeItem('theme');
      
      toast({
        title: "Data Cleared",
        description: "All local data has been cleared.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <SettingsIcon className="h-8 w-8" />
              Settings
            </h1>
            <p className="text-muted-foreground">Manage your application preferences and settings</p>
          </div>
        </div>

        <Tabs defaultValue="account" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="calculations">Calculations</TabsTrigger>
            <TabsTrigger value="theme">Theme</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="data">Data</TabsTrigger>
          </TabsList>

          {/* Account Settings */}
          <TabsContent value="account" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Firm Details
                </CardTitle>
                <CardDescription>
                  Configure your organization's branding and information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="firm-name">Firm / Organization Name</Label>
                  <Input
                    id="firm-name"
                    value={accountSettings.firmName}
                    onChange={(e) =>
                      setAccountSettings(prev => ({
                        ...prev,
                        firmName: e.target.value
                      }))
                    }
                    placeholder="Enter your firm name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="logo-upload">Firm Logo</Label>
                  <div className="flex items-center gap-4">
                    {accountSettings.logoUrl && (
                      <div className="w-24 h-24 border rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                        <img 
                          src={accountSettings.logoUrl} 
                          alt="Firm Logo" 
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <Input
                        id="logo-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="cursor-pointer"
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        Upload your firm logo (Max 2MB, PNG, JPG, or SVG)
                      </p>
                    </div>
                  </div>
                  {accountSettings.logoUrl && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setAccountSettings(prev => ({ ...prev, logoUrl: '' }))}
                    >
                      Remove Logo
                    </Button>
                  )}
                </div>

                <Button onClick={saveAccountSettings} className="w-full">
                  Save Account Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notifications
                </CardTitle>
                <CardDescription>
                  Configure your notification preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <Switch
                    id="email-notifications"
                    checked={notifications.emailNotifications}
                    onCheckedChange={(checked) =>
                      setNotifications(prev => ({ ...prev, emailNotifications: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="push-notifications">Push Notifications</Label>
                  <Switch
                    id="push-notifications"
                    checked={notifications.pushNotifications}
                    onCheckedChange={(checked) =>
                      setNotifications(prev => ({ ...prev, pushNotifications: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="project-reminders">Project Reminders</Label>
                  <Switch
                    id="project-reminders"
                    checked={notifications.projectReminders}
                    onCheckedChange={(checked) =>
                      setNotifications(prev => ({ ...prev, projectReminders: checked }))
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Calculation Settings */}
          <TabsContent value="calculations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Default Calculation Values
                </CardTitle>
                <CardDescription>
                  Set default values for financial calculations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="default-margin">Default Margin (%)</Label>
                    <Input
                      id="default-margin"
                      type="number"
                      value={calculationSettings.defaultMargin}
                      onChange={(e) =>
                        setCalculationSettings(prev => ({
                          ...prev,
                          defaultMargin: Number(e.target.value)
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="default-tax">Default Tax Rate (%)</Label>
                    <Input
                      id="default-tax"
                      type="number"
                      value={calculationSettings.defaultTaxRate}
                      onChange={(e) =>
                        setCalculationSettings(prev => ({
                          ...prev,
                          defaultTaxRate: Number(e.target.value)
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Input
                      id="currency"
                      value={calculationSettings.currency}
                      onChange={(e) =>
                        setCalculationSettings(prev => ({
                          ...prev,
                          currency: e.target.value
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="include-tax">Include Tax in Calculations by Default</Label>
                  <Switch
                    id="include-tax"
                    checked={calculationSettings.includeTaxInCalculations}
                    onCheckedChange={(checked) =>
                      setCalculationSettings(prev => ({
                        ...prev,
                        includeTaxInCalculations: checked
                      }))
                    }
                  />
                </div>
                <Button onClick={saveCalculationSettings} className="w-full">
                  Save Calculation Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Theme Settings */}
          <TabsContent value="theme" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Appearance
                </CardTitle>
                <CardDescription>
                  Customize the look and feel of your application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {['light', 'dark', 'system'].map((themeOption) => (
                      <Button
                        key={themeOption}
                        variant={theme === themeOption ? "default" : "outline"}
                        onClick={() => {
                          setTheme(themeOption);
                          localStorage.setItem('theme', themeOption);
                          // Apply theme change logic here
                          toast({
                            title: "Theme Updated",
                            description: `Theme changed to ${themeOption}`,
                          });
                        }}
                        className="capitalize"
                      >
                        {themeOption}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* User Management */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  User Management
                </CardTitle>
                <CardDescription>
                  Manage users and authentication settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    User management and authentication features require a backend connection. 
                    Connect to Supabase to enable user registration, login, and role management.
                  </AlertDescription>
                </Alert>
                <div className="mt-4 space-y-2 opacity-50">
                  <Button disabled className="w-full">Add New User</Button>
                  <Button disabled variant="outline" className="w-full">Manage Roles</Button>
                  <Button disabled variant="outline" className="w-full">Authentication Settings</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data Management */}
          <TabsContent value="data" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Data Management
                </CardTitle>
                <CardDescription>
                  Backup, restore, and manage your application data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <Button onClick={exportData} className="w-full flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Export All Data
                  </Button>
                  
                  <Button variant="outline" className="w-full flex items-center gap-2" disabled>
                    <Upload className="h-4 w-4" />
                    Import Data
                  </Button>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <Label className="text-destructive">Danger Zone</Label>
                    <Button 
                      variant="destructive" 
                      onClick={clearAllData}
                      className="w-full flex items-center gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Clear All Data
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      This will permanently delete all your projects and settings from local storage.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;