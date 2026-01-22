# Form Administration Module

A full-stack form administration application with AI-powered form generation capabilities.

## Tech Stack

- **Backend**: NestJS with PostgreSQL (TypeORM)
- **Frontend**: Vite  + React
- **AI Integration**: Mistral AI API for intelligent form generation

## Project Structure

```
form/
├── backend/                    # NestJS application
│   ├── src/
│   │   ├── forms/             # Form module (entities, DTOs, controllers, services)
│   │   ├── fields/            # Field module (entities, DTOs, validators, controllers, services)
│   │   ├── ai/                # AI service module (controller, service, DTOs)
│   │   ├── database/          # Database configuration and migrations
│   │   ├── app.module.ts      # Root application module
│   │   └── main.ts            # Application entry point
│   ├── dist/                  # Compiled JavaScript output
│   ├── package.json
│   └── tsconfig.json
├── frontend/                  # React application
│   ├── src/
│   │   ├── actions/           # Async actions (API calls, business logic)
│   │   ├── components/        # React components (UI components, dialogs, editors)
│   │   │   └── ui/            # Reusable UI components (buttons, checkboxes, etc from shadcn)
│   │   ├── pages/             # Page components (FormEditor, FormList)
│   │   ├── services/           # API service layer
│   │   ├── stores/             # Zustand state management stores (Flux)
│   │   ├── types/              # TypeScript type definitions
│   │   ├── util/               # Utility functions
│   │   ├── lib/                # Library utilities
│   │   ├── styles/             # Global CSS styles
│   │   ├── App.tsx             # Root component
│   │   └── main.tsx            # Application entry point
│   ├── package.json
│   └── vite.config.ts
├── package.json               # Root workspace configuration
└── README.md
```

## Prerequisites

- Node.js >= 18.0.0
- PostgreSQL database
- Mistral AI API key (for AI form generation)

## Getting Started

### 1. Install Dependencies

From the root directory:

```bash
npm install
```

This will install dependencies for both backend and frontend workspaces.

### 2. Environment Setup

Configure the environment variables for the backend. Create a `.env` file in the `backend/` directory:

```bash
cd backend
```

```bash
cp .env.sample .env
```


Contact the administrator to obtain the remote environment values. This ensures no local configuration is required and maintains consistency across environments.

### 3. Run Development Servers

Start both backend and frontend simultaneously:

```bash
npm run dev
```

Or run them separately:

```bash
# Backend only (runs on http://localhost:3000)
npm run dev:backend

# Frontend only (runs on http://localhost:5173)
npm run dev:frontend
```

You can open http://localhost:5173 and enjoy the app!

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both backend and frontend in development mode |
| `npm run dev:backend` | Start backend in watch mode |
| `npm run dev:frontend` | Start frontend dev server |
| `npm run build` | Build both workspaces |
| `npm run test` | Run tests in all workspaces |
| `npm run lint` | Run linting in all workspaces |

## Features

- **Form Management**: Create, edit, and delete forms
- **Field Types**: Support for text, number, and dropdown fields
- **Drag & Drop**: Reorder fields with intuitive drag-and-drop
- **AI Generation**: Generate form structures from natural language descriptions
- **Publishing**: Control form visibility with publish/unpublish

## Technical Choices

### 1. PostgreSQL

- **Structured Data**: Forms require structured data storage, no need for document flexibility
- **Cloud-Ready**: Web services for form creation always rely on cloud infrastructure
- **TypeORM**: Straightforward ORM that abstracts database complexity

### 2. NestJS

- **TypeScript First**: Full TypeScript support with strong typing
- **Structured Framework**: Opinionated structure for maintainability
- **Layered Architecture**: Clear separation of concerns (controllers, services, repositories)

### 3. React + Vite

- **Fast Build Configuration**: Very easy and fast build setup
- **Zustand State Management**: 
  - Simplicity for medium-sized applications
  - Lower boilerplate compared to pure Redux (which offers higher scalability)
- **Flux Pattern**: 
  - Actions separate business logic from state management (stores) and component rendering
  - Multiple stores and reducers for improved readability and maintainability

### 4. Mistral AI API

- **LLM on Demand**: On-demand language model service
- **French Language Support**: Native French language capabilities 😉
- **Free Tier**: Free to use for development and POC
- **Perfect for POC**: Ideal for proof of concept and rapid prototyping


