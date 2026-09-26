# 🤖 JARVIS — AI Virtual Assistant

> A modern, intelligent, and personalized AI-powered virtual assistant built with a full-stack web application and a dedicated desktop agent.

JARVIS is a full-stack AI Virtual Assistant designed to provide users with a personalized conversational experience. The application combines an interactive AI chat interface with authentication, conversation history, memory management, profile management, assistant customization, settings, and desktop capabilities.

The project is organized into three major parts:

- **Frontend** — React-based web application
- **Backend** — Node.js + Express REST API
- **Desktop Agent** — Node.js desktop automation service

---

## ✨ Features

### 🤖 AI Assistant

- AI-powered conversational interface
- Interactive chat experience
- User and assistant message bubbles
- Typing indicator
- Suggested prompts
- Copy assistant responses
- Voice interaction interface

### 🎨 Personalized Assistant

- Custom assistant name
- Assistant avatar
- Personality configuration
- Wake-word configuration
- Live assistant preview
- Personalized assistant experience

### 💬 Conversation Management

- Conversation history
- Previous conversations
- Conversation navigation
- Delete conversations
- Empty-state handling

### 🧠 Memory Vault

- Manage assistant memories
- Store personalized user context
- Memory-focused interface
- Contextual personalization

### 👤 User Profile

- Profile management
- User information
- Personalized account experience

### ⚙️ Settings

- Application settings
- Assistant preferences
- Theme customization
- User experience configuration

### 🔐 Authentication

- User registration
- User login
- Authentication state management
- Protected application experience
- JWT-based authentication support

### 🖥️ Desktop Agent

The project includes a separate desktop agent for extending JARVIS beyond the browser.

Current desktop-agent dependencies include:

- `robotjs` — desktop automation
- `screenshot-desktop` — desktop screenshot capture
- `express` — desktop-agent server
- `dotenv` — environment configuration

### 📱 Responsive UI

- Desktop layout
- Tablet support
- Mobile-friendly interface
- Responsive navigation
- Responsive chat interface
- Adaptive forms and cards

---

# 🖥️ UI & Design

JARVIS follows a futuristic dark-interface design.

- 🌑 Dark theme
- ✨ Glassmorphism-inspired components
- 🎨 Gradient accents
- 🤖 Animated assistant elements
- 📱 Responsive layouts
- ⚡ Modern dashboard experience
- 🧹 Clean and minimal interaction design

---

# 🏗️ Architecture

JARVIS uses a separated frontend, backend, database, AI, and desktop-agent architecture.

```text
                         ┌──────────────────────┐
                         │       User           │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │      Frontend        │
                         │ React + Vite +       │
                         │ Tailwind CSS         │
                         └──────────┬───────────┘
                                    │
                              HTTP / API
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │       Backend        │
                         │ Node.js + Express    │
                         └───────┬───────┬──────┘
                                 │       │
                    ┌────────────┘       └─────────────┐
                    ▼                                  ▼
          ┌──────────────────┐              ┌──────────────────┐
          │     MongoDB      │              │    AI Service    │
          │    Mongoose      │              │   AI Integration │
          └──────────────────┘              └──────────────────┘

                                    │
                                    ▼
                         ┌──────────────────────┐
                         │    Desktop Agent     │
                         │ Node.js + RobotJS    │
                         │ + Screenshot Desktop │
                         └──────────────────────┘
```

---

# 🛠️ Tech Stack

## Frontend

| Technology | Purpose |
|---|---|
| React 19 | User interface |
| Vite 8 | Frontend development and build tool |
| React Router DOM 7 | Client-side routing |
| Tailwind CSS 4 | Styling |
| Axios | HTTP/API communication |
| Lucide React | UI icons |
| clsx | Conditional class handling |
| tailwind-merge | Tailwind class merging |
| Oxlint | Code linting |

## Backend

| Technology | Purpose |
|---|---|
| Node.js | Server-side runtime |
| Express 5 | REST API framework |
| MongoDB | Application database |
| Mongoose 9 | MongoDB object modeling |
| JWT | Authentication tokens |
| bcryptjs | Password hashing |
| cookie-parser | Cookie handling |
| dotenv | Environment configuration |
| Multer | File upload handling |
| Cloudinary | Cloud media storage/management |
| Nodemon | Development server restart |

## Desktop Agent

| Technology | Purpose |
|---|---|
| Node.js | Desktop-agent runtime |
| Express 5 | Agent server |
| RobotJS | Desktop automation |
| screenshot-desktop | Desktop screenshot capture |
| dotenv | Environment configuration |

---

# 📂 Project Structure

```text
Ai-Virtual-Assistant/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── assistant/
│   │   │   ├── common/
│   │   │   └── history/
│   │   │
│   │   ├── context/
│   │   ├── hooks/
│   │   │
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   ├── dashboard/
│   │   │   ├── history/
│   │   │   ├── memory/
│   │   │   ├── profile/
│   │   │   ├── settings/
│   │   │   └── setup/
│   │   │
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   └── package.json
│
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── routes/
│   │   ├── test.routes.js
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── conversation.routes.js
│   │   ├── ai.routes.js
│   │   ├── memory.routes.js
│   │   ├── profile.routes.js
│   │   └── desktop.routes.js
│   ├── middlewares/
│   │   └── error.middleware.js
│   ├── index.js
│   └── package.json
│
├── desktop-agent/
│   ├── src/
│   │   └── index.js
│   └── package.json
│
├── README.md
└── .gitignore
```

> The structure above documents the folders and files confirmed from the project configuration and existing project structure. Additional model/controller/service files can be added to this section as the backend evolves.

---

# 🔌 Backend API Structure

The backend exposes REST API route groups under `/api`.

| Route | Responsibility |
|---|---|
| `/api/test` | Backend testing |
| `/api/auth` | Authentication |
| `/api/user` | User operations |
| `/api/conversation` | Conversation management |
| `/api/ai` | AI-related operations |
| `/api/memory` | Memory management |
| `/api/profile` | Profile management |
| `/api/desktop` | Desktop-agent communication |

The backend also contains a global 404 handler and a global error-handling middleware.

---

# 🔐 Authentication & Security

The backend includes authentication-related technologies and middleware support.

### Authentication stack

- JWT for authentication tokens
- bcryptjs for password hashing
- Cookie parsing support
- Protected application flow

### Production security checklist

Before production deployment:

- [ ] Use strong production secrets
- [ ] Keep `.env` files out of Git
- [ ] Configure production CORS origin
- [ ] Use HTTPS
- [ ] Restrict database access
- [ ] Validate uploaded files
- [ ] Validate and sanitize user input
- [ ] Protect sensitive API routes
- [ ] Do not expose AI/API credentials in frontend code
- [ ] Configure secure cookie settings where cookies are used

---

# ⚙️ Environment Variables

The project uses `dotenv`, so environment-specific configuration should be stored in `.env` files.

Because the exact variable names depend on the current backend configuration files, use the names already defined in your project's code rather than copying arbitrary values from this README.

A typical configuration can contain values for:

```env
PORT=8000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Add the AI provider/API variables used by your project
```

> **Important:** Do not commit real API keys, database credentials, JWT secrets, or Cloudinary credentials to GitHub.

---

# 🚀 Getting Started

## Prerequisites

Install the following before running the project:

- Node.js
- npm
- Git
- MongoDB / MongoDB Atlas
- Required AI service credentials
- Required Cloudinary credentials if media upload functionality is used
- A desktop environment for running the desktop agent

---

## 1. Clone the Repository

```bash
git clone https://github.com/nitinkarma04-afk/Ai-Virtual-Assistant.git

cd Ai-Virtual-Assistant
```

---

# 🎨 2. Frontend Setup

Open a terminal:

```bash
cd frontend
npm install
```

### Run frontend in development

```bash
npm run dev
```

### Build frontend for production

```bash
npm run build
```

### Preview production build locally

```bash
npm run preview
```

### Lint frontend

```bash
npm run lint
```

---

# ⚙️ 3. Backend Setup

Open another terminal:

```bash
cd backend
npm install
```

Create the required `.env` file and configure your database, authentication, media, AI, and other required services.

### Run backend in development

```bash
npm run dev
```

The backend uses:

```text
http://localhost:8000
```

by default when `PORT` is not configured.

---

# 🖥️ 4. Desktop Agent Setup

Open another terminal:

```bash
cd desktop-agent
npm install
```

### Start desktop agent

```bash
npm start
```

The desktop agent starts from:

```text
src/index.js
```

---

# ▶️ Running the Complete Project

Run the three components separately.

### Terminal 1 — Frontend

```bash
cd frontend
npm run dev
```

### Terminal 2 — Backend

```bash
cd backend
npm run dev
```

### Terminal 3 — Desktop Agent

```bash
cd desktop-agent
npm start
```

---

# 🌐 Development Communication

During local development, the architecture works approximately as follows:

```text
Browser
   │
   │ React Application
   ▼
Frontend :5173
   │
   │ HTTP Requests
   ▼
Backend :8000
   │
   ├── Authentication
   ├── Users
   ├── Conversations
   ├── AI
   ├── Memory
   ├── Profile
   └── Desktop
        │
        ▼
   Desktop Agent
```

The backend currently allows the local frontend origin:

```text
http://localhost:5173
```

with credentials support.

> **Production note:** Before deployment, update the backend CORS configuration to allow the deployed frontend domain instead of relying only on the local development origin.

---

# 🧠 Personalization & Memory

JARVIS is designed around a personalized assistant experience.

The application includes dedicated areas for:

- Assistant configuration
- User profile
- Conversation history
- Memory Vault
- Assistant preferences
- Application settings

This allows the project to evolve from a basic chatbot into a more personalized virtual-assistant platform.

---

# 🖥️ Desktop Agent

The `desktop-agent` is a separate Node.js application that extends JARVIS toward desktop interaction.

It currently includes:

- **RobotJS** for desktop automation
- **screenshot-desktop** for desktop screenshot capture
- **Express** for server functionality
- **dotenv** for configuration

This separation allows desktop-specific functionality to remain independent from the main React web application.

---

# 📦 Production Build

## Frontend

Create an optimized production build:

```bash
cd frontend
npm run build
```

The production output is generated by Vite.

## Backend

The backend is a Node.js/Express application and should be deployed to a Node-compatible hosting environment.

## Database

MongoDB can be hosted using a managed MongoDB deployment such as MongoDB Atlas.

## Desktop Agent

The desktop agent is intended to run in a desktop environment where RobotJS and screenshot functionality are available.

---

# 🌍 Deployment Checklist

Before deploying JARVIS:

### Frontend

- [ ] Create production build
- [ ] Configure production backend API URL
- [ ] Verify routing
- [ ] Verify authentication
- [ ] Verify responsive UI

### Backend

- [ ] Configure production environment variables
- [ ] Configure production database
- [ ] Update CORS origin
- [ ] Configure authentication secrets
- [ ] Configure Cloudinary
- [ ] Configure AI service credentials
- [ ] Test all API routes

### Desktop Agent

- [ ] Configure environment variables
- [ ] Verify RobotJS functionality
- [ ] Verify screenshot functionality
- [ ] Verify communication with backend

### Final Testing

- [ ] Registration
- [ ] Login
- [ ] AI chat
- [ ] Conversation history
- [ ] Memory Vault
- [ ] Profile
- [ ] Settings
- [ ] Assistant setup
- [ ] File/media functionality
- [ ] Desktop agent
- [ ] Mobile responsiveness
- [ ] Production error handling

---

# 🗺️ Future Roadmap

Potential improvements for future versions include:

- 🎙️ More advanced voice interaction
- 🧠 Improved long-term memory
- 🤖 More autonomous assistant workflows
- 🖥️ Expanded desktop automation
- 🔗 More external service integrations
- 🔔 Notifications and reminders
- 🧩 Tool/plugin integrations
- 📊 Assistant usage analytics
- ⚡ Improved real-time interaction
- 🔐 Additional production security hardening

---

# 📸 Screenshots

Add screenshots of the major application screens here.

Recommended screenshots:

- Login / Registration
- Dashboard
- AI Chat
- Assistant Setup
- Conversation History
- Memory Vault
- Profile
- Settings
- Mobile Responsive UI
- Desktop Agent

Example:

```markdown
## 📸 Screenshots

### Dashboard

![JARVIS Dashboard](./screenshots/dashboard.png)

### AI Chat

![JARVIS Chat](./screenshots/chat.png)

### Assistant Setup

![Assistant Setup](./screenshots/setup.png)
```

---

# 🤝 Contributing

Contributions, suggestions, and improvements are welcome.

```bash
git checkout -b feature/your-feature

git add .

git commit -m "Add: your feature"

git push origin feature/your-feature
```

Then open a Pull Request.

---

# 📄 License

This project currently uses the `ISC` license value in its package configuration.

If you want to publish a formal open-source license file, add a `LICENSE` file to the repository and update this section accordingly.

---

# 👨‍💻 Author

## Nitin Sharma

**Full Stack Developer | MERN Stack | AI Projects**

- GitHub: https://github.com/nitinkarma04-afk
- Project: https://github.com/nitinkarma04-afk/Ai-Virtual-Assistant

---

# ⭐ Support

If you find JARVIS interesting, consider giving the repository a ⭐ on GitHub.

Feedback, suggestions, and contributions are welcome.

---

## 🤖 JARVIS

> **A personalized AI assistant — built to explore the future of intelligent interaction.**
