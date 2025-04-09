# Library Management System

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[中文文档](README_CN.md)

A modern library management system built with Next.js and Prisma, offering an intuitive user interface and powerful management features.

## Features

- 📚 Complete Library Management
  - Book Borrowing and Returns
  - Book Information Management
  - User Account Management

- 🔍 Smart Search Functionality
  - Fuzzy Book Search
  - Category Statistics and Quick Precise Search
  - Multi-dimensional Filtering

- 📊 Data Statistics and Analysis
  - Borrowing Statistics
  - Popular Books Display
  - Book Category Statistics

- 🎨 User Experience Optimization
  - Responsive Design
  - Dark/Light Theme Toggle
  - Intuitive Operation Interface

## Tech Stack

- **Frontend Framework**: Next.js
- **Database ORM**: Prisma
- **Styling Solution**: CSS Modules
- **State Management**: React Context
- **Authentication**: JWT

## Project Structure

```
├── prisma/                # Database models and migrations
│   ├── schema.prisma      # Database schema definition
│   └── seed.ts           # Database initialization script
├── src/
│   ├── app/              # Page routes
│   ├── components/       # Reusable components
│   ├── lib/              # Utility functions
│   └── context/          # Global state management
```

## Quick Start

### Prerequisites

1. Ensure Node.js and npm are installed
2. Prepare MySQL database

### Environment Configuration

Create a `.env` file in the project root directory:

```env
# Database connection configuration
DATABASE_URL="mysql://username:password@localhost:3306/database_name"

# JWT secret
JWT_SECRET="your-jwt-secret-key"
```

### Installation and Running

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Initialize database (optional)
npx prisma db push

# Start development server
npm run dev
```

Visit http://localhost:3000/auth/login to log in

Default admin account:
- Username: admin
- Password: admin123

### Database Management

Start Prisma Studio for visual database management:

```bash
npx prisma studio
```

## Contributing

Issues and Pull Requests are welcome!

## License

MIT License