# E-Commerce Skeleton

A modern, full-stack e-commerce skeleton built with the bleeding edge of the React ecosystem. This project provides a robust foundation for building scalable, high-performance online stores with seamless user experiences and secure backend integrations.

## 🚀 Tech Stack

### Core

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand)

### UI & Styling

- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Components:** [shadcn/ui](https://ui.shadcn.com/) (built on [Radix UI](https://www.radix-ui.com/))
- **Icons:** [Lucide React](https://lucide.dev/)
- **Theming:** `next-themes` for Dark/Light mode support
- **Alerts/Toasts:** [Sonner](https://sonner.emilkowal.ski/)
- **Carousels:** [Embla Carousel](https://www.embla-carousel.com/)

### Backend & Database

- **ORM:** [Prisma](https://www.prisma.io/)
- **Database:** PostgreSQL (Optimized for [Neon Serverless](https://neon.tech/))
- **Authentication:** [Better Auth](https://better-auth.com/) with `bcrypt` / `argon2`

### Utilities

- **Validation:** [Zod](https://zod.dev/)
- **Money Handling:** `currency.js`

## 📦 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- PostgreSQL database

### Installation

1. Clone the repository and install dependencies:

   ```bash
   npm install
   ```

2. Set up your environment variables:
   Create a `.env` file in the root directory and configure your database and authentication secrets.

3. Run Prisma migrations / generate the client:

   ```bash
   npx prisma generate
   # Run migrations depending on your DB setup
   # npx prisma db push  OR  npx prisma migrate dev
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🛠️ Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the app for production.
- `npm run start`: Runs the built app in production mode.
- `npm run lint`: Lints the codebase using ESLint.
- `npm run type-check`: Checks for TypeScript errors.
- `npm run format`: Formats code using Prettier.
- `npm run prisma:studio`: Opens Prisma Studio to view and edit database records.

## 🔒 Authentication Flow

The skeleton uses **Better Auth** to provide secure, robust user sessions. It handles standard email/password authentication (hashed via bcrypt/argon2) and links gracefully with the Prisma database schema for storing user profiles, payment methods, and addresses.

## 🛒 Cart & State Management

Global application state, particularly the shopping cart and user sessions, is managed via **Zustand**. It provides a lightweight, fast, and scalable alternative to React Context for inter-component state synchronisation.

## 🎨 Styling Convention

- **Tailwind CSS v4** is used for utility-first styling.
- Extensively uses **shadcn/ui** for accessible, unstyled, and customizable foundational components (accessible via `components/ui`).
