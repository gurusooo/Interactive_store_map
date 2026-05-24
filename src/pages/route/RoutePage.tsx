import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { StoreMap } from '../../components/common/StoreMap';
import styles from './RoutePage.module.css';
import { createPortal } from 'react-dom';
import { Heading } from '@chakra-ui/react';
import { useShoppingList } from '../../hooks/useShoppingList';
import { useStore } from '../../stores/useStore';
import { Product } from '../../types/types';
import { calculateOptimalRoute } from '../../utils/navigationUtils';
import { ConfirmModal } from '../../components/common/ConfirmModal'

interface Department {
    id: string;
    name: string;
    x: number;
    y: number;
    width: number;
    height: number;
}

const departments: Department[] = [
    { id: 'dept-milk', name: 'Молочная продукция и яйцо', x: 30, y: 0, width: 218, height: 30 },
    { id: 'dept-beer', name: 'Пиво 18+', x: 324, y: 0, width: 218, height: 30 },
    { id: 'dept-bread', name: 'Хлеб и выпечка', x: 0, y: 480, width: 30, height: 160 },
    { id: 'dept-alcohol', name: 'Алкоголь 18+', x: 542, y: 30, width: 30, height: 414 },
    { id: 'dept-drinks', name: 'Вода, газировка и энергетики', x: 70, y: 70, width: 192, height: 30},
    { id: 'dept-snacks', name: 'Чипсы и снеки', x: 310, y: 70, width: 192, height: 30 },
    {id: 'dept-juice-kids', name: 'Детское питание и соки', x: 70, y: 103, width: 192, height: 30},
    { id: 'dept-pets', name: 'Для животных', x: 310, y: 103, width: 192, height: 30 },
    { id: 'dept-sweets', name: 'Конфеты и сладости', x: 70, y: 173, width: 192, height: 30 },
    { id: 'dept-hygiene', name: 'Гигиена и аптека', x: 310, y: 173, width: 192, height: 30 },
    { id: 'dept-tea-cookies', name: 'Чай и к чаю', x: 70, y: 206, width: 192, height: 30 },
    { id: 'dept-cleaning', name: 'Стирка и уборка', x: 310, y: 206, width: 192, height: 30 },
    { id: 'dept-grocery-cakes', name: 'Бакалея, торты и пирожные', x: 70, y: 276, width: 192, height: 30},
    { id: 'dept-spice', name: 'Соусы и специи', x: 70, y: 309, width: 192, height: 30 },
    { id: 'dept-frozen', name: 'Заморозка', x: 85, y: 342, width: 162, height: 26 },
    { id: 'dept-cereals', name: 'Крупы и готовые завтраки', x: 70, y: 412, width: 192, height: 30 },
    { id: 'dept-canned', name: 'Консервы', x: 70, y: 445, width: 192, height: 30 },
    { id: 'dept-veggies', name: 'Овощи', x: 91, y: 515, width: 160, height: 40 },
    { id: 'dept-fruits', name: 'Фрукты и ягоды', x: 91, y: 558, width: 160, height: 40 },
    { id: 'dept-coffee-takeaway', name: 'Кофе с собой', x: 30, y: 640, width: 100, height: 40 },
    { id: 'dept-ready', name: 'Готовая еда', x: 133, y: 650, width: 180, height: 30 },
    { id: 'dept-nuts', name: 'Орехи и сухофрукты', x: 316, y: 650, width: 74, height: 30 },
    { id: 'dept-home', name: 'Для дома и дачи', x: 310, y: 276, width: 192, height: 30 },
    { id: 'dept-toys', name: 'Игрушки', x: 310, y: 379, width: 96, height: 40 },
    { id: 'dept-school', name: 'Товары для школы', x: 310, y: 422, width: 96, height: 40 },
    { id: 'dept-ice-cream', name: 'Мороженое', x: 422, y: 389, width: 80, height: 61 },
    { id: 'dept-beauty', name: 'Красота', x: 310, y: 309, width: 192, height: 30 },
    { id: 'dept-meat', name: 'Мясо, птица, рыба, колбасы', x: 0, y: 30, width: 30, height: 414 },
    { id: 'dept-cash', name: 'Кассы', x: 572, y: 480, width: 120, height: 30 },
    { id: 'dept-el-cash', name: 'Электронные кассы', x: 449, y: 480, width: 120, height: 30 },
];

export function RoutePage() {
    const navigate = useNavigate();
    const location = useLocation();
    const isNavigating = location.state?.isNavigating || false;

    const mapContainerRef = useRef<HTMLDivElement>(null);
    const [selectedDept, setSelectedDept] = useState<Department | null>(null);
    const [scale, setScale] = useState(1);
    const [transform, setTransform] = useState({ offsetX: 0, offsetY: 0 });

    const { cartItems, getQuantity } = useShoppingList();
    const { products } = useStore();
    const [routeSteps, setRouteSteps] = useState<Product[]>([]);
    const [routePoints, setRoutePoints] = useState<{ x: number; y: number }[]>([]);
    const [isShoppingStarted, setIsShoppingStarted] = useState(false);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);

    const cartKeysSerialized = Array.from(cartItems.keys()).join(',');
    const [showExitModal, setShowExitModal] = useState(false);

    useEffect(() => {
        if (isNavigating && products.length > 0) {
            const itemsToPick = Array.from(cartItems.keys())
                .map((id) => products.find((p) => p.id === Number(id)))
                .filter(Boolean) as Product[];

            const { fullPathCoordinates, sortedProducts } = calculateOptimalRoute(itemsToPick);

            setRouteSteps(sortedProducts);
            setRoutePoints(fullPathCoordinates);
        }
    }, [isNavigating, cartKeysSerialized, products]);

    useEffect(() => {
        if (!isShoppingStarted || !('Notification' in window) || Notification.permission !== 'granted') return;

        const sendRouteNotification = async (title: string, body: string) => {
            try {
                const registration = await navigator.serviceWorker.ready;

                const options: any = {
                    body,
                    icon: '/icons/cart-icon.png',
                    badge: '/icons/cart-line.svg',
                    tag: 'shopping-route',
                    renotify: true,
                    silent: true
                };

                await registration.showNotification(title, options);
            } catch (error) {
                console.error('Ошибка отправки уведомления:', error);
            }
        };

        if (currentStepIndex < routeSteps.length) {
            const nextItem = routeSteps[currentStepIndex];
            if (nextItem) {
                sendRouteNotification(
                    'Следующий товар',
                    `${nextItem.name} — ${getQuantity(nextItem.id)} шт.`
                ).catch(console.error);
            }
        } else if (currentStepIndex === routeSteps.length && routeSteps.length > 0) {
            sendRouteNotification(
                'Корзина собрана!',
                'Маршрут завершен. Пройдите к кассам для оплаты покупок.'
            ).catch(console.error);
        }
    }, [currentStepIndex, isShoppingStarted, routeSteps, getQuantity]);

    useEffect(() => {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission().then((permission) => {
                console.log('Статус разрешения на уведомления:', permission);
            }).catch(err => console.error('Ошибка при запросе прав:', err));
        }
    }, []);

    const handleBackClick = () => {
        if (isNavigating) {
            setShowExitModal(true);
        } else {
            navigate(-1);
        }
    };

    const handleTransformChange = useCallback((t: { offsetX: number; offsetY: number }) => {
        setTransform((prev) => {
            if (prev.offsetX === t.offsetX && prev.offsetY === t.offsetY) {
                return prev;
            }
            return { offsetX: t.offsetX, offsetY: t.offsetY };
        });
    }, []);

    const zoomIn = () => setScale((s) => Math.min(s + 0.2, 3));
    const zoomOut = () => setScale((s) => Math.max(s - 0.2, 0.5));
    const handleNavigate = () => selectedDept && navigate(`/catalog/${selectedDept.id}`);
    const handleClose = () => setSelectedDept(null);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    const handleNextStep = () => {
        if (currentStepIndex < routeSteps.length) {
            setCurrentStepIndex((prev) => prev + 1);
        }
    };

    const finishShopping = () => {
        navigate('/');
    };

    const getPopupPosition = () => {
        if (!selectedDept || !mapContainerRef.current) return { left: 0, top: 0 };
        const rect = mapContainerRef.current.getBoundingClientRect();

        const deptCenterX = selectedDept.x + selectedDept.width / 2;
        const deptCenterY = selectedDept.y + selectedDept.height / 2;

        const screenX = rect.left + transform.offsetX + deptCenterX * scale;
        const screenY = rect.top + transform.offsetY + deptCenterY * scale;

        const popupWidth = 240;
        const popupHeight = 100;
        const screenPadding = 16;

        let left = screenX - popupWidth / 2;
        let top = screenY - popupHeight;

        left = Math.max(screenPadding, Math.min(left, window.innerWidth - popupWidth - screenPadding));
        top = Math.max(screenPadding, Math.min(top, window.innerHeight - popupHeight - screenPadding));

        return { left, top };
    };
    const popupPosition = getPopupPosition();

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <button className={styles.backButton} onClick={handleBackClick} aria-label="Назад">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                </button>
                <Heading as="h1" size="lg" className={styles.h1}>
                    {isNavigating ? 'Шоппинг' : 'Маршрут'}
                </Heading>
            </div>

            <div className={styles.content}>
                <div className={styles.mapContainer} ref={mapContainerRef}>
                    <div className={styles.zoomControls}>
                        <button onClick={zoomIn}>+</button>
                        <button onClick={zoomOut}>–</button>
                    </div>

                    <StoreMap
                        location={{ x: 500, y: 620 }}
                        className={styles.map}
                        scale={scale}
                        onTransformChange={handleTransformChange}
                        routePath={routePoints}
                        routeItems={routeSteps}
                        currentStepIndex={currentStepIndex}
                    />

                    {!isNavigating && (
                        <div
                            className={styles.clickOverlay}
                            style={{
                                transform: `translate(${transform.offsetX}px, ${transform.offsetY}px) scale(${scale})`,
                                transformOrigin: '0 0',
                                zIndex: 200,
                            }}
                        >
                            {departments.map((dept) => (
                                <div
                                    key={dept.id}
                                    className={styles.deptClickArea}
                                    style={{
                                        left: dept.x,
                                        top: dept.y,
                                        width: dept.width,
                                        height: dept.height,
                                    }}
                                    onClick={() => setSelectedDept(dept)}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {isNavigating && (
                    <div className={styles.navigationPanel}>
                        {!isShoppingStarted ? (
                            <button
                                className={styles.navButtonMain}
                                onClick={() => setIsShoppingStarted(true)}
                            >
                                Начать шоппинг
                            </button>
                        ) : currentStepIndex < routeSteps.length ? (
                            <div className={styles.activeNav}>
                                {routeSteps[currentStepIndex]?.image && (
                                    <img
                                        src={routeSteps[currentStepIndex].image}
                                        alt={routeSteps[currentStepIndex].name}
                                        className={styles.productImage}
                                    />
                                )}

                                <div className={styles.nextItemInfo}>
                                    <span className={styles.nextItemLabel}>Следующий товар:</span>
                                    <span className={styles.nextItemName}>
                                        {routeSteps[currentStepIndex].name}
                                    </span>
                                    <span className={styles.productQuantity}>
                                        Количество: <strong>{getQuantity(routeSteps[currentStepIndex].id)} шт.</strong>
                                    </span>
                                </div>
                                <button className={styles.navButtonAction} onClick={handleNextStep}>
                                    В корзине
                                </button>
                            </div>
                        ) : (
                            <div className={styles.activeNav}>
                                <div className={styles.nextItemInfo}>
                                    <span className={styles.nextItemLabel}>Корзина собрана!</span>
                                    <span className={styles.nextItemName}>Пройдите к кассам</span>
                                </div>
                                <button className={styles.navButtonAction} onClick={finishShopping}>
                                    Завершить
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <ConfirmModal
                isOpen={showExitModal}
                onClose={() => setShowExitModal(false)}
                onConfirm={() => {
                    setShowExitModal(false);
                    navigate('/');
                }}
                title="Прервать покупки?"
                message="Вы уверены, что хотите выйти из режима шоппинга? Текущий прогресс построения маршрута будет сброшен."
                confirmText="Выйти"
                cancelText="Отмена"
                confirmBgColor="var(--color-accent)"
            />

            {!isNavigating &&
                selectedDept &&
                createPortal(
                    <div
                        className={styles.popup}
                        style={{
                            left: popupPosition.left,
                            top: popupPosition.top,
                            position: 'fixed',
                            zIndex: 999,
                        }}
                    >
                        <button className={styles.close} onClick={handleClose}>
                            ×
                        </button>
                        <span className={styles.deptName}>{selectedDept.name}</span>
                        <button className={styles.goBtn} onClick={handleNavigate}>
                            Перейти
                        </button>
                    </div>,
                    document.body
                )}
        </div>
    );
}