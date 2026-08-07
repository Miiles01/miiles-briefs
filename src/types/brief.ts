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
  | 'color-picker'
  | 'image-gallery'
  | 'file-upload';

export interface ChoiceOption {
  id: string;
  label: string;
  description?: string;
  icon?: string;
  badge?: string;
}

export interface ImageOption {
  id: string;
  url: string;
  label?: string;
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
  highlightWord?: string; // Word highlighted with WelthCatritz font
  subtitle?: string;
  section?: string; // e.g. "Sección 1 — Contexto del negocio"
  sectionHeader?: string; // Contextual header e.g. "Si tu marca fuera una persona que te encuentras en la calle..."
  placeholder?: string;
  required?: boolean;
  allowUndefined?: boolean;
  options?: ChoiceOption[];
  imageOptions?: ImageOption[];
  hasConditionalInput?: boolean;
  conditionalTriggerId?: string; // e.g. 'si'
  conditionalInputPlaceholder?: string;
  conditionalInputLabel?: string;
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
  ctaText?: string; // e.g. 'Empezar'
  submitText?: string; // e.g. 'Finalizar'
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
