import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, X, Download, CheckCheck, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ClientResponse } from "@/hooks/useClientResponses";

interface ClientResponseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  totalQuestions: number;
  answeredQuestions: number;
  responses: ClientResponse[];
  onAcceptSelected: (questionIds: string[]) => void;
  isApplying?: boolean;
}

export function ClientResponseDialog({
  open,
  onOpenChange,
  totalQuestions,
  answeredQuestions,
  responses,
  onAcceptSelected,
  isApplying = false,
}: ClientResponseDialogProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    () => new Set(responses.map((r) => r.questionId))
  );

  // Reset selections when dialog opens with new responses
  const responseKey = responses.map((r) => r.questionId).join(",");
  const [prevKey, setPrevKey] = useState(responseKey);
  if (responseKey !== prevKey) {
    setSelectedIds(new Set(responses.map((r) => r.questionId)));
    setPrevKey(responseKey);
  }

  const allSelected = selectedIds.size === responses.length && responses.length > 0;
  const someSelected = selectedIds.size > 0;

  const toggleOne = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(responses.map((r) => r.questionId)));
    }
  };

  const handleAccept = () => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;
    onAcceptSelected(ids);
    onOpenChange(false);
  };

  const handleReject = () => {
    onOpenChange(false);
  };

  const answerBadgeColor = (answer: string) => {
    const lower = answer.toLowerCase();
    if (lower === "yes" || lower === "true") return "bg-emerald-100 text-emerald-700 border-emerald-200";
    if (lower === "no" || lower === "false") return "bg-red-100 text-red-700 border-red-200";
    if (lower === "na" || lower === "n/a") return "bg-amber-100 text-amber-700 border-amber-200";
    return "bg-muted text-muted-foreground border-border";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] flex flex-col">
        <DialogHeader className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
            <CheckCircle2 className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-lg font-semibold">
            Client Responses Received
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {answeredQuestions} of {totalQuestions} questions answered. Review and select which responses to accept.
          </DialogDescription>
        </DialogHeader>

        {/* Progress bar */}
        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${(answeredQuestions / totalQuestions) * 100}%` }}
          />
        </div>

        {/* Select all toggle */}
        <div className="flex items-center justify-between py-1">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <Checkbox
              checked={allSelected}
              onCheckedChange={toggleAll}
              disabled={isApplying}
            />
            <span className="text-sm font-medium">
              {allSelected ? "Deselect All" : "Select All"}
            </span>
          </label>
          <span className="text-xs text-muted-foreground">
            {selectedIds.size} of {responses.length} selected
          </span>
        </div>

        {/* Response list */}
        <ScrollArea className="flex-1 max-h-[40vh] border rounded-lg">
          <div className="divide-y divide-border">
            {responses.map((response) => (
              <label
                key={response.questionId}
                className={`flex items-start gap-3 px-3 py-2.5 cursor-pointer transition-colors ${
                  selectedIds.has(response.questionId)
                    ? "bg-primary/5"
                    : "hover:bg-muted/50"
                }`}
              >
                <Checkbox
                  checked={selectedIds.has(response.questionId)}
                  onCheckedChange={() => toggleOne(response.questionId)}
                  className="mt-0.5"
                  disabled={isApplying}
                />
                <div className="flex-1 min-w-0 space-y-1">
                  <p className="text-sm font-medium text-foreground truncate">
                    {response.questionText || response.questionId}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge
                      variant="outline"
                      className={`text-xs px-1.5 py-0 ${answerBadgeColor(response.answer)}`}
                    >
                      {response.answer}
                    </Badge>
                    {response.explanation && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground cursor-help">
                            <Info className="h-3 w-3" />
                            <span className="truncate max-w-[200px]">
                              {response.explanation}
                            </span>
                          </span>
                        </TooltipTrigger>
                        <TooltipContent
                          side="top"
                          className="max-w-xs text-xs"
                        >
                          {response.explanation}
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </ScrollArea>

        <DialogFooter className="flex sm:flex-row gap-2 pt-2">
          <Button
            variant="outline"
            onClick={handleReject}
            className="flex-1"
            disabled={isApplying}
          >
            <X className="h-4 w-4" />
            Reject
          </Button>
          <Button
            onClick={handleAccept}
            disabled={!someSelected || isApplying}
            className="flex-1"
          >
            <CheckCheck className="h-4 w-4" />
            Accept{selectedIds.size === responses.length ? " All" : ` (${selectedIds.size})`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
