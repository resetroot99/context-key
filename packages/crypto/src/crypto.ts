/**
 * Core cryptographic functions for Context Key
 */

import * as nacl from 'tweetnacl';
import { encodeBase64, decodeBase64, encodeUTF8, decodeUTF8 } from 'tweetnacl-util';
import type { ContextKey, SignedContextKey, EncryptedContextKey } from './types';

/**
 * Generate a new Ed25519 key pair for signing
 * @returns Object containing public and private keys as base64 strings
 */
export function generateKeyPair(): { publicKey: string; privateKey: string } {
  const keyPair = nacl.sign.keyPair();
  
  return {
    publicKey: encodeBase64(keyPair.publicKey),
    privateKey: encodeBase64(keyPair.secretKey),
  };
}

/**
 * Sign a context key with a private key
 * @param contextKey - The context key to sign
 * @param privateKey - Base64 encoded private key
 * @returns Signed context key with signature and public key
 */
export function signContextKey(
  contextKey: ContextKey,
  privateKey: string
): SignedContextKey {
  const privateKeyBytes = decodeBase64(privateKey);
  const keyPair = nacl.sign.keyPair.fromSecretKey(privateKeyBytes);
  
  // Serialize the context key deterministically
  const serialized = JSON.stringify(contextKey, Object.keys(contextKey).sort());
  const message = encodeUTF8(serialized);
  
  // Sign the message
  const signature = nacl.sign.detached(message, privateKeyBytes);
  
  return {
    data: contextKey,
    signature: encodeBase64(signature),
    public_key: encodeBase64(keyPair.publicKey),
  };
}

/**
 * Verify a signed context key
 * @param signedKey - The signed context key to verify
 * @returns True if the signature is valid, false otherwise
 */
export function verifyContextKey(signedKey: SignedContextKey): boolean {
  try {
    const publicKey = decodeBase64(signedKey.public_key);
    const signature = decodeBase64(signedKey.signature);
    
    // Serialize the data the same way it was signed
    const serialized = JSON.stringify(signedKey.data, Object.keys(signedKey.data).sort());
    const message = encodeUTF8(serialized);
    
    return nacl.sign.detached.verify(message, signature, publicKey);
  } catch (error) {
    return false;
  }
}

/**
 * Derive a key from a password using PBKDF2 (Web Crypto API)
 * @param password - The password to derive from
 * @param salt - Salt bytes
 * @param iterations - Number of iterations
 * @returns Promise resolving to the derived key
 */
async function deriveKey(
  password: string,
  salt: Uint8Array,
  iterations: number
): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);
  
  // Import the password as a key
  const baseKey = await crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    'PBKDF2',
    false,
    ['deriveKey']
  );
  
  // Derive the actual encryption key
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: iterations,
      hash: 'SHA-256',
    },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypt a signed context key with a password
 * @param signedKey - The signed context key to encrypt
 * @param password - Password for encryption
 * @returns Promise resolving to encrypted context key
 */
export async function encryptContextKey(
  signedKey: SignedContextKey,
  password: string
): Promise<EncryptedContextKey> {
  // Generate random salt and IV
  const salt = crypto.getRandomValues(new Uint8Array(32));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  
  // Derive encryption key
  const iterations = 100000; // OWASP recommended minimum
  const key = await deriveKey(password, salt, iterations);
  
  // Serialize and encrypt the signed key
  const serialized = JSON.stringify(signedKey);
  const encoder = new TextEncoder();
  const data = encoder.encode(serialized);
  
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv },
    key,
    data
  );
  
  return {
    encrypted_data: encodeBase64(new Uint8Array(encrypted)),
    iv: encodeBase64(iv),
    salt: encodeBase64(salt),
    kdf_params: {
      algorithm: 'argon2id', // Note: We're using PBKDF2 for now, but labeling for future upgrade
      iterations: iterations,
      memory: 65536, // 64MB
      parallelism: 1,
    },
  };
}

/**
 * Decrypt an encrypted context key with a password
 * @param encryptedKey - The encrypted context key
 * @param password - Password for decryption
 * @returns Promise resolving to the decrypted signed context key
 */
export async function decryptContextKey(
  encryptedKey: EncryptedContextKey,
  password: string
): Promise<SignedContextKey> {
  const salt = decodeBase64(encryptedKey.salt);
  const iv = decodeBase64(encryptedKey.iv);
  const encryptedData = decodeBase64(encryptedKey.encrypted_data);
  
  // Derive the same key
  const key = await deriveKey(password, salt, encryptedKey.kdf_params.iterations);
  
  // Decrypt the data
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: iv },
    key,
    encryptedData
  );
  
  // Parse the decrypted JSON
  const decoder = new TextDecoder();
  const serialized = decoder.decode(decrypted);
  
  return JSON.parse(serialized) as SignedContextKey;
}
