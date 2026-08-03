# 🏰 Portfolio CMS (Command Center)

A premium, high-performance Headless Content Management System (CMS) designed to feed data to multiple portfolio frontends. Built with modern web technologies, this CMS acts as your central database and command center for managing projects, experience, education, and incoming communications.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

---

## ✨ Features

- **Headless Architecture:** Exposes secure REST API endpoints (`/api/...`) that any of your frontend portfolios can fetch data from.
- **Secure Authentication:** Locked down with NextAuth (GitHub Provider). Only the designated `ADMIN_EMAIL` can log in and execute `POST`, `PUT`, and `DELETE` requests.
- **Real-time Notifications:** Incoming messages from your public portfolios trigger real-time email alerts via Resend.
- **Cloud Asset Management:** Directly upload project architecture/cover images to Cloudinary from the dashboard.
- **Optimized UI/UX:** Built with Tailwind CSS, Lucide Icons, Sonner (for beautiful toast notifications), and `@tanstack/react-query` for instantaneous UI updates and caching.

---

## 🏗️ System Architecture

1. **Frontend (The Dashboard):** 
   - Uses Next.js 16 App Router.
   - Protected routes using NextAuth middleware.
   - React Query manages data fetching, caching, and mutation invalidation to keep the UI snappy.
2. **Backend (API Routes):**
   - Serverless Next.js API routes (`app/api/...`) interface directly with MongoDB using Mongoose.
   - Routes are separated into `GET` (publicly accessible by your frontend portfolios) and `POST/PUT/DELETE` (secured, require an active admin session).
3. **Database Layer:**
   - **MongoDB** stores `Projects`, `Experience`, `Education`, `About`, and `Messages`.
4. **External Services:**
   - **Cloudinary:** Handles image hosting and delivery.
   - **Resend:** Delivers encrypted payload emails to the admin when a new message hits the inbox.
   - **GitHub OAuth:** Handles identity verification.

---

## ⚙️ Environment Variables

To run this project locally, you must create a `.env.local` file in the root directory and populate it with the following keys:

```env
# Database
MONGODB_URI="mongodb+srv://<user>:<password>@cluster.mongodb.net/portfolio"

# Authentication (NextAuth)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your_super_secret_random_string" # Run `openssl rand -base64 32` to generate

# GitHub OAuth (For Admin Login)
GITHUB_ID="your_github_oauth_client_id"
GITHUB_SECRET="your_github_oauth_client_secret"

# Admin Identity (Only this email can access the dashboard)
ADMIN_EMAIL="your.email@example.com"

# Cloudinary (Image Hosting)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name"
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="your_unsigned_upload_preset"

# Resend (Email Notifications)
RESEND_API_KEY="re_your_resend_api_key"
```

---

## 🚀 Setup & Installation

Follow these steps to deploy the Command Center on your local machine:

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/portfolio-cms.git
cd portfolio-cms
```

### 2. Install Dependencies
Make sure you have Node.js (v18+ recommended) installed.
```bash
npm install
```

### 3. Configure External Services
Before starting the server, ensure you have set up the following:
- **MongoDB:** Create a free cluster on MongoDB Atlas, get your connection string, and add it to `.env.local`.
- **GitHub OAuth:** Go to GitHub Settings > Developer Settings > OAuth Apps. Create a new app (Callback URL: `http://localhost:3000/api/auth/callback/github`).
- **Cloudinary:** Create a free account, go to Settings > Upload, and create an **Unsigned** upload preset.
- **Resend:** Create an API key at resend.com.

### 4. Start the Development Server
```bash
npm run dev
```

The CMS will be available at [http://localhost:3000](http://localhost:3000). 
Navigate to `/login` and authenticate with your GitHub account (make sure the GitHub email matches your `ADMIN_EMAIL`).

---

## 📂 Folder Structure

```text
portfolio-cms/
├── app/
│   ├── admin/            # Secure CMS Dashboard pages (Projects, Inbox, etc.)
│   ├── api/              # Headless REST API routes & NextAuth endpoints
│   ├── globals.css       # Global styles & Tailwind configuration
│   ├── layout.tsx        # Root layout with providers (React Query, NextAuth)
│   └── icon.svg          # Application Favicon
├── components/           # Reusable UI components and modal forms
├── lib/                  # Core utilities (e.g., MongoDB connection logic)
├── models/               # Mongoose database schemas (About, Project, etc.)
├── public/               # Static assets (logo.svg)
├── .env.local            # Environment variables (do not commit)
├── next.config.mjs       # Next.js configuration settings
├── tailwind.config.ts    # Tailwind CSS design tokens
└── README.md
```

---

## 📡 API Endpoints (For your Frontend Portfolios)

Your external portfolios (e.g., minimalist web app, 3D terminal app) can consume data from these endpoints.

- **GET `/api/projects`** - Returns an array of all projects.
- **GET `/api/experience`** - Returns an array of career milestones.
- **GET `/api/education`** - Returns academic history.
- **GET `/api/about`** - Returns your global profile configuration (bio, tagline, skills).
- **POST `/api/contact`** - Endpoint for your public contact forms. Expects JSON body: `{ "name": "...", "email": "...", "message": "..." }`.

*(Note: Data mutation endpoints like PUT and DELETE are strictly protected and will reject unauthenticated requests.)*
