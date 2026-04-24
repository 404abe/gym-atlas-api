# GymAtlas 🏋️

Gym Data Engine is an open-source data platform designed to map gym equipment across locations. It leverages crowd-sourced data to build a structured database of machines in real gyms, enabling users to query where specific equipment is available and discover new training environments.

The platform exposes this data through a REST API, allowing developers to build applications for gym discovery, equipment comparison, and training analytics.

> Built to answer: *where can I find this machine?*

---

# Features

- Structured equipment database (brands, series, machine types)
- Gym ↔ equipment mapping with machine counts
- REST API for querying gyms and equipment
- Seeded dataset with real-world machine distributions
- Relational PostgreSQL schema
- Scalable foundation for gym discovery and analytics

---

## 🤝 Contributing

refer to [CONTRIBUTING.md](./docs/CONTRIBUTING.md) for guidelines.

---

## Future Plans

GymAtlas is being built as the foundation for a larger ecosystem of gym-focused tools.

### Data Platform Expansion
- Enable community contributions to expand gym and equipment data
- Improve data validation and consistency
- Introduce equipment ratings and community insights

### Discovery & Search
- Advanced search (by machine, brand, location)
- Location-based queries (e.g. nearest gyms with specific equipment)

### 📱 Full Application
- Build a web interface for managing and exploring gym data
- Develop a mobile app for gym discovery and comparison
- Personalised tracking of favourite machines and gyms