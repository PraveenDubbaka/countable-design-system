import { useState } from "react";
import { ArrowLeft, X, User, FileText, Zap, Bell, Users, Shield, Download, ChevronDown, ChevronUp, Sparkles, CheckSquare, Database, CircleHelp, MessageSquare, FileOutput, RotateCcw, Check, Info } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
              className="h-9 w-9"
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
              className="h-9 w-9"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1 overflow-auto p-6">
            {activeSection === "my-account" && <MyAccountContent />}
            {activeSection === "letterhead" && <PlaceholderContent title="Letterhead & Signature" />}
            {activeSection === "luka" && <LukaContent />}
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

function LukaContent() {
  const [showAutomatesPanel, setShowAutomatesPanel] = useState(true);
  const [openSections, setOpenSections] = useState<string[]>(["autopilot-scope"]);
  const [autopilotScope, setAutopilotScope] = useState("recommended");

  const toggleSection = (id: string) => {
    setOpenSections(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const expandAll = () => {
    setOpenSections(lukaSettingsSections.map(s => s.id));
  };

  const collapseAll = () => {
    setOpenSections([]);
  };

  const lukaSettingsSections = [
    { id: "autopilot-scope", label: "Autopilot Scope", icon: Zap, badge: null },
    { id: "checklist-coverage", label: "Checklist Coverage", icon: CheckSquare, badge: "4 of 4 selected" },
    { id: "source-data-trust", label: "Source & Data Trust", icon: Database, badge: null },
    { id: "confidence-threshold", label: "Confidence Threshold", icon: CircleHelp, badge: null },
    { id: "client-interaction", label: "Client Interaction Controls", icon: MessageSquare, badge: "All off" },
    { id: "output-review", label: "Output & Review Preferences", icon: FileOutput, badge: null },
    { id: "notifications", label: "Notifications", icon: Bell, badge: null },
  ];

  const autopilotOptions = [
    {
      id: "recommended",
      label: "Recommended",
      isDefault: true,
      features: [
        { text: "Auto-fill checklists", included: true },
        { text: "Draft responses & explanations", included: true },
        { text: "No client communication", included: false },
      ],
    },
    {
      id: "assisted",
      label: "Assisted Mode",
      isDefault: false,
      features: [
        { text: "Auto-fill where confident", included: true },
        { text: "Pause for review on low confidence", included: true },
      ],
    },
    {
      id: "manual",
      label: "Manual Review First",
      isDefault: false,
      features: [
        { text: "Preview only", included: true },
        { text: "No auto-save", included: false },
      ],
    },
  ];

  return (
    <div className="flex flex-col h-full">
      <Tabs defaultValue="automation" className="w-full flex-1 flex flex-col">
        <TabsList className="h-11 bg-[#f0f1f3] dark:bg-muted rounded-full p-1 gap-1 w-fit">
          <TabsTrigger value="automation" className="rounded-full px-5 text-muted-foreground data-[state=active]:bg-white dark:data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm gap-2">
            <Zap className="h-4 w-4" />
            Automation
          </TabsTrigger>
          <TabsTrigger value="feedback" className="rounded-full px-5 text-muted-foreground data-[state=active]:bg-white dark:data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">Feedback</TabsTrigger>
          <TabsTrigger value="terms" className="rounded-full px-5 text-muted-foreground data-[state=active]:bg-white dark:data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">Terms of use</TabsTrigger>
          <TabsTrigger value="privacy" className="rounded-full px-5 text-muted-foreground data-[state=active]:bg-white dark:data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">Privacy policy</TabsTrigger>
        </TabsList>

        <TabsContent value="automation" className="mt-6 flex-1 flex flex-col">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Luka Autopilot Settings</h3>
                <p className="text-sm text-muted-foreground">Defaults are optimized. Change only if needed.</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <button 
                onClick={expandAll}
                className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ChevronDown className="h-4 w-4" />
                Expand All
              </button>
              <button 
                onClick={collapseAll}
                className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ChevronUp className="h-4 w-4" />
                Collapse All
              </button>
            </div>
          </div>

          {/* Show Automates Panel Toggle */}
          <div className="p-4 border border-border rounded-xl mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Show "How Luka Automates" Panel</p>
                <p className="text-sm text-muted-foreground">Display the automation visualization panel on your dashboard</p>
              </div>
            </div>
            <Switch checked={showAutomatesPanel} onCheckedChange={setShowAutomatesPanel} />
          </div>

          {/* Collapsible Sections */}
          <div className="space-y-3 flex-1">
            {lukaSettingsSections.map((section) => (
              <Collapsible 
                key={section.id}
                open={openSections.includes(section.id)}
                onOpenChange={() => toggleSection(section.id)}
              >
                <CollapsibleTrigger className="w-full">
                  <div className={cn(
                    "p-4 border flex items-center justify-between transition-colors hover:bg-muted/50",
                    openSections.includes(section.id) 
                      ? "border-border rounded-t-xl border-b-0" 
                      : "border-border rounded-xl"
                  )}>
                    <div className="flex items-center gap-3">
                      <section.icon className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">{section.label}</span>
                      {section.badge && (
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                          {section.badge}
                        </span>
                      )}
                    </div>
                    <ChevronDown className={cn(
                      "h-5 w-5 text-muted-foreground transition-transform",
                      openSections.includes(section.id) && "rotate-180"
                    )} />
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="p-4 border border-border rounded-b-xl">
                    {section.id === "autopilot-scope" ? (
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                          Define how far Luka can proceed without stopping for your input.
                        </p>
                        
                        <RadioGroup value={autopilotScope} onValueChange={setAutopilotScope} className="space-y-3">
                          {autopilotOptions.map((option) => (
                            <label
                              key={option.id}
                              htmlFor={option.id}
                              className={cn(
                                "flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors",
                                autopilotScope === option.id
                                  ? "border-primary bg-primary/5"
                                  : "border-border hover:border-muted-foreground/30"
                              )}
                            >
                              <RadioGroupItem value={option.id} id={option.id} className="mt-1" />
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="font-medium">{option.label}</span>
                                  {option.isDefault && (
                                    <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full font-medium">
                                      Default
                                    </span>
                                  )}
                                </div>
                                <div className="space-y-1">
                                  {option.features.map((feature, idx) => (
                                    <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                                      {feature.included ? (
                                        <Check className="h-4 w-4 text-muted-foreground" />
                                      ) : (
                                        <X className="h-4 w-4 text-muted-foreground" />
                                      )}
                                      <span>{feature.text}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </label>
                          ))}
                        </RadioGroup>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
                          <Info className="h-4 w-4" />
                          <span>You can change this anytime.</span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">{section.label} settings content coming soon...</p>
                    )}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="feedback" className="mt-6">
          <PlaceholderContent title="Feedback" />
        </TabsContent>

        <TabsContent value="terms" className="mt-6">
          <PlaceholderContent title="Terms of Use" />
        </TabsContent>

        <TabsContent value="privacy" className="mt-6">
          <PlaceholderContent title="Privacy Policy" />
        </TabsContent>
      </Tabs>

      {/* Footer */}
      <div className="border-t border-border pt-4 mt-6 flex items-center justify-between">
        <Button variant="outline" className="gap-2">
          <RotateCcw className="h-4 w-4" />
          Reset to Defaults
        </Button>
        <Button className="gap-2 bg-gradient-to-r from-[#1C63A6] to-[#7A31D8] hover:from-[#1a5a96] hover:to-[#6a2bc2]">
          <Zap className="h-4 w-4" />
          Review Settings
        </Button>
      </div>
    </div>
  );
}

function MyAccountContent() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="h-11 bg-[#f0f1f3] dark:bg-muted rounded-full p-1 gap-1">
          <TabsTrigger value="profile" className="rounded-full px-5 text-muted-foreground data-[state=active]:bg-white dark:data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">Profile</TabsTrigger>
          <TabsTrigger value="firm-info" className="rounded-full px-5 text-muted-foreground data-[state=active]:bg-white dark:data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">Firm Info</TabsTrigger>
          <TabsTrigger value="timezone" className="rounded-full px-5 text-muted-foreground data-[state=active]:bg-white dark:data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">Time Zone</TabsTrigger>
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
