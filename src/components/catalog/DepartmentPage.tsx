import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/config";
import { Product } from "../../types/types";
import { ProductCard } from "./ProductCard.tsx";
import styles from "./DepartmentPage.module.css";
import { ProductModal } from "./ProductModal";
import { Box, Text, VStack, Spinner } from "@chakra-ui/react";

export function DepartmentPage() {
    const { departmentId } = useParams<{ departmentId: string }>();
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProducts() {
            if (!departmentId) return;
            setLoading(true);

            try {
                const q = query(
                    collection(db, "products"),
                    where("category", "==", departmentId)
                );
                const snapshot = await getDocs(q);
                const items: Product[] = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...(doc.data() as Omit<Product, "id">),
                }));
                setProducts(items);
            } catch (err) {
                console.error("Ошибка загрузки товаров:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchProducts();
    }, [departmentId]);

    if (loading) {
        return (
            <div className={styles.page}>
                <Box display="flex"
                     justifyContent="center"
                     alignItems="center"
                     height="50vh"
                     flexDirection="column">
                    <VStack gap={4}>
                        <Spinner size="xl" color="var(--color-primary)" />
                        <Text>Загрузка..</Text>
                    </VStack>
                </Box>
            </div>
        );
    }


    return (
        <div className={styles.page}>
            {products.length === 0 ? (
                <Box textAlign="center" py={8}>
                    <Text color="var(--color-base-500)">
                        В этом отделе пока нет товаров
                    </Text>
                </Box>
            ) : (
                <div className={styles.productsGrid}>
                    {products.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onClick={() => setSelectedProduct(product)}
                        />
                    ))}
                </div>
            )}

            {selectedProduct && (
                <ProductModal
                    product={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                />
            )}
        </div>
    );
}
