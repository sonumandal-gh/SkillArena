# 🏆 SkillArena Backend

SkillArena is a coding and DSA challenge platform where users can solve challenges, earn XP, track their progress, and compete on a leaderboard.

## 🚀 Tech Stack

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* bcrypt

## 📦 Installation

Install all required dependencies using:

```bash
npm install
```

## ▶️ Start Backend

Start the backend server using:

```bash
npm start
```

The server will start using the `start` script defined in `package.json`.

## 🔧 Development

For development, you can use Nodemon:

```bash
npx nodemon index.js
```

## 🔐 Environment Variables

Create a `.env` file in the backend folder and add your required environment variables.

Example:

```env
PORT=5003
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

> Do not upload your `.env` file to GitHub.

## 📁 Backend Structure

```text
backend/
├── controllers/
├── middleware/
├── models/
├── routes/
├── .env
├── index.js
├── package.json
└── package-lock.json
```
