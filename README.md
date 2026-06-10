[![](https://raw.githubusercontent.com/404abe/gym-atlas-api/main/gymatlas%20api%20banner.png)](https://github.com/404abe/gym-atlas-api)

# Gym Atlas API

[![Node.js](https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/postgresql-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Supabase](https://img.shields.io/badge/supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Docker](https://img.shields.io/badge/docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Express](https://img.shields.io/badge/express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)](#)
[![Status](https://img.shields.io/badge/status-active--development-orange?style=for-the-badge)](#)

The backend API for GymAtlas — an open-source, community-driven platform for mapping gym equipment across real-world locations.

Builds a structured database of gym machines using user-contributed data, enabling applications to query where specific equipment is available and discover new training environments.

> Built to answer: _Where can I find this machine?_

---

## Features

- Structured equipment catalog (brands, series, machine types, images)
- Gym ↔ equipment mapping with community submissions and admin approval flow
- Equipment and gym ratings and favourites
- Weight stack tracking for pin-loaded machines
- Best-in-class equipment selections per category
- In-app notifications for submission approvals/rejections
- Leaderboard tracking user contributions
- Image uploads via Azure Blob Storage (gyms and equipment)
- Supabase JWT authentication with role-based access (`user`, `admin`, `super_admin`)
- REST API with optional auth for public queries

---

## API Structure

```
routes/       → Express route definitions
controllers/  → Request/response handling
services/     → Business logic
repositories/ → Database queries
middleware/   → Auth middleware (Supabase JWT)
config/       → External service config (Azure Blob Storage)
```

### Endpoints

| Prefix | Description |
|---|---|
| `GET /health` | Health check |
| `/gyms` | Gym discovery, equipment mapping, ratings, favourites, image upload |
| `/equipment` | Equipment catalog, ratings, favourites, weight stack, image upload |
| `/users` | User profiles, stats, contribution history |
| `/leaderboard` | Top contributors and per-user contribution details |
| `/notifications` | User notification inbox |
| `/best-in-class` | User's best-in-class equipment selections per category |
| `/admin` | Pending submission review and user role management |

---

## Getting Started

### Prerequisites

- Node.js
- Docker
- A [Supabase](https://supabase.com/) project (for auth)
- An Azure Storage account (for image uploads)

### Environment Variables

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (for JWT verification) |
| `AZURE_STORAGE_CONNECTION_STRING` | Azure Blob Storage connection string |
| `AZURE_STORAGE_CONTAINER_NAME` | Container name for uploaded images |
| `CORS_ORIGIN` | Comma-separated list of allowed origins (e.g. `http://localhost:3000`) |
| `PORT` | Server port (defaults to `3000`) |

### Setup

1. Clone the repo and install dependencies:

```bash
npm install
```

2. Start the database:

```bash
docker-compose up -d
```

3. Set up the schema:

```bash
docker exec -i gym-db psql -U postgres -d gymapp < schema.sql
```

4. Seed the database with sample data:

```bash
node seed.js
```

5. Start the server:

```bash
node server.js
```

The API will be running at `http://localhost:3000`.

---

## Running Tests

```bash
npm test
```

---

## Contributing

See [CONTRIBUTING.md](./docs/CONTRIBUTING.md) for guidelines.

---

## Roadmap

- GymAtlas web frontend — coming soon
- Location-based search (nearest gyms with specific equipment)
- Mobile app for gym discovery and comparison
