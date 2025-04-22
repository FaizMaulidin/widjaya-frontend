import React from "react"
import { AuthProvider } from "./auth/AuthProvider"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import LoginPage from "./pages/LoginPage"
import Menu from "./pages/Menu"
import ProtectedRoute from "./auth/ProtectedRoute"

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Navigate to="/login" replace/>} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route
                        path="/main/*"
                        element={
                        <ProtectedRoute>
                            <Menu />
                        </ProtectedRoute>
                        }
                    />
                </Routes>
            </Router>
        </AuthProvider>
    )
}

export default App
