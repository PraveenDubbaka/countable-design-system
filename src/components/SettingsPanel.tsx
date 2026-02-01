import { useState } from "react";
import { ArrowLeft, X, User, FileText, Zap, Bell, Users, Shield, Download } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface SettingsPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const settingsNavItems = [
  { id: "my-account", label: "My Account", icon: User },
  { id: "letterhead", label: "Letterhead & Signature", icon: FileText },
  { id: "luka", label: "Luka", icon: Zap },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "user-access", label: "User & Access", icon: Users },
  { id: "privacy", label: "Privacy & Security", icon: Shield },
  { id: "export", label: "Export Data", icon: Download },
];

export function SettingsPanel({ open, onOpenChange }: SettingsPanelProps) {
  const [activeSection, setActiveSection] = useState("my-account");

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="right" 
        className="!w-[900px] !max-w-[900px] p-0 flex gap-0 [&>button]:hidden sm:rounded-l-2xl"
      >
        {/* Left Navigation */}
        <div className="w-64 border-r border-border bg-muted/30 flex flex-col">
          <div className="p-4 flex items-center gap-3 border-b border-border">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => onOpenChange(false)}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <span className="font-semibold text-lg">Settings</span>
          </div>
          
          <nav className="flex-1 p-2">
            {settingsNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-left",
                  activeSection === item.id
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h2 className="text-xl font-semibold text-primary">
              {settingsNavItems.find(item => item.id === activeSection)?.label}
            </h2>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1 overflow-auto p-6">
            {activeSection === "my-account" && <MyAccountContent />}
            {activeSection === "letterhead" && <PlaceholderContent title="Letterhead & Signature" />}
            {activeSection === "luka" && <PlaceholderContent title="Luka Settings" />}
            {activeSection === "notifications" && <PlaceholderContent title="Notifications" />}
            {activeSection === "user-access" && <PlaceholderContent title="User & Access" />}
            {activeSection === "privacy" && <PlaceholderContent title="Privacy & Security" />}
            {activeSection === "export" && <PlaceholderContent title="Export Data" />}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function MyAccountContent() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="h-10 bg-card border border-border rounded-lg p-1">
          <TabsTrigger value="profile" className="px-4 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-md data-[state=active]:border data-[state=active]:border-border font-medium">Profile</TabsTrigger>
          <TabsTrigger value="firm-info" className="px-4 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-md data-[state=active]:border data-[state=active]:border-border font-medium">Firm Info</TabsTrigger>
          <TabsTrigger value="timezone" className="px-4 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-md data-[state=active]:border data-[state=active]:border-border font-medium">Time Zone</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6 space-y-8">
          {/* Profile Picture Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-primary">Profile Picture</h3>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl font-semibold">
                JD
              </div>
              <Button variant="default" size="sm">Remove Image</Button>
              <Button variant="outline" size="sm">Change Color</Button>
            </div>
          </div>

          {/* Personal Information Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-primary">Personal Information</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="memberId">Member ID</Label>
                <Input id="memberId" defaultValue="2541" className="max-w-md" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name<span className="text-destructive">*</span></Label>
                  <Input id="firstName" defaultValue="John" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name<span className="text-destructive">*</span></Label>
                  <Input id="lastName" defaultValue="Doe" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email<span className="text-destructive">*</span></Label>
                  <Input id="email" type="email" defaultValue="johndoe@email.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Title<span className="text-destructive">*</span></Label>
                  <Input id="title" defaultValue="Manager" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="businessPhone">Business Phone</Label>
                  <Input id="businessPhone" defaultValue="(555) 123-4567" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cellPhone">Cell Phone</Label>
                  <Input id="cellPhone" defaultValue="(555) 987-6543" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hourlyRate">Hourly Rate</Label>
                  <Input id="hourlyRate" defaultValue="75" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="licenseNumber">License Number</Label>
                  <Input id="licenseNumber" />
                </div>
              </div>
            </div>
          </div>

          <Button className="mt-6">Save Changes</Button>
        </TabsContent>

        <TabsContent value="firm-info" className="mt-6">
          <PlaceholderContent title="Firm Information" />
        </TabsContent>

        <TabsContent value="timezone" className="mt-6">
          <PlaceholderContent title="Time Zone Settings" />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function PlaceholderContent({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-center h-64 text-muted-foreground">
      <p>{title} content coming soon...</p>
    </div>
  );
}
