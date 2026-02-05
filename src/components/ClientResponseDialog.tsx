import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Share2, CheckCircle2, X, Download } from "lucide-react";

interface ClientResponseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  totalQuestions: number;
  answeredQuestions: number;
  onAddResponses: () => void;
  isApplying?: boolean;
}

export function ClientResponseDialog({
  open,
  onOpenChange,
  totalQuestions,
  answeredQuestions,
  onAddResponses,
  isApplying = false,
}: ClientResponseDialogProps) {
  const handleAddResponses = () => {
    onAddResponses();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
            <CheckCircle2 className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-lg font-semibold">
            Client Responses Received
          </DialogTitle>
          <DialogDescription className="sr-only">
            Review client responses and add them to the checklist
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          <div className="flex flex-col items-center gap-4">
          {/* Progress indicator */}
            <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-500 ease-out"
                style={{ width: `${(answeredQuestions / totalQuestions) * 100}%` }}
              />
            </div>
            
            {/* Stats */}
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-primary">{answeredQuestions}</span>
              <span className="text-muted-foreground text-lg">/</span>
              <span className="text-xl font-medium text-muted-foreground">{totalQuestions}</span>
            </div>
            
            <p className="text-sm text-muted-foreground text-center">
              Client answered <span className="font-semibold text-foreground">{answeredQuestions}</span> out of <span className="font-semibold text-foreground">{totalQuestions}</span> questions
            </p>
          </div>
        </div>

        <DialogFooter className="flex sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1"
            disabled={isApplying}
          >
            <X className="h-4 w-4" />
            Reject
          </Button>
          <Button
            onClick={handleAddResponses}
            disabled={isApplying}
            className="flex-1"
          >
            <Download className="h-4 w-4" />
            Accept
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
