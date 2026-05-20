import { useState } from "react";
import { Checklist } from "@/types/checklist";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Info, Plus } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AddToMyTemplatesDialog } from "@/components/AddToMyTemplatesDialog";

interface WorksheetViewProps {
  checklist: Checklist;
  onUpdate: (updated: Checklist) => void;
}

export function WorksheetView({ checklist, onUpdate }: WorksheetViewProps) {
  const [checkedRows, setCheckedRows] = useState<Set<string>>(new Set());
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [conclusion, setConclusion] = useState<string>("");

  const updateQuestion = (
    sectionId: string,
    questionId: string,
    field: "answer" | "explanation" | "reference",
    value: string
  ) => {
    const updated = {
      ...checklist,
      sections: checklist.sections.map((s) =>
        s.id !== sectionId
          ? s
          : {
              ...s,
              questions: s.questions.map((q) =>
                q.id !== questionId ? q : { ...q, [field]: value }
              ),
            }
      ),
      updatedAt: new Date(),
    };
    onUpdate(updated);
  };

  const updateSubQuestion = (
    sectionId: string,
    parentId: string,
    subId: string,
    field: "answer" | "explanation" | "reference",
    value: string
  ) => {
    const updated = {
      ...checklist,
      sections: checklist.sections.map((s) =>
        s.id !== sectionId
          ? s
          : {
              ...s,
              questions: s.questions.map((q) =>
                q.id !== parentId
                  ? q
                  : {
                      ...q,
                      subQuestions: (q.subQuestions ?? []).map((sq) =>
                        sq.id !== subId ? sq : { ...sq, [field]: value }
                      ),
                    }
              ),
            }
      ),
      updatedAt: new Date(),
    };
    onUpdate(updated);
  };

  const toggleRow = (id: string) => {
    setCheckedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Build a flat row counter across all sections
  let rowCounter = 0;

  return (
    <TooltipProvider>
      <div className="flex flex-col h-full">
        {/* Top toolbar */}
        <div className="border-b bg-card px-6 py-3 flex items-center justify-between shrink-0">
          <h1 className="text-lg font-semibold px-2 py-1">{checklist.title}</h1>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAddDialog(true)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add to My Templates
          </Button>
        </div>

        {/* Objective bar */}
        {checklist.objective && (
          <div className="px-6 py-3 border-b border-border bg-background flex items-start gap-2 shrink-0">
            <span className="text-sm font-semibold text-foreground whitespace-nowrap">Objective:</span>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0 cursor-default" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-xs">This is the objective of the audit worksheet.</p>
              </TooltipContent>
            </Tooltip>
            <p className="text-sm text-muted-foreground flex-1">{checklist.objective}</p>
          </div>
        )}

        {/* Main scrollable body */}
        <div className="flex-1 overflow-y-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted/40 border-b border-border text-xs font-medium text-muted-foreground">
                <th className="w-10 px-2 py-2 text-center" style={{ minWidth: 40 }}></th>
                <th className="w-14 px-2 py-2 text-center" style={{ minWidth: 56 }}></th>
                <th className="px-3 py-2 text-left">Description</th>
                <th className="px-3 py-2 text-left" style={{ width: 180, minWidth: 180 }}>
                  Procedure successfully completed
                </th>
                <th className="px-3 py-2 text-left">
                  Responses and any difficulties encountered
                </th>
                <th className="px-3 py-2 text-left" style={{ width: 80, minWidth: 80 }}>
                  w/p ref
                </th>
              </tr>
            </thead>
            <tbody>
              {checklist.sections.map((section) => (
                <>
                  {/* Section header row */}
                  <tr
                    key={`section-header-${section.id}`}
                    className="bg-muted/60 border-b border-t border-border"
                  >
                    <td colSpan={6}>
                      <span className="text-sm font-semibold text-foreground pl-4 py-2 block">
                        {section.title}
                      </span>
                    </td>
                  </tr>

                  {/* Question rows */}
                  {section.questions.map((question) => {
                    rowCounter += 1;
                    const currentRow = rowCounter;

                    return (
                      <>
                        <tr
                          key={`question-${question.id}`}
                          className="border-b border-border hover:bg-muted/20 transition-colors"
                        >
                          {/* Checkbox */}
                          <td className="px-2 py-3 text-center align-top">
                            <Checkbox
                              checked={checkedRows.has(question.id)}
                              onCheckedChange={() => toggleRow(question.id)}
                            />
                          </td>
                          {/* Row number */}
                          <td className="px-2 py-3 text-center align-top text-sm text-muted-foreground font-mono">
                            {currentRow}
                          </td>
                          {/* Description */}
                          <td className="px-3 py-3 align-top">
                            <div
                              className="text-sm text-foreground prose prose-sm max-w-none"
                              dangerouslySetInnerHTML={{ __html: question.text }}
                            />
                          </td>
                          {/* Procedure successfully completed */}
                          <td className="px-3 py-3 align-top" style={{ width: 180 }}>
                            <Select
                              value={question.answer ?? ""}
                              onValueChange={(val) =>
                                updateQuestion(section.id, question.id, "answer", val)
                              }
                            >
                              <SelectTrigger className="h-8 text-sm">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Yes">Yes</SelectItem>
                                <SelectItem value="No">No</SelectItem>
                                <SelectItem value="N/A">N/A</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                          {/* Responses and difficulties */}
                          <td className="px-3 py-3 align-top">
                            <Textarea
                              placeholder="Enter your response"
                              className="min-h-[60px] text-sm resize-none"
                              value={question.explanation ?? ""}
                              onChange={(e) =>
                                updateQuestion(
                                  section.id,
                                  question.id,
                                  "explanation",
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          {/* w/p ref */}
                          <td className="px-3 py-3 align-top" style={{ width: 80 }}>
                            <Button variant="outline" size="sm" className="text-xs">
                              + Ref
                            </Button>
                          </td>
                        </tr>

                        {/* SubQuestion rows */}
                        {(question.subQuestions ?? []).map((sub, subIdx) => (
                          <tr
                            key={`sub-${sub.id}`}
                            className="border-b border-border hover:bg-muted/10 transition-colors bg-background/50"
                          >
                            {/* Checkbox */}
                            <td className="px-2 py-3 text-center align-top">
                              <Checkbox
                                checked={checkedRows.has(sub.id)}
                                onCheckedChange={() => toggleRow(sub.id)}
                              />
                            </td>
                            {/* Sub-number */}
                            <td className="px-2 py-3 text-center align-top text-sm text-muted-foreground font-mono">
                              {String.fromCharCode(97 + subIdx)}
                            </td>
                            {/* Description (indented) */}
                            <td className="px-3 py-3 align-top pl-8">
                              <div
                                className="text-sm text-foreground prose prose-sm max-w-none"
                                dangerouslySetInnerHTML={{ __html: sub.text }}
                              />
                            </td>
                            {/* Procedure successfully completed */}
                            <td className="px-3 py-3 align-top" style={{ width: 180 }}>
                              <Select
                                value={sub.answer ?? ""}
                                onValueChange={(val) =>
                                  updateSubQuestion(
                                    section.id,
                                    question.id,
                                    sub.id,
                                    "answer",
                                    val
                                  )
                                }
                              >
                                <SelectTrigger className="h-8 text-sm">
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Yes">Yes</SelectItem>
                                  <SelectItem value="No">No</SelectItem>
                                  <SelectItem value="N/A">N/A</SelectItem>
                                </SelectContent>
                              </Select>
                            </td>
                            {/* Responses and difficulties */}
                            <td className="px-3 py-3 align-top">
                              <Textarea
                                placeholder="Enter your response"
                                className="min-h-[60px] text-sm resize-none"
                                value={sub.explanation ?? ""}
                                onChange={(e) =>
                                  updateSubQuestion(
                                    section.id,
                                    question.id,
                                    sub.id,
                                    "explanation",
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                            {/* w/p ref */}
                            <td className="px-3 py-3 align-top" style={{ width: 80 }}>
                              <Button variant="outline" size="sm" className="text-xs">
                                + Ref
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </>
                    );
                  })}
                </>
              ))}
            </tbody>
          </table>

          {/* Conclusion section */}
          <div className="px-6 py-4 border-t border-border">
            <h3 className="text-sm font-semibold text-foreground mb-2">Conclusion</h3>
            <Textarea
              placeholder="Document your conclusion..."
              className="min-h-[80px] text-sm resize-none"
              value={conclusion}
              onChange={(e) => setConclusion(e.target.value)}
            />
            <div className="flex justify-end mt-3">
              <Button>Conclude worksheet</Button>
            </div>
          </div>
        </div>

        {/* Add to My Templates Dialog */}
        <AddToMyTemplatesDialog
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          checklist={checklist}
          checklistName={checklist.title}
        />
      </div>
    </TooltipProvider>
  );
}
