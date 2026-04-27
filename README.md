# Taza Pizza SaaS Platform

Taza Pizza is a modern, AI-powered food delivery SaaS application built to demonstrate a scalable, full-stack React implementation with real-time features. 

## Features
- **AI "Pizza Lab"**: Uses Google Gemini to dynamically generate custom gourmet pizza recipes based on user flavor preferences.
- **Smart Delivery System**: Integrates (mocked/simulated) Google Maps and OpenWeather API to provide dynamic delivery estimates (adds buffer time for rain/snow/smog).
- **Market Localization**: Features a cultural discount engine that automatically applies discounts during events like Pakistan Day (Mar 23), Independence Day (Aug 14), Basant, and Midnight cravings.
- **Database Architecture**: Fully configured for Supabase (PostgreSQL) with `orders` and `reviews` tables and Row Level Security (RLS) policies.
- **State Management**: Cart and checkout logic powered by Zustand.

## Tech Stack
- **Frontend**: React 19, Vite, Tailwind CSS v4, Radix UI, Framer Motion
- **Backend / BaaS**: Supabase (PostgreSQL, Auth)
- **APIs**: Google Gemini SDK (`@google/genai`), Google Maps API, OpenWeather API

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Rename `.env.example` to `.env` and fill in your keys:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   VITE_SUPABASE_URL=your_supabase_url_here
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
   VITE_OPENWEATHER_API_KEY=your_openweather_api_key_here
   ```

3. **Database Setup**
   Run the SQL scripts located in `supabase_schema.sql` in your Supabase SQL editor to create the necessary tables for Orders and Reviews.

4. **Run Development Server**
   ```bash
   npm run dev
   ```

## Project Documentation
Detailed diagrams (Architecture, Class, Sequence) and the full project proposal are available in the `project_proposal.md` file in the root directory.
