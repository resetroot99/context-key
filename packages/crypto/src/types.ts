/**
 * Core types for the Context Key system
 */

/**
 * User profile information stored in the context key
 */
export interface UserProfile {
  /** Display name for the user */
  display_name: string;
  /** Preferred communication tone/style */
  tone: string;
  /** Areas of expertise or interest */
  domains: string[];
}

/**
 * Privacy and data handling policies
 */
export interface Policies {
  /** Whether the AI can save new information back to the key */
  allow_writeback: boolean;
  /** Data persistence preferences */
  persistence: 'ephemeral' | 'session' | 'permanent';
  /** PII handling rules */
  pii_handling: 'strict' | 'moderate' | 'permissive';
}

/**
 * Reference to an external data source
 */
export interface DataSource {
  /** Unique identifier for this source */
  id: string;
  /** Human-readable name */
  name: string;
  /** Type of data source */
  type: 'google_drive' | 'notion' | 'dropbox' | 'local_file';
  /** Configuration specific to the source type */
  config: Record<string, unknown>;
  /** When this source was last accessed */
  last_accessed?: string;
}

/**
 * A saved memory entry that can be written back to the key
 */
export interface MemoryEntry {
  /** Unique identifier */
  id: string;
  /** The content of the memory */
  content: string;
  /** When this memory was created */
  created_at: string;
  /** Optional tags for categorization */
  tags?: string[];
  /** Source of this memory (conversation, document, etc.) */
  source?: string;
}

/**
 * The main context key structure
 */
export interface ContextKey {
  /** Schema version for future compatibility */
  version: string;
  /** Unique identifier for this key */
  id: string;
  /** When this key was created */
  created_at: string;
  /** When this key was last modified */
  updated_at: string;
  /** User profile information */
  profile: UserProfile;
  /** Privacy and data handling policies */
  policies: Policies;
  /** Connected data sources */
  data_sources: DataSource[];
  /** Saved memories */
  memories: MemoryEntry[];
}

/**
 * A signed context key with cryptographic verification
 */
export interface SignedContextKey {
  /** The context key data */
  data: ContextKey;
  /** Ed25519 signature of the serialized data */
  signature: string;
  /** Public key used for verification */
  public_key: string;
}

/**
 * An encrypted context key blob for storage/transport
 */
export interface EncryptedContextKey {
  /** Encrypted data */
  encrypted_data: string;
  /** Initialization vector for AES-GCM */
  iv: string;
  /** Salt used for key derivation */
  salt: string;
  /** Key derivation parameters */
  kdf_params: {
    algorithm: 'argon2id';
    iterations: number;
    memory: number;
    parallelism: number;
  };
}
