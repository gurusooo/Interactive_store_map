import { useEffect, useRef, useState } from "react";
import styles from "./HomePage.module.css";
import happyCart from "../../assets/cart-happy.png";
import 'maplibre-gl/dist/maplibre-gl.css';
//import Map, { Marker } from "react-map-gl";
import maplibregl from 'maplibre-gl';

const STORE_COORDS = { latitude: 56.426444, longitude: 43.963122 };

export function HomePage() {
    const [showMap, setShowMap] = useState(false);
    const mapContainer = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<maplibregl.Map | null>(null);

    useEffect(() => {
        if (showMap && mapContainer.current && !mapInstance.current) {
            mapInstance.current = new maplibregl.Map({
                container: mapContainer.current,
                style: {
                    version: 8,
                    sources: {
                        'osm-tiles': {
                            type: 'raster',
                            tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
                            tileSize: 256,
                            attribution: '© OpenStreetMap contributors'
                        }
                    },
                    layers: [{
                        id: 'osm-tiles',
                        type: 'raster',
                        source: 'osm-tiles',
                        minzoom: 0,
                        maxzoom: 19
                    }]
                },
                center: [STORE_COORDS.longitude, STORE_COORDS.latitude],
                zoom: 16,
            });

            mapInstance.current.on('load', () => {
                new maplibregl.Marker({ color: '#f08c1f' })
                    .setLngLat([STORE_COORDS.longitude, STORE_COORDS.latitude])
                    .addTo(mapInstance.current!);
            });
        }

        return () => {
            if (mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
            }
        };
    }, [showMap]);

    const handleCloseMap = () => {
        setShowMap(false);
        if (mapInstance.current) {
            mapInstance.current.remove();
            mapInstance.current = null;
        }
    };

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <h1 className={styles.logo}>Yummies' Cart</h1>
                <button className={styles.mapButton} onClick={() => setShowMap(true)}>
                    Найти магазин
                </button>
            </header>

            <main className={styles.main}>
                <div className={styles.textBlock}>
                    <h2 className={styles.greeting}>Добро пожаловать в Yummies' Cart!</h2>
                    <p className={styles.subtext}>
                        Мы собрали всё вкусное и нужное!
                    </p>
                    <ul className={styles.guideList}>
                        <li>В Yummies' Cart всегда широкий выбор и свежие товары.</li>
                        <li>Загляните в отдел свежей выпечки и кофе: комбо поможет Вам согреться!</li>
                        <li>Если торопитесь, то найдите нужный товар на карте - и никаких долгих поисков!</li>
                    </ul>
                </div>

                <div className={styles.imageBlock}>
                    <img src={happyCart} alt="Весёлая тележка" className={styles.cartImg} />
                </div>
            </main>

            <footer className={styles.footer}>
                <div className={styles.contacts}>
                    <p><strong>Контакты:</strong></p>
                    <p>+7 (123)-456-78-90</p>
                    <p>г. Бор, ул. Кожедуба, 1</p>
                    <p>tg: @gurusoooda</p>
                </div>
                <p className={styles.copy}>© 2025 Yummies' Cart. Все права защищены.</p>
            </footer>

            {showMap && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <button className={styles.closeButton} onClick={handleCloseMap}>✖</button>
                        <div ref={mapContainer} style={{ width: "100%", height: "400px" }} />
                    </div>
                </div>
            )}
        </div>
    );
}
