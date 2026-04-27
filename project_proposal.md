# Taza Pizza SaaS Project Proposal

## Executive Summary
Taza Pizza is transitioning from a traditional static web presence into a fully-fledged software-as-a-service (SaaS) platform. This platform aims to revolutionize the food ordering experience by integrating real-time AI for customized recipes, dynamic delivery tracking, and intelligent localized discount management for the Pakistani market. 

## Objectives
1. **Enhanced User Experience**: Provide an intuitive, visually stunning UI built with modern React.
2. **AI-Powered "Pizza Lab"**: Allow users to generate custom pizza recipes and names dynamically using Large Language Models (LLMs).
3. **Real-time Operations**: Implement live tracking (Google Maps) and weather-adjusted delivery times.
4. **Market Localization**: Introduce automated, dynamic discount events (e.g., Ramadan, Eid).
5. **Data Management**: Maintain robust feedback and order history via a cloud database.

---

## Architecture Diagram (Component & System View)

```mermaid
graph TD
    subgraph Client Application (React / Vite)
        UI[User Interface]
        State[Zustand State Manager]
        Routing[React Router]
        API_Layer[API Service Layer]
    end

    subgraph External APIs & Services
        Supabase[(Supabase - PostgreSQL)]
        Auth[Supabase Auth]
        Maps[Google Maps API]
        Weather[OpenWeather API]
        LLM[Google Gemini API]
    end

    UI --> State
    UI --> Routing
    UI --> API_Layer

    API_Layer -->|Fetch/Save Orders & Reviews| Supabase
    API_Layer -->|Authenticate User| Auth
    API_Layer -->|Calculate Route & ETA| Maps
    API_Layer -->|Check Weather Conditions| Weather
    API_Layer -->|Generate Custom Recipes| LLM
```

---

## Class Diagram (Data Models)

```mermaid
classDiagram
    class User {
        +UUID id
        +String name
        +String email
        +String phone
        +login()
        +logout()
    }

    class Order {
        +UUID order_id
        +UUID user_id
        +Array items
        +Float total_price
        +String status
        +DateTime created_at
        +DateTime estimated_delivery
        +calculateETA()
        +applyDiscount()
    }

    class Pizza {
        +UUID pizza_id
        +String name
        +Array ingredients
        +Float base_price
        +Boolean is_ai_generated
    }

    class Review {
        +UUID review_id
        +UUID order_id
        +UUID user_id
        +Int rating
        +String comment
    }

    User "1" -- "*" Order : places
    Order "1" -- "*" Pizza : contains
    Order "1" -- "0..1" Review : receives
```

---

## Sequence / Activity Diagram: Smart Delivery Processing

```mermaid
sequenceDiagram
    actor Customer
    participant Frontend as Web App
    participant SaaS as Supabase DB
    participant Weather as OpenWeather
    participant Maps as Google Maps

    Customer->>Frontend: Submit Order
    Frontend->>Weather: Get local weather conditions (Lahore/Karachi/etc.)
    Weather-->>Frontend: Weather data (e.g., "Heavy Rain")
    
    Frontend->>Maps: Request Route & Base Duration
    Maps-->>Frontend: Base Duration (e.g., 25 mins)
    
    Frontend->>Frontend: Calculate ETA (Base + Prep + Weather Buffer)
    Note over Frontend: If Rain, add 15 mins
    
    Frontend->>SaaS: Create Order with calculated ETA
    SaaS-->>Frontend: Order Confirmed
    Frontend-->>Customer: Show Live Tracker & Countdown
```

---

## Technical Stack & Justification

- **React 19 + Vite**: Chosen for unparalleled performance, instant HMR during development, and modern features.
- **Tailwind CSS v4 & Radix UI**: Provides a highly customizable, accessible, and premium visual aesthetic matching the required "WOW" factor.
- **Supabase (PostgreSQL)**: An open-source Firebase alternative offering robust relational databases, Row Level Security (RLS), and real-time subscriptions, perfect for order tracking and reviews.
- **Zustand**: A lightweight, fast state-management library for maintaining the shopping cart and user sessions.

## Delivery Timeline
1. **Phase 1: Foundation & Docs** - Architecture, Diagrams, Setup
2. **Phase 2: Core UI** - Home, About, Static Content
3. **Phase 3: AI Integration** - Pizza Lab Development
4. **Phase 4: Backend Integration** - Orders, Reviews, User auth
5. **Phase 5: Real-time features** - Live map tracking, dynamic weather timings
6. **Phase 6: Final Polish** - Animations, Discount engine, Deployment prep.
