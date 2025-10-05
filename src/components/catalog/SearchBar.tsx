import { useStore } from "../../stores/useStore";
import styles from "./SearchBar.module.css";

export function SearchBar() {
    const searchQuery = useStore((s) => s.searchQuery);
    const setSearchQuery = useStore((s) => s.setSearchQuery);

    return (
        <div className={styles.inputWrapper}>
            <input
                className={styles.input}
                placeholder="Искать товары.."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>
    );
}