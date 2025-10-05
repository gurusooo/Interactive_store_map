import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { StoreMap } from "../../components/common/StoreMap";
import styles from "./RoutePage.module.css";

interface Department {
    id: string;
    name: string;
    x: number;
    y: number;
    width: number;
    height: number;
}

const departments: Department[] = [
    { id: "dept-milk", name: "Молочная продукция и яйцо", x: 30, y: 0, width: 218, height: 30 },
    { id: "dept-beer", name: "Пиво 18+", x: 324, y: 0, width: 218, height: 30 },
    { id: "dept-bread", name: "Хлеб и выпечка", x: 0, y: 480, width: 30, height: 160 },
    { id: "dept-alcohol", name: "Алкоголь 18+", x: 542, y: 30, width: 30, height: 414 },
    { id: "dept-drinks", name: "Вода, газировка и энергетики", x: 70, y: 70, width: 192, height: 30 },
    { id: "dept-snacks", name: "Чипсы и снеки", x: 310, y: 70, width: 192, height: 30 },
    { id: "dept-juice-kids", name: "Детское питание и соки", x: 70, y: 103, width: 192, height: 30 },
    { id: "dept-pets", name: "Для животных", x: 310, y: 103, width: 192, height: 30 },
    { id: "dept-sweets", name: "Конфеты и сладости", x: 70, y: 173, width: 192, height: 30 },
    { id: "dept-hygiene", name: "Гигиена и аптека", x: 310, y: 173, width: 192, height: 30 },
    { id: "dept-tea-cookies", name: "Чай и к чаю", x: 70, y: 206, width: 192, height: 30 },
    { id: "dept-cleaning", name: "Стирка и уборка", x: 310, y: 206, width: 192, height: 30 },
    { id: "dept-grocery-cakes", name: "Бакалея, торты и пирожные", x: 70, y: 276, width: 192, height: 30 },
    { id: "dept-spice", name: "Соусы и специи", x: 70, y: 309, width: 192, height: 30 },
    { id: "dept-frozen", name: "Заморозка", x: 85, y: 342, width: 162, height: 26 },
    { id: "dept-cereals", name: "Крупы и готовые завтраки", x: 70, y: 412, width: 192, height: 30 },
    { id: "dept-canned", name: "Консервы", x: 70, y: 445, width: 192, height: 30 },
    { id: "dept-veggies", name: "Овощи", x: 91, y: 515, width: 160, height: 40 },
    { id: "dept-fruits", name: "Фрукты и ягоды", x: 91, y: 558, width: 160, height: 40 },
    { id: "dept-coffee-takeaway", name: "Кофе с собой", x: 30, y: 640, width: 100, height: 40 },
    { id: "dept-ready", name: "Готовая еда", x: 133, y: 650, width: 180, height: 30 },
    { id: "dept-nuts", name: "Орехи и сухофрукты", x: 316, y: 650, width: 74, height: 30 },
    { id: "dept-home", name: "Для дома и дачи", x: 310, y: 276, width: 192, height: 30 },
    { id: "dept-toys", name: "Игрушки", x: 310, y: 379, width: 96, height: 40 },
    { id: "dept-school", name: "Товары для школы", x: 310, y: 422, width: 96, height: 40 },
    { id: "dept-ice-cream", name: "Мороженое", x: 422, y: 389, width: 80, height: 61 },
    { id: "dept-el-cash", name: "Электронные кассы", x: 449, y: 480, width: 120, height: 30 },
    { id: "dept-cash", name: "Кассы", x: 572, y: 480, width: 120, height: 30 }, //потеряла мясо, добавить
];

export function RoutePage() {
    const navigate = useNavigate();
    const [selectedDept, setSelectedDept] = useState<Department | null>(null);
    const [scale, setScale] = useState(1);
    const [transform, setTransform] = useState({ offsetX: 0, offsetY: 0, svgLeft: 0, svgTop: 0 });

    const handleDeptClick = (dept: Department) => setSelectedDept(dept);
    const handleNavigate = () => selectedDept && navigate(`/catalog/${selectedDept.id}`);
    const handleClose = () => setSelectedDept(null);

    const zoomIn = () => setScale(prev => Math.min(prev + 0.2, 3));
    const zoomOut = () => setScale(prev => Math.max(prev - 0.2, 0.5));

    return (
        <div className={styles.page}>
            <div className={styles.mapContainer}>
                <div className={styles.zoomControls}>
                    <button onClick={zoomIn}>+</button>
                    <button onClick={zoomOut}>–</button>
                </div>

                <StoreMap
                    location={{ x: 0, y: 0 }}
                    className={styles.map}
                    scale={scale}
                    onTransformChange={setTransform}
                />

                <div
                    style={{
                        transform: `translate(${transform.offsetX}px, ${transform.offsetY}px) scale(${scale})`,
                        transformOrigin: "0 0",
                        position: "absolute",
                        top: transform.svgTop - transform.svgTop,
                        left: transform.svgLeft - transform.svgLeft,
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
                            onClick={() => handleDeptClick(dept)}
                        />
                    ))}
                </div>

                {selectedDept && (
                    <div
                        className={styles.popup}
                        style={{
                            left:
                                (selectedDept.x + selectedDept.width + 8) * scale + transform.offsetX + transform.svgLeft,
                            top: selectedDept.y * scale + transform.offsetY + transform.svgTop,
                        }}
                    >
                        <button className={styles.close} onClick={handleClose}>×</button>
                        <span className={styles.deptName}>{selectedDept.name}</span>
                        <button className={styles.goBtn} onClick={handleNavigate}>Перейти</button>
                    </div>
                )}
            </div>
        </div>
    );
}
