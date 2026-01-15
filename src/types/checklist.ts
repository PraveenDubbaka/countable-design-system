export type AnswerType = 'yes-no' | 'yes-no-na' | 'multiple-choice' | 'short-answer' | 'long-answer' | 'dropdown';

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
}

export interface Section {
  id: string;
  title: string;
  questions: Question[];
  isExpanded: boolean;
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

export type GenerationScope = 'concise' | 'standard' | 'detailed';

export interface AIEditOption {
  id: string;
  label: string;
  icon: string;
  action: (text: string) => string;
}
