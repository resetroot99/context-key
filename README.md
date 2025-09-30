# Context Key

**A portable, secure AI context system that puts users in control of their data.**

Context Key is a project to build a decentralized, user-owned AI context management system. It allows users to create a secure, encrypted "key" that contains their preferences, knowledge, and policies for interacting with AI assistants. This key can then be loaded into any compatible chat application, providing instant personalization without sacrificing privacy.

## Core Concepts

*   **Context Key**: An encrypted file (`.ckey`) that holds all your AI-related data.
*   **App A (The Vault)**: A web application for creating, managing, and updating your Context Key.
*   **App B (Temp Chat)**: An ephemeral, stateless chat application that can load a Context Key for a single session.
*   **Secure by Default**: All cryptographic operations happen in the browser. Your unencrypted data and passwords are never sent to a server.

## Project Structure

This is a monorepo managed with pnpm workspaces.

*   `packages/app`: The main Next.js web application that contains both the Vault (App A) and the Temp Chat (App B).
*   `packages/crypto`: A dedicated package for all cryptographic functions. It is a dependency of the `app` package.

## Getting Started

### Prerequisites

*   Node.js (v18.0.0 or higher)
*   pnpm (v8.0.0 or higher)

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/resetroot99/tool.git
    cd tool
    ```

2.  Install dependencies from the root directory:
    ```bash
    pnpm install
    ```

### Development

To run the development server for the web application:

```bash
pnpm dev
```

This will start the Next.js application on `http://localhost:3000`.

### Building for Production

To build the application for production:

```bash
pnpm build
```

This will create an optimized production build in the `packages/app/.next` directory.

### Running Tests

To run the tests for all packages:

```bash
pnpm test
```

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

