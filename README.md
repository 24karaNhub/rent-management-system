# Rent Management System

A backend REST API built for small and medium landlords in India who manage
properties and rent on notebooks or Excel sheets — built to solve a real gap
in simple, affordable property management.

## Why I Built This

While observing how rental properties are managed in India, I noticed most
small landlords track rent, due dates, and tenant info manually. This project
is a structured backend solution built specifically for that gap — designed
for landlords managing 1–10 properties who need something simple but reliable.

## Features

- Landlord and tenant management
- Property tracking with tenant assignments
- Rent payment recording and history
- Relationship tracking — landlord → properties → tenants → payments
- Input validation and structured error responses
- Role-based JWT authentication (in progress)

## Tech Stack

- Java 17
- Spring Boot 3
- Spring Data JPA / Hibernate
- Spring Security + JWT
- MySQL
- Maven

## API Endpoints

### Landlord
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /landlords | Create landlord |
| GET | /landlords | Get all landlords |
| GET | /landlords/{id} | Get by ID |
| PUT | /landlords/{id} | Update landlord |
| DELETE | /landlords/{id} | Delete landlord |

### Property
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /properties | Add property |
| GET | /properties | Get all properties |
| GET | /properties/{id} | Get by ID |
| PUT | /properties/{id} | Update property |
| DELETE | /properties/{id} | Delete property |
| GET | /properties/{id}/tenants | Get tenants of property |
| GET | /properties/{id}/payments | Get payments of property |

### Tenant
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /tenants | Add tenant |
| GET | /tenants | Get all tenants |
| GET | /tenants/{id} | Get by ID |
| PUT | /tenants/{id} | Update tenant |
| DELETE | /tenants/{id} | Delete tenant |
| GET | /tenants/{id}/payments | Get payments of tenant |

### Rent Payment
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /rent-payments | Record payment |
| GET | /rent-payments | Get all payments |
| GET | /rent-payments/{id} | Get by ID |
| PUT | /rent-payments/{id} | Update payment |
| DELETE | /rent-payments/{id} | Delete payment |

## How to Run Locally
```bash
# 1. Clone the repository
git clone https://github.com/yourusername/rent-management

# 2. Create a MySQL database
CREATE DATABASE rent_management;

# 3. Configure your credentials in src/main/resources/application.properties
spring.datasource.url=jdbc:mysql://localhost:3306/rent_management
spring.datasource.username=your_username
spring.datasource.password=your_password

# 4. Run the application
./mvnw spring-boot:run

# App runs on http://localhost:8080
```

## Project Structure
```
src/main/java/com/karan/rentmanagement/
├── controller/      # REST controllers
├── service/         # Business logic
├── repository/      # JPA repositories
├── entity/          # Database entities
├── dto/             # Request and response DTOs
├── exception/       # Custom exceptions + global handler
└── security/        # JWT filter and config
```

## Roadmap

- [x] Core CRUD APIs — landlord, tenant, property, payments
- [x] Input validation and exception handling
- [ ] DTO pattern — request/response separation
- [ ] JWT authentication with role-based access
- [ ] Scheduled rent reminders
- [ ] Deployment — Railway / Render
- [ ] Tenant complaint and maintenance requests