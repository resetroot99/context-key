/**
 * Shared constants
 */

/**
 * Current schema version for context keys
 */
export const CONTEXT_KEY_VERSION = '1.0.0';

/**
 * Maximum file size for uploads (10MB)
 */
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

/**
 * Supported file types for document upload
 */
export const SUPPORTED_FILE_TYPES = [
  'text/plain',
  'text/markdown',
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
] as const;

/**
 * Default tone options for user profiles
 */
export const DEFAULT_TONES = [
  'Professional and formal',
  'Friendly and conversational',
  'Concise and direct',
  'Detailed and explanatory',
  'Creative and expressive',
] as const;

/**
 * Default domain suggestions
 */
export const DEFAULT_DOMAINS = [
  'Software Development',
  'Data Science',
  'Marketing',
  'Finance',
  'Healthcare',
  'Education',
  'Design',
  'Research',
  'Business Strategy',
  'Technology',
] as const;

/**
 * Supported AI chat platforms for browser extension
 */
export const SUPPORTED_PLATFORMS = [
  {
    name: 'ChatGPT',
    url: 'https://chat.openai.com',
    selector: 'textarea[data-id="root"]',
  },
  {
    name: 'Claude',
    url: 'https://claude.ai',
    selector: 'div[contenteditable="true"]',
  },
  {
    name: 'Bard',
    url: 'https://bard.google.com',
    selector: 'textarea',
  },
  {
    name: 'Perplexity',
    url: 'https://www.perplexity.ai',
    selector: 'textarea',
  },
] as const;

/**
 * Local storage keys
 */
export const STORAGE_KEYS = {
  CONTEXT_KEY: 'context_key',
  USER_PREFERENCES: 'user_preferences',
  RECENT_KEYS: 'recent_keys',
} as const;

/**
 * API endpoints
 */
export const API_ENDPOINTS = {
  HEALTH: '/health',
  UPLOAD: '/upload',
  INGEST: '/ingest',
  SEARCH: '/search',
  MEMORY: '/memory',
} as const;
