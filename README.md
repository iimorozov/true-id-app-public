## Prerequisites

-   Node.js 22+ (required)

-   pnpm package manager

## Getting Started

### Installation

-   Ensure you have Node.js 22 or later installed:
       ```bash 
       node  --version
       # Should display v22.x.x or higher

-   Install pnpm if you don't have it already:
    ```bash 
    npm  install  -g  pnpm
-   Clone the repository and install dependencies:
    ```bash
    git  clone  <repository-url>
    cd  <project-directory>
    pnpm  install

## Development Mode

To run the project in development mode, simply install the dependencies with `pnpm i` and run the script `pnpm dev`, which will automatically set the `VITE_API_URL` environment variable to `https://support-stg-now.truevisions.co.th` and start the application in development mode.

### API Configuration

The `VITE_API_URL` environment variable is used in `vite.config.ts` to configure the development server's proxy settings. All requests to `/api/*` paths are automatically forwarded to the configured API URL, allowing seamless integration with the backend during development without CORS issues.

### Running with Docker

For Docker deployment, similar environment variables are used:
- `API_URL`: Sets the base URL for API requests
- `API_HOST`: Sets the hostname for the Nginx configuration

These can be configured in the `docker-compose.yml` file or passed as environment variables when starting containers.

### Private Package Authentication

The project depends on `@tdg/trueid-web-sdk`, which is a private npm package hosted in TrueDigital's private repository. To access this package, you need an authentication token:

- `NPM_TOKEN`: Authentication token for the TrueDigital npm registry

This token is required when building the Docker image or when installing dependencies locally. For security reasons, we don't provide this token by default in the repository. You must obtain a valid token from the TrueDigital team.

When building with Docker:
```bash
NPM_TOKEN=your_token_here docker-compose up --build
```

For local development, you'll need to configure your `.npmrc` file with the appropriate registry and token settings. Contact your team administrator for the correct configuration.
