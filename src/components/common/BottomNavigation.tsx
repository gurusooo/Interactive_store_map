import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AiFillHome, AiOutlineUnorderedList } from "react-icons/ai";
import { FaMap } from "react-icons/fa";
import { IoPerson } from "react-icons/io5";
import styles from "./BottomNavigation.module.css";

type PageKey = "home" | "catalog" | "route" | "account";

interface NavItem {
    id: PageKey
    label: string
    icon: React.ComponentType<{ className?: string }>
    path: string
}

const navItems: NavItem[] = [
    { id: "home", label: "Главная", icon: AiFillHome, path: "/" },
    { id: "catalog", label: "Каталог", icon: AiOutlineUnorderedList, path: "/catalog" },
    { id: "route", label: "Маршрут", icon: FaMap, path: "/route" },
    { id: "account", label: "Аккаунт", icon: IoPerson, path: "/account" },
]

const BottomNavigation: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const getCurrentPage = (): PageKey => {
        const path = location.pathname;
        if (path === "/") return "home";
        if (path === "/catalog" || path.startsWith("/catalog/")) return "catalog";
        if (path === "/route") return "route";
        if (path === "/account") return "account";
        return "home";
    };

    const currentPage = getCurrentPage();

    const handleNavigation = (item: NavItem) => {
        navigate(item.path);
    };

    return (
        <nav className={styles.navigation}>
            {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;

                return (
                    <button
                        key={item.id}
                        className={`${styles.navItem} ${
                            isActive ? styles.navItemActive : ""
                        }`}
                        onClick={() => handleNavigation(item)}
                    >
                        <Icon className={styles.navIcon} />
                        <span className={styles.navLabel}>{item.label}</span>
                    </button>
                );
            })}
        </nav>
    );
};

export default BottomNavigation;
