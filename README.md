# Role-Based Project Management System

A full-stack project management application with strict invite-only user registration and Role-Based Access Control (RBAC).

## Connect to GitHub
NOTE: This repository uses local commits as requested. Commits follow Semantic Commit Messages.

## Tech Stack
- **Frontend**: React, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express, TypeScript, MongoDB (Native Driver)
- **Auth**: JWT, BCrypt, Role-Based Middleware

## Features
- **Invite-Only Registration**: Users can only register if invited by an Admin via a generated token.
- **RBAC**: 
  - **ADMIN**: Invites users, manages users (role/status), manages all projects (edit/soft-delete).
  - **MANAGER/STAFF**: Can create projects and view all projects. Cannot delete/edit others' projects (unless Admin implemented granular permissions, but currently implemented as Admin-only edit/delete per spec "Only ADMIN can EDIT or DELETE projects").
- **Soft Delete**: Projects are marked deleted but remain in DB.

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas URI

### Backend Setup
1. Navigate to `/backend`
2. Install dependencies: `npm install`
3. Setup `.env`:
   ```
   DB_USER=...
   DB_PASSWORD=...
   JWT_SECRET=supersecret
   PORT=5000
   ```
4. **Seed Admin User**:
   ```
   npm run seed:admin
   ```
   *Creates an admin user: `admin@admin.com` / `admin123`*
5. Start server:
   ```
   npm run dev
   ```

### Frontend Setup
1. Navigate to `/frontend`
2. Install dependencies: `npm install`
3. Start dev server:
   ```
   npm run dev
   ```
4. Application runs at provided local URL (usually `http://localhost:5173`).

## Workflow
1. Login as Admin (`admin@admin.com` / `admin123`).
2. Go to **User Management**.
3. Click **Invite User**. Enter email and role.
4. Copy the generated link (or token).
5. Open link in Incognito (or logout).
6. Register using the token.
7. Login as the new user.
