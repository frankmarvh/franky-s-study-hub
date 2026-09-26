# 🎓 Franky's Study Hub

**Franky's Study Hub** is a modern AI-powered learning platform designed to help students access study materials, organize academic resources, and get instant academic assistance through **Franky's AI**.

The platform combines a searchable study-material library, secure student accounts, AI-powered learning assistance, course/unit content, and an administrative dashboard in one application.

---

## ✨ Features

### 📚 Study Materials Library

Students can browse academic resources organized by:

* University
* Course
* Unit
* Year of study
* Semester
* Material type

Supported learning resources can include:

* Lecture notes
* Revision notes
* Assignments
* Past papers
* Course documents
* AI-generated study notes

---

### 🤖 Franky's AI

Franky's includes an AI-powered academic assistant designed to help students with their studies.

Students can use Franky's AI to:

* Ask academic questions
* Understand difficult concepts
* Get explanations
* Summarize topics
* Generate revision notes
* Work through study questions
* Receive step-by-step learning assistance

The AI service is handled through a server-side API route so private AI credentials are not exposed directly to the browser.

---

### 🔐 Authentication

Franky's uses Supabase Authentication for secure user accounts.

Supported authentication features include:

* Email registration
* Email/password login
* Google authentication
* Session management
* Protected user features
* Role-based authorization

---

### 👤 User Profiles

Registered users can maintain individual accounts and securely access authenticated features.

The database includes support for:

* User profiles
* User roles
* Authentication information
* AI conversations

---

### 🛡️ Role-Based Access Control

Franky's supports different permission levels.

Current roles include:

```text
USER
ADMIN
```

Normal users can access student features, while administrators receive additional permissions for managing learning resources.

Authorization is enforced using Supabase Row Level Security rather than relying only on frontend checks.

---

### ⚙️ Admin Dashboard

Administrators can manage study resources through the admin section.

Admin capabilities include:

* Uploading study materials
* Creating learning resources
* Updating materials
* Deleting materials
* Managing resource information
* Managing AI-generated unit content

Database security policies ensure that administrative operations are restricted to authorized administrators.

---

### 🔒 Secure File Storage

Study files are stored using Supabase Storage.

Protected materials use temporary signed URLs instead of permanently exposing private storage URLs.

This helps ensure that protected academic resources are only available to authorized users.

---

## 🛠️ Technology Stack

### Frontend

* React 19
* TypeScript
* TanStack Router
* TanStack Start
* TanStack Query
* Tailwind CSS 4
* Vite
* Lucide React

### Backend

* TanStack Start server routes
* Supabase
* PostgreSQL
* Supabase Authentication
* Supabase Storage
* Supabase Row Level Security

### Artificial Intelligence

* Vercel AI SDK
* OpenAI-compatible AI provider
* Server-side AI API routes

---

## 📁 Project Structure

```text
franky-s-study-hub/
│
├── public/
│
├── src/
│   ├── components/
│   │   ├── ui/
│   │   ├── FrankyChat.tsx
│   │   ├── MaterialsLibrary.tsx
│   │   ├── SiteFooter.tsx
│   │   └── SiteHeader.tsx
│   │
│   ├── hooks/
│   │   └── useAuth.tsx
│   │
│   ├── integrations/
│   │   ├── lovable/
│   │   └── supabase/
│   │
│   ├── lib/
│   │   └── units.functions.ts
│   │
│   └── routes/
│       ├── __root.tsx
│       ├── index.tsx
│       ├── auth.tsx
│       ├── library.tsx
│       ├── franky-ai.tsx
│       ├── unit.$id.tsx
│       ├── admin.tsx
│       │
│       └── api/
│           └── chat.ts
│
├── supabase/
│   └── migrations/
│
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

# 🚀 Getting Started

## 1. Prerequisites

Before running Franky's locally, install:

* Node.js 20 or newer
* npm
* Git
* VS Code or another code editor

Check your installations:

```bash
node --version
npm --version
git --version
```

---

## 2. Clone the Repository

```bash
git clone https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
```

Enter the project:

```bash
cd YOUR-REPOSITORY
```

---

## 3. Install Dependencies

Install the required packages:

```bash
npm install
```

---

## 4. Environment Variables

Create a `.env` file in the root directory.

Example:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

Server-only credentials should be configured through your deployment environment and must never be exposed through `VITE_` variables.

For example:

```env
LOVABLE_API_KEY=your_server_side_ai_key
```

Never expose private API keys in frontend source code.

---

## 5. Supabase Setup

Create a Supabase project and configure:

* PostgreSQL database
* Authentication
* Storage
* Row Level Security
* Required database migrations

The application uses tables including:

```text
profiles
user_roles
materials
chat_conversations
```

Apply the migrations located in:

```text
supabase/migrations/
```

---

## 6. Start the Development Server

Run:

```bash
npm run dev
```

The terminal will display the local development URL.

Open that URL in your browser.

---

# 🗄️ Database Architecture

Franky's uses Supabase PostgreSQL as its primary database.

The main application flow is:

```text
User
 │
 ▼
React / TanStack Application
 │
 ├──────────────► Supabase Authentication
 │
 ├──────────────► PostgreSQL Database
 │
 ├──────────────► Supabase Storage
 │
 └──────────────► Franky's AI API
```

---

## 🔐 Row Level Security

Supabase Row Level Security protects application data.

Policies control operations such as:

```text
SELECT
INSERT
UPDATE
DELETE
```

Administrative database operations are protected using role checks.

This prevents users from gaining administrative privileges simply by modifying frontend code.

---

# 📂 Study Material Access

Franky's separates material metadata from protected files.

The basic flow is:

```text
Student
   │
   ▼
Browse Library
   │
   ▼
Select Material
   │
   ▼
Authentication Check
   │
   ▼
Generate Temporary Signed URL
   │
   ▼
Access Material
```

Signed URLs expire automatically after a limited period.

---

# 🤖 Franky's AI Architecture

The AI assistant uses a server-side architecture.

```text
Student
   │
   ▼
Franky's AI Interface
   │
   ▼
/api/chat
   │
   ▼
AI Provider
   │
   ▼
Generated Response
   │
   ▼
Student
```

Private AI credentials should always remain on the server.

The AI endpoint should also use authentication and rate limiting before production deployment.

---

# 🧠 AI-Generated Unit Content

Franky's can generate study content for units that do not already contain notes.

The process works approximately as follows:

```text
Open Unit
    │
    ▼
Does content exist?
   / \
 YES  NO
 │     │
 ▼     ▼
Show   Generate content
notes      with AI
            │
            ▼
       Save to database
            │
            ▼
       Display content
```

Saving generated content prevents unnecessary repeated AI generation requests.

---

# 🔒 Security

Franky's uses several security mechanisms, including:

* Supabase Authentication
* PostgreSQL Row Level Security
* Role-based authorization
* Protected administrative operations
* Private environment variables
* Signed storage URLs
* Server-side AI requests

Before production deployment, the project should also include:

* AI API authentication
* API rate limiting
* Request validation
* Production logging
* Improved error handling
* Security monitoring

---

# 🌐 Deployment

Franky's can be deployed using platforms that support modern React/TanStack applications and server-side routes.

Before deployment, configure all required environment variables in the hosting provider.

Do not upload production secrets directly to GitHub.

Run a production build before deploying:

```bash
npm run build
```

Resolve all TypeScript or build errors before publishing the application.

---

# 🧪 Development Commands

Install dependencies:

```bash
npm install
```

Start development:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

---

# 🗺️ Development Roadmap

Planned improvements include:

* Persistent Franky's AI conversation history
* New Chat functionality
* Previous conversation sidebar
* AI rate limiting
* Protected AI API authentication
* Improved search
* Material filtering
* Student dashboard
* User profile management
* Improved admin dashboard
* AI-generated quizzes
* Study progress tracking
* Bookmarks and saved materials
* Improved mobile experience
* Notifications
* Better error handling
* Automated testing
* Production monitoring

---

# 🔮 Future Vision

Franky's aims to become a complete digital learning environment where students can:

```text
Learn
  +
Revise
  +
Ask AI
  +
Access Notes
  +
Find Past Papers
  +
Practice Questions
  +
Track Progress
  =
Franky's
```

The long-term goal is to combine academic resources and artificial intelligence into one secure and easy-to-use learning platform.

---

# 🤝 Contributing

Contributions are welcome.

To contribute:

1. Fork the repository.
2. Create a new branch.
3. Make your changes.
4. Test the application.
5. Commit your changes.
6. Push your branch.
7. Open a Pull Request.

Example:

```bash
git checkout -b feature/new-feature
git add .
git commit -m "Add new feature"
git push origin feature/new-feature
```

---

# 🐛 Reporting Issues

If you discover a bug, open a GitHub Issue and include:

* Description of the problem
* Steps to reproduce it
* Expected behavior
* Actual behavior
* Screenshots where applicable
* Browser/device information
* Relevant console errors

Do **not** include API keys, passwords, access tokens, or other private credentials in an issue.

---

# 📄 License

This project is intended for educational and development purposes.

Add a `LICENSE` file to the repository before public distribution if you want to define explicit reuse, modification, and redistribution terms.

---

# 👨‍💻 Developer

Developed by **Frank Marvin**.

Franky's is built with the goal of making university learning resources and AI-powered academic assistance easier to access from one platform.

---

## ⭐ Support Franky's

If you find the project useful, consider starring the repository on GitHub.

**Learn smarter. Study better. Build your future with Franky's. 🎓**
