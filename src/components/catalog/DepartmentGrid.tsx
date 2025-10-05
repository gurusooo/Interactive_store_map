import { useNavigate } from "react-router-dom";
import styles from "./DepartmentGrid.module.css";
import { GiWheat, GiMeat, GiMilkCarton, GiFrozenOrb, GiChipsBag, GiWashingMachine,
        GiComb, GiFireBowl, GiSchoolBag, GiOpenedFoodCan, GiPeanut, GiTomato,
        GiBananaBunch, GiSodaCan, GiTeapotLeaves, GiCakeSlice, GiKetchup, GiChocolateBar,
        GiBanknote} from "react-icons/gi";
import { FaBeer, FaCat, FaGlassMartiniAlt, FaToiletPaper, FaIceCream } from "react-icons/fa";
import { MdSmartToy, MdBakeryDining, MdWaterDrop, MdOutlineCreditCard } from "react-icons/md";
import { BiCoffeeTogo, BiSolidDish } from "react-icons/bi";

const departments = [
    { id: "dept-ready", name: "Готовая еда", icon: <BiSolidDish /> },
    { id: "dept-coffee-takeaway", name: "Кофе с собой", icon: <BiCoffeeTogo /> },
    { id: "dept-bread", name: "Хлеб и выпечка", icon: <MdBakeryDining /> },
    { id: "dept-nuts", name: "Орехи и сухофрукты", icon: <GiPeanut /> },
    { id: "dept-canned", name: "Консервы", icon: <GiOpenedFoodCan /> },
    { id: "dept-veggies", name: "Овощи", icon: <GiTomato /> },
    { id: "dept-fruits", name: "Фрукты и ягоды", icon: <GiBananaBunch /> },
    { id: "dept-cereals", name: "Крупы и готовые завтраки", icon: <GiWheat /> },
    { id: "dept-meat", name: "Мясо, птица, рыба, колбасы", icon: <GiMeat /> },
    { id: "dept-milk", name: "Молочная продукция и яйцо", icon: <GiMilkCarton /> },
    { id: "dept-drinks", name: "Вода, газировка и энергетики", icon: <GiSodaCan  /> },
    { id: "dept-juice-kids", name: "Детское питание и соки", icon: <MdWaterDrop /> },
    { id: "dept-tea-cookies", name: "Чай и к чаю", icon: <GiTeapotLeaves /> },
    { id: "dept-grocery-cakes", name: "Бакалея, торты и пирожные", icon: <GiCakeSlice /> },
    { id: "dept-sweets", name: "Конфеты и сладости", icon: <GiChocolateBar /> },
    { id: "dept-frozen", name: "Заморозка", icon: <GiFrozenOrb /> },
    { id: "dept-spice", name: "Соусы и специи", icon: <GiKetchup /> },
    { id: "dept-snacks", name: "Чипсы и снеки", icon: <GiChipsBag /> },
    { id: "dept-ice-cream", name: "Мороженое", icon: <FaIceCream /> },
    { id: "dept-school", name: "Товары для школы", icon: <GiSchoolBag  /> },
    { id: "dept-toys", name: "Игрушки", icon: <MdSmartToy /> },
    { id: "dept-home", name: "Для дома и дачи", icon: <GiFireBowl /> },
    { id: "dept-beauty", name: "Красота", icon: <GiComb /> },
    { id: "dept-cleaning", name: "Стирка и уборка", icon: <GiWashingMachine /> },
    { id: "dept-hygiene", name: "Гигиена и аптека", icon: <FaToiletPaper /> },
    { id: "dept-pets", name: "Для животных", icon: <FaCat /> },
    { id: "dept-beer", name: "Пиво 18+", icon: <FaBeer /> },
    { id: "dept-alcohol", name: "Алкоголь 18+", icon: <FaGlassMartiniAlt /> },
    { id: "dept-cash", name: "Кассы", icon: <GiBanknote /> },
    { id: "dept-el-cash", name: "Электронные кассы", icon: <MdOutlineCreditCard /> },
];

export function DepartmentGrid() {
    const navigate = useNavigate();

    return (
        <div className={styles.grid}>
            {departments.map((dept) => (
                <button
                    key={dept.id}
                    className={styles.card}
                    onClick={() => navigate(`/catalog/${dept.id}`)}
                >
                    <div className={styles.icon}>{dept.icon}</div>
                    <div className={styles.label}>{dept.name}</div>
                </button>
            ))}
        </div>
    );
}

