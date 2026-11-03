# ServiceDesk Pro: IT Service Desk & Incident Management System

A full-stack web application where employees report IT issues, IT staff manage them, and managers monitor service performance. It's built with **C# / ASP.NET Core**, **React + TypeScript** and **SQL Server** as a practical, enterprise-style stack project.

> **Status:** Phase 1 (authentication and employee tickets) is complete. Phases 2 to 6 are planned (see the roadmap).

## Features (Phase 1)

- Employee registration, login and logout with ASP.NET Core Identity
- Secure cookie-based sessions (HTTP-only cookies, no tokens in local storage)
- Role setup: Employee, Technician and Admin roles are created on startup. Public registration always creates an Employee
- Create tickets with title, description, category, type (incident or service request) and priority
- "My Tickets" page with search and status filter
- Ticket detail page
- Ownership enforced on the server: employees can only see their own tickets
- Server-side validation and consistent error handling

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React, TypeScript, Vite, Tailwind CSS, React Router |
| Backend | C#, ASP.NET Core Web API (.NET 10) |
| Database | Microsoft SQL Server, Entity Framework Core (migrations) |
| Authentication | ASP.NET Core Identity, cookie authentication |

## Architecture

```
React + TypeScript (Vite, port 5173)
        |  /api requests (dev proxy)
ASP.NET Core Web API (port 5041)  -> controllers, validation, authorization
        |  Entity Framework Core
SQL Server (ServiceDeskDb)
```

## API endpoints (Phase 1)

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Register an employee |
| POST | `/api/auth/login` | Sign in |
| POST | `/api/auth/logout` | Sign out |
| GET | `/api/auth/me` | Current user |
| GET | `/api/categories` | List categories |
| POST | `/api/tickets` | Create a ticket |
| GET | `/api/tickets/my` | List my tickets (`search`, `status` filters) |
| GET | `/api/tickets/{id}` | View an authorized ticket |

## Getting started

### Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [Node.js](https://nodejs.org/) 20.19 or newer
- SQL Server (Developer edition) and SQL Server Management Studio
- The EF Core tool: `dotnet tool install --global dotnet-ef`

### 1. Database and API

```bash
cd backend/ServiceDesk.Api
dotnet ef database update
dotnet run
```

The connection string in `appsettings.json` uses the default local instance (`localhost`) with Windows Authentication. Change it if your SQL Server setup is different. On first start the API creates the roles and a set of starter categories.

### 2. Frontend

```bash
cd frontend/servicedesk-client
npm install
npm run dev
```

Open http://localhost:5173 and register an account.

## Project structure

```
IT-Service-Desk/
├── backend/ServiceDesk.Api/   Controllers, Data, Models, DTOs, Authorization, Migrations
└── frontend/servicedesk-client/   components, pages, services, context, hooks, types
```

## Roadmap

- [x] **Phase 1:** Foundation, authentication and employee tickets
- [ ] **Phase 2:** Technician dashboard and ticket workflow
- [ ] **Phase 3:** Admin dashboard and management
- [ ] **Phase 4:** Notifications, attachments and audit trail
- [ ] **Phase 5:** SLA deadlines and advanced features
- [ ] **Phase 6:** Automated tests, Docker and deployment