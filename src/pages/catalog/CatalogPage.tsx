import { SearchHeader } from "../../components/catalog/SearchHeader.tsx";
import { DepartmentGrid } from "../../components/catalog/DepartmentGrid.tsx";
import styles from "./CatalogPage.module.css";
import { useStore } from "../../stores/useStore";
import { useEffect } from "react";
import { Box, Text, Spinner, VStack } from "@chakra-ui/react";

export default function CatalogPage() {
    const loadProducts = useStore((s) => s.loadProducts);
    const setSearchQuery = useStore((s) => s.setSearchQuery);
    const loading = useStore((s) => s.loading);
    const error = useStore((s) => s.error);

    useEffect(() => {
        loadProducts();
        setSearchQuery("");
    }, [loadProducts, setSearchQuery]);

    if (loading) {
        return (
            <div className={styles.page}>
                <SearchHeader />
                <Box display="flex"
                     justifyContent="center"
                     alignItems="center"
                     height="60vh"
                     flexDirection="column">
                    <VStack gap={4}>
                        <Spinner size="xl" color="var(--color-primary)" />
                        <Text ml={3}>Загрузка..</Text>
                    </VStack>
                </Box>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.page}>
                <SearchHeader />
                <Box textAlign="center" py={8}>
                    <Text color="var(--color-accent)">{error}</Text>
                </Box>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <SearchHeader />
            <DepartmentGrid />
        </div>
    );
}
