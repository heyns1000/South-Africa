# Fruitful South Africa Dashboard

## Overview

The Fruitful South Africa Dashboard is a comprehensive web application that showcases a multi-brand ecosystem for South African businesses. The application features a React frontend with shadcn/ui components, an Express.js backend, and integrates with multiple external services including PayPal, Firebase, Google Gemini AI, and more. The system is designed to manage and display information about various brands across three main categories: South African Brands, Logic & Automation, and Sovereign Insurance.

**Latest Update (October 17, 2025)**: The system now includes a complete **Fruitful Integration System** - a universal, portable integration layer that can be injected into any Replit application or platform. This deep code integration enables cross-system adaptation and universal deployment capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation through @hookform/resolvers

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Session Management**: PostgreSQL-based sessions using connect-pg-simple
- **API Design**: RESTful endpoints with Express routing

### Database Schema
The application uses Drizzle ORM with PostgreSQL and defines three main entities:
- **Users**: Stores user authentication and profile information with Firebase UID integration
- **Brands**: Contains comprehensive brand information including pricing, descriptions, and system integration details
- **API Keys**: Manages external service API keys and their active status

## Key Components

### Authentication System
- **Firebase Integration**: Uses Firebase Auth for user authentication
- **Multiple Sign-in Methods**: Email/password, anonymous authentication
- **Session Management**: Server-side session storage with PostgreSQL
- **User Management**: Automatic user creation and Firebase UID mapping

### Brand Management
- **Dynamic Brand Display**: Three categories of brands with different pricing structures
- **Partner Pricing**: Toggle between standard and partner pricing models
- **Search and Filtering**: Real-time search across brand names, descriptions, and taglines
- **Modal System**: Detailed brand information in responsive modals

### External Service Integrations
- **PayPal SDK**: Complete payment processing with order creation and capture
- **Google Gemini AI**: Text summarization, sentiment analysis, and image processing
- **Firebase**: Authentication and potential Firestore integration
- **Multiple API Services**: Google Maps, Spotify, Xero accounting integration

### UI/UX Components
- **Theme System**: Dark/light mode toggle with CSS custom properties
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints
- **Component Library**: Comprehensive shadcn/ui component suite
- **Interactive Elements**: Charts, progress indicators, and data visualization

## Data Flow

1. **Client Requests**: React frontend makes API calls through TanStack Query
2. **Express Routing**: Server routes handle API endpoints with middleware for logging
3. **Database Operations**: Drizzle ORM manages PostgreSQL interactions
4. **External APIs**: Server-side calls to PayPal, Gemini AI, and other services
5. **Response Handling**: JSON responses with proper error handling and status codes
6. **State Management**: Client-side caching and synchronization via React Query

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React 18, React DOM, React Hook Form
- **Build Tools**: Vite, TypeScript, ESBuild for production builds
- **UI Libraries**: Radix UI primitives, Lucide React icons, Recharts for data visualization

### Backend Services
- **Database**: Neon Database (PostgreSQL) with Drizzle ORM
- **Authentication**: Firebase Auth
- **Payment Processing**: PayPal Server SDK
- **AI Services**: Google Gemini AI
- **Additional APIs**: Google Maps, Spotify, Xero

### Development Tools
- **Type Safety**: TypeScript with strict configuration
- **Code Quality**: ESLint configuration through Vite
- **Database Management**: Drizzle Kit for migrations and schema management
- **Development Experience**: Replit integration with hot module replacement

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with Express backend
- **Hot Reload**: Vite HMR for frontend, tsx for backend auto-restart
- **Environment Variables**: Separate configuration for development and production
- **Database**: Neon Database connection for development

### Production Build
- **Frontend**: Vite build process outputs to `dist/public`
- **Backend**: ESBuild bundles server code to `dist/index.js`
- **Static Assets**: Served through Express static middleware
- **Process Management**: Single Node.js process serving both frontend and API

### Environment Configuration
- **Database URL**: PostgreSQL connection string via environment variables
- **API Keys**: Secure storage of external service credentials
- **Firebase Config**: Client-side configuration with fallback defaults
- **PayPal Environment**: Automatic sandbox/production switching based on NODE_ENV

### Security Considerations
- **API Key Management**: Server-side storage and validation
- **CORS Configuration**: Appropriate cross-origin request handling
- **Session Security**: PostgreSQL-backed session storage
- **Input Validation**: Zod schemas for request validation
- **Error Handling**: Comprehensive error middleware with appropriate status codes