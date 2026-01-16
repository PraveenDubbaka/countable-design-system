import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Checklist, Section, Question } from '@/types/checklist';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ChecklistTableViewProps {
  checklist: Checklist;
  onUpdate: (checklist: Checklist) => void;
  isPreviewMode: boolean;
}

interface TableRowProps {
  question: Question;
  sectionIndex: number;
  questionIndex: number;
  onUpdate: (question: Question) => void;
  isPreviewMode: boolean;
}

function TableRow({ question, onUpdate, isPreviewMode }: TableRowProps) {
  const [checked, setChecked] = useState(false);
  const [response, setResponse] = useState(question.answer || '');
  const [procedureStatus, setProcedureStatus] = useState<string>('');

  const handleResponseChange = (value: string) => {
    setResponse(value);
    onUpdate({ ...question, answer: value });
  };

  const handleProcedureChange = (value: string) => {
    setProcedureStatus(value);
    onUpdate({ ...question, note: value });
  };

  // Strip HTML tags for display
  const plainText = question.text.replace(/<[^>]*>/g, '');

  return (
    <tr className="border-b hover:bg-muted/30 transition-colors">
      <td className="p-3 w-10">
        <Checkbox
          checked={checked}
          onCheckedChange={(val) => setChecked(!!val)}
          disabled={isPreviewMode}
        />
      </td>
      <td className="p-3 min-w-[300px] max-w-[400px]">
        <div className="border rounded-lg p-3 bg-background min-h-[60px]">
          <p className="text-sm text-foreground whitespace-pre-wrap">{plainText}</p>
        </div>
      </td>
      <td className="p-3 w-[160px]">
        <Select
          value={procedureStatus}
          onValueChange={handleProcedureChange}
          disabled={isPreviewMode}
        >
          <SelectTrigger className="bg-background">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="not-started">Not Started</SelectItem>
            <SelectItem value="na">N/A</SelectItem>
          </SelectContent>
        </Select>
      </td>
      <td className="p-3 min-w-[250px]">
        <input
          type="text"
          value={response}
          onChange={(e) => handleResponseChange(e.target.value)}
          placeholder="Enter your response"
          disabled={isPreviewMode}
          className="w-full px-3 py-2 border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
        />
      </td>
      <td className="p-3 w-[100px]">
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground"
          disabled={isPreviewMode}
        >
          + Ref
        </Button>
      </td>
    </tr>
  );
}

export function ChecklistTableView({ checklist, onUpdate, isPreviewMode }: ChecklistTableViewProps) {
  const handleQuestionUpdate = (sectionIndex: number, questionIndex: number, updatedQuestion: Question) => {
    const newSections = [...checklist.sections];
    newSections[sectionIndex] = {
      ...newSections[sectionIndex],
      questions: newSections[sectionIndex].questions.map((q, idx) =>
        idx === questionIndex ? updatedQuestion : q
      ),
    };
    onUpdate({ ...checklist, sections: newSections });
  };

  const handleAddRow = (sectionIndex: number) => {
    const newQuestion: Question = {
      id: `q-${Date.now()}`,
      text: '',
      answerType: 'short-answer',
      required: false,
    };
    const newSections = [...checklist.sections];
    newSections[sectionIndex] = {
      ...newSections[sectionIndex],
      questions: [...newSections[sectionIndex].questions, newQuestion],
    };
    onUpdate({ ...checklist, sections: newSections });
  };

  // Strip number prefix from section title
  const cleanTitle = (title: string) => title.replace(/^\d+\.\s*/, '');

  return (
    <div className="space-y-8">
      {checklist.sections.map((section, sectionIndex) => (
        <div key={section.id} className="bg-card border rounded-xl overflow-hidden">
          <div className="bg-muted/50 px-4 py-3 border-b">
            <h3 className="font-semibold text-foreground">
              {sectionIndex + 1}. {cleanTitle(section.title)}
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="p-3 w-10"></th>
                  <th className="p-3 text-left text-sm font-medium text-muted-foreground">
                    Description
                  </th>
                  <th className="p-3 text-left text-sm font-medium text-muted-foreground w-[160px]">
                    Procedure completed successfully
                  </th>
                  <th className="p-3 text-left text-sm font-medium text-muted-foreground min-w-[250px]">
                    Responses and any difficulties encountered
                  </th>
                  <th className="p-3 text-left text-sm font-medium text-muted-foreground w-[100px]">
                    w/p reference
                  </th>
                </tr>
              </thead>
              <tbody>
                {section.questions.map((question, questionIndex) => (
                  <TableRow
                    key={question.id}
                    question={question}
                    sectionIndex={sectionIndex}
                    questionIndex={questionIndex}
                    onUpdate={(q) => handleQuestionUpdate(sectionIndex, questionIndex, q)}
                    isPreviewMode={isPreviewMode}
                  />
                ))}
              </tbody>
            </table>
          </div>
          
          {!isPreviewMode && (
            <div className="p-4 border-t">
              <Button
                variant="default"
                size="sm"
                onClick={() => handleAddRow(sectionIndex)}
                className="bg-[#3379C9] hover:bg-[#1C63A6] text-white"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Row
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
