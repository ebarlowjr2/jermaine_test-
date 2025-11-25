# Virtual IT Labs - Educational Platform

A modern, responsive educational/training website similar to Udemy, built with React and FastAPI. Features include course browsing, student registration, Stripe payment integration, and an AI-powered teaching assistant.

## Features

- **User Authentication**: Register, login, and password reset functionality with JWT tokens
- **Course Management**: Browse, search, and filter courses by category and level
- **Student Dashboard**: Track enrolled courses and learning progress
- **Admin Panel**: Create, edit, and delete courses (admin users only)
- **Stripe Payments**: Secure checkout for paid courses
- **AI Assistant**: Chat with an AI teaching assistant on course pages
- **Responsive Design**: Modern UI with TailwindCSS, optimized for all devices

## Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **JWT Authentication** - Secure token-based auth
- **Stripe API** - Payment processing
- **OpenAI API** - AI chat assistant
- **In-memory Database** - For proof of concept (data resets on restart)

### Frontend
- **React 18** with TypeScript
- **Vite** - Fast build tool
- **TailwindCSS** - Utility-first CSS
- **shadcn/ui** - Pre-built UI components
- **React Router** - Client-side routing
- **Lucide React** - Modern icons

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Python 3.11+ and Poetry
- Stripe account (for payments)
- OpenAI API key (for AI assistant)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   poetry install
   ```

3. Configure environment variables in `.env`:
   ```env
   JWT_SECRET_KEY=your-secret-key-change-in-production
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
   OPENAI_API_KEY=sk-your-openai-api-key
   FRONTEND_URL=http://localhost:5173
   ```

4. Start the development server:
   ```bash
   poetry run fastapi dev app/main.py
   ```

   The backend will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables in `.env`:
   ```env
   VITE_API_URL=http://localhost:8000
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:5173`

## Demo Accounts

The application comes with pre-seeded demo accounts:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@virtualitlabs.com | admin123 |
| Student | demo@example.com | demo123 |

## Project Structure

```
website/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI app with all endpoints
│   │   ├── auth.py          # JWT authentication utilities
│   │   ├── database.py      # In-memory database with seed data
│   │   └── models.py        # Pydantic models
│   ├── pyproject.toml       # Python dependencies
│   └── .env                 # Backend environment variables
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── ui/          # shadcn/ui components
│   │   │   ├── Layout.tsx   # Main layout with header/footer
│   │   │   ├── CourseCard.tsx
│   │   │   └── AIChat.tsx   # AI assistant chat widget
│   │   ├── context/
│   │   │   └── AuthContext.tsx  # Global auth state
│   │   ├── pages/           # Page components
│   │   │   ├── Home.tsx
│   │   │   ├── About.tsx
│   │   │   ├── Courses.tsx
│   │   │   ├── CourseDetail.tsx
│   │   │   ├── Mentorship.tsx
│   │   │   ├── Contact.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   └── Admin.tsx
│   │   ├── services/
│   │   │   └── api.ts       # API client with all endpoints
│   │   └── App.tsx          # Main app with routing
│   ├── package.json         # Node dependencies
│   └── .env                 # Frontend environment variables
│
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user info
- `POST /api/auth/forgot-password` - Request password reset

### Courses
- `GET /api/courses` - List all courses (with filters)
- `GET /api/courses/{id}` - Get course details
- `GET /api/courses/{id}/lessons` - Get course lessons

### Enrollments
- `GET /api/enrollments` - List user's enrollments
- `POST /api/enrollments/{course_id}` - Enroll in free course
- `POST /api/enrollments/{course_id}/progress` - Update lesson progress

### Payments
- `POST /api/payments/create-checkout` - Create Stripe checkout session
- `POST /api/payments/verify` - Verify payment and enroll user

### Admin
- `GET /api/admin/courses` - List all courses (admin)
- `POST /api/admin/courses` - Create new course
- `PUT /api/admin/courses/{id}` - Update course
- `DELETE /api/admin/courses/{id}` - Delete course

### AI Chat
- `POST /api/chat` - Send message to AI assistant

## Color Theme

The application uses a Facebook-style blue theme:
- Primary: `#1877F2`
- Primary Dark: `#1664d9`
- Primary Light: `#0d4ea6`

## Notes

- This is a proof of concept using an in-memory database. Data will be lost when the backend restarts.
- For production, replace the in-memory database with PostgreSQL or another persistent database.
- Update the JWT secret key and API keys before deploying to production.
- The Stripe integration uses test mode by default.

## License

MIT License - feel free to use this project for your own purposes.
