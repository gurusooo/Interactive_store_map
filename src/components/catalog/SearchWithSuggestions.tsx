import React, { useState, useRef, useEffect, useMemo } from "react";
import { useStore } from "../../stores/useStore";
import { FaSearch, FaTimes } from "react-icons/fa";
import styles from "./SearchWithSuggestions.module.css";
import { Product } from "../../types/types";
import { SearchProductModal } from "./SearchProductModal";

export function SearchWithSuggestions() {
    const searchQuery = useStore((s) => s.searchQuery);
    const setSearchQuery = useStore((s) => s.setSearchQuery);
    const products = useStore((s) => s.products);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const searchRef = useRef<HTMLDivElement>(null);

    const suggestions = useMemo(() => {
        if (!searchQuery) return [];
        return products
            .filter(product =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .slice(0, 4);
    }, [searchQuery, products]);

    const handleInputChange =
        (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchQuery(value);
        setShowSuggestions(value.length > 0);
    };

    const handleSuggestionClick = (product: Product) => {
        setSearchQuery(product.name);
        setShowSuggestions(false);
        setSelectedProduct(product);
    };

    const handleInputFocus = () => {
        if (searchQuery.length > 0) {
            setShowSuggestions(true);
        }
    };

    const handleCloseModal = () => {
        setSelectedProduct(null);
        setSearchQuery("");
    };

    const handleInputKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            setShowSuggestions(false);
        }
    };

    const handleClearSearch = () => {
        setSearchQuery("");
        setShowSuggestions(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <>
            <div className={styles.searchContainer} ref={searchRef}>
                <div className={styles.inputWrapper}>
                    <input
                        className={styles.input}
                        placeholder="Искать товары.."
                        value={searchQuery}
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                        onKeyDown={handleInputKeyDown}
                    />
                    {searchQuery.length > 0 ? (
                        <button
                            className={styles.clearButton}
                            onClick={handleClearSearch}
                            type="button"
                            aria-label="Очистить поиск"
                        >
                            <FaTimes className={styles.clearIcon} />
                        </button>
                    ) : (
                        <FaSearch className={styles.searchIcon} />
                    )}
                </div>

                {showSuggestions && (
                    <div className={styles.suggestionsDropdown}>
                        {suggestions.length > 0 ? (
                            <>
                                <div className={styles.resultsCount}>
                                    {suggestions.length === 1 ? 'Найден' : 'Найдено'} {suggestions.length} {suggestions.length === 1 ? 'товар' : 'товара'}
                                </div>
                                {suggestions.map((product) => (
                                    <div
                                        key={product.id}
                                        className={styles.suggestionItem}
                                        onClick={() => handleSuggestionClick(product)}
                                    >
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className={styles.suggestionImage}
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = "/src/assets/placeholder.png";
                                            }}
                                        />
                                        <div className={styles.suggestionInfo}>
                                            <div className={styles.suggestionName}>{product.name}</div>
                                            <div className={styles.suggestionDetails}>
                                                <span className={styles.suggestionPrice}>{product.price} ₽</span>
                                                {product.weight && (
                                                    <span className={styles.suggestionWeight}>{product.weight} кг</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </>
                        ) : (
                            <div className={styles.noResults}>
                                По запросу "{searchQuery}" ничего не найдено :(
                            </div>
                        )}
                    </div>
                )}
            </div>

            <SearchProductModal
                product={selectedProduct}
                onClose={handleCloseModal}
            />
        </>
    );
}