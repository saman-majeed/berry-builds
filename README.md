# BerryBuilds — Next.js Website

A full-stack Next.js 14 website with SQLite backend and admin panel.

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Run development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 3. Admin Panel
Go to [http://localhost:3000/admin](http://localhost:3000/admin)

**Default credentials:**
- Username: `admin`
- Password: `berry2024`

> ⚠️ Change the password after first login via Admin → Settings → Change Password

---

## 📁 Project Structure

```
berrybuilds/
├── app/
│   ├── page.tsx              # Home page
│   ├── projects/page.tsx     # Projects portfolio
│   ├── services/page.tsx     # Services page
│   ├── contact/page.tsx      # Contact page
│   ├── admin/                # Admin panel (all pages)
│   │   ├── dashboard/
│   │   ├── messages/
│   │   ├── projects/
│   │   ├── services/
│   │   ├── stats/
│   │   ├── team/
│   │   ├── users/
│   │   └── settings/
│   └── api/                  # REST API routes
│       ├── contact/          # Contact form submissions
│       ├── messages/         # Messages CRUD
│       ├── projects/         # Projects CRUD
│       ├── services/         # Services CRUD
│       ├── team/             # Team CRUD
│       ├── users/            # Users CRUD
│       ├── settings/         # Site settings
│       └── auth/             # Login / Logout / Me
├── components/
│   ├── layout/               # Navbar, Footer
│   ├── ui/                   # Page sections
│   └── admin/                # AdminShell (login + sidebar)
├── lib/
│   ├── db.ts                 # SQLite database (better-sqlite3)
│   └── auth.ts               # JWT authentication
├── data/                     # SQLite DB stored here (auto-created)
└── .env.local                # Environment variables
```

## 🗄️ Database

Uses **SQLite** via `better-sqlite3`. The database file is auto-created at `data/berrybuilds.db` on first run with all default data seeded.

**Tables:** messages, projects, services, team, users, settings

## 🔐 Authentication

JWT-based auth stored in an httpOnly cookie (`bb-token`). All admin API routes require a valid session.

## 🌐 Deployment

### Vercel
```bash
npm run build
vercel deploy
```
> Note: SQLite is for local/VPS use. For Vercel, swap `better-sqlite3` with a hosted DB like Neon (PostgreSQL) or PlanetScale (MySQL).

### VPS / Server
```bash
npm run build
npm start
```

## 📝 Environment Variables

```env
JWT_SECRET=your-strong-random-secret-here
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```
