<div align="center">

# 🍕 Taza Pizza // Global AI SaaS 2026

[![React 19](https://img.shields.io/badge/React-19-blue.svg?style=for-the-badge&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF.svg?style=for-the-badge&logo=vite)](https://vitejs.dev)
[![Express.js](https://img.shields.io/badge/Express.js-000000.svg?style=for-the-badge&logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248.svg?style=for-the-badge&logo=mongodb)](https://mongodb.com/)
[![Python ML](https://img.shields.io/badge/Python_ML-3776AB.svg?style=for-the-badge&logo=python)](https://python.org)

*Revolutionizing the artisanal pizza experience with Custom Machine Learning Models, Real-time Tracking, and Global Scale.*

</div>

---

## 🚀 The Vision
Taza Pizza isn't just a restaurant—it's a **Next-Gen Food SaaS Platform**. We blend ancient Neapolitan dough-making techniques with cutting-edge 2026 web technologies and custom, locally-trained Artificial Intelligence.

Experience real-time delivery tracking, AI-generated gourmet recipes tailored to your precise cravings, and dynamic machine-learning-adjusted ETAs that factor in weather and global rush hour metrics.

---

## ✨ Cutting-Edge Features

### 🧠 **The AI "Pizza Lab" (Recommendation Engine)**
Our custom-built, pure-Python Machine Learning engine uses **Collaborative Filtering (Pearson Centered Cosine Similarity)** and **Content-Based Keyword Matching**. 
Users input their flavor profiles (e.g., "spicy, truffle"), and our local ML model cross-references historical datasets to instantly suggest the absolute perfect pizza match. *100% Free. No external API keys required.*

### 🌤️ **Smart ETA Prediction Model**
Why guess when your pizza will arrive? We trained a **Multiple Linear Regression (SGD)** model from scratch in Python that achieved a **99.69% accuracy rating**. It dynamically adjusts delivery ETAs based on:
- Delivery Distance
- Live Weather Delays
- Order Volume / Quantity
- Rush Hour Matrix & Day of Week

### 🔐 **Secure Full-Stack Authentication**
Built with a rock-solid Express & MongoDB backend, utilizing `bcrypt` for secure password hashing. Users have access to a beautiful, glassmorphic Profile dashboard where they can securely update their personal details and manage their order history.

---

## 🛠️ Tech Stack Architecture

| Domain | Technology | Justification |
| :--- | :--- | :--- |
| **Frontend Core** | React 19 + Vite | Unmatched compilation speed & React Compiler optimizations |
| **Styling & UI** | Tailwind CSS v4 + Radix UI | Native nested CSS, lightning-fast engine, accessible primitives |
| **Animations** | Framer Motion | Fluid, hardware-accelerated micro-interactions across pages |
| **Backend API** | Node.js + Express | Fast, scalable, and heavily integrated with our Python microservices |
| **Database** | MongoDB + Mongoose | Highly flexible NoSQL document storage for users and orders |
| **Machine Learning** | Pure Python Engine | Custom Matrix Factorization & Gradient Descent running locally |

---

## ⚙️ Quick Start Guide

### 1. Clone & Install
```bash
git clone https://github.com/thisisahmad24/taza-pizza.git
cd taza-pizza
npm install
```

### 2. Backend Environment & Database
Ensure you have [MongoDB Community Server](https://www.mongodb.com/try/download/community) installed and running locally on port `27017` (or provide an Atlas URI).

Navigate to the server directory and install backend dependencies:
```bash
cd server
npm install bcrypt cors dotenv express mongoose
```

### 3. Ignite the Services

**Start the Express & ML API Server (Terminal 1):**
```bash
# From the root directory
node server/server.js
```

**Start the Vite Frontend (Terminal 2):**
```bash
# From the root directory
npm run dev
```

Your global Taza Pizza SaaS is now live at `http://localhost:5173`!

---

<div align="center">
  <p>Built with ❤️ and 🍕 by <a href="https://github.com/thisisahmad24">Ahmad</a> for the world.</p>
</div>
