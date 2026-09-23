export type ToolCategory =
  | 'pdf-tools'
  | 'ai-pdf-tools'
  | 'ocr-tools'
  | 'document-tools'
  | 'ai-writing-tools'
  | 'education-tools'
  | 'business-tools'
  | 'image-tools';

export interface ToolItem {
  id: string;
  slug: string;
  name: string;
  category: ToolCategory;
  shortDesc: string;
  badge?: 'Popular' | 'AI Powered' | 'New' | 'Fast';
  icon: string;
  seoTitle: string;
  metaDesc: string;
  h1: string;
  howToSteps: string[];
  features: string[];
  faqs: { question: string; answer: string }[];
  acceptedMimeTypes?: string[];
  maxFiles?: number;
  workspaceType:
    | 'pdf-core'
    | 'ai-chat'
    | 'ai-summary'
    | 'ai-quiz'
    | 'ai-flashcard'
    | 'ai-study-guide'
    | 'ocr'
    | 'ai-writing'
    | 'converter';
}

export interface ProcessedDocument {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: Date;
  expiresAt: Date;
  text?: string;
  dataUrl?: string;
  file?: File;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  citations?: { page?: number; snippet?: string }[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export interface Flashcard {
  front: string;
  back: string;
  hint?: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  category: string;
  readTime: string;
  publishedAt: string;
  author: string;
  excerpt: string;
  content: string[];
}
