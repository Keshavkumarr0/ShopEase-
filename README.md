
# 🛍️ ShopEase - Modern Headless E-commerce Store

<div align="center">

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge&logo=vercel)](https://shop-ease-woad.vercel.app/)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue?style=for-the-badge&logo=github)](https://github.com/Keshavkumarr0/ShopEase-)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)

**A blazing-fast, feature-rich headless e-commerce platform built with modern web technologies**

[🚀 Live Demo](https://shop-ease-woad.vercel.app/) | [📖 Documentation](#installation) | [🎯 Features](#features)

</div>

---

## 📸 Preview

<div align="center">
  <img src="https://github.com/Keshavkumarr0/ShopEase-/blob/main/Screenshot%20(462).png"/>
</div>

---

## 🌟 Overview

**ShopEase** is a production-ready, headless e-commerce store that leverages **Shopify's Storefront API** for backend operations while providing a custom, lightning-fast React frontend. Built with performance and user experience in mind, it features real-time cart management, AI-powered product assistance, and seamless shopping workflows.

### 🎯 Key Highlights

- ⚡ **Lightning Fast** - Built with Vite for instant HMR and optimized production builds
- 🛒 **Smart Cart Management** - Real-time updates, persistent storage, and smooth checkout flow
- 🤖 **AI Shopping Assistant** - Google Gemini-powered chatbot for product recommendations
- 📱 **Fully Responsive** - Mobile-first design that works flawlessly on all devices
- 🌓 **Dark/Light Modes** - Automatic theme detection with manual toggle option
- 📦 **Efficient Pagination** - Load and browse through 70+ products seamlessly
- 🔍 **Advanced Search** - Intelligent product search with filtering capabilities

---

## ✨ Features

### 🛍️ E-commerce Core

| Feature | Description |
|---------|-------------|
| **Product Catalog** | Browse 70+ products with high-quality images and detailed descriptions |
| **Smart Pagination** | Navigate through products efficiently with 12 items per page |
| **Product Search** | Real-time search functionality to find products instantly |
| **Detailed Product Pages** | Individual pages with full product information and images |

### 🛒 Shopping Experience

| Feature | Description |
|---------|-------------|
| **Dynamic Cart** | Add, remove, and update quantities with real-time total calculations |
| **Persistent Cart** | Cart data persists across sessions using Context API |
| **Quantity Controls** | Intuitive +/- buttons with validation |
| **Cart Badge** | Live cart item count displayed in navigation |
| **Checkout Ready** | Seamless integration with Shopify checkout |

### 🤖 AI Integration

- **Google Gemini Chatbot** - Intelligent product recommendations and customer support
- **Natural Language Processing** - Understands user queries contextually
- **Real-time Responses** - Instant answers to product questions
- **Contextual Assistance** - Product-specific help and guidance

### 🎨 Design & UI

- **Modern Design System** - Custom CSS with design tokens for consistency
- **Dark/Light Theme** - Automatic detection with manual override
- **Responsive Layout** - Mobile, tablet, and desktop optimized
- **Smooth Animations** - CSS transitions for enhanced user experience
- **Accessible** - WCAG compliant with keyboard navigation support

### ⚡ Performance

- **Code Splitting** - Lazy loading for optimal bundle size
- **Image Optimization** - Shopify CDN for fast image delivery
- **Efficient State Management** - React Context API for global state
- **GraphQL API** - Precise data fetching with Shopify Storefront API

---

## 🛠️ Tech Stack

### Frontend

| Technology | Purpose | Version |
|------------|---------|---------|
| ![React](https://img.shields.io/badge/React-18-61DAFB?logo=react) | UI Library | 18.3+ |
| ![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite) | Build Tool | 5.4+ |
| ![React Router](https://img.shields.io/badge/React_Router-6-CA4245?logo=react-router) | Routing | 6.26+ |
| ![Axios](https://img.shields.io/badge/Axios-1.7-5A29E4?logo=axios) | HTTP Client | 1.7+ |

### Backend & Services

| Service | Purpose |
|---------|---------|
| **Shopify Storefront API** | Product catalog, cart, and checkout management |
| **Google Gemini API** | AI-powered chatbot and recommendations |
| **GraphQL** | Efficient data querying and mutations |

### Styling & Icons

| Tool | Purpose |
|------|---------|
| **Custom CSS** | Component styling with design system |
| **CSS Variables** | Theming and dark/light mode |
| **React Icons** | Iconography (Font Awesome) |

### Deployment

| Platform | Purpose |
|----------|---------|
| **Vercel** | Production hosting with automatic deployments |
| **GitHub** | Version control and CI/CD integration |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm/yarn
- **Shopify Store** with Storefront API access
- **Google Gemini API** key

### Installation

1. **Clone the repository**
   git clone https://github.com/Keshavkumarr0/ShopEase-.git
cd ShopEase-

2. **Install dependencies**

npm install

3. **Set up environment variables**

Create a `.env` file in the root directory:
 VITE_SHOPIFY_DOMAIN=your-store.myshopify.com
VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_token
VITE_GOOGLE_GEMINI_API_KEY=your_gemini_api_key


4. **Start development server**
  npm run dev

5. **Open browser**

Navigate to `http://localhost:5173`

### Build for Production
npm run build
npm run preview


