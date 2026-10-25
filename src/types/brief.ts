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
  | 'file-upload'
  | 'contact-channels' // redes, WhatsApp, correo y medios personalizados, con hasta N principales
  | 'tags' // etiquetas de selección múltiple, con opción de agregar personalizadas
  | 'style-grid'; // estilos de marca ("Aa") pintados con los colores de otra pregunta

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
  allowCustom?: boolean; // tags: permite agregar etiquetas propias
  customPlaceholder?: string;
  maxPrimary?: number; // contact-channels: cuántos medios pueden marcarse como principales
  colorSourceId?: string; // style-grid: pregunta de la que salen los colores
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
  completionMessage?: string; // Texto de la pantalla final; si falta, se usa el genérico
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
