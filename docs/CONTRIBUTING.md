# Contributing 🤝

Thanks for your interest in contributing to Gym Data Engine.

This is the backend API for GymAtlas — a platform for mapping gym equipment across locations (frontend coming soon). It handles gyms, equipment, ratings, favourites, and a community-driven approval system for user submissions.

---

## 📊 Contributing Data

Data contributions (adding gyms, equipment, linking machines to gyms) will be handled through the GymAtlas frontend,. Once live, all submissions go through an approval process before going public — no direct edits to the dataset needed.

In the meantime, if you spot data issues or want to discuss coverage, open an issue.

---

## 🛠 Contributing Code

Bug fixes, new endpoints, performance improvements, and general improvements to the API are welcome.

---

## Running the project locally

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

## Running Tests

```bash
npm test
```

---

## Submitting Changes

1. Fork the repo
2. Create a branch (`git checkout -b feat/your-feature`)
3. Commit your changes
4. Open a pull request with a clear description of what you changed and why
