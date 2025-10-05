import { HStack } from "@chakra-ui/react";
//import { FaShoppingCart } from "react-icons/fa";
import cartIcon from "../../assets/cart.svg";
import styles from "./SearchHeader.module.css";
import { useNavigate } from "react-router-dom";
import { SearchWithSuggestions } from "./SearchWithSuggestions";

export function SearchHeader() {
    const navigate = useNavigate();

    return (
        <HStack className={styles.header}>
            <button onClick={() => navigate("/")} className={styles.cartWrapper}>
                <img src={cartIcon} alt="cart" className={styles.cartIcon} />
            </button>

            <SearchWithSuggestions />
        </HStack>
    );
}