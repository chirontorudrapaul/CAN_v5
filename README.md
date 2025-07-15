# CAN - A Modern E-Commerce Platform for Fashion

## Project Description

CAN is a modern, AI-powered e-commerce platform designed for fashion retail. Built with Next.js, TypeScript, and MongoDB, it features a stylish storefront, a robust admin dashboard, and an AI stylist to help users find the perfect look. CAN aims to deliver a seamless shopping and management experience for both customers and store admins.

> The name **CAN** is formed from the initials of the team members:
**C** from **C**hironto Rudra Paul  
**A** from**A**rnob Das  
**N** from**N**ajir Hossain Sahinur

## Team Members & Roles

This project was built by a team of three, each focusing on different areas:

- **Chironto Rudra Paul** mainly worked on the admin panel, handling both the frontend and backend.
- **Najir Hossain Sahinur** focused on the user interface, developing features for both the frontend and backend on the customer side.
- **Arnob Das** managed the database and took care of testing to make sure everything runs smoothly.

## Setup & Installation

### Prerequisites

- [Node.js (v18+)](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/) (local or Atlas)
- [Git](https://git-scm.com/)
- (Optional) [Google Cloud SDK](https://cloud.google.com/sdk) for Genkit AI features

### 1. Clone the Repository

```bash
[git clone https://github.com/chirontorudrapaul/CAN_v5.git]
cd CAN_v5
```

### 2. Install Dependencies

```bash
npm install
# or
yarn
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory with the following content:

```
MONGODB_URI=mongodb://localhost:27017/can-db
JWT_SECRET=your_jwt_secret_here
GENKIT_API_KEY=your_google_genkit_api_key
GENKIT_PROJECT_ID=your_gcp_project_id
```

### 4. Start the Development Server

```bash
npm run dev
# or
yarn dev
```

Open your browser and go to [http://localhost:3000](http://localhost:3000).

### 5. (Optional) Enable Genkit AI Features

If you want to use the AI stylist features, run:

```bash
npx genkit dev
```

Make sure Genkit is properly configured.

---

Thank you for checking out CAN!  
For more details, see the full documentation or reach out to the team.

---

**This version is ready to use and will not cause YAML errors.**
