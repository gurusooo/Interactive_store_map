import React, { useEffect } from 'react';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { HomePage } from './pages/home/HomePage';
import CatalogPage from './pages/catalog/CatalogPage';
import AccountPage from './pages/account/AccountPage';
import { DepartmentPage } from './components/catalog/DepartmentPage';
import { RoutePage } from './pages/route/RoutePage';
import BottomNavigation from './components/common/BottomNavigation';
import { LoginPage } from './pages/auth/LoginPage';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { useAuthStore } from './stores/authStore';

export const App: React.FC = () => {
    const { initializeAuth } = useAuthStore();
    const location = useLocation();
    const hideBottomNav = location.pathname === '/login';

    useEffect(() => {
        initializeAuth()
            .then(() => {
                console.log('Auth initialized successfully');
            })
            .catch((error) => {
                console.error('Failed to initialize auth:', error);
            });
    }, []);

    useEffect(() => {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker
                    .register('/sw.js')
                    .then((registration) => {
                        console.log('SW registered successfully: ', registration);
                    })
                    .catch((registrationError) => {
                        console.log('SW registration failed: ', registrationError);
                    });
            });
        }
    }, []);

    return (
        <ChakraProvider value={defaultSystem}>
            <div className="app-container">
                <main className={`app-main ${hideBottomNav ? 'no-bottom-nav' : ''}`}>
                    <Routes>
                        <Route path="/login" element={<LoginPage />} />

                        <Route
                            path="/"
                            element={
                                <ProtectedRoute>
                                    <HomePage />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/catalog"
                            element={
                                <ProtectedRoute>
                                    <CatalogPage />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/catalog/:departmentId"
                            element={
                                <ProtectedRoute>
                                    <DepartmentPage />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/route"
                            element={
                                <ProtectedRoute>
                                    <RoutePage />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/account"
                            element={
                                <ProtectedRoute>
                                    <AccountPage />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </main>
                {!hideBottomNav && <BottomNavigation />}
            </div>
        </ChakraProvider>
    );
};

export default App;
