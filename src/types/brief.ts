export type QuestionType =
  | 'text'
  | 'textarea'
  | 'email'
  | 'phone'
  | 'single-choice'
  | 'multiple-choice'
  | 'scale-rating'
  | 'budget-slider'
  | 'color-palette'
  | 'file-upload';

export interface ChoiceOption {
  id: string;
  label: string;
  description?: string;
  icon?: string;
  badge?: string;
}

export interface ColorPaletteOption {
  id: string;
  name: string;
  description: string;
  colors: string[];
}

export interface Question {
  id: string;
  type: QuestionType;
  title: string;
  highlightWord?: string; // Word highlighted with Pacifico font
  subtitle?: string;
  placeholder?: string;
  required?: boolean;
  options?: ChoiceOption[];
  colorPalettes?: ColorPaletteOption[];
  minScale?: number;
  maxScale?: number;
  minLabel?: string;
  maxLabel?: string;
  budgetOptions?: {
    id: string;
    label: string;
    range: string;
    popular?: boolean;
  }[];
}

export interface BriefTemplate {
  id: string;
  slug: string;
  title: string;
  highlightWord?: string;
  badge: string;
  description: string;
  icon: string;
  estimatedTime: string;
  totalQuestions: number;
  coverImage?: string;
  colorAccent?: string;
  welcomeSubtitle: string;
  questions: Question[];
}

export type SubmissionStatus = 'new' | 'reviewing' | 'approved' | 'proposal_sent' | 'archived';

export interface ClientSubmission {
  id: string;
  briefId: string;
  briefTitle: string;
  clientName: string;
  clientEmail: string;
  clientCompany?: string;
  clientPhone?: string;
  status: SubmissionStatus;
  createdAt: string;
  updatedAt: string;
  answers: Record<string, any>;
  score?: number;
  notes?: string;
  estimatedBudget?: string;
}
