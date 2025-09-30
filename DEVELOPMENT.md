# Development Guide

This guide provides detailed information for developers working on the Context Key project.

## 🏗️ Architecture Overview

Context Key follows a **monorepo architecture** with clear separation of concerns:

### Package Dependencies

```mermaid
graph TD
    A[vault] --> C[crypto]
    A --> S[shared]
    B[temp-chat] --> C
    B --> S
    E[browser-extension] --> C
    E --> S
    D[api] --> C
    D --> S
    C --> |independent|
    S --> |independent|
```

### Data Flow

1. **Key Creation** (Vault):
   - User inputs profile data
   - Crypto package generates and signs key
   - Encrypted key is downloaded

2. **Key Loading** (Temp Chat):
   - User uploads encrypted key
   - Crypto package decrypts and verifies
   - Context is loaded into chat session

3. **AI Interaction**:
   - User sends message
   - Context is injected into system prompt
   - OpenAI API generates response

## 🔧 Development Setup

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **pnpm**: v8.0.0 or higher (required for workspaces)
- **Git**: For version control
- **VS Code**: Recommended with extensions:
  - TypeScript and JavaScript Language Features
  - Tailwind CSS IntelliSense
  - ESLint
  - Prettier

### Initial Setup

1. **Clone and Install**:
   ```bash
   git clone https://github.com/resetroot99/context-key.git
   cd context-key
   pnpm install
   ```

2. **Environment Setup**:
   ```bash
   # Temp Chat
   cp packages/temp-chat/.env.example packages/temp-chat/.env.local
   
   # API (if using)
   cp packages/api/.env.example packages/api/.env
   ```

3. **Verify Installation**:
   ```bash
   pnpm type-check
   pnpm lint
   ```

### Development Workflow

1. **Start Development Servers**:
   ```bash
   # Terminal 1: Vault
   pnpm dev:vault
   
   # Terminal 2: Temp Chat
   pnpm dev:temp-chat
   
   # Terminal 3: API (optional)
   pnpm dev:api
   ```

2. **Make Changes**:
   - Edit files in the appropriate package
   - Changes are automatically reloaded
   - TypeScript errors appear in terminal

3. **Test Changes**:
   ```bash
   pnpm test
   pnpm lint
   pnpm type-check
   ```

## 📦 Package Details

### Crypto Package

**Purpose**: Core cryptographic operations
**Dependencies**: tweetnacl, tweetnacl-util
**Key Files**:
- `src/types.ts`: TypeScript definitions
- `src/crypto.ts`: Cryptographic functions
- `src/index.ts`: Public API

**Key Functions**:
```typescript
// Generate Ed25519 key pair
const keyPair = generateKeyPair();

// Sign a context key
const signedKey = signContextKey(contextKey, privateKey);

// Verify signature
const isValid = verifyContextKey(signedKey);

// Encrypt with password
const encrypted = await encryptContextKey(signedKey, password);

// Decrypt with password
const decrypted = await decryptContextKey(encrypted, password);
```

### Shared Package

**Purpose**: Common utilities and validation
**Dependencies**: zod, clsx
**Key Files**:
- `src/validation.ts`: Zod schemas
- `src/utils.ts`: Utility functions
- `src/constants.ts`: Shared constants

**Usage Example**:
```typescript
import { ContextKeySchema, cn, generateId } from '@context-key/shared';

// Validate data
const result = ContextKeySchema.parse(data);

// Combine classes
const className = cn('base-class', conditionalClass && 'conditional');

// Generate ID
const id = generateId();
```

### Vault Package

**Purpose**: Context Key creation and management
**Technology**: Next.js 14 (App Router), React, Tailwind CSS
**Key Features**:
- Multi-step key creation wizard
- Form validation with react-hook-form
- File download functionality
- Responsive design

**Key Components**:
- `src/app/page.tsx`: Landing page
- `src/app/create/page.tsx`: Key creation wizard
- `src/app/layout.tsx`: Root layout
- `src/app/globals.css`: Global styles

### Temp Chat Package

**Purpose**: Ephemeral AI chat with context loading
**Technology**: Next.js 14, OpenAI API
**Key Features**:
- Drag-and-drop key loading
- Real-time chat interface
- Context-aware responses
- Session isolation

**Key Files**:
- `src/app/page.tsx`: Main chat interface
- `src/app/api/chat/route.ts`: OpenAI API integration
- `src/app/layout.tsx`: Chat-specific layout

### Browser Extension Package

**Purpose**: Inject context into existing AI platforms
**Technology**: TypeScript, Webpack
**Key Features**:
- Cross-platform compatibility
- Local key storage
- Content script injection
- Popup interface

**Key Files**:
- `src/manifest.json`: Extension manifest
- `src/background.ts`: Service worker
- `src/content.ts`: Content script
- `src/popup.ts`: Popup interface
- `webpack.config.js`: Build configuration

### API Package

**Purpose**: Backend services for advanced features
**Technology**: Fastify, Supabase
**Key Features**:
- Document processing
- Vector search
- Memory management
- OAuth integrations

## 🧪 Testing Strategy

### Unit Tests

Each package includes unit tests for core functionality:

```bash
# Run all tests
pnpm test

# Run tests for specific package
pnpm --filter crypto test
```

### Integration Tests

Test the interaction between packages:

```bash
# Test crypto + vault integration
pnpm test:integration
```

### End-to-End Tests

Test complete user workflows:

```bash
# Test key creation and loading
pnpm test:e2e
```

## 🔍 Code Quality

### TypeScript

- **Strict Mode**: All packages use strict TypeScript
- **Type Safety**: No `any` types allowed in production code
- **Interface Design**: Prefer interfaces over types for public APIs

### ESLint Rules

Key rules enforced across the project:

```json
{
  "@typescript-eslint/no-unused-vars": "error",
  "@typescript-eslint/no-explicit-any": "warn",
  "@typescript-eslint/explicit-function-return-type": "off"
}
```

### Prettier Configuration

Consistent formatting across all files:

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
```

## 🚀 Build Process

### Development Builds

```bash
# Watch mode for development
pnpm dev:vault    # Next.js dev server
pnpm dev:api      # tsx watch mode
```

### Production Builds

```bash
# Build all packages
pnpm build

# Build specific package
pnpm build:vault
pnpm build:extension
```

### Build Outputs

| Package | Output Location | Type |
|---------|----------------|------|
| vault | `.next/` | Next.js build |
| temp-chat | `.next/` | Next.js build |
| browser-extension | `dist/` | Webpack bundle |
| api | `dist/` | TypeScript compilation |
| crypto | `dist/` | TypeScript compilation |
| shared | `dist/` | TypeScript compilation |

## 🔧 Debugging

### Common Issues

1. **TypeScript Errors**:
   ```bash
   # Clear TypeScript cache
   pnpm clean
   pnpm install
   ```

2. **Build Failures**:
   ```bash
   # Check dependencies
   pnpm type-check
   pnpm lint
   ```

3. **Runtime Errors**:
   - Check browser console for client-side errors
   - Check terminal output for server-side errors
   - Verify environment variables are set

### Debug Tools

- **React DevTools**: For debugging React components
- **Chrome DevTools**: For debugging browser extension
- **VS Code Debugger**: For debugging Node.js API

## 📝 Adding New Features

### 1. Planning

- Identify which package(s) need changes
- Design TypeScript interfaces
- Consider security implications
- Plan testing strategy

### 2. Implementation

- Create feature branch: `git checkout -b feature/your-feature`
- Add types to shared package if needed
- Implement core logic
- Add UI components if needed
- Write tests

### 3. Integration

- Update package dependencies if needed
- Test integration between packages
- Update documentation
- Submit pull request

### Example: Adding a New Crypto Function

1. **Add to crypto package**:
   ```typescript
   // packages/crypto/src/crypto.ts
   export function newCryptoFunction(input: string): string {
     // Implementation
   }
   ```

2. **Export from index**:
   ```typescript
   // packages/crypto/src/index.ts
   export { newCryptoFunction } from './crypto';
   ```

3. **Add tests**:
   ```typescript
   // packages/crypto/src/__tests__/crypto.test.ts
   describe('newCryptoFunction', () => {
     it('should work correctly', () => {
       // Test implementation
     });
   });
   ```

4. **Use in other packages**:
   ```typescript
   // packages/vault/src/some-component.tsx
   import { newCryptoFunction } from '@context-key/crypto';
   ```

## 🔒 Security Considerations

### Cryptographic Security

- **Key Generation**: Use cryptographically secure random number generation
- **Encryption**: Always use authenticated encryption (AES-GCM)
- **Signatures**: Verify all signatures before trusting data
- **Key Derivation**: Use appropriate iteration counts for PBKDF2

### Client-Side Security

- **No Secrets in Code**: Never hardcode API keys or secrets
- **Input Validation**: Validate all user inputs
- **XSS Prevention**: Sanitize any user-generated content
- **CSRF Protection**: Use appropriate CSRF tokens for state-changing operations

### API Security

- **Authentication**: Implement proper authentication for API endpoints
- **Rate Limiting**: Prevent abuse with rate limiting
- **Input Validation**: Validate all API inputs with Zod schemas
- **Error Handling**: Don't leak sensitive information in error messages

## 📊 Performance Considerations

### Bundle Size

- **Tree Shaking**: Ensure unused code is eliminated
- **Code Splitting**: Split large bundles appropriately
- **Dependencies**: Regularly audit and minimize dependencies

### Runtime Performance

- **React Optimization**: Use React.memo and useMemo appropriately
- **Crypto Operations**: Perform heavy crypto operations in Web Workers when possible
- **API Responses**: Implement appropriate caching strategies

### Monitoring

- **Build Size**: Monitor bundle sizes in CI/CD
- **Performance Metrics**: Track Core Web Vitals
- **Error Tracking**: Implement error monitoring in production

## 🔄 Release Process

### Version Management

- **Semantic Versioning**: Follow semver for all packages
- **Synchronized Releases**: All packages version together
- **Changelog**: Maintain detailed changelog

### Release Steps

1. **Prepare Release**:
   ```bash
   pnpm version patch  # or minor/major
   pnpm build
   pnpm test
   ```

2. **Create Release**:
   ```bash
   git tag v0.1.0
   git push origin v0.1.0
   ```

3. **Deploy**:
   - Vault & Temp Chat: Deploy to Vercel
   - Browser Extension: Submit to Chrome Web Store
   - API: Deploy to production server

This development guide should help you understand the project structure and contribute effectively to the Context Key project.
