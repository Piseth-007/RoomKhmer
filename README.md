# RoomKhmer

RoomKhmer is a modern room rental web application designed to help students, workers, tenants, landlords, and administrators manage room rentals in Phnom Penh, Cambodia.

The platform provides a simple way for tenants to discover available rooms, search by location, view room details, save favorite rooms, submit rental requests, manage bookings, and manage their profiles.

Landlords can manage their rooms, rental requests, bookings, and payments, while administrators can manage users, rooms, bookings, and the overall platform.

## Run and deploy

Install dependencies and start the local development server:

```bash
npm install
npm run dev
```

Before deploying, copy `.env.example` to `.env` locally and set the same variables in your hosting provider's environment settings. Do not commit `.env`.

Create the production bundle with:

```bash
npm run build
```

Deploy the generated `dist/` directory to a static host. Configure the host to rewrite unknown routes to `index.html`, so direct visits to client-side routes continue to work.

---

## Project Overview

RoomKhmer is designed especially for students and workers who move to Phnom Penh and need a convenient way to find affordable accommodation.

The system has three main user roles:

- Student / Tenant
- Landlord
- Administrator

Each role has different permissions and functionality.

---

## Main Features

### Client / Tenant

- Browse available rooms
- Search rooms
- Filter rooms by location
- Filter rooms by price
- Filter by room type
- Filter by facilities
- Sort rooms
- View room details
- View room images
- Save favorite rooms
- Submit room rental requests
- Manage bookings
- View payment information
- Manage profile
- Update personal information
- Logout

### Landlord

- Landlord dashboard
- Create rooms
- Edit rooms
- Delete rooms
- Upload room images
- Manage room information
- View room status
- Manage rental requests
- Accept or reject requests
- Manage bookings
- Manage payments
- View reports
- Manage landlord profile
- Manage settings

### Administrator

- Admin dashboard
- Manage users
- Manage landlords
- Manage tenants
- Manage rooms
- Approve rooms
- Reject rooms
- Manage bookings
- Manage payments
- View reports
- Manage administrator profile
- Manage system settings

---

## Room Workflow

The main room workflow is:

```text
Landlord
   |
   | Create Room
   v
Pending
   |
   | Admin Review
   v
Approved
   |
   | Visible to tenants
   v
Available
   |
   | Tenant rents room
   v
Occupied
```
