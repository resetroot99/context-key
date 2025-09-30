/**
 * Context Key Crypto Library
 * 
 * This library provides secure cryptographic functions for creating,
 * signing, encrypting, and verifying Context Keys.
 */

export * from './types';
export * from './crypto';

// Re-export commonly used functions for convenience
export {
  generateKeyPair,
  signContextKey,
  verifyContextKey,
  encryptContextKey,
  decryptContextKey,
} from './crypto';

export type {
  ContextKey,
  SignedContextKey,
  EncryptedContextKey,
  UserProfile,
  Policies,
  DataSource,
  MemoryEntry,
} from './types';
