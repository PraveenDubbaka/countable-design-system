import { Calendar } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as DatePickerCalendar } from "@/components/ui/calendar";
import { format as formatDateFns } from "date-fns";

// Calendar date field styled to match the form inputs (h-9, 10px radius, double-border focus).
// Extracted from CreateNewEngagement.tsx (P5) so it can be shared with CreateEngagement.tsx and
// the new Participants section (Admission date / Retirement date).
export const DateField = ({
 label, value, onChange, required = false, disabled = false,
}: {
 label?: string;
 value: string; // MM/dd/yyyy
 onChange: (value: string) => void;
 required?: boolean;
 disabled?: boolean;
}) => {
 const m = value ? value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/) : null;
 const parsed = m ? new Date(Number(m[3]), Number(m[1]) - 1, Number(m[2])) : undefined;
 const selected = parsed && !isNaN(parsed.getTime()) ? parsed : undefined;
 return (
 <div className="flex flex-col gap-1">
 {label && (
 <label className="text-xs font-medium text-foreground">
 {label}
 {required && <span className="text-destructive ml-0.5">*</span>}
 </label>
 )}
 <Popover>
 <PopoverTrigger asChild disabled={disabled}>
 <button
 type="button"
 disabled={disabled}
 className={`input-double-border w-full h-9 px-3 py-2 text-sm rounded-[10px] outline-none transition-all duration-200 flex items-center text-left ${
 disabled
 ? "bg-muted border border-transparent text-muted-foreground opacity-60 cursor-not-allowed"
 : "bg-white border border-[#C3CBD6] dark:border-[hsl(220_15%_30%)] dark:bg-card hover:border-[hsl(210_25%_75%)] dark:hover:border-[hsl(220_15%_40%)]"
 } ${selected ? "text-foreground" : "text-muted-foreground"}`}
 >
 <span className="flex-1 truncate">{selected ? formatDateFns(selected, "MM/dd/yyyy") : "MM/DD/YYYY"}</span>
 <Calendar className="h-4 w-4 ml-auto shrink-0 text-muted-foreground" />
 </button>
 </PopoverTrigger>
 <PopoverContent className="w-auto p-0" align="start">
 <DatePickerCalendar
 mode="single"
 selected={selected}
 onSelect={d => onChange(d ? formatDateFns(d, "MM/dd/yyyy") : "")}
 initialFocus
 className="p-3 pointer-events-auto"
 />
 </PopoverContent>
 </Popover>
 </div>
 );
};
