import { useState, useRef, useEffect, useMemo } from 'react';
import { useStore } from '../../stores/useStore';
import { useShoppingList } from '../../hooks/useShoppingList';
import { FaSearch, FaTimes, FaPlus } from 'react-icons/fa';
import styles from './AddProductOverlay.module.css';
import { Product } from '../../types/types';

interface AddProductOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    onProductAdded?: () => void;
}

export function AddProductOverlay({ isOpen, onClose, onProductAdded }: AddProductOverlayProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [isAdding, setIsAdding] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const products = useStore((s) => s.products);
    const { addToCart, getQuantity, updateQuantity } = useShoppingList();

    const suggestions = useMemo(() => {
        if (!searchQuery || searchQuery.length < 1) return [];
        return products
            .filter(
                (product) =>
                    product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
                    (!selectedProduct || product.id !== selectedProduct.id)
            )
            .slice(0, 5);
    }, [searchQuery, products, selectedProduct]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => {
                inputRef.current?.focus();
                setShowSuggestions(true);
            }, 100);
        }
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) {
            setSearchQuery('');
            setSelectedProduct(null);
            setQuantity(1);
            setShowSuggestions(false);
        }
    }, [isOpen]);

    const handleSuggestionClick = (product: Product) => {
        setSelectedProduct(product);
        setSearchQuery(product.name);
        setShowSuggestions(false);

        const existingQuantity = getQuantity(product.id);
        if (existingQuantity > 0) {
            setQuantity(existingQuantity);
        } else {
            setQuantity(1);
        }
    };

    const handleClearSearch = () => {
        setSearchQuery('');
        setSelectedProduct(null);
        setShowSuggestions(true);
        inputRef.current?.focus();
    };

    const handleQuantityChange = (delta: number) => {
        setQuantity((prev) => Math.max(1, prev + delta));
    };

    const handleAdd = async () => {
        if (!selectedProduct) return;

        setIsAdding(true);
        try {
            const existingQuantity = getQuantity(selectedProduct.id);

            if (existingQuantity > 0) {
                await updateQuantity(selectedProduct.id, existingQuantity + quantity);
            } else {
                await addToCart(selectedProduct.id);
                if (quantity > 1) {
                    await updateQuantity(selectedProduct.id, quantity);
                }
            }
            onProductAdded?.();
            onClose();
        } catch (error) {
            console.error('Error adding product:', error);
        } finally {
            setIsAdding(false);
        }
    };

    const handleInputFocus = () => {
        if (searchQuery && !selectedProduct) {
            setShowSuggestions(true);
        } else if (searchQuery && selectedProduct) {
            setShowSuggestions(true);
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchQuery(value);
        setShowSuggestions(true);

        if (value === '' && selectedProduct) {
            setSelectedProduct(null);
        }
    };

    if (!isOpen) return null;

    const existingQty = selectedProduct ? getQuantity(selectedProduct.id) : 0;
    const isProductInCart = existingQty > 0;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.content} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h3 className={styles.title}>Добавить товар</h3>
                    <button className={styles.closeBtn} onClick={onClose}>
                        <FaTimes />
                    </button>
                </div>

                <div className={styles.searchSection} ref={searchRef}>
                    <div className={styles.inputWrapper}>
                        <FaSearch className={styles.searchIcon} />
                        <input
                            ref={inputRef}
                            type="text"
                            className={styles.searchInput}
                            placeholder="Поиск товаров..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            onFocus={handleInputFocus}
                        />
                        {searchQuery && (
                            <button className={styles.clearBtn} onClick={handleClearSearch}>
                                <FaTimes />
                            </button>
                        )}
                    </div>

                    {showSuggestions && searchQuery && (
                        <div className={styles.suggestionsList}>
                            {suggestions.length > 0 ? (
                                suggestions.map((product) => (
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
                                                (e.target as HTMLImageElement).src =
                                                    '/src/assets/placeholder.png';
                                            }}
                                        />
                                        <div className={styles.suggestionInfo}>
                                            <div className={styles.suggestionName}>
                                                {product.name}
                                            </div>
                                            <div className={styles.suggestionPrice}>
                                                {product.price} ₽
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className={styles.noResults}>
                                    Ничего не найдено для "{searchQuery}"
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {selectedProduct && (
                    <div className={styles.selectedSection}>
                        <div className={styles.selectedProduct}>
                            <img
                                src={selectedProduct.image}
                                alt={selectedProduct.name}
                                className={styles.selectedImage}
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src =
                                        '/src/assets/placeholder.png';
                                }}
                            />
                            <div className={styles.selectedInfo}>
                                <h4 className={styles.selectedName}>{selectedProduct.name}</h4>
                                <div className={styles.selectedPrice}>
                                    {selectedProduct.price} ₽
                                </div>
                                {selectedProduct.weight && (
                                    <div className={styles.selectedWeight}>
                                        {selectedProduct.weight} кг
                                    </div>
                                )}
                            </div>
                        </div>

                        {isProductInCart && (
                            <div className={styles.alreadyInCart}>
                                Уже в списке: {existingQty} шт
                            </div>
                        )}

                        <div className={styles.quantitySection}>
                            <span className={styles.quantityLabel}>Количество:</span>
                            <div className={styles.quantityControls}>
                                <button
                                    className={styles.qtyButton}
                                    onClick={() => handleQuantityChange(-1)}
                                    disabled={quantity <= 1}
                                >
                                    -
                                </button>
                                <span className={styles.quantity}>{quantity} шт</span>
                                <button
                                    className={styles.qtyButton}
                                    onClick={() => handleQuantityChange(1)}
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        <button
                            className={styles.addButton}
                            onClick={handleAdd}
                            disabled={isAdding}
                        >
                            <FaPlus />
                            <span>
                                {isAdding
                                    ? 'Добавление...'
                                    : isProductInCart
                                      ? `Добавить еще ${quantity} шт`
                                      : 'Добавить в список'}
                            </span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
