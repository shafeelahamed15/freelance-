# CLAUDE.md - ClientHandle

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with Turbopack (port 3001)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Firebase Commands

- `firebase login` - Authenticate with Firebase
- `firebase use freelanceeasy-c6e6e` - Use the correct Firebase project
- `firebase deploy --only firestore:rules,firestore:indexes` - Deploy Firestore rules and indexes
- `firebase emulators:start` - Start Firebase emulators (Auth: 9099, Firestore: 8080, Functions: 5001, Hosting: 5000)

## Architecture Overview

ClientHandle is a Next.js 15 client relationship management and invoice management application with the following key architectural components:

### Tech Stack
- **Frontend**: Next.js 15 with App Router, TypeScript, Tailwind CSS
- **Backend**: Firebase (Auth, Firestore, Functions, Storage)
- **Email**: Resend API for transactional emails
- **AI**: OpenAI for template generation

### Data Model
The application uses Firestore with the following main collections:
- `users` - User profiles with brand settings
- `clients` - Client information and project details  
- `invoices` - Invoice data with line items
- `onboardingFlows` - Multi-step client onboarding workflows
- `templates` - AI-generated and custom email templates
- `emailLogs` - Email delivery tracking

### Security Architecture
- Firebase Authentication for user management
- Firestore security rules enforce user-scoped data access
- All data is scoped to `userId` to prevent cross-user access
- Client portal access allows limited public read access with specific client ID

### Key Services
- **FirestoreService** (`src/lib/firestore.ts`) - Generic CRUD operations with user scoping
- **OpenAIService** (`src/lib/openai.ts`) - AI template generation
- **Email Service** (`src/lib/email.ts`) - Resend integration for transactional emails
- **AuthGuard** (`src/components/AuthGuard.tsx`) - Route protection component

### API Routes
All API routes are in `src/app/api/`:
- `/generate-template` - AI template generation
- `/process-template` - Template processing with variables
- `/send-email` - Email sending via Resend
- `/test-email` - Email service testing

### Environment Variables Required
```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=freelanceeasy-c6e6e
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
RESEND_API_KEY=
FROM_EMAIL=
OPENAI_API_KEY=
```

### Component Structure
- Authentication flows in `src/app/auth/`
- Main dashboard and feature pages in `src/app/`
- Reusable UI components in `src/components/`
- Custom hooks in `src/hooks/`
- TypeScript types in `src/types/index.ts`

### Key Features
- Client management with onboarding workflows
- AI-powered template generation for emails and documents
- Professional invoice creation and tracking
- Email automation with delivery tracking
- Brand customization for user personalization