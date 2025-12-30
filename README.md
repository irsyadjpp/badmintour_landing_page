# BadminTour - Badminton Event Management Platform

BadminTour is a comprehensive web application designed to manage badminton events, communities, and coaching sessions. It features a modern, high-performance landing page and a robust member area for booking and management.

## 🚀 Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/) (Radix Primitives)
- **Database**: Firebase Firestore
- **Authentication**: NextAuth.js (Custom Credentials with Firebase)
- **Storage**: Firebase Storage
- **Icons**: Lucide React

## ✨ Key Features

### 🌍 Public Landing Page
- **Dynamic Event Listing**: Real-time display of Mabar (Sparring) and Drilling (Training) sessions.
- **Responsive Design**: Optimized for mobile and desktop with a "Gen-Z" sporty aesthetic.
- **Guest Booking**: Validates guest checkouts and links bookings to phone numbers.
- **Interactive Elements**: Animated cards, glassmorphism effects, and dynamic gradients.

### 👤 Member Area
- **Dashboard**: personalized view of active schedules ("Jadwal Saya") with real-time status.
- **Drilling & Clinic**: Dedicated page for booking coaching sessions with "Join/Leave" class logic.
- **Mabar & Sparring**: Find and join community games.
- **Tournaments**: Internal tournament registration with approval workflows.
- **Profile Management**: Update personal details, avatar, and view membership info.
- **Jersey Pre-order**: Track exclusive merchandise orders.

### 🛡️ Admin & Host Dashboard
- **Event Management**: Create, edit, and manage Mabar, Drilling, or Tournament events.
- **Participant Management**: View avatar stacks, approve/reject tournament applicants, and mark payments.
- **Host Features**: Auto-filled coach nicknames and partner assignment logic.

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+
- NPM or Bun

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/irsyadpp/badmintour-landing-page.git
   cd badmintour_landing_page
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory and add your Firebase and NextAuth credentials:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
   # ... other firebase config
   NEXTAUTH_SECRET=...
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser.

## 📂 Project Structure

- `src/app`: App Router pages (Public, Member, Admin).
- `src/components`: Reusable UI components (Shadcn) and feature-specific blocks (Layout, Host).
- `src/lib`: Utilities, Firebase Admin setup, and Auth configuration.
- `public`: Static assets (Images, Logos).

## 🎨 Design System

The project uses a custom design system based on Material Design 3 principles but adapted for a sporty, dark-mode aesthetic:
- **Primary Colors**: Gold (`#ffbe00`) and Red (`#ca1f3d`).
- **Accent**: Neon Cyan (`#00f2ea`) for Training/Drilling zones.
- **Typography**: Inter / Sans-serif with bold headings.

---

Built with ❤️ by the BadminTour Team.
