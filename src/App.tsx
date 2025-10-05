import React from "react";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import CatalogPage from "./pages/catalog/CatalogPage";
import AccountPage from "./pages/account/AccountPage";
import {DepartmentPage} from "./components/catalog/DepartmentPage";
import { RoutePage } from './pages/route/RoutePage';
import BottomNavigation from "./components/common/BottomNavigation";

export const App: React.FC = () => {
    return (
        <ChakraProvider value={defaultSystem}>
            <div className="app-container">
                <main className="app-main">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/catalog" element={<CatalogPage />} />
                        <Route path="/catalog/:departmentId" element={<DepartmentPage />} />
                        <Route path="/route" element={<RoutePage />} />
                        <Route path="/account" element={<AccountPage />} />
                    </Routes>
                </main>
                <BottomNavigation />
            </div>
        </ChakraProvider>
    );
};

export default App;