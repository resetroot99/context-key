/**
 * Validation schemas using Zod
 */

import { z } from 'zod';

/**
 * User profile validation schema
 */
export const UserProfileSchema = z.object({
  display_name: z.string().min(1, 'Display name is required').max(100),
  tone: z.string().min(1, 'Tone is required').max(500),
  domains: z.array(z.string()).min(1, 'At least one domain is required'),
});

/**
 * Policies validation schema
 */
export const PoliciesSchema = z.object({
  allow_writeback: z.boolean(),
  persistence: z.enum(['ephemeral', 'session', 'permanent']),
  pii_handling: z.enum(['strict', 'moderate', 'permissive']),
});

/**
 * Data source validation schema
 */
export const DataSourceSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Name is required'),
  type: z.enum(['google_drive', 'notion', 'dropbox', 'local_file']),
  config: z.record(z.unknown()),
  last_accessed: z.string().optional(),
});

/**
 * Memory entry validation schema
 */
export const MemoryEntrySchema = z.object({
  id: z.string(),
  content: z.string().min(1, 'Content is required'),
  created_at: z.string(),
  tags: z.array(z.string()).optional(),
  source: z.string().optional(),
});

/**
 * Context key validation schema
 */
export const ContextKeySchema = z.object({
  version: z.string(),
  id: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  profile: UserProfileSchema,
  policies: PoliciesSchema,
  data_sources: z.array(DataSourceSchema),
  memories: z.array(MemoryEntrySchema),
});

/**
 * Chat message validation schema
 */
export const ChatMessageSchema = z.object({
  id: z.string(),
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string(),
  timestamp: z.string(),
  metadata: z.record(z.unknown()).optional(),
});

/**
 * File upload validation schema
 */
export const FileUploadSchema = z.object({
  name: z.string().min(1, 'File name is required'),
  size: z.number().positive('File size must be positive'),
  type: z.string().min(1, 'File type is required'),
  content: z.string().optional(), // Base64 encoded content
});

/**
 * API response validation schema
 */
export const ApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.unknown().optional(),
  error: z.string().optional(),
  message: z.string().optional(),
});

// Export types inferred from schemas
export type UserProfile = z.infer<typeof UserProfileSchema>;
export type Policies = z.infer<typeof PoliciesSchema>;
export type DataSource = z.infer<typeof DataSourceSchema>;
export type MemoryEntry = z.infer<typeof MemoryEntrySchema>;
export type ContextKey = z.infer<typeof ContextKeySchema>;
export type ChatMessage = z.infer<typeof ChatMessageSchema>;
export type FileUpload = z.infer<typeof FileUploadSchema>;
export type ApiResponse = z.infer<typeof ApiResponseSchema>;
