# RentOS — Rental Management System

> A full-stack platform built for small landlords in India — replacing Excel sheets and WhatsApp tracking with structured, automated rent management.

<!-- Add a screenshot or GIF here once deployed -->
<!-- ![Dashboard preview](./docs/preview.png) -->

---

## The problem

Most landlords managing 1–10 properties still rely on Excel sheets, WhatsApp groups, and manual calculations. RentOS replaces that with structured data, automated tracking, and a clean dashboard — all tied to a proper multi-tenant backend.

---

## Tech stack

**Backend** — Java 17, Spring Boot 3, Spring Data JPA / Hibernate, MySQL, Maven  
**Frontend** — React.js, Tailwind CSS, Axios

---

## Features

### Authentication
- Login and signup with landlord-scoped data isolation
- JWT authentication (in progress)

### Dashboard
- Personalized view per landlord — total properties, tenants, and revenue at a glance
- Recent transactions and dark mode support

### Property management
- Add and view properties with rent amount and location tracking

### Tenant management
- Add tenants with property assignment and move-in date tracking

### Rent payments
- Record and track payments linked to tenant, property, and landlord

### Excel import
- Bulk upload rent and payment data via `.xlsx` files

---

## Architecture
```
Landlord → Property → Tenant → Payment
```

Key engineering decisions: multi-tenant data isolation, proper DTO separation (Request / Response), cascade + orphan removal handling, and Bean Validation edge-case fixes.

---

## API reference
```
POST   /auth/signup
POST   /auth/login

GET    /properties/landlord/{id}
GET    /tenants/landlord/{id}
GET    /rent-payments/landlord/{id}
```

---

## Run locally
```bash
git clone https://github.com/24karaNhub/rent-management-system.git

# Backend
cd backend
./mvnw spring-boot:run

# Frontend
cd rent-management-frontend
npm install
npm run dev
```

> Requires Java 17, Node.js 18+, and a running MySQL instance. Configure your DB credentials in `application.properties`.

---

## Status

| Feature | Status |
|---|---|
| Auth system | Done |
| Personalized data | Done |
| Dashboard | Done |
| Properties, tenants, payments | Done |
| Excel import | Done |
| Dark mode | Done |
| JWT security | In progress |

---

## Roadmap

- JWT route protection
- Edit / update flows for properties and tenants
- Property → Tenant dropdown linking
- Payment analytics with monthly trends
- Due date reminders and notifications
- Deployment (Render / Railway)

---

## Author

**Karan Chaudhary** — BTech Cyber Security | Full Stack Developer  
[GitHub](https://github.com/24karaNhub) · [LinkedIn](https://www.linkedin.com/in/karan-chaudhary-a58954313/)

---

