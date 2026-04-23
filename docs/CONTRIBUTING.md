# Contributing 🤝

Thanks for your interest in contributing to Gym Data Engine.

This project aims to build a structured, real-world dataset of gym equipment across locations. Contributions that improve data quality, expand coverage, or enhance the API are welcome.

---

## 📊 Contributing Data

The main way to contribute right now is by improving or expanding the dataset.

### You can:

- Add new equipment (brands, series, machines)
- Add new gyms
- Add or update equipment available in gyms
- Fix incorrect or inconsistent data

---

##  Data Format

Data is currently stored in:

- `seed-data/equipment.json`
- `seed-data/gyms.json`

Please ensure:
- consistent naming (e.g. "Matrix", not "matrix")
- correct brand and series where possible
- no duplicate machines
- realistic equipment counts

---

## Running the project locally

1. Start the database:
```bash
docker start gym-db