import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import { AppProvider } from '@/context/AppContext';
import HomePage from './pages/HomePage';
import { LoginPage, RegisterPage } from './pages/AuthPages';
import AdminPage from './pages/AdminPage';
import ProfilePage from './pages/ProfilePage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';

function App() {
    return (
        <AppProvider>
            <Router>
                <ScrollToTop />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/giris" element={<LoginPage />} />
                    <Route path="/kayit" element={<RegisterPage />} />
                    <Route path="/admin" element={<AdminPage />} />
                    <Route path="/profil" element={<ProfilePage />} />
                    <Route path="/urun/:id" element={<ProductPage />} />
                    <Route path="/sepet" element={<CartPage />} />
                </Routes>
            </Router>
        </AppProvider>
    );
}

export default App;
