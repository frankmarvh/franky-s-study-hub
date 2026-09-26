# 🎓 Franky's Study Hub

> **Learn smarter. Study better. Build your future.**

Franky's Study Hub is a modern full-stack learning platform designed for university students.

It combines free and openly available educational resources with **Franky's AI**, an AI-powered study assistant that helps students understand difficult concepts, revise subjects, discover learning resources, and organize their studies.

Instead of requiring administrators to upload copyrighted learning materials, Franky's Study Hub connects students to legitimate educational resources that are already freely available on the internet from universities, open textbook projects, documentation websites, and other educational organizations.

---

# ✨ Features

## 📚 Free Learning Resources

Students can discover educational materials that are already legally and freely available online.

Resources may include:

- Open textbooks
- Course materials
- Programming documentation
- Mathematics resources
- Computer science resources
- Physics resources
- Engineering resources
- Business resources
- Science resources
- Open educational repositories
- Tutorials
- Lecture notes
- Educational websites

Franky's Study Hub does not claim ownership of external resources.

Each external learning resource remains the property of its respective author, institution, publisher, or provider.

---

## 🔍 Learning Resource Search

Students can search the Franky's resource catalog by:

- Subject
- Topic
- Resource title
- Description
- Course area
- Keywords

The application can direct students to the original educational provider instead of storing unnecessary copies of external resources.

---

## 🤖 Franky's AI

Franky's AI is the built-in academic study assistant.

Students can ask questions such as:

```text
Explain database normalization.
```

```text
Teach me integration from the beginning.
```

```text
What is the difference between a stack and a queue?
```

```text
Explain Newton's laws using simple examples.
```

```text
Help me understand binary trees.
```

Franky's AI can provide:

- Topic explanations
- Step-by-step learning
- Programming examples
- Mathematics explanations
- Revision assistance
- Concept summaries
- Examples
- Study guidance
- Relevant learning-resource suggestions

AI responses can also render:

- Markdown
- Headings
- Lists
- Tables
- Code blocks
- Inline code
- Links

Students can copy AI answers directly from the interface.

> AI-generated information can contain mistakes. Important academic or technical information should be verified using appropriate sources.

---

# 💬 AI Conversation History

Franky's AI conversations can be stored in the application's database.

Each authenticated user receives their own conversation history.

Features include:

- Start a new conversation
- Continue an existing conversation
- View previous conversations
- Delete conversations
- Persistent conversation history
- User-specific access control

Conversation data is protected so one student should not be able to access another student's conversation history.

---

# 🔐 Authentication

Franky's Study Hub uses Supabase Authentication.

Supported authentication can include:

- Email registration
- Email/password login
- Google OAuth
- Secure sessions
- Logout
- Protected pages
- Authentication persistence

Users must authenticate before accessing protected areas of the platform.

---

# 👤 Student Profiles

Each student can maintain a personal profile.

Profile information:

- Full name
- Email
- University
- Course / programme
- Account information

Students can update their university and course information from the Profile page.

---

# 💾 Saved Learning Materials

Students can save useful resources to their personal library.

This allows students to build their own study collection without uploading copies of the original educational material.

Saved-resource functionality provide:

- Save resource
- Remove saved resource
- View saved resources
- Open original resource
- Organize useful study links

---

# 🌙 Light & Dark Mode

Franky's Study Hub includes a theme system supporting:

- Light mode
- Dark mode

The selected theme is stored locally on the student's device.

---

# 📱 Responsive Design

The interface is designed to work across:

- Desktop computers
- Laptops
- Tablets
- Mobile phones

The navigation automatically adapts for smaller displays.

---

# 🛡️ Security

Security is an important part of the project architecture.

The application uses several layers of protection.

### Authentication

Protected routes require an authenticated user.

### Supabase Row Level Security

Database tables can use Supabase Row Level Security policies to ensure users only access data they are authorized to access.

### Server-side AI API Key

The OpenAI API key must never be exposed to frontend code.

Correct:

```env
OPENAI_API_KEY=your_key
```

Incorrect:

```env
VITE_OPENAI_API_KEY=your_key
```

Variables prefixed with `VITE_` may be bundled into frontend code.

### Service Role Key

The Supabase service role key must only exist on the backend.

Never expose:

```env
SUPABASE_SERVICE_ROLE_KEY
```

to the browser.

### Rate Limiting

The Express backend uses API rate limiting to reduce abuse.

AI endpoints can use stricter rate limits because AI requests consume external API resources.

### HTTP Security Headers

The backend uses Helmet to configure common HTTP security headers.

---

# 🏗️ Technology Stack

## Frontend

- React
- TypeScript
- Vite
- React Router
- Tailwind CSS
- Lucide React
- React Hot Toast
- React Markdown
- Remark GFM

## Backend

- Node.js
- Express
- TypeScript
- TSX
- CORS
- Helmet
- Express Rate Limit

## Authentication & Database

- Supabase Authentication
- Supabase PostgreSQL
- Supabase Row Level Security

## AI

- OpenAI API
- OpenAI JavaScript/TypeScript SDK
- Responses API

## Development

- npm
- TypeScript
- Vite
- VS Code
- Git
- GitHub

---

# 📂 Project Structure

```text
frankys-study-hub/
│
├── public/
│   ├── favicon.ico
│   └── robots.txt
│
├── server/
│   │
│   ├── config/
│   │
│   ├── data/
│   │   └── oerCatalog.ts
│   │
│   ├── middleware/
│   │   └── auth.ts
│   │
│   ├── routes/
│   │   ├── chat.ts
│   │   └── materials.ts
│   │
│   ├── services/
│   │   └── openai.ts
│   │
│   ├── utils/
│   │
│   └── index.ts
│
├── src/
│   │
│   ├── components/
│   │   ├── AIMessage.tsx
│   │   ├── AdminRoute.tsx
│   │   ├── AppHeader.tsx
│   │   ├── ProtectedRoute.tsx
│   │   ├── SiteFooter.tsx
│   │   └── ThemeToggle.tsx
│   │
│   ├── context/
│   │   └── ThemeContext.tsx
│   │
│   ├── hooks/
│   │   └── useAuth.tsx
│   │
│   ├── integrations/
│   │   └── supabase/
│   │       └── client.ts
│   │
│   ├── pages/
│   │   ├── AboutPage.tsx
│   │   ├── AdminPage.tsx
│   │   ├── AuthPage.tsx
│   │   ├── ContactPage.tsx
│   │   ├── FrankyAIPage.tsx
│   │   ├── HomePage.tsx
│   │   ├── LibraryPage.tsx
│   │   ├── NotFoundPage.tsx
│   │   ├── PrivacyPage.tsx
│   │   ├── ProfilePage.tsx
│   │   ├── SavedMaterialsPage.tsx
│   │   ├── SettingsPage.tsx
│   │   └── TermsPage.tsx
│   │
│   ├── services/
│   │   └── chat.ts
│   │
│   ├── types/
│   │   └── chat.ts
│   │
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── vite-env.d.ts
│
├── supabase/
│   └── migrations/
│       ├── 001_initial_schema.sql
│       └── 002_ai_conversations.sql
│
├── .env
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
└── README.md
```

---

# ⚠️ Environment Security

Never upload your real `.env` file to GitHub.

Your `.gitignore` should include:

```gitignore
.env
.env.local
.env.development.local
.env.production.local
.env.*.local

!.env.example
```

Never expose these values publicly:

```text
OPENAI_API_KEY
SUPABASE_SERVICE_ROLE_KEY
```

If a secret is accidentally committed publicly, remove it from use and rotate/revoke it with the relevant provider.

---

# 🗄️ Supabase Setup

Create a Supabase project and configure the required database tables.

The project may use tables such as:

```text
profiles
user_roles
saved_materials
chat_conversations
chat_messages
```

Database migrations are stored under:

```text
supabase/migrations/
```

Run the required SQL migrations through your Supabase environment before using the application.

---

# 🔒 Row Level Security

Row Level Security should be enabled for user-specific database tables.

For example:

```text
profiles
saved_materials
chat_conversations
chat_messages
```

Policies should ensure that authenticated users only access records belonging to them unless an administrator is explicitly authorized.

The frontend alone must never be treated as the security boundary.

---

# 🤖 OpenAI Configuration

Franky's AI runs through the backend.

The browser sends:

```text
Student question
        ↓
Express backend
        ↓
Authentication check
        ↓
Rate limiting
        ↓
OpenAI API
        ↓
AI response
        ↓
Database
        ↓
Student
```

The frontend should never communicate with OpenAI using a secret API key.

The OpenAI client is configured in:

```text
server/services/openai.ts
```

The AI endpoint is implemented in:

```text
server/routes/chat.ts
```

---

# 🧠 Franky's AI Conversation Flow

When a student sends a question:

```text
Student
   │
   ▼
FrankyAIPage.tsx
   │
   ▼
src/services/chat.ts
   │
   │ Bearer access token
   ▼
POST /api/chat
   │
   ▼
Authentication middleware
   │
   ▼
Load conversation history
   │
   ▼
Find relevant learning resources
   │
   ▼
OpenAI
   │
   ▼
Save AI response
   │
   ▼
Supabase
   │
   ▼
Student interface
```

This allows Franky's to maintain its own conversation history.

---

# 📚 Learning Resource Architecture

Franky's Study Hub is designed around **external open educational resources**.

The basic architecture is:

```text
Student
   │
   ▼
Franky's Library
   │
   ▼
Search / filter
   │
   ▼
Resource catalog
   │
   ├── Open textbook
   ├── University resource
   ├── Documentation
   ├── Educational website
   └── Open course
          │
          ▼
Original provider
```

The platform should provide:

- Resource title
- Description
- Subject
- Topics
- Source/provider
- Original URL
- Resource type

Franky's should not claim ownership of external educational materials.

---

# 💾 Saved Resource Flow

Instead of copying an entire external resource into Franky's servers, the application can save references to useful resources.

Example:

```text
Student
   │
   ▼
Find resource
   │
   ▼
Save
   │
   ▼
saved_materials
   │
   ▼
Student's personal library
```

---

# 🔐 Authentication Architecture

Authentication is handled through Supabase.

```text
Register / Login
       │
       ▼
Supabase Auth
       │
       ▼
Session
       │
       ▼
AuthProvider
       │
       ├── Public routes
       │
       └── Protected routes
```

Protected routes include:

```text
/library
/saved
/franky-ai
/profile
/settings
/admin
```

The `/admin` route requires additional administrator authorization.

---

# 🌐 Application Routes

## Public Routes

```text
/
```

Landing page.

```text
/auth
```

Login and registration.

```text
/about
```

Information about Franky's Study Hub.

```text
/contact
```

Contact information.

```text
/privacy
```

Privacy policy.

```text
/terms
```

Terms of use.

---

## Protected Student Routes

```text
/library
```

Learning resource library.

```text
/saved
```

Saved learning resources.

```text
/franky-ai
```

Franky's AI tutor.

```text
/profile
```

Student profile.

```text
/settings
```

Application settings.

---

## Administrator Route

```text
/admin
```

Administrator dashboard.

This route should require an administrator role.

---

# 🌓 Theme System

Franky's supports:

```text
Light Mode
Dark Mode
```

The theme is managed through:

```text
src/context/ThemeContext.tsx
```

and controlled through:

```text
src/components/ThemeToggle.tsx
```

The selected preference is stored locally.

---

# ▶️ Running the Development Server

Run:

```bash
npm run dev
```

This starts the frontend and backend development servers.

Frontend:

```text
http://localhost:5173
```

Backend:

```text
http://localhost:5000
```

API health endpoint:

```text
http://localhost:5000/api/health
```

---

# ⚠️ Do Not Use VS Code Live Server

Franky's Study Hub is a full-stack application.

Do not run the complete project by right-clicking:

```text
index.html
```

and selecting:

```text
Open with Live Server
```

Live Server only serves static frontend files.

It does not run:

- Express
- Node.js API routes
- Server-side OpenAI integration
- Authentication middleware
- API rate limiting
- Backend environment variables

For development use:

```bash
npm run dev
```

---

# 🛠️ Development Commands

## Start development

```bash
npm run dev
```

## Frontend only

```bash
npm run dev:client
```

## Backend only

```bash
npm run dev:server
```

## Type checking

```bash
npm run typecheck
```

## Production build

```bash
npm run build
```

## Preview frontend production build

```bash
npm run preview
```

## Start backend

```bash
npm start
```

---

# 🏭 Production Build

Before deployment run:

```bash
npm install
```

Then:

```bash
npm run typecheck
```

Then:

```bash
npm run build
```

The frontend production output is normally created inside:

```text
dist/
```

---

# 🌍 Deployment

Because Franky's Study Hub contains both a frontend and backend, deployment requires more than ordinary static hosting.

A common architecture is:

```text
Internet
   │
   ├───────────────┐
   │               │
   ▼               ▼
Frontend         Backend
Hosting          Node Hosting
   │               │
   │               ├── OpenAI
   │               │
   │               └── Supabase
   │
   └───────────────┐
                   ▼
                Student
```

The frontend can be deployed to a static-capable frontend hosting provider.

The Express backend requires:

- Node.js hosting
- Container hosting
- Serverless adaptation
- VPS
- Or another environment capable of running the backend

A plain HTML hosting panel without Node.js support cannot run the Express backend by itself.

---

# 🔧 Production Environment Variables

Frontend hosting needs public frontend variables such as:

```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_API_URL=https://your-api-domain.example/api
```

The backend environment requires private values such as:

```env
PORT=5000

CLIENT_URL=https://your-frontend-domain.example

SUPABASE_URL=...

SUPABASE_SERVICE_ROLE_KEY=...

OPENAI_API_KEY=...

OPENAI_MODEL=...

NODE_ENV=production
```

Never place backend secrets in frontend environment variables.

---

# 🔁 SPA Routing

Because React Router handles routes such as:

```text
/library
/profile
/franky-ai
/settings
```

your frontend hosting provider must be configured to return the React application's `index.html` for unknown frontend routes.

Otherwise refreshing:

```text
/franky-ai
```

may incorrectly produce a hosting-provider `404`.

---

# 🧪 Recommended Testing

Before deployment, test:

### Authentication

- Registration
- Login
- Logout
- Session persistence
- Invalid password
- Email confirmation
- OAuth login
- Protected routes

### Library

- Search
- Subject filters
- External links
- Save resource
- Remove saved resource

### Franky's AI

- New conversation
- Multiple messages
- Conversation history
- Refresh persistence
- Delete conversation
- Markdown
- Code blocks
- Tables
- Copy response
- Rate limiting
- Unauthenticated requests

### Profile

- Update name
- Update university
- Update programme
- Refresh and verify persistence

### Theme

- Light mode
- Dark mode
- Refresh persistence

### Security

- Student A cannot access Student B's data
- Non-admin cannot access administrator data
- OpenAI key is not visible in browser code
- Service-role key is not visible in browser code
- API rejects invalid authentication tokens

---

# 🛡️ Production Security Checklist

Before making Franky's public:

- [ ] `.env` is ignored by Git
- [ ] No API keys exist in GitHub history
- [ ] Supabase RLS is enabled
- [ ] RLS policies have been tested
- [ ] OpenAI API key exists only on backend
- [ ] Supabase service-role key exists only on backend
- [ ] Backend validates authentication
- [ ] AI endpoint has rate limiting
- [ ] CORS only allows approved production origins
- [ ] HTTPS is enabled
- [ ] Error messages do not expose secrets
- [ ] Admin authorization is enforced server-side/database-side
- [ ] Dependencies are updated
- [ ] Production environment variables are configured
- [ ] Account deletion is implemented before public launch if required
- [ ] Privacy policy matches the actual production data flow

---

# 🎯 Design Goals

Franky's Study Hub is designed around five principles:

### 1. Simple

Students should be able to find learning resources without navigating a complicated interface.

### 2. Useful

Features should solve real study problems.

### 3. Secure

Private user information must remain protected.

### 4. Educational

Franky's AI should help students understand concepts rather than simply produce answers without explanation.

### 5. Open

Where possible, the platform should help students discover legitimate free and open educational resources.

---

# 🔮 Future Features

Possible future additions include:

- Study planner
- Revision timetable
- Flashcards
- AI-generated quizzes
- Practice questions
- Progress tracking
- Course dashboards
- Study streaks
- Resource ratings
- Resource recommendations
- Better academic search
- Citation tools
- AI conversation search
- Export study notes
- PWA support
- Offline saved-resource metadata
- University-specific resource collections

---

# 🤝 Contributing

Contributions are welcome.

A typical contribution workflow is:

```bash
git checkout -b feature/your-feature
```

Make your changes.

Then:

```bash
git add .
```

Commit:

```bash
git commit -m "Add new feature"
```

Push:

```bash
git push origin feature/your-feature
```

Then open a pull request.

---

# 🐛 Reporting Problems

When reporting a problem, include:

- What happened
- What you expected
- Steps to reproduce it
- Browser
- Operating system
- Relevant console error
- Relevant server error

---

# 📜 External Educational Resources

Franky's Study Hub may provide links to educational resources hosted by third parties.

Those materials remain subject to the copyright, licensing terms, privacy policies, and terms of their respective providers.

Franky's Study Hub should link to original sources wherever practical and should not represent third-party resources as being owned by Franky's.

---

# ⚖️ Disclaimer

Franky's Study Hub is an educational support platform.

AI-generated responses may be incomplete or incorrect and should not automatically be treated as authoritative academic information.

Students should verify important information with:

- Course instructors
- Official documentation
- Textbooks
- University materials
- Peer-reviewed sources
- Other appropriate academic references

---

# 👨‍💻 Developer

**Marvin Frank**

Franky's Study Hub is being developed as a modern full-stack educational platform combining open educational resources, secure student tools, and AI-assisted learning.

---

# 📄 License

Add the project's chosen license in:

```text
LICENSE
```

before public distribution.

If the repository contains third-party resources, libraries, icons, or other external material, their respective licenses still apply.

---

# 💙 Franky's Study Hub

```text
Discover.
Understand.
Practice.
Learn.
```

**Learn smarter. Study better. Build your future with Franky's. 🎓**
