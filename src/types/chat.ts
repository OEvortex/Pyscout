
export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

// New types for model selection
export interface Model {
  id: string;
  object: 'model';
  created: number;
  owned_by: string;
  name?: string; // Parsed name for display
}

export interface ModelApiResponse {
  object: 'list';
  data: Model[];
}
