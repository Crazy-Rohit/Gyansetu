# 📘 GyanSetu – Smart Learning Platform

GyanSetu is a full-stack web application designed to manage classes, subjects, chapters, and learning content for students.
It includes powerful admin controls, a public course viewer, and a clean UI built with React.


## 🚀 Tech Stack
### Frontend

React.js (Vite/CRA based)

React Router

Axios

Tailwind / Custom CSS (as used in your project)

Context API for state management


### Backend

Node.js

Express.js

MongoDB + Mongoose

JWT Authentication

Cloud-based media storage (if used)


## 📂 Project Structure
GyanSetu/

│

├── client/                     # React Frontend

│   ├── src/

│   │   ├── api/                # API handlers (Axios)

│   │   ├── components/

│   │   ├── pages/              # Course, Chapter, Admin pages

│   │   ├── context/            # Global Auth Context

│   │   ├── styles/

│   │   └── main.jsx

│   └── index.html

│

└── server/                     # Node.js Backend

    ├── controllers/
    
    ├── models/
    
    ├── routes/
    
    ├── middleware/
    
    
    ├── config/
    
    └── server.js


## ✨ Features
### Public / Student Features

View Classes → Subjects → Chapters → Subcontent

Each content opens in its own dedicated page/tab

Clean card-based UI for browsing content

Automatic sorting: oldest content shown first


### Admin Features

Add/Edit/Delete:

Classes

Subjects

Chapters

Content (PDF, Video, Text, Attachments)

Authentication with JWT

Dashboard interface to manage learning material

Image/PDF upload support


## 🛠️ Installation & Setup
1. Clone the repository
git clone https://github.com/yourusername/gyansetu.git
cd gyansetu

📦 Backend Setup (server/)
Install dependencies
cd server
npm install

Create .env file
PORT=5000
MONGO_URI=your_mongodb_url
JWT_SECRET=your_secret_key
CLOUD_NAME=
CLOUD_API_KEY=
CLOUD_API_SECRET=

Start backend
npm start

💻 Frontend Setup (client/)
Install dependencies
cd client
npm install

Start frontend
npm run dev

🔗 API Endpoints Overview
Class Endpoints
GET    /api/classes
POST   /api/classes
PATCH  /api/classes/:id
DELETE /api/classes/:id

Subject / Chapter / Content APIs

Follow similar pattern, structured under:

/api/subjects
/api/chapters
/api/content

🎨 UI Highlights

Responsive card layout for classes, subjects & chapters

Subcontent displayed in dedicated tabs/pages

Clean typography and spacing

Consistent color palette following GyanSetu theme

All content automatically sorted oldest → newest

🔒 Authentication Flow

Admin login generates a JWT

Stored securely (context/localStorage)

Protected routes using middleware

🚀 Deployment Guide
Frontend (Vercel/Netlify)

Build command:

npm run build


Folder to deploy:

/client/dist

Backend (Render/Railway/Vercel Serverless)

Ensure environment variables are set.
Start command:

node server.js

📘 Future Enhancements

Student login & dashboards

Progress tracking

Assignment upload

Admin analytics panel

Chat/AI-based doubt solving

🧑‍💻 Contributors

Project Owner: GyanSetu

Developer: Rohit Manna
