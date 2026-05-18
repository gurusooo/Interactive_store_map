import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './HomePage.module.css';
import happyCart from '../../assets/cart-happy.png';
import placeholderImage from '../../assets/placeholder.png';
import 'maplibre-gl/dist/maplibre-gl.css';
import maplibregl from 'maplibre-gl';
import { useAuthStore } from '../../stores/authStore';
import { useProfileStore } from '../../stores/profileStore';
import { useShoppingList } from '../../hooks/useShoppingList';
import { useStore } from '../../stores/useStore';
import { FaTrashAlt, FaPlus, FaMinus } from 'react-icons/fa';
import { ConfirmModal } from '../../components/common/ConfirmModal.tsx';
import { AddProductOverlay } from '../../components/home/AddProductOverlay';
import { Flex, Spinner, Text } from '@chakra-ui/react';
import { IoClose } from 'react-icons/io5';

const STORE_COORDS = {
    latitude: 56.426444,
    longitude: 43.963122,
};

export function HomePage() {
    const [showMap, setShowMap] = useState(false);
    const [showAddOverlay, setShowAddOverlay] = useState(false);

    const [productToDelete, setProductToDelete] = useState<{
        id: number;
        name: string;
    } | null>(null);

    const mapContainer = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<maplibregl.Map | null>(null);

    const { user } = useAuthStore();

    const { profile, loadProfile } = useProfileStore();

    const { cartItems, loading: cartLoading, refreshCart, updateQuantity } = useShoppingList();

    const { products, loadProducts, loading: productsLoading } = useStore();

    const navigate = useNavigate();

    useEffect(() => {
        if (!user) return;

        const loadInitialData = async () => {
            try {
                await Promise.all([loadProfile(user.id), refreshCart(), loadProducts()]);
            } catch (error) {
                console.error('Error loading initial data:', error);
            }
        };
        void loadInitialData();
    }, [user]);

    const isPageLoading = cartLoading || productsLoading;

    const cartItemsWithDetails = Array.from(cartItems.entries())
        .map(([productId, cartItem]) => {
            const product = products.find((p) => p.id === productId);

            if (!product) return null;

            return {
                cartId: cartItem.id,
                productId,
                quantity: cartItem.quantity,
                name: product.name,
                price: product.price,
                image: product.image || placeholderImage,
            };
        })
        .filter(Boolean);

    useEffect(() => {
        if (!showMap || !mapContainer.current || mapInstance.current) {
            return;
        }

        mapInstance.current = new maplibregl.Map({
            container: mapContainer.current,

            style: {
                version: 8,

                sources: {
                    'osm-tiles': {
                        type: 'raster',
                        tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
                        tileSize: 256,
                        attribution: '© OpenStreetMap contributors',
                    },
                },

                layers: [
                    {
                        id: 'osm-tiles',
                        type: 'raster',
                        source: 'osm-tiles',
                        minzoom: 0,
                        maxzoom: 19,
                    },
                ],
            },

            center: [STORE_COORDS.longitude, STORE_COORDS.latitude],

            zoom: 16,
        });

        mapInstance.current.on('load', () => {
            new maplibregl.Marker({
                color: '#f08c1f',
            })
                .setLngLat([STORE_COORDS.longitude, STORE_COORDS.latitude])
                .addTo(mapInstance.current!);
        });

        return () => {
            if (mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
            }
        };
    }, [showMap]);

    const handleCloseMap = () => {
        setShowMap(false);
    };

    const handleDeleteItem = async (productId: number) => {
        await updateQuantity(productId, 0);

        setProductToDelete(null);
    };

    const handleQuantityChange = async (productId: number, newQuantity: number) => {
        if (newQuantity < 1) {
            const item = cartItemsWithDetails.find((i) => i?.productId === productId);

            setProductToDelete({
                id: productId,
                name: item?.name || 'товар',
            });

            return;
        }

        await updateQuantity(productId, newQuantity);
    };

    const displayName = profile?.display_name || user?.email?.split('@')[0] || 'гость';

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <h1 className={styles.logo}>Главная</h1>

                <button className={styles.mapButton} onClick={() => setShowMap(true)}>
                    Найти магазин
                </button>
            </header>
            <main className={styles.main}>
                <div className={styles.welcomeSection}>
                    <p className={styles.greeting}>Привет, {displayName}!</p>

                    <div className={styles.listHeader}>
                        <p className={styles.subtext}>Твой список покупок:</p>
                        {cartItemsWithDetails.length > 0 && (
                            <button
                                className={styles.startRouteButton}
                                onClick={() =>
                                    navigate('/route', { state: { isNavigating: true } })
                                }
                            >
                                В путь!
                            </button>
                        )}
                    </div>
                </div>

                <div className={styles.shoppingListSection}>
                    {isPageLoading ? (
                        <Flex
                            direction="column"
                            align="center"
                            justify="center"
                            gap="16px"
                            py="48px"
                        >
                            <Spinner size="xl" color="var(--color-primary)" />

                            <Text>Загрузка списка...</Text>
                        </Flex>
                    ) : cartItemsWithDetails.length === 0 ? (
                        <div className={styles.emptyState}>
                            <img
                                src={happyCart}
                                alt="Пустая корзина"
                                className={styles.emptyImage}
                            />

                            <p className={styles.emptyText}>
                                Тут пока пусто, давай добавим что-нибудь?
                            </p>

                            <button
                                className={styles.addFirstButton}
                                onClick={() => setShowAddOverlay(true)}
                            >
                                <FaPlus />
                                Добавить товар
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className={styles.cartList}>
                                {cartItemsWithDetails.map((item) => {
                                    if (!item) return null;

                                    return (
                                        <div key={item.productId} className={styles.cartItem}>
                                            <div className={styles.itemContent}>
                                                <div className={styles.itemImageWrapper}>
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className={styles.itemImage}
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src =
                                                                placeholderImage;
                                                        }}
                                                    />
                                                </div>

                                                <div className={styles.itemInfo}>
                                                    <h3 className={styles.itemName}>{item.name}</h3>

                                                    <div className={styles.itemBottom}>
                                                        <span className={styles.itemPrice}>
                                                            {item.price} ₽
                                                        </span>

                                                        <div className={styles.itemControls}>
                                                            <div
                                                                className={styles.quantityControls}
                                                            >
                                                                <button
                                                                    className={styles.qtyButton}
                                                                    onClick={() =>
                                                                        handleQuantityChange(
                                                                            item.productId,
                                                                            item.quantity - 1
                                                                        )
                                                                    }
                                                                    disabled={cartLoading}
                                                                >
                                                                    <FaMinus />
                                                                </button>

                                                                <span className={styles.quantity}>
                                                                    {item.quantity} шт
                                                                </span>

                                                                <button
                                                                    className={styles.qtyButton}
                                                                    onClick={() =>
                                                                        handleQuantityChange(
                                                                            item.productId,
                                                                            item.quantity + 1
                                                                        )
                                                                    }
                                                                    disabled={cartLoading}
                                                                >
                                                                    <FaPlus />
                                                                </button>
                                                            </div>

                                                            <button
                                                                className={styles.deleteButton}
                                                                onClick={() =>
                                                                    setProductToDelete({
                                                                        id: item.productId,
                                                                        name: item.name,
                                                                    })
                                                                }
                                                                disabled={cartLoading}
                                                            >
                                                                <FaTrashAlt />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <button
                                className={styles.floatingAddButton}
                                onClick={() => setShowAddOverlay(true)}
                            >
                                <FaPlus />
                            </button>
                        </>
                    )}
                </div>
            </main>
            {showMap && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <button className={styles.closeButton} onClick={handleCloseMap}>
                            <IoClose />
                        </button>

                        <div
                            ref={mapContainer}
                            style={{
                                width: '100%',
                                height: '400px',
                            }}
                        />
                    </div>
                </div>
            )}
            <AddProductOverlay
                isOpen={showAddOverlay}
                onClose={() => setShowAddOverlay(false)}
                onProductAdded={() => {
                    void refreshCart().catch((error) => {
                        console.error('Error refreshing cart after product added:', error);
                    });
                    setShowAddOverlay(false);
                }}
            />
            <ConfirmModal
                isOpen={!!productToDelete}
                onClose={() => setProductToDelete(null)}
                onConfirm={() => handleDeleteItem(productToDelete!.id)}
                title="Удалить товар"
                message={`Вы уверены, что хотите удалить "${productToDelete?.name}" из списка покупок?`}
                confirmText="Удалить"
                cancelText="Отмена"
                confirmBgColor="var(--color-accent)"
            />
        </div>
    );
}
