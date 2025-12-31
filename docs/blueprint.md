# **System Blueprint: BadminTour Platform**

**Version**: 2.0 (Live Implementation)
**Status**: Active Development

---

## **1. Technology Stack**

### **Core Framework**
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS + Shadcn/UI (Radix Primitives)
- **Animations**: Framer Motion
- **Icons**: Lucide React

### **Backend & Data**
- **BaaS**: Firebase (Firestore, Authentication, Storage)
- **SDKs**:
  - `firebase/app` & `firebase/firestore`: Client-side interactions.
  - `firebase-admin`: Server-side API logic & privileged operations.
- **State Management**: React Query (TanStack Query) v5

### **Authentication**
- **Library**: NextAuth.js (v4)
- **Strategies**:
  - **Google OAuth**: Primary login method.
  - **PIN Login**: Custom Credentials Provider (6-digit PIN) for quick access.
- **Role Management**: RBAC (Role-Based Access Control)
  - **Roles**: `member` (Default), `admin`, `host`, `coach`, `superadmin`.
  - **Mechanism**: Roles stored in Firestore (`users` collection) and synced to Session via JWT callbacks.

---

## **2. System Architecture & Routing**

### **Public Zone (Guest Accessible)**
- `/`: Landing Page (Hero, Bento Grid Services, Upcoming Events, Testimonials).
- `/events/[id]`: Event Detail Page (Dynamic booking form for Guests & Members).
- `/schedule`: Public calendar view.

### **Member Zone (Protected: `member` role)**
- `/member/dashboard`: Personalized hub (Upcoming match, Stats, Quick Actions).
- `/member/mabar`: "Main Bareng" listing and joining.
- `/member/coaching`: Drilling & Private Coaching booking.
  - Features: Coach list (real-time), Skill level filtering, Private session request.
- `/member/tournament`: Tournament specific info & internal registration.
- `/member/tickets`: QR Code tickets for booked events.
- `/member/history`: Booking history (Paid, Confirmed, Cancelled).
- `/member/profile`: Identity Card, Badge display, Profile editing.

### **Admin Zone (Protected: `admin` / `host` role)**
- `/admin/dashboard`: Business Intelligence (Revenue, Member Count, Fill Rate, Recent Activity).
- `/admin/events`: Event Management (Create, Edit, Delete).
  - **Features**: Tournament Bracket settings, Quota management, Partner assignments.
- `/admin/participants`: Participant management (Approve/Reject, Mark Paid, Check-in).
- `/admin/users`: Member database & Role assignment.
- `/admin/finance`: Financial Control Center.
  - **Ledger**: View all journal entries.
  - **Transactions**: Create Expense, Income, Transfer, Journal.
  - **Reports**: Profit & Loss, Cashflow.
- `/admin/inventory`: Stock & Asset Management.
  - **Stock**: Manage items, restock, and usage.
  - **Assets**: Register fixed assets and track value.

---

## **3. Database Schema (Firestore)**

### **`users`**
- `uid`: String (Auth ID)
- `name`: String
- `nickname`: String (Derived from name or set by user)
- `email`: String
- `phoneNumber`: String (WhatsApp)
- `role`: String (Active role)
- `roles`: String[] (Available roles)
- `pin`: String (6-digit, unique)
- `image`: String (URL)
- `stats`: Map (matchesPlayed, wins, etc.)

### **`events`**
- `title`: String
- `type`: 'mabar' | 'tournament' | 'coaching'
- `date`: ISOString
- `time`: String ("19:00 - 23:00")
- `location`: String
- `price`: Number
- `quota`: Number
- `bookedSlot`: Number (Atomic increment)
- `hostId`: String (Ref to `users`)
- `coachNickname`: String (Optional, for Coaching)
- `isInternalTournament`: Boolean
- `allowedUserTypes`: ['member', 'guest']

### **`bookings`**
- `bookingCode`: String (e.g., "BT-MAB-9X8Y")
- `userId`: String (Ref to `users`)
- `eventId`: String (Ref to `events`)
- `status`: 'pending_payment' | 'pending_approval' | 'paid' | 'confirmed' | 'cancelled'
- `totalPrice`: Number
- `partnerName`: String (For tournaments)
- `createdAt`: ISOString

### **`notifications`**
- `userId`: String
- `title`: String
- `message`: String
- `type`: 'booking' | 'system' | 'payment'
- `isRead`: Boolean

### **`finance_accounts` (Chart of Accounts)**
- `code`: String (e.g., "1-100")
- `name`: String (e.g., "Kas Besar")
- `type`: 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE' | 'COGS'
- `category`: 'CASH' | 'BANK' | 'INVENTORY' | ...
- `balance`: Number (Current Balance)
- `isActive`: Boolean

### **`finance_ledger` (Journal Entries)**
- `id`: String
- `date`: ISOString
- `description`: String
- `reference`: String (e.g., "EXP-20231001-001")
- `type`: 'EXPENSE' | 'REVENUE' | 'TRANSFER' | 'JOURNAL' | 'COGS'
- `amount`: Number
- `entries`: Array
  - `accountCode`: String
  - `debit`: Number
  - `credit`: Number
- `proofImage`: String (Base64/URL)
- `metadata`: Map (e.g., inventoryId, bookingId)
- `createdAt`: ISOString
- `createdBy`: String (Admin ID)

### **`inventory_items`**
- `id`: String
- `name`: String
- `sku`: String
- `category`: String
- `type`: 'CONSUMABLE' | 'ASSET'
- `quantity`: Number
- `unit`: String (pcs, box)
- `costPrice`: Number (Avg Cost)
- `sellPrice`: Number
- `minStock`: Number
- `location`: String

### **`inventory_transactions`**
- `id`: String
- `itemId`: String
- `type`: 'IN' | 'OUT' | 'ADJUSTMENT'
- `quantity`: Number
- `date`: ISOString
- `relatedJournalId`: String (Ref to `finance_ledger`)
- `reason`: String

---

## **4. Key Workflows**

### **Booking Logic**
1.  **Guest**: Fills Name & WhatsApp -> Checks if phone number exists in `users`.
    *   If Yes: Links booking to existing Member.
    *   If No: Creates Guest booking.
2.  **Member**: Auto-fills profile data.
3.  **Concurrency**: Uses Firestore Transactions to ensure No Double Booking & Quota Integrity.
4.  **Status**:
    *   Mabar/Coaching -> `pending_payment` -> Admin marks `paid` -> `confirmed`.
    *   Tournament -> `pending_approval` -> Admin approves -> `pending_payment`...

### **Admin Dashboard**
- **Real-time Data**: Fetches directly from Firestore.
- **Metrics**:
  - **Revenue**: Sum of `totalPrice` from valid bookings.
  - **Fill Rate**: Percentage of booked slots vs total quota.
  - **Activity**: Live feed of new bookings (shows Nicknames).

### **Financial Automation**
1.  **Booking Payment**:
    *   System records Debit `Cash/Bank`, Credit `Revenue`.
    *   Generates `finance_ledger` entry automatically.
2.  **Expense Recording**:
    *   Admin enters expense details + split categories.
    *   System validates Debit (Expenses) == Credit (Source Fund).
3.  **Inventory Usage**:
    *   Restock: Debit `Inventory`, Credit `Cash/Bank`.
    *   Usage/Sale: Debit `COGS`, Credit `Inventory`.

---

## **5. Design System**

### **Aesthetics**
- **Theme**: Premium Sports Dark Mode.
- **Colors**:
  - Background: `#0a0a0a` / `#151515` (Zinc-950)
  - Primary: `#ca1f3d` (BadminTour Red)
  - Accent: `#ffbe00` (Gold)
  - Surface: Glassmorphism (`backdrop-blur-xl`, `bg-white/5`)
- **Typography**: Sans-serif (Geist / Inter).
- **Components**:
  - **Cards**: Rounded 2.5rem (`rounded-[2.5rem]`), often with subtle border gradients.
  - **Inputs**: Material Design 3 style (Filled container with bottom indicator).
  - **Motion**: Fluid page transitions and subtle hover lifts.
