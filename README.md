# OmniCorp ERP MVP

## Overview

Frontend-only enterprise ERP MVP demonstrating:

- authentication
- multi-tenant architecture
- contextual RBAC
- resource management
- server-side simulation
- multi-column sorting
- debounced search
- pagination
- conditional onboarding wizard
- CRUD mutations
- dashboard analytics

## Tech Stack

React
TypeScript
Vite
Tailwind CSS
Zustand
React Hook Form
Zod
Recharts

## Authentication

This project uses deterministic client-side demo authentication because the assessment specifies that no backend API is required.

## Demo Credentials

### Admin

Email:
admin@omnicorp.demo

Password:
OmniCorp@2026

Access:

OmniCorp India
ADMIN + FINANCE

OmniCorp Europe
MANAGER

OmniCorp Labs
VIEWER + FINANCE

### Manager

Email:
manager@omnicorp.demo

Password:
Manager@2026

Access:

OmniCorp Europe
MANAGER

### Viewer

Email:
viewer@omnicorp.demo

Password:
Viewer@2026

Access:

OmniCorp Labs
VIEWER + FINANCE

## RBAC Matrix

| Role | View | Create | Edit | Delete |
|------|------|--------|------|--------|
| ADMIN | Yes | Yes | Yes | Yes |
| MANAGER | Yes | Yes | Yes | No |
| VIEWER | Yes | No | No | No |

Roles are fully tenant-scoped. A user's permissions dynamically evaluate against their specific role mapping within the currently active workspace.

## Multi-Tenant Behavior

Roles are scoped to tenant memberships and permissions are resolved according to the active tenant. A single user can act as an Admin in one workspace and a Viewer in another.

## Resource Mutations

Resource Create/Edit/Delete operations use an in-memory mock API. Mutations persist during the current application session but intentionally reset to deterministic mock data after a browser refresh.

## Setup

npm install
npm run dev

## Build

npm run build

## Architecture

UI -> Service Layer -> RBAC -> Mock API -> In-Memory Data