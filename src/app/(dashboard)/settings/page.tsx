'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Shield, 
  Bell, 
  CreditCard, 
  ArrowLeft,
  Camera,
  Globe,
  Palette,
  Download,
  Trash2,
  Key,
  Mail,
  Smartphone,
  Monitor,
  Moon,
  Sun,
  Languages,
  Volume2,
  Zap,
  AlertCircle,
  CheckCircle,
  QrCode,
  Copy,
  Eye,
  EyeOff,
  Check,
  X,
  Chrome,
  Info
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { PaymentMethodsSimple } from '@/components/settings/payment-methods-simple';
// import { useTheme } from 'next-themes';

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const { toast } = useToast();
  const router = useRouter();
  // const { theme, setTheme } = useTheme();
  const [theme, setTheme] = useState('dark'); // Temporary state
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  
  // Profile State
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    bio: '',
    website: '',
    location: '',
    language: 'en',
  });
  
  // Preferences State
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    videoComplete: true,
    lowCredits: true,
    marketingEmails: false,
    soundEffects: true,
    autoplay: false,
    quality: 'high',
    downloadFormat: 'mp4',
  });
  
  // Security State
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [sessions, setSessions] = useState([]);
  
  // Modal States
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // 2FA Setup State
  const [qrCode, setQrCode] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [verificationToken, setVerificationToken] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [show2FASuccess, setShow2FASuccess] = useState(false);
  
  // Password Change State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  
  // Delete Account State
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  
  // Notifications state
  const [notifications, setNotifications] = useState({
    generationFailed: true,
    subscriptionUpdates: true,
  });
  
  const handleNotificationUpdate = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };
  
  useEffect(() => {
    if (session?.user) {
      setProfileData(prev => ({
        ...prev,
        name: session.user.name || '',
        email: session.user.email || '',
      }));
    }
  }, [session]);
  
  // Calculate password strength
  useEffect(() => {
    const pass = passwordData.newPassword;
    let strength = 0;
    
    if (pass.length >= 8) strength += 20;
    if (pass.length >= 12) strength += 20;
    if (/[a-z]/.test(pass)) strength += 20;
    if (/[A-Z]/.test(pass)) strength += 20;
    if (/[0-9]/.test(pass)) strength += 10;
    if (/[^A-Za-z0-9]/.test(pass)) strength += 10;
    
    setPasswordStrength(strength);
  }, [passwordData.newPassword]);
  
  // Password requirements check
  const getPasswordRequirements = () => {
    const pass = passwordData.newPassword;
    return {
      length: pass.length >= 8,
      uppercase: /[A-Z]/.test(pass),
      lowercase: /[a-z]/.test(pass),
      number: /[0-9]/.test(pass),
      special: /[^A-Za-z0-9]/.test(pass)
    };
  };
  
  // Mock function to get sessions with device detection
  const getSessionsWithDeviceInfo = () => {
    return [
      {
        id: '1',
        device: 'Windows PC',
        browser: 'Chrome',
        location: 'San Francisco, CA',
        lastActive: 'Current session',
        isActive: true,
        icon: Monitor
      },
      {
        id: '2',
        device: 'iPhone 14 Pro',
        browser: 'Safari',
        location: 'New York, NY',
        lastActive: '2 hours ago',
        isActive: false,
        icon: Smartphone
      }
    ];
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // API call would go here
      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // 2FA Handlers
  const handle2FAToggle = async (enabled: boolean) => {
    if (enabled) {
      // Generate QR code and secret
      setQrCode('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='); // Mock QR code
      setSecretKey('JBSWY3DPEHPK3PXP');
      setShow2FAModal(true);
    } else {
      // Disable 2FA
      setTwoFactorEnabled(false);
      toast({
        title: 'Two-Factor Authentication Disabled',
        description: 'Your account is now less secure',
      });
    }
  };
  
  const handleVerify2FA = async () => {
    setIsLoading(true);
    try {
      // Verify token API call would go here
      if (verificationToken === '123456') { // Mock verification
        // Generate backup codes
        const codes = Array(8).fill(0).map(() => 
          Math.random().toString(36).substring(2, 10).toUpperCase()
        );
        setBackupCodes(codes);
        setShow2FASuccess(true);
        setTwoFactorEnabled(true);
      } else {
        throw new Error('Invalid token');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Invalid verification token',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Password Change Handler
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match',
        variant: 'destructive',
      });
      return;
    }
    
    const requirements = getPasswordRequirements();
    if (!Object.values(requirements).every(Boolean)) {
      toast({
        title: 'Error',
        description: 'Password does not meet all requirements',
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);
    try {
      // API call would go here
      toast({
        title: 'Success',
        description: 'Password changed successfully',
      });
      setShowPasswordModal(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to change password',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Delete Account Handler
  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'DELETE') {
      toast({
        title: 'Error',
        description: 'Please type DELETE to confirm',
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);
    try {
      // API call would go here
      toast({
        title: 'Account Deletion Scheduled',
        description: 'Your account will be deleted in 7 days. You can cancel this anytime.',
      });
      setShowDeleteModal(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete account',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied',
      description: 'Copied to clipboard',
    });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Simple Header */}
      <header className="border-b border-zinc-800">
        <div className="container mx-auto px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#A259FF] rounded-lg flex items-center justify-center">
              <span className="text-white text-lg">◆</span>
            </div>
            <span className="font-bold text-xl">Kylo</span>
          </Link>
          
          <Button
            variant="ghost"
            onClick={() => router.push('/studio/video')}
            className="text-zinc-400 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Studio
          </Button>
        </div>
      </header>

      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-zinc-400">Manage your account settings and preferences</p>
          </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-5 w-full bg-zinc-900 border border-zinc-800">
          <TabsTrigger value="profile" className="data-[state=active]:bg-zinc-800">
            <User className="w-4 h-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="preferences" className="data-[state=active]:bg-zinc-800">
            <Palette className="w-4 h-4 mr-2" />
            Preferences
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-zinc-800">
            <Shield className="w-4 h-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-zinc-800">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="billing" className="data-[state=active]:bg-zinc-800">
            <CreditCard className="w-4 h-4 mr-2" />
            Billing
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your profile details and public information</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                {/* Avatar Section */}
                <div className="flex items-center gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={session?.user?.image || ''} />
                    <AvatarFallback className="bg-[#A259FF] text-2xl">
                      {profileData.name?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <Button type="button" variant="outline" className="border-zinc-700">
                      <Camera className="w-4 h-4 mr-2" />
                      Change Avatar
                    </Button>
                    <p className="text-xs text-zinc-500">JPG, PNG or GIF. Max 2MB.</p>
                  </div>
                </div>
                
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Display Name</Label>
                    <Input 
                      id="name" 
                      value={profileData.name}
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      className="bg-zinc-800 border-zinc-700"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={profileData.email}
                      disabled
                      className="bg-zinc-800 border-zinc-700 opacity-50"
                    />
                  </div>
                </div>
                
                {/* Additional Info */}
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                    className="bg-zinc-800 border-zinc-700 min-h-[100px]"
                    placeholder="Tell us about yourself..."
                    maxLength={200}
                  />
                  <p className="text-xs text-zinc-500">{profileData.bio.length}/200 characters</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                      <Input 
                        id="website" 
                        value={profileData.website}
                        onChange={(e) => setProfileData({...profileData, website: e.target.value})}
                        className="bg-zinc-800 border-zinc-700 pl-10"
                        placeholder="https://example.com"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input 
                      id="location" 
                      value={profileData.location}
                      onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                      className="bg-zinc-800 border-zinc-700"
                      placeholder="San Francisco, CA"
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4">
                  <Button type="submit" disabled={isLoading} className="bg-[#A259FF] hover:bg-[#9148e0]">
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    className="text-red-500 hover:text-red-400 hover:bg-red-950/20"
                    onClick={() => setShowDeleteModal(true)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Account
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-4">
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader>
              <CardTitle>App Preferences</CardTitle>
              <CardDescription>Customize your Kylo experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Theme */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium flex items-center gap-2">
                      {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                      Appearance
                    </p>
                    <p className="text-sm text-zinc-500">Choose your preferred theme</p>
                  </div>
                  <Select value={theme} onValueChange={setTheme}>
                    <SelectTrigger className="w-32 bg-zinc-800 border-zinc-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Language */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium flex items-center gap-2">
                      <Languages className="w-4 h-4" />
                      Language
                    </p>
                    <p className="text-sm text-zinc-500">Select your preferred language</p>
                  </div>
                  <Select value={profileData.language} onValueChange={(v) => setProfileData({...profileData, language: v})}>
                    <SelectTrigger className="w-32 bg-zinc-800 border-zinc-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="pt">Português</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                      <SelectItem value="ja">日本語</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Sound Effects */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium flex items-center gap-2">
                      <Volume2 className="w-4 h-4" />
                      Sound Effects
                    </p>
                    <p className="text-sm text-zinc-500">Play sounds for actions and notifications</p>
                  </div>
                  <Switch 
                    checked={preferences.soundEffects}
                    onCheckedChange={(v) => setPreferences({...preferences, soundEffects: v})}
                  />
                </div>
                
                {/* Video Quality */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium flex items-center gap-2">
                      <Monitor className="w-4 h-4" />
                      Default Video Quality
                    </p>
                    <p className="text-sm text-zinc-500">Choose default quality for generated videos</p>
                  </div>
                  <Select value={preferences.quality} onValueChange={(v) => setPreferences({...preferences, quality: v})}>
                    <SelectTrigger className="w-32 bg-zinc-800 border-zinc-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low (720p)</SelectItem>
                      <SelectItem value="medium">Medium (1080p)</SelectItem>
                      <SelectItem value="high">High (4K)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Download Format */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      Download Format
                    </p>
                    <p className="text-sm text-zinc-500">Preferred format for downloads</p>
                  </div>
                  <Select value={preferences.downloadFormat} onValueChange={(v) => setPreferences({...preferences, downloadFormat: v})}>
                    <SelectTrigger className="w-32 bg-zinc-800 border-zinc-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mp4">MP4</SelectItem>
                      <SelectItem value="mov">MOV</SelectItem>
                      <SelectItem value="avi">AVI</SelectItem>
                      <SelectItem value="webm">WebM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Autoplay */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Autoplay Videos
                    </p>
                    <p className="text-sm text-zinc-500">Automatically play videos when ready</p>
                  </div>
                  <Switch 
                    checked={preferences.autoplay}
                    onCheckedChange={(v) => setPreferences({...preferences, autoplay: v})}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-4">
          {/* Password & Authentication */}
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader>
              <CardTitle>Password & Authentication</CardTitle>
              <CardDescription>Manage your security settings and authentication methods</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg">
                  <div>
                    <p className="font-medium flex items-center gap-2">
                      <Key className="w-4 h-4" />
                      Password
                    </p>
                    <p className="text-sm text-zinc-500">Last changed 3 months ago</p>
                  </div>
                  <Button 
                    variant="outline" 
                    className="border-zinc-700 hover:bg-zinc-800"
                    onClick={() => setShowPasswordModal(true)}
                  >
                    Change Password
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg">
                  <div>
                    <p className="font-medium flex items-center gap-2">
                      <Smartphone className="w-4 h-4" />
                      Two-Factor Authentication
                    </p>
                    <p className="text-sm text-zinc-500">
                      {twoFactorEnabled ? 'Enabled - Using authenticator app' : 'Add an extra layer of security'}
                    </p>
                  </div>
                  <Switch 
                    checked={twoFactorEnabled}
                    onCheckedChange={handle2FAToggle}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Active Sessions */}
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader>
              <CardTitle>Active Sessions</CardTitle>
              <CardDescription>Manage devices where you're signed in</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {getSessionsWithDeviceInfo().map((session) => {
                  const Icon = session.icon;
                  return (
                    <div key={session.id} className="flex items-center justify-between p-3 bg-zinc-800/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5 text-zinc-400" />
                        <div>
                          <p className="font-medium">{session.device} - {session.browser}</p>
                          <p className="text-sm text-zinc-500">
                            {session.lastActive} • {session.location}
                          </p>
                        </div>
                      </div>
                      {session.isActive ? (
                        <Badge className="bg-green-600/20 text-green-400 border-green-600/30">Active</Badge>
                      ) : (
                        <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-400">
                          Revoke
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
              
              <Button variant="outline" className="w-full mt-4 border-red-900 text-red-500 hover:bg-red-950/20">
                Sign Out All Other Sessions
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>Control which emails you receive from Kylo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                {/* Activity Notifications */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Activity
                  </h3>
                  <div className="space-y-3 pl-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Generation Complete</p>
                        <p className="text-sm text-zinc-500">When your video, image or audio is ready</p>
                      </div>
                      <Switch 
                        checked={preferences.videoComplete}
                        onCheckedChange={(v) => setPreferences({...preferences, videoComplete: v})}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Generation Failed</p>
                        <p className="text-sm text-zinc-500">If something goes wrong with your generation</p>
                      </div>
                      <Switch 
                        checked={notifications.generationFailed}
                        onCheckedChange={(v) => handleNotificationUpdate('generationFailed', v)}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Account Notifications */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Account
                  </h3>
                  <div className="space-y-3 pl-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Low Credits Warning</p>
                        <p className="text-sm text-zinc-500">When credits drop below 20%</p>
                      </div>
                      <Switch 
                        checked={preferences.lowCredits}
                        onCheckedChange={(v) => setPreferences({...preferences, lowCredits: v})}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Subscription Updates</p>
                        <p className="text-sm text-zinc-500">Changes to your plan or billing</p>
                      </div>
                      <Switch 
                        checked={notifications.generationFailed}
                        onCheckedChange={(v) => handleNotificationUpdate('generationFailed', v)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Security Alerts</p>
                        <p className="text-sm text-zinc-500">Unusual login attempts or security issues</p>
                      </div>
                      <Switch defaultChecked disabled />
                    </div>
                  </div>
                </div>
                
                {/* Marketing */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Marketing
                  </h3>
                  <div className="space-y-3 pl-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Product Updates</p>
                        <p className="text-sm text-zinc-500">New features and improvements</p>
                      </div>
                      <Switch 
                        checked={preferences.marketingEmails}
                        onCheckedChange={(v) => setPreferences({...preferences, marketingEmails: v})}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Tips & Tutorials</p>
                        <p className="text-sm text-zinc-500">Get the most out of Kylo</p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Push Notifications (Future) */}
          <Card className="border-zinc-800 bg-zinc-900/50 opacity-60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Push Notifications
                <Badge variant="outline" className="border-zinc-700">Coming Soon</Badge>
              </CardTitle>
              <CardDescription>Get instant updates on your device</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-zinc-500">
                <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Push notifications will be available soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-4">
          {/* Current Plan */}
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader>
              <CardTitle>Current Plan</CardTitle>
              <CardDescription>Your subscription details and usage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-6 bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 rounded-xl border border-zinc-700">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-sm text-zinc-400 mb-1">Active Plan</p>
                      <p className="text-3xl font-bold">Free</p>
                    </div>
                    <Badge className="bg-green-600/20 text-green-400 border-green-600/30">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Active
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-zinc-500">Credits Included</p>
                      <p className="font-medium">300 / month</p>
                    </div>
                    <div>
                      <p className="text-zinc-500">Credits Used</p>
                      <p className="font-medium">0 this month</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-zinc-700">
                    <div className="flex items-center gap-2 text-sm text-zinc-400">
                      <AlertCircle className="w-4 h-4" />
                      <p>Renews on {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
                
                <Button className="w-full bg-[#A259FF] hover:bg-[#9148e0]" onClick={() => router.push('/membership')}>
                  Upgrade to Pro
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Payment Methods */}
          <PaymentMethodsSimple />
          
          {/* Billing History */}
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
              <CardDescription>Download invoices and receipts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-zinc-500">
                <p>No billing history available</p>
                <p className="text-sm mt-2">Your invoices will appear here after your first payment</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* 2FA Setup Modal */}
      <Dialog open={show2FAModal} onOpenChange={setShow2FAModal}>
        <DialogContent className="sm:max-w-[500px] bg-zinc-900 border-zinc-800">
          <DialogHeader>
            <DialogTitle>Set Up Two-Factor Authentication</DialogTitle>
            <DialogDescription>
              {!show2FASuccess ? 
                'Scan the QR code with your authenticator app or enter the key manually' : 
                'Save your backup codes in a safe place'
              }
            </DialogDescription>
          </DialogHeader>
          
          {!show2FASuccess ? (
            <div className="space-y-6">
              {/* QR Code */}
              <div className="flex justify-center">
                <div className="p-4 bg-white rounded-lg">
                  <QrCode className="w-48 h-48 text-black" />
                </div>
              </div>
              
              {/* Manual Entry Key */}
              <div className="space-y-2">
                <Label>Manual Entry Key</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    value={secretKey} 
                    readOnly 
                    className="bg-zinc-800 border-zinc-700 font-mono"
                  />
                  <Button 
                    size="icon" 
                    variant="ghost"
                    onClick={() => copyToClipboard(secretKey)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Verification Token */}
              <div className="space-y-2">
                <Label htmlFor="token">Enter Verification Code</Label>
                <Input
                  id="token"
                  value={verificationToken}
                  onChange={(e) => setVerificationToken(e.target.value)}
                  placeholder="000000"
                  className="bg-zinc-800 border-zinc-700 text-center text-lg font-mono"
                  maxLength={6}
                />
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setShow2FAModal(false)} className="border-zinc-700">
                  Cancel
                </Button>
                <Button 
                  onClick={handleVerify2FA} 
                  disabled={isLoading || verificationToken.length !== 6}
                  className="bg-[#A259FF] hover:bg-[#9148e0]"
                >
                  {isLoading ? 'Verifying...' : 'Verify and Enable'}
                </Button>
              </DialogFooter>
            </div>
          ) : (
            <div className="space-y-6">
              <Alert className="border-green-600/30 bg-green-600/10">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertTitle>Two-Factor Authentication Enabled!</AlertTitle>
                <AlertDescription>
                  Your account is now protected with 2FA. Save these backup codes in a safe place.
                </AlertDescription>
              </Alert>
              
              <div className="space-y-2">
                <Label>Backup Codes</Label>
                <div className="grid grid-cols-2 gap-2">
                  {backupCodes.map((code, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-zinc-800 rounded font-mono text-sm">
                      <span>{code}</span>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-6 w-6"
                        onClick={() => copyToClipboard(code)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-zinc-500 mt-2">
                  Each code can only be used once. Store them securely.
                </p>
              </div>
              
              <DialogFooter>
                <Button 
                  onClick={() => {
                    setShow2FAModal(false);
                    setShow2FASuccess(false);
                    setVerificationToken('');
                  }}
                  className="bg-[#A259FF] hover:bg-[#9148e0]"
                >
                  Done
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Password Change Modal */}
      <Dialog open={showPasswordModal} onOpenChange={setShowPasswordModal}>
        <DialogContent className="sm:max-w-[500px] bg-zinc-900 border-zinc-800">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Enter your current password and choose a new one
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handlePasswordChange} className="space-y-4">
            {/* Current Password */}
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <div className="relative">
                <Input
                  id="current-password"
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  className="bg-zinc-800 border-zinc-700 pr-10"
                  required
                />
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            
            {/* New Password */}
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showNewPassword ? 'text' : 'password'}
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  className="bg-zinc-800 border-zinc-700 pr-10"
                  required
                />
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              
              {/* Password Strength Indicator */}
              {passwordData.newPassword && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-500">Password Strength</span>
                    <span className={`font-medium ${
                      passwordStrength < 40 ? 'text-red-500' : 
                      passwordStrength < 70 ? 'text-yellow-500' : 
                      'text-green-500'
                    }`}>
                      {passwordStrength < 40 ? 'Weak' : 
                       passwordStrength < 70 ? 'Medium' : 
                       'Strong'}
                    </span>
                  </div>
                  <Progress 
                    value={passwordStrength} 
                    className={`h-2 ${
                      passwordStrength < 40 ? '[&>div]:bg-red-500' : 
                      passwordStrength < 70 ? '[&>div]:bg-yellow-500' : 
                      '[&>div]:bg-green-500'
                    }`}
                  />
                </div>
              )}
              
              {/* Password Requirements */}
              <div className="space-y-1 text-sm">
                {(() => {
                  const reqs = getPasswordRequirements();
                  return (
                    <>
                      <div className={`flex items-center gap-2 ${reqs.length ? 'text-green-500' : 'text-zinc-500'}`}>
                        {reqs.length ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                        At least 8 characters
                      </div>
                      <div className={`flex items-center gap-2 ${reqs.uppercase ? 'text-green-500' : 'text-zinc-500'}`}>
                        {reqs.uppercase ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                        One uppercase letter
                      </div>
                      <div className={`flex items-center gap-2 ${reqs.lowercase ? 'text-green-500' : 'text-zinc-500'}`}>
                        {reqs.lowercase ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                        One lowercase letter
                      </div>
                      <div className={`flex items-center gap-2 ${reqs.number ? 'text-green-500' : 'text-zinc-500'}`}>
                        {reqs.number ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                        One number
                      </div>
                      <div className={`flex items-center gap-2 ${reqs.special ? 'text-green-500' : 'text-zinc-500'}`}>
                        {reqs.special ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                        One special character
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
            
            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                className="bg-zinc-800 border-zinc-700"
                required
              />
              {passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword && (
                <p className="text-sm text-red-500">Passwords do not match</p>
              )}
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowPasswordModal(false)} 
                className="border-zinc-700"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading || !Object.values(getPasswordRequirements()).every(Boolean)}
                className="bg-[#A259FF] hover:bg-[#9148e0]"
              >
                {isLoading ? 'Changing...' : 'Change Password'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Account Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="sm:max-w-[500px] bg-zinc-900 border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-red-500">Delete Account</DialogTitle>
            <DialogDescription>
              This action cannot be undone. Your account will be permanently deleted after a 7-day grace period.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <Alert className="border-red-900/30 bg-red-950/20">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <AlertTitle>Warning</AlertTitle>
              <AlertDescription className="text-zinc-300">
                All your data including videos, credits, and subscription will be permanently deleted.
                You will have 7 days to cancel this request by logging back in.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              <Label htmlFor="delete-confirmation">
                Type <span className="font-mono font-bold">DELETE</span> to confirm
              </Label>
              <Input
                id="delete-confirmation"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                placeholder="Type DELETE"
                className="bg-zinc-800 border-zinc-700"
              />
            </div>
            
            <div className="space-y-2 text-sm text-zinc-400">
              <p className="font-medium">What happens when you delete your account:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>All your generated videos will be permanently deleted</li>
                <li>Your subscription will be cancelled immediately</li>
                <li>Remaining credits will be forfeited</li>
                <li>Your email will be removed from all mailing lists</li>
                <li>This action cannot be reversed after 7 days</li>
              </ul>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setShowDeleteModal(false);
                setDeleteConfirmation('');
              }} 
              className="border-zinc-700"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleDeleteAccount}
              disabled={isLoading || deleteConfirmation !== 'DELETE'}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isLoading ? 'Processing...' : 'Delete Account'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
        </div>
      </div>
    </div>
  );
}