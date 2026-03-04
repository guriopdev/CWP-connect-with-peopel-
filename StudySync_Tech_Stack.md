# StudySync -- Official Tech Stack (100% Free, No Trials)

This document defines the complete technology stack for StudySync. All
tools listed below are fully free to use with no trial traps.

------------------------------------------------------------------------

## 1. Frontend

### Framework

-   Next.js (App Router)
-   React (via Next.js)

Why: - Production ready - Built-in routing - API routes support -
Scalable architecture

------------------------------------------------------------------------

## 2. Styling & UI

### Tailwind CSS

-   Utility-first CSS framework
-   Fully free
-   Easy dark/light theme support

### shadcn/ui

-   Free modern component library
-   Built on Tailwind
-   Fully customizable
-   No paid version

Used For: - Navbar - Cards - Buttons - Dialogs - Inputs - Dropdowns

### Framer Motion

-   Free animation library
-   Used for:
    -   Parallax effects
    -   Smooth transitions
    -   Scroll animations

------------------------------------------------------------------------

## 3. Backend

### Next.js API Routes

-   Built into Next.js
-   No separate backend required
-   Free and scalable

Alternative: - Node.js + Express (if separate backend preferred)

------------------------------------------------------------------------

## 4. Database

### Recommended: PostgreSQL

Why: - Best for relational data - Strong consistency - Ideal for: -
Users - Rooms - Friends - Messages - Todos

### ORM

-   Prisma ORM (Free)

------------------------------------------------------------------------

## 5. Free Database Hosting Options

Choose one:

### Neon

-   Free serverless PostgreSQL
-   Good for production

### Supabase

-   Free PostgreSQL
-   Optional built-in Auth & Storage

### Railway (Hobby Tier)

-   Free basic hosting

------------------------------------------------------------------------

## 6. Authentication

### NextAuth.js (Auth.js)

-   Free
-   Google OAuth support
-   JWT session handling

Alternative: - Supabase Auth (Free)

------------------------------------------------------------------------

## 7. Real-Time Communication

### Socket.io

-   Free
-   Used for:
    -   Room chat
    -   DM chat
    -   Room updates
    -   Online status

Alternative: - Native WebSockets

------------------------------------------------------------------------

## 8. Video Calling

### WebRTC (Self-Hosted)

-   Fully free
-   Peer-to-peer connection
-   No platform fees

Requirements: - STUN server (Google public STUN works) - Optional TURN
server (future scaling)

Avoid paid platforms like: - Agora - Twilio - Daily.co

------------------------------------------------------------------------

## 9. File Storage (Profile Pictures)

Options: - Supabase Storage (Free) - Cloudinary (Free tier) - Local
server storage

------------------------------------------------------------------------

## 10. Deployment

### Frontend Hosting

-   Vercel (Free Hobby Plan)
-   Netlify (Free Plan)

### Backend Hosting (if separate)

-   Railway
-   Render
-   Or use Next.js API routes on Vercel

------------------------------------------------------------------------

## 11. Dark Mode Implementation

Use Tailwind dark mode strategy:

Example: className="bg-white dark:bg-black text-black dark:text-white"

Primary Accent Color: - Purple (#7C3AED)

Light Mode: - White + Purple

Dark Mode: - Black + Purple

------------------------------------------------------------------------

## 12. Final Recommended Stack

Frontend: - Next.js - Tailwind CSS - shadcn/ui - Framer Motion

Backend: - Next.js API Routes

Database: - PostgreSQL (Neon or Supabase) - Prisma ORM

Authentication: - NextAuth.js + Google OAuth

Real-Time: - Socket.io

Video: - WebRTC (custom implementation)

Hosting: - Vercel + Neon

------------------------------------------------------------------------

This stack is: - 100% free - No trials - No vendor lock-in - Scalable -
Resume-worthy
