# 🎓 StudentOS - Academic Operating System

**Next-Gen Academic & Career Management Platform**

A comprehensive full-stack web application designed to streamline the entire student journey — from academic tracking to career placement preparation.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)

---

## ✨ Features

### 🎯 Career Management
- **Job Application Tracker** - Kanban-style board for managing internship/job applications
- **AI-Powered Resume Builder** - ATS-optimized resume generator with Gemini AI
- **Cover Letter Generator** - Customizable AI-generated cover letters
- **Mock Interview Simulator** - AI grading and feedback system

### 📊 Academic Tools
- **Interactive Timeline Portfolio** - Visual representation of academic achievements
- **Study Notes** - Markdown-powered note-taking with syntax highlighting
- **Smart Calendar** - Integrated deadline and event management
- **Document Locker** - Secure storage for transcripts and certificates

### 🤖 AI Integration
- **Career Roadmap Generator** - Personalized learning paths powered by Gemini AI
- **AI Chat Assistant** - 24/7 academic and career guidance
- **Resume Optimization** - Automatic bullet point enhancement
- **Bio Generator** - Professional profile summary creation

### 📈 Analytics & Insights
- **GitHub Integration** - Contribution heatmap and language breakdown
- **LeetCode Tracker** - Real-time coding stats display
- **Performance Dashboard** - Application success rate and trends
- **Gamification** - XP system with achievement badges

---

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for lightning-fast builds
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Axios** for API calls

### Backend
- **Node.js** with Express
- **Prisma ORM** for database management
- **MongoDB** for data persistence
- **JWT** for authentication
- **Google Gemini API** for AI features

### DevOps
- **Vercel** (Frontend hosting)
- **Render** (Backend hosting)
- **MongoDB Atlas** (Database)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB connection string
- Google Gemini API key

### Installation

```bash
# Clone repository
git clone https://github.com/arnav-54/StudentOS.git
cd StudentOS

# Install dependencies
npm install --prefix server
npm install --prefix client

# Setup environment variables
cp server/.env.example server/.env
# Edit server/.env with your credentials

# Generate Prisma client
cd server && npx prisma generate

# Start backend
npm run dev --prefix server

# Start frontend (new terminal)
npm run dev --prefix client
```

Visit `http://localhost:5173` 🎉

---

## 📝 Environment Variables

### Backend (`server/.env`)
```env
DATABASE_URL="your_mongodb_connection_string"
ACCESS_TOKEN_SECRET="your_access_secret"
REFRESH_TOKEN_SECRET="your_refresh_secret"
GEMINI_API_KEY="your_gemini_api_key"
PORT=5001
```

### Frontend (`client/.env`)
```env
VITE_API_URL="http://localhost:5001/api"
```

---

## 📸 Screenshots

### Dashboard
![Dashboard](docs/dashboard.png)

### Job Tracker
![Job Tracker](docs/job-tracker.png)

### AI Hub
![AI Hub](docs/ai-hub.png)

---

## 🎯 Project Structure

```
StudentOS/
├── client/               # React frontend
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── context/     # React Context APIs
│   │   └── App.tsx      # Main app component
│   └── package.json
├── server/              # Node.js backend
│   ├── src/
│   │   ├── controllers/ # Route controllers
│   │   ├── routes/      # API routes
│   │   ├── services/    # Business logic
│   │   ├── middlewares/ # Auth & validation
│   │   └── index.ts     # Server entry point
│   ├── prisma/
│   │   └── schema.prisma # Database schema
│   └── package.json
└── README.md
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Arnav Kumar**
- GitHub: [@arnav-54](https://github.com/arnav-54)
- Email: arnav.kumar@adypu.edu.in

---

## 🙏 Acknowledgments

- [Gemini API](https://ai.google.dev/) for AI capabilities
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Prisma](https://www.prisma.io/) for database ORM
- [Vercel](https://vercel.com/) & [Render](https://render.com/) for hosting

---

## 📊 Project Stats

![GitHub stars](https://img.shields.io/github/stars/arnav-54/StudentOS?style=social)
![GitHub forks](https://img.shields.io/github/forks/arnav-54/StudentOS?style=social)
![GitHub issues](https://img.shields.io/github/issues/arnav-54/StudentOS)

---

**Built with ❤️ for students, by students**
