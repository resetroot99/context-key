# Context Key

**A portable, secure AI context system that puts users in control of their data.**

Context Key is a revolutionary approach to AI personalization that gives users complete control over their data. Create a secure, encrypted "key" that contains your preferences, knowledge, and policies for interacting with AI assistants. This key can then be loaded into any compatible chat application, providing instant personalization without sacrificing privacy.

## 🚀 Quick Start

### Prerequisites

- Node.js (v18.0.0 or higher)
- pnpm (v8.0.0 or higher)
- OpenAI API key (for Temp Chat functionality)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/resetroot99/context-key.git
   cd context-key
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   ```bash
   # For Temp Chat (packages/temp-chat/.env.local)
   OPENAI_API_KEY=your_openai_api_key_here
   ```

### Running the Applications

**Vault (Context Key Creator):**
```bash
pnpm dev:vault
# Runs on http://localhost:3000
```

**Temp Chat (Ephemeral Chat):**
```bash
pnpm dev:temp-chat
# Runs on http://localhost:3001
```

**API Server:**
```bash
pnpm dev:api
# Runs on http://localhost:3002
```

## 🏗️ Architecture

This project is organized as a monorepo with the following packages:

```
packages/
├── vault/              # Context Key creation and management (App A)
├── temp-chat/          # Ephemeral chat application (App B)
├── browser-extension/  # Browser extension for seamless integration
├── api/               # Backend API services
├── crypto/            # Core cryptographic functions
└── shared/            # Shared utilities and types
```

### Core Components

| Component | Purpose | Technology |
|-----------|---------|------------|
| **Vault** | Create and manage Context Keys | Next.js, React, Tailwind CSS |
| **Temp Chat** | Ephemeral AI chat with context loading | Next.js, OpenAI API |
| **Browser Extension** | Inject context into existing AI chats | TypeScript, Webpack |
| **API** | Backend services for document processing | Fastify, Supabase |
| **Crypto** | Cryptographic operations | tweetnacl, Web Crypto API |
| **Shared** | Common utilities and validation | Zod, TypeScript |

## 🔐 Security Model

Context Key implements a **zero-trust, client-side encryption** model:

- **Ed25519 Digital Signatures**: Every Context Key is cryptographically signed
- **AES-GCM Encryption**: Keys are encrypted with user-provided passwords
- **PBKDF2 Key Derivation**: Secure password-based encryption
- **No Server Storage**: Unencrypted data never leaves your device

### Cryptographic Flow

1. **Key Generation**: Ed25519 key pair generated in browser
2. **Signing**: Context Key data is signed with private key
3. **Encryption**: Signed key is encrypted with user password
4. **Storage**: Only encrypted blob is stored/transmitted

## 📱 Applications

### Vault (App A) - Context Key Creator

The Vault is where users create and manage their Context Keys. It provides:

- **Profile Setup**: Define your communication style and expertise areas
- **Privacy Controls**: Set data handling and memory policies
- **Secure Generation**: Create encrypted, signed Context Keys
- **File Management**: Download and organize your keys

**Key Features:**
- Multi-step wizard for easy setup
- Real-time validation and feedback
- Secure password-based encryption
- Downloadable `.ckey` files

### Temp Chat (App B) - Ephemeral AI Chat

Temp Chat is a stateless chat application that loads Context Keys for personalized AI interactions:

- **Context Loading**: Upload and decrypt Context Keys
- **Personalized Chat**: AI adopts your defined persona and knowledge
- **Ephemeral Sessions**: No data persistence beyond the session
- **OpenAI Integration**: Powered by GPT models

**Key Features:**
- Drag-and-drop key loading
- Real-time chat interface
- Context-aware AI responses
- Session isolation

### Browser Extension - Universal Integration

The browser extension enables Context Key integration with existing AI chat platforms:

- **Platform Support**: ChatGPT, Claude, Bard, Perplexity
- **Seamless Injection**: Add context without leaving the platform
- **Local Storage**: Secure key management in browser
- **Cross-Platform**: Works across supported AI services

### API - Backend Services

The API provides backend functionality for advanced features:

- **Document Processing**: Extract and chunk text from various formats
- **Vector Search**: Semantic search across user documents
- **Memory Management**: Store and retrieve conversation memories
- **Integration Services**: Connect with external data sources

## 🛠️ Development

### Project Structure

```
context-key/
├── .cursorrules           # AI-assisted development guidelines
├── .eslintrc.json        # ESLint configuration
├── .prettierrc           # Code formatting rules
├── package.json          # Root package configuration
└── packages/
    ├── vault/            # Next.js app for key creation
    │   ├── src/app/      # App Router pages
    │   ├── src/components/ # React components
    │   └── src/lib/      # Utility functions
    ├── temp-chat/        # Next.js app for ephemeral chat
    │   ├── src/app/      # App Router pages
    │   └── src/api/      # API routes
    ├── browser-extension/ # Browser extension
    │   ├── src/          # Extension source code
    │   └── webpack.config.js # Build configuration
    ├── api/              # Backend API
    │   └── src/          # Fastify server
    ├── crypto/           # Cryptographic functions
    │   └── src/          # Core crypto utilities
    └── shared/           # Shared utilities
        └── src/          # Common types and functions
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev:vault` | Start Vault development server |
| `pnpm dev:temp-chat` | Start Temp Chat development server |
| `pnpm dev:api` | Start API development server |
| `pnpm build` | Build all packages |
| `pnpm lint` | Run ESLint on all packages |
| `pnpm format` | Format code with Prettier |
| `pnpm test` | Run tests across all packages |

### Adding New Features

1. **Identify the Package**: Determine which package your feature belongs to
2. **Follow Conventions**: Use the established patterns and naming conventions
3. **Update Types**: Add TypeScript types in the appropriate package
4. **Write Tests**: Include tests for new functionality
5. **Update Documentation**: Document new features and APIs

## 🔧 Configuration

### Environment Variables

**Temp Chat (.env.local):**
```bash
OPENAI_API_KEY=your_openai_api_key_here
```

**API (.env):**
```bash
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key_here
```

### Customization

The project is designed to be highly customizable:

- **Themes**: Modify Tailwind CSS configurations in each package
- **AI Models**: Change OpenAI model settings in API configurations
- **Crypto Parameters**: Adjust encryption settings in the crypto package
- **Validation**: Update Zod schemas in the shared package

## 🚀 Deployment

### Vault & Temp Chat (Vercel)

```bash
# Build the applications
pnpm build:vault
pnpm build:temp-chat

# Deploy to Vercel
vercel --prod
```

### Browser Extension (Chrome Web Store)

```bash
# Build the extension
pnpm build:extension

# Package for Chrome Web Store
cd packages/browser-extension/dist
zip -r context-key-extension.zip .
```

### API (Docker)

```bash
# Build and run with Docker
cd packages/api
docker build -t context-key-api .
docker run -p 3002:3002 context-key-api
```

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Repository**: https://github.com/resetroot99/context-key
- **Issues**: https://github.com/resetroot99/context-key/issues
- **Discussions**: https://github.com/resetroot99/context-key/discussions

## 🙏 Acknowledgments

- **tweetnacl**: For providing robust cryptographic primitives
- **Next.js**: For the excellent React framework
- **Tailwind CSS**: For utility-first styling
- **OpenAI**: For powerful language models
- **Supabase**: For backend infrastructure

---

**Built with ❤️ for a more private and personalized AI future.**
