# Flynet SaaS Dashboard (Frontend)

A fully responsive **SaaS Admin Dashboard** built with:

- **React 18**
- **Material UI (MUI)**
- **React Router v6**
- **Leaflet Maps**
- **Context API (Authentication)**
- **Vite**
- **Custom CSS based on Figma design**
- **MUI Icons**

This project implements the complete front-end UI for the Flynet SaaS system and integrates with a backend API (Node / Laravel / Django — depending on backend team).

---

## 🚀 Features

### ✅ Admin Panel Screens
- Dashboard (map + stats)
- All Businesses (table, filters, pagination)
- Add Business
- Packages
- Package Subscription
- Reports
- Communicator (Rich editor using TipTap)
- Notification Center
- Settings (Super Admin Settings, Email/SMTP, Payment Gateways)

### ✅ Core Functionality
- Authentication (Email + Password)
- Protected Routes using `RequireAuth`
- Global Auth Context
- Sidebar Navigation (Collapsible)
- Header (Language switcher, notifications, profile)
- Fully responsive layout

---

## 📁 Project Structure

```
saas-dashboard/
│
├── public/
│   ├── assets/
│   │   ├── auth/ (login images)
│   │   ├── icons/ (Figma SVGs)
│   │   ├── flags/
│   │   └── bg/
│
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.jsx
│   │   │   └── Sidebar.jsx
│   │   └── ui/
│   │
│   ├── context/
│   │   └── AuthContext.jsx
│   │
│   ├── layouts/
│   │   └── MainLayout.jsx
│   │
│   ├── pages/
│   │   ├── Auth/
│   │   │   └── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── AllBusiness.jsx
│   │   ├── AddBusiness.jsx
│   │   ├── Packages.jsx
│   │   ├── PackageSubscriptions.jsx
│   │   ├── Reports.jsx
│   │   ├── Communicator.jsx
│   │   ├── NotificationCenter.jsx
│   │   └── Settings.jsx
│   │
│   ├── utils/
│   │   └── helpers.js
│   │
│   ├── styles.css
│   ├── theme.js
│   ├── App.jsx
│   └── main.jsx
│
└── package.json
```

---

## 🛠 Installation

### 1. Clone the frontend repo
```bash
git clone https://github.com/your-org/flynet-saas-dashboard.git
cd saas-dashboard
```

### 2. Install dependencies
```bash
npm install
```

---

## 🔧 Environment Variables (`.env`)

Create a `.env` file:

```
VITE_API_URL=http://localhost:8000/api
VITE_MAP_TILE_URL=https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
```

---

## ▶ Running the Project (Dev)

```bash
npm run dev
```

App runs at:

```
http://localhost:5173
```

---

## 🧱 Build for Production

```bash
npm run build
```

---

## 🔒 Authentication Flow

The dashboard uses **Context API authentication**.

### Files:
- `src/context/AuthContext.jsx`
- `src/components/auth/RequireAuth.jsx`

### Summary:
- Login sets a token → stored in `localStorage`
- `RequireAuth` protects private routes
- If user is not authenticated → redirect to `/login`

---

## 🌐 Routing Map

| Route | Component | Protected |
|-------|-----------|-----------|
| `/login` | Login.jsx | ❌ No |
| `/dashboard` | Dashboard.jsx | ✅ Yes |
| `/all-business` | AllBusiness.jsx | ✅ Yes |
| `/add-business` | AddBusiness.jsx | ✅ Yes |
| `/packages` | Packages.jsx | ✅ Yes |
| `/package-subscription` | PackageSubscriptions.jsx | ✅ Yes |
| `/reports` | Reports.jsx | ✅ Yes |
| `/communicator` | Communicator.jsx | ✅ Yes |
| `/notification-center` | NotificationCenter.jsx | ✅ Yes |
| `/settings` | Settings.jsx | Yes |

---

## 🗺 Map Integration (Leaflet)

- Map located inside Dashboard page
- Using:
```
react-leaflet
leaflet
```
- Loads map tiles from OpenStreetMap

---

## 🎨 UI / Theme

- Based strictly on Figma design
- Global theme in `theme.js`
- Font: **Inter**
- Sidebar collapsible (icons-only mode)
- Consistent spacing & shadows according to design system

---

## 🤝 API Integration (for Backend Team)

Expected endpoints:

```
POST /login
GET  /businesses
POST /businesses
GET  /packages
POST /packages
GET  /notifications
GET  /settings
POST /settings
```

Token Handling:
- Backend must return `{ token: "...jwt..." }`
- Token stored in `localStorage`
- Each request includes:

```
Authorization: Bearer <token>
```

---

## 👨‍💻 Contributing

1. Create a new branch:
```bash
git checkout -b feature/your-feature-name
```

2. Commit changes:
```bash
git commit -m "Added new feature"
```

3. Push:
```bash
git push origin feature/your-feature-name
```

4. Create a Pull Request

---

## 📄 License
Proprietary — Flynet Software.  
Not for public use without permission.

---

## 📧 Contact
For integration questions:  
**Backend Developer** → connect with frontend via `/api` endpoints.  
**UI/UX Questions** → refer to the Figma source file.

---


