import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StyledCard } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const Field = ({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-2">
    <label className="text-sm font-medium text-foreground">
      {label}
      {required && <span className="text-destructive ml-0.5">*</span>}
    </label>
    {children}
  </div>
);

export default function AddNewClient() {
  const navigate = useNavigate();
  const [gstRegistered, setGstRegistered] = useState<string>("");

  const handleAdd = () => {
    toast.success("Client added");
    navigate("/clients");
  };

  return (
    <Layout title="Add New Client" hideSidebar>
      <div className="flex flex-col h-full overflow-hidden bg-background">
        <div className="flex items-center justify-between px-6 pt-6 pb-4 flex-shrink-0">
          <button
            onClick={() => navigate("/clients")}
            className="flex items-center gap-2 text-link font-medium text-sm hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Add New Client
          </button>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="h-9 px-4 text-sm"
              onClick={() => navigate("/clients")}
            >
              Cancel
            </Button>
            <Button
              className="h-9 px-4 text-sm bg-primary hover:bg-primary/90 text-white"
              onClick={handleAdd}
            >
              Add
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-auto px-6 pb-6">
          <StyledCard className="p-6">
            <h2 className="text-base font-semibold text-foreground mb-6">Basic Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-5">
              <Field label="Client ID (Only AlphaNumeric)">
                <Input placeholder="Client ID (Only AlphaNumeric!)" />
              </Field>
              <Field label="Entity Name" required>
                <Input placeholder="Entity Name" />
              </Field>
              <Field label="Entity Type" required>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Entity Type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="corporation">Corporation</SelectItem>
                    <SelectItem value="partnership">Partnership</SelectItem>
                    <SelectItem value="sole-proprietor">Sole Proprietor</SelectItem>
                    <SelectItem value="trust">Trust</SelectItem>
                    <SelectItem value="non-profit">Non-Profit</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Group Name">
                <Input placeholder="Group Name" />
              </Field>
              <Field label="First Name" required>
                <Input placeholder="First Name" />
              </Field>
              <Field label="Last Name" required>
                <Input placeholder="Last Name" />
              </Field>
              <Field label="Email" required>
                <Input type="email" placeholder="Email" />
              </Field>
              <Field label="Engagement Partner" required>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Engagement Partner" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cpt">Cpt Group</SelectItem>
                    <SelectItem value="monte">Monte Heilig</SelectItem>
                    <SelectItem value="jangaiah">Jangaiah Arige</SelectItem>
                    <SelectItem value="jude">Jude Law</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Business Phone">
                <Input placeholder="Business Phone" />
              </Field>
              <Field label="Cell Phone">
                <Input placeholder="Cell Phone" />
              </Field>
              <Field label="Address">
                <Input placeholder="Address" />
              </Field>
              <Field label="City">
                <Input placeholder="City" />
              </Field>
              <Field label="Province/State">
                <Select>
                  <SelectTrigger><SelectValue placeholder="Province / State" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="on">Ontario</SelectItem>
                    <SelectItem value="qc">Quebec</SelectItem>
                    <SelectItem value="bc">British Columbia</SelectItem>
                    <SelectItem value="ab">Alberta</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Country">
                <Select>
                  <SelectTrigger><SelectValue placeholder="Country" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ca">Canada</SelectItem>
                    <SelectItem value="us">United States</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Postal/Zip Code">
                <Input placeholder="Postal/Zip Code" />
              </Field>
              <Field label="Business Number">
                <Input placeholder="Business Number" />
              </Field>
              <Field label="GST/HST Registered">
                <Select value={gstRegistered} onValueChange={setGstRegistered}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              {gstRegistered === "yes" && (
                <Field label="HST Number">
                  <Input placeholder="HST Number" />
                </Field>
              )}
              <Field label="Tax ID">
                <Input placeholder="Tax ID" />
              </Field>
              <Field label="Payroll Number">
                <Input placeholder="Payroll Number" />
              </Field>
              <Field label="Corporate Tax Number">
                <Input placeholder="Corporate Tax Number" />
              </Field>
            </div>
          </StyledCard>
        </div>
      </div>
    </Layout>
  );
}
