import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import Cart from './components/Cart';
import Chatbot from './components/Chatbot';
import { ThemeProvider } from './context/ThemeContext';
import { CartProvider } from './context/CartContext';
import './styles/App.css';
import './styles/theme.css';
import './styles/components.css';

function App() {
  return (
    <ThemeProvider>
      <CartProvider>
        <Router
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <div className="app">
            {/* Header with real-time cart count */}
            <Header />

            {/* Main content */}
            <main className="main-content">
              <div className="container">
                <Routes>
                  <Route path="/" element={<ProductList />} />
                  <Route path="/products" element={<ProductList />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                </Routes>
              </div>
            </main>

            {/* Footer */}
            <Footer />

            {/* Chatbot */}
            <Chatbot />
          </div>
        </Router>
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;
