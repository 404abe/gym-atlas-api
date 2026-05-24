# Gym Data Engine 🏋️

[![Node.js](https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/postgresql-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
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
- Gym ↔ equipment mapping with quantity tracking
- Community submissions with admin approval flow
- Equipment and gym ratings
- Favourites for gyms and equipment
- Leaderboard tracking user contributions
- JWT authentication with role-based access (user, admin, super_admin)
- REST API for querying gyms and equipment

---

## API Structure

```
routes/       → Express route definitions
controllers/  → Request/response handling
services/     → Business logic
repositories/ → Database queries
middleware/   → Auth middleware
config/       → External service config (Cloudinary)
```

---

## Getting Started

### Prerequisites

- Node.js
- Docker

### Setup

1. Clone the repo and install dependencies:

```bash
npm install
```

2. Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

3. Start the database:

```bash
docker-compose up -d
```

4. Set up the schema:

```bash
docker exec -i gym-db psql -U postgres -d gymapp < schema.sql
```

5. Seed the database with sample data:

```bash
node seed.js
```

6. Start the server:

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

## 🤝 Contributing

See [CONTRIBUTING.md](./docs/CONTRIBUTING.md) for guidelines.

---

## Roadmap

- GymAtlas web frontend — coming soon
- Location-based search (nearest gyms with specific equipment)
- Mobile app for gym discovery and comparison
