import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './app';
import LoginPage from './app/LoginPage';
import ProtectedRoute from './ProtectedRoute';
import RegisterPage from "./app/RegisterPage";

export default function AppRouter() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route element={<ProtectedRoute />}>
                    <Route path="/" element={<App />} />
                </Route>
            </Routes>
        </Router>
    );
}