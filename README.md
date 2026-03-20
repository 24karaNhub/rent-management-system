# Rent Management System (Spring Boot)

## 📌 Overview
A backend system to manage landlords, tenants, properties, and rent payments.

## 🚀 Features
- Landlord management (CRUD)
- Tenant management (CRUD)
- Property management
- Rent payment tracking
- Relationships:
  - Landlord → Tenants
  - Property → Tenants
  - Tenant → Payments
- Validation & Exception Handling

## 🛠 Tech Stack
- Java
- Spring Boot
- Spring Data JPA
- MySQL
- Hibernate

## 🔗 API Modules

### Landlord APIs
- POST /landlords
- GET /landlords
- GET /landlords/{id}
- PUT /landlords/{id}

### Tenant APIs
- POST /tenants
- GET /tenants
- GET /tenants/{id}
- PUT /tenants/{id}
- DELETE /tenants/{id}
- GET /tenants/{id}/payments

### Property APIs
- POST /property/addProperty
- GET /property
- PUT /property/{id}
- DELETE /property/{id}

### Rent Payment APIs
- POST /rentpayments
- GET /rentpayments
- GET /rentpayments/{id}

## ⚙️ How to Run
1. Clone repo
2. Configure MySQL in application.properties
3. Run Spring Boot app

## 📈 Future Improvements
- JWT Authentication
- DTO pattern
- Payment reminders
- Frontend (React)