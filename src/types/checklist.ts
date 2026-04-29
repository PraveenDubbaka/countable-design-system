export type AnswerType = 'none' | 'yes-no' | 'yes-no-na' | 'multiple-choice' | 'date' | 'long-answer' | 'answer' | 'reference' | 'amount' | 'follow-up' | 'dropdown' | 'file-upload' | 'toggle';

export type CellBlockType = 'text' | 'heading' | 'small-text' | 'question-number' | 'response' | 'reference-number' | 'sub-items' | 'yes-no' | 'yes-no-na' | 'multiple-choice' | 'date' | 'long-answer' | 'answer' | 'amount' | 'dropdown' | 'toggle' | 'free-text' | 'explanation';

export interface ColumnCell {
  id: string;
  content: string;
  blockType?: CellBlockType;
  subItems?: string[]; // for sub-items type
  placeholder?: string; // custom placeholder text
}

export type BorderStyle = 'none' | 'all' | 'separator' | 'top' | 'right' | 'bottom' | 'left';

export interface ColumnLayout {
  columns: number;
  cells: ColumnCell[];
  borders?: BorderStyle[];
  columnWidths?: number[]; // fractional widths, should sum to 1
}

export interface Question {
  id: string;
  text: string;
  answerType: AnswerType;
  answer?: string;
  options?: string[];
  required: boolean;
  subQuestions?: Question[];
  note?: string;
  explanation?: string;
  reference?: string;
  isExpanded?: boolean;
  isUserAdded?: boolean; // Track if question was added by user in engagement mode
  columnLayout?: ColumnLayout; // If present, renders as a column block row
}

export interface FormElement {
  id: string;
  type: 'empty' | 'text-input' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'button' | 'date';
  label?: string;
  placeholder?: string;
  options?: string[];
  buttonStyle?: 'icon-text' | 'text-only' | 'icon-only';
  icon?: string;
}

export interface FormLayout {
  columns: number;
  elements: FormElement[];
}

export interface Section {
  id: string;
  title: string;
  questions: Question[];
  isExpanded: boolean;
  formLayout?: FormLayout;
  note?: string;
}

export interface Checklist {
  id: string;
  title: string;
  description?: string;
  objective?: string;
  sections: Section[];
  createdAt: Date;
  updatedAt: Date;
}

export type GenerationScope = 'standard' | 'detailed';

export type NumberingFormat = 'number' | 'number-alphabet' | 'alphabet-number';

/** Format a question number based on the selected numbering format */
export const formatQuestionNumber = (
  format: NumberingFormat,
  sectionNumber: number,
  itemIndex: number,
  subItemIndex?: number,
  subSubItemIndex?: number
): string => {
  const toUpperAlpha = (num: number): string => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return letters[(num - 1) % 26] || 'A';
  };
  const toLowerAlpha = (num: number): string => {
    const letters = 'abcdefghijklmnopqrstuvwxyz';
    return letters[(num - 1) % 26] || 'a';
  };

  switch (format) {
    case 'number':
      if (subSubItemIndex !== undefined && subItemIndex !== undefined) return `${sectionNumber}.${itemIndex + 1}.${subItemIndex + 1}.${subSubItemIndex + 1}`;
      if (subItemIndex !== undefined) return `${sectionNumber}.${itemIndex + 1}.${subItemIndex + 1}`;
      return `${sectionNumber}.${itemIndex + 1}`;
    case 'number-alphabet':
      if (subSubItemIndex !== undefined && subItemIndex !== undefined) return `${sectionNumber}.${toUpperAlpha(itemIndex + 1)}.${toLowerAlpha(subItemIndex + 1)}.${subSubItemIndex + 1}`;
      if (subItemIndex !== undefined) return `${sectionNumber}.${toUpperAlpha(itemIndex + 1)}.${toLowerAlpha(subItemIndex + 1)}`;
      return `${sectionNumber}.${toUpperAlpha(itemIndex + 1)}`;
    case 'alphabet-number':
      if (subSubItemIndex !== undefined && subItemIndex !== undefined) return `${toUpperAlpha(sectionNumber)}.${itemIndex + 1}.${toLowerAlpha(subItemIndex + 1)}.${subSubItemIndex + 1}`;
      if (subItemIndex !== undefined) return `${toUpperAlpha(sectionNumber)}.${itemIndex + 1}.${toLowerAlpha(subItemIndex + 1)}`;
      return `${toUpperAlpha(sectionNumber)}.${itemIndex + 1}`;
    default:
      if (subSubItemIndex !== undefined && subItemIndex !== undefined) return `${sectionNumber}.${itemIndex + 1}.${subItemIndex + 1}.${subSubItemIndex + 1}`;
      if (subItemIndex !== undefined) return `${sectionNumber}.${itemIndex + 1}.${subItemIndex + 1}`;
      return `${sectionNumber}.${itemIndex + 1}`;
  }
};

/** Build a map of question ID → formatted number string from a checklist */
export const buildQuestionNumberMap = (
  checklist: Checklist,
  format: NumberingFormat = 'number'
): Map<string, string> => {
  const map = new Map<string, string>();
  checklist.sections.forEach((section, sectionIdx) => {
    const sectionNumber = sectionIdx + 1;
    section.questions.forEach((question, questionIdx) => {
      map.set(question.id, formatQuestionNumber(format, sectionNumber, questionIdx));
      if (question.subQuestions) {
        question.subQuestions.forEach((sub, subIdx) => {
          map.set(sub.id, formatQuestionNumber(format, sectionNumber, questionIdx, subIdx));
          if (sub.subQuestions) {
            sub.subQuestions.forEach((subSub, subSubIdx) => {
              map.set(subSub.id, formatQuestionNumber(format, sectionNumber, questionIdx, subIdx, subSubIdx));
            });
          }
        });
      }
    });
  });
  return map;
};

export interface AIEditOption {
  id: string;
  label: string;
  icon: string;
  action: (text: string) => string;
}
