# ⚓ FuelEU Maritime – Compliance Dashboard

A full-stack web application implementing **Fuel EU Maritime compliance tracking**, following **Hexagonal Architecture (Ports & Adapters)**.

It provides an end-to-end view of routes, emissions, banking, and pooling compliance metrics for maritime vessels.

-----

## 🚀 Features

### 🧩 Core Functionalities

1.  **Routes**
      * View all vessel routes with details (fuel type, distance, emissions, etc.)
      * **Set a baseline route**
      * Filter by vessel type, fuel type, or year
2.  **Compare**
      * Compare routes against baseline
      * View **% improvement and compliance**
      * Visual chart comparing GHG intensity across routes
3.  **Banking**
      * Bank surplus CB (compliance balance)
      * Apply banked surplus to deficit ships
      * Validates availability and compliance rules
      * Human-readable error handling
4.  **Pooling**
      * Combine ships into a compliance pool
      * Ensures $\Sigma(\text{CB}) \ge 0$
      * Auto-redistributes surplus across deficits
      * Prevents worsening of deficits

-----

## 🏗️ Architecture Overview

### 🔸 Hexagonal (Ports & Adapters) Architecture

```
src/
├── core/                     # Application core (framework-agnostic)
│   ├── domain/               # Domain entities and business logic
│   ├── application/          # Use cases (application services)
│   ├── ports/                # Input/output port interfaces
│   └── ...
├── adapters/
│   ├── inbound/              # HTTP Controllers (Express)
│   ├── outbound/             # Database Repositories (Prisma)
│   ├── ui/                   # React components (Frontend)
│   └── infrastructure/       # API clients, Prisma setup, etc.
└── shared/                   # Shared constants, types, and errors
```

  * **🧱 Core (Business Logic):** Independent of any framework. Defines pure TypeScript domain models and use cases.
  * **🌐 Adapters:** Connect the core to external layers like **Inbound** (Express routes), **Outbound** (Prisma database), **UI** (React components), and **Infrastructure** (Axios API clients).

-----

## ⚙️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Backend** | Node.js, Express, TypeScript |
| **Database** | PostgreSQL + Prisma ORM |
| **Frontend** | React (Vite) + TypeScript + TailwindCSS |
| **Testing** | Jest + Supertest |
| **Architecture** | Hexagonal / Ports & Adapters |
| **Dev Tools** | ESLint, Prettier, ts-node, nodemon |

-----

## 📦 Installation & Setup

### 🧭 1. Clone the Repository

```bash
git clone https://github.com/yourusername/fueleu-maritime.git
cd fueleu-maritime
```

### ⚙️ 2. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 🗄️ Backend Configuration

#### 1️⃣ Environment Variables

Create a **`.env`** file inside `/backend`:

```
DATABASE_URL="postgresql://postgres:password@localhost:5432/fueleu"
PORT=4000
```

#### 2️⃣ Database Setup

Run **Prisma migrations**:

```bash
npx prisma migrate dev
```

#### 3️⃣ Seed the Database

Insert sample route data:

```bash
npm run seed
```

#### 4️⃣ Run the Backend

```bash
npm run dev
```

> **Backend runs on:** `http://localhost:4000`

### 🖥️ Frontend Configuration

#### 1️⃣ Set API Base URL

In `frontend/src/adapters/infrastructure/apiClient.ts`:

```typescript
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000", // ✅ Backend base URL
  headers: { "Content-Type": "application/json" },
});

export default api;
```

#### 2️⃣ Run the Frontend

```bash
npm run dev
```

> **Frontend runs on:** `http://localhost:5173`

-----

## 🧪 Testing

### ✅ Unit Tests

Includes tests for core business logic:

  * `computeComparison`
  * `computeCB`
  * `BankSurplus`
  * `ApplyBanked`
  * `CreatePool`

Run all tests:

```bash
npm run test
```

### ✅ Integration Tests

Uses **Supertest** for HTTP endpoint validation on:

  * `/routes`
  * `/compliance`
  * `/banking`
  * `/pools`

### ✅ Data Validation

Ensures database seed and migrations are correct:

```bash
npx prisma db seed
```

-----

## 📘 API Endpoints Summary

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/routes` | `GET` | Get all routes |
| `/routes/:id/baseline` | `POST` | Set route as baseline |
| `/routes/comparison` | `GET` | Compare baseline vs all |
| `/compliance/cb?shipId&year` | `GET` | Compute and store CB snapshot |
| `/compliance/adjusted-cb?shipId&year` | `GET` | Get adjusted CB after banking |
| `/banking/records?shipId&year` | `GET` | Retrieve bank records |
| `/banking/bank` | `POST` | Bank positive CB |
| `/banking/apply` | `POST` | Apply stored CB to deficit |
| `/pools` | `POST` | Create a new compliance pool |

-----

## 🧠 Frontend Tabs Overview

| Tab | Description |
| :--- | :--- |
| **Routes** | Displays all maritime routes with filters and baseline selection |
| **Compare** | Compares route GHG intensities against baseline with compliance metrics |
| **Banking** | Allows credit (**bank**) and debit (**apply**) CB transactions with user feedback |
| **Pooling** | Enables pooling ships to balance CB within a fleet, with real-time validation |

-----

## 🔐 Error Handling

| Error Type | Meaning |
| :--- | :--- |
| `EntityNotFoundError` | Missing ship compliance or route |
| `ValidationError` | Invalid input or missing parameters |
| `BusinessRuleViolationError` | Logic violation (e.g., insufficient bank balance) |

> **UI automatically shows human-readable messages** (e.g., "⚠️ No compliance record found for this ship and year.")

-----

## 🧩 Example Workflow

1.  Go to **Routes Tab** → **set a baseline**.
2.  Open **Compare Tab** → view compliance **% differences**.
3.  Switch to **Banking Tab** → **bank surplus** or **apply deficit**.
4.  Move to **Pooling Tab** → **group ships** for collective compliance.

-----

## 🧰 Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Run the backend in development |
| `npm run build` | Build production backend |
| `npm run test` | Run Jest test suite |
| `npx prisma studio` | Open interactive DB view |
| `npm run seed` | Seed demo routes into DB |

-----

## 🧭 Project Highlights

  * **Cleanly separated domain logic** (no framework dependencies)
  * **Full TypeScript support** with strict mode
  * Axios-based API communication
  * **TailwindCSS responsive dashboard**
  * Safe error handling & validation
  * Reusable **Hooks pattern** in frontend

-----

## 📄 License

**MIT License** © 2025 — Developed by Ranjan Kumar
