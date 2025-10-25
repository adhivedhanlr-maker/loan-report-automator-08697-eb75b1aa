import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/components/ThemeProvider";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
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
  Settings as SettingsIcon,
  User as UserIcon,
  Camera
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
import { ImageCropModal } from "@/components/ImageCropModal";

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
  const { theme, setTheme } = useTheme();
  const { user, role } = useAuth();
  
  // User management state
  const [users, setUsers] = useState<any[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  
  // Profile state
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [tempAvatarSrc, setTempAvatarSrc] = useState('');
  const [showAvatarCrop, setShowAvatarCrop] = useState(false);
  const [tempLogoSrc, setTempLogoSrc] = useState('');
  const [showLogoCrop, setShowLogoCrop] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  
  // Load profile data
  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username, full_name, avatar_url')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if (data) {
        setUsername(data.username || '');
        setFullName(data.full_name || '');
        setAvatarUrl(data.avatar_url || '');
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setProfileLoading(false);
    }
  };

  const loadUsers = async () => {
    if (role !== 'manager') return;
    
    setUsersLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          email,
          username,
          full_name,
          created_at,
          user_roles (role)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setUsersLoading(false);
    }
  };

  const updateProfile = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username: username || null,
          full_name: fullName || null,
          avatar_url: avatarUrl || null,
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        setTempAvatarSrc(reader.result as string);
        setShowAvatarCrop(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarCropComplete = (croppedImage: string) => {
    setAvatarUrl(croppedImage);
    setTempAvatarSrc('');
  };
  
  
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
        setTempLogoSrc(reader.result as string);
        setShowLogoCrop(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoCropComplete = (croppedImage: string) => {
    setAccountSettings(prev => ({
      ...prev,
      logoUrl: croppedImage
    }));
    setTempLogoSrc('');
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
            {/* Profile Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserIcon className="h-5 w-5" />
                  Profile
                </CardTitle>
                <CardDescription>
                  Manage your personal account information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {profileLoading ? (
                  <div className="text-center py-4">Loading profile...</div>
                ) : (
                  <>
                    {/* Avatar */}
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <div className="h-24 w-24 rounded-full overflow-hidden border-2 border-primary/20 bg-muted flex items-center justify-center">
                          {avatarUrl ? (
                            <img 
                              src={avatarUrl} 
                              alt="Profile Avatar" 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <UserIcon className="h-12 w-12 text-muted-foreground" />
                          )}
                        </div>
                        <label 
                          htmlFor="avatar-upload"
                          className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors"
                        >
                          <Camera className="h-4 w-4" />
                          <input
                            id="avatar-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarUpload}
                            className="hidden"
                          />
                        </label>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">Profile Picture</h3>
                        <p className="text-sm text-muted-foreground">
                          Click the camera icon to upload a new avatar (Max 2MB)
                        </p>
                      </div>
                    </div>

                    {/* Username */}
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="johndoe"
                      />
                      <p className="text-xs text-muted-foreground">
                        3-30 characters, letters, numbers, underscore, or hyphen
                      </p>
                    </div>

                    {/* Full Name */}
                    <div className="space-y-2">
                      <Label htmlFor="full-name">Full Name</Label>
                      <Input
                        id="full-name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="John Doe"
                      />
                    </div>

                    {/* Email (read-only) */}
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        value={user?.email || ''}
                        disabled
                        className="bg-muted"
                      />
                      <p className="text-xs text-muted-foreground">
                        Email cannot be changed
                      </p>
                    </div>

                    <Button onClick={updateProfile} className="w-full">
                      Save Profile
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Firm Details Section */}
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
                      <div className="w-24 h-24 border rounded-full overflow-hidden bg-muted flex items-center justify-center">
                        <img 
                          src={accountSettings.logoUrl} 
                          alt="Firm Logo" 
                          className="w-full h-full object-cover"
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
                        Upload your firm logo (Max 2MB, will be cropped to circle)
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
                  Save Firm Settings
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
                          setTheme(themeOption as "light" | "dark" | "system");
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
                  {role === 'manager' 
                    ? 'View and manage all users in the system'
                    : 'View your account role and permissions'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Current User Info */}
                <div className="mb-6 p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold mb-2">Your Account</h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-muted-foreground">Email:</span> {user?.email}</p>
                    <p><span className="text-muted-foreground">Username:</span> {username || 'Not set'}</p>
                    <p><span className="text-muted-foreground">Role:</span> <span className="capitalize font-medium">{role}</span></p>
                  </div>
                </div>

                {role === 'manager' ? (
                  <>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-semibold">All Users</h3>
                      <Button onClick={loadUsers} variant="outline" size="sm">
                        Refresh
                      </Button>
                    </div>
                    
                    {usersLoading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Loading users...</p>
                      </div>
                    ) : users.length > 0 ? (
                      <div className="space-y-2">
                        {users.map((u) => (
                          <div key={u.id} className="p-3 border rounded-lg">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium">{u.username || u.email}</p>
                                <p className="text-sm text-muted-foreground">{u.email}</p>
                                {u.full_name && (
                                  <p className="text-sm text-muted-foreground">{u.full_name}</p>
                                )}
                              </div>
                              <div className="text-right">
                                <span className="inline-block px-2 py-1 text-xs font-medium rounded bg-primary/10 text-primary capitalize">
                                  {u.user_roles?.[0]?.role || 'user'}
                                </span>
                                <p className="text-xs text-muted-foreground mt-1">
                                  Joined {new Date(u.created_at).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Users className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground">Click Refresh to load users</p>
                      </div>
                    )}
                  </>
                ) : (
                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      You have <span className="font-semibold capitalize">{role}</span> permissions. 
                      Contact a manager to modify user roles or access advanced user management features.
                    </AlertDescription>
                  </Alert>
                )}
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

        {/* Crop Modals */}
        <ImageCropModal
          open={showAvatarCrop}
          onClose={() => {
            setShowAvatarCrop(false);
            setTempAvatarSrc('');
          }}
          imageSrc={tempAvatarSrc}
          onCropComplete={handleAvatarCropComplete}
          aspectRatio={1}
          title="Crop Profile Picture"
        />

        <ImageCropModal
          open={showLogoCrop}
          onClose={() => {
            setShowLogoCrop(false);
            setTempLogoSrc('');
          }}
          imageSrc={tempLogoSrc}
          onCropComplete={handleLogoCropComplete}
          aspectRatio={1}
          title="Crop Firm Logo"
        />
      </div>
    </div>
  );
};

export default Settings;