<div align="center">

# 🍕 Taza Pizza // SaaS Platform 2026

[![React 19](https://img.shields.io/badge/React-19-blue.svg?style=for-the-badge&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF.svg?style=for-the-badge&logo=vite)](https://vitejs.dev)
[![TailwindCSS v4](https://img.shields.io/badge/Tailwind_v4-38B2AC.svg?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E.svg?style=for-the-badge&logo=supabase)](https://supabase.com)
[![Google Gemini](https://img.shields.io/badge/Gemini_AI-4285F4.svg?style=for-the-badge&logo=google)](https://ai.google.dev/)

*Revolutionizing the artisanal pizza experience with Artificial Intelligence, Real-time Tracking, and Dynamic Market Localization.*

</div>

---

## 🚀 The Vision
Taza Pizza isn't just a restaurant—it's a **Next-Gen Food SaaS**. We blend ancient Neapolitan dough-making techniques with cutting-edge 2026 web technologies. 

Experience real-time delivery tracking, AI-generated gourmet recipes tailored to your cravings, and smart weather-adjusted ETAs.

---

## ✨ Cutting-Edge Features

### 🧠 **The AI "Pizza Lab"**
Powered by **Google Gemini API**, users input their flavor profiles (e.g., "spicy, truffle, no olives"), and our AI dynamically generates a fully custom, gourmet pizza recipe with premium ingredients and dynamic pricing.

### 🌤️ **Smart ETA Engine**
Why guess when your pizza will arrive? We integrate **Google Maps APIs** for base route calculation and the **OpenWeather API** to inject dynamic delay buffers. Raining in Lahore? Your ETA updates instantly to guarantee food quality.

### 🇵🇰 **Localized Discount Matrix**
Our dynamic event engine automatically tracks Pakistani cultural events:
- **Independence Day (Aug 14):** 14% OFF
- **Pakistan Day (Mar 23):** 23% OFF
- **Midnight Cravings:** Automated late-night discounts.

### 🗄️ **Robust Cloud Architecture**
Built on **Supabase** (PostgreSQL), utilizing Row Level Security (RLS) for secure order tracking, real-time feedback, and review ingestion.

---

## 🛠️ Tech Stack (2026 Standard)

| Domain | Technology | Justification |
| :--- | :--- | :--- |
| **Frontend Core** | React 19 + Vite | Unmatched compilation speed & React Compiler optimizations |
| **Styling & UI** | Tailwind CSS v4 + Radix UI | Native nested CSS, lightning-fast engine, accessible primitives |
| **State Management** | Zustand | Zero-boilerplate, hyper-fast global state |
| **Animations** | Framer Motion | Fluid, hardware-accelerated micro-interactions |
| **Backend / DB** | Supabase (PostgreSQL) | Scalable BaaS with instant real-time channels |

---

## ⚙️ Quick Start Guide

### 1. Clone & Install
```bash
git clone https://github.com/thisisahmad24/taza-pizza.git
cd taza-pizza
npm install
```

### 2. Environment Setup
Rename `.env.example` to `.env` and inject your active API keys:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
VITE_OPENWEATHER_API_KEY=your_openweather_api_key_here
```

### 3. Database Migration
Navigate to your Supabase SQL Editor and execute the `supabase_schema.sql` file located in the root directory to provision your `orders` and `reviews` tables.

### 4. Ignite the Server
```bash
npm run dev
```

---

<div align="center">
  <p>Built with ❤️ and 🍕 by <a href="https://github.com/thisisahmad24">Ahmad</a></p>
</div>
