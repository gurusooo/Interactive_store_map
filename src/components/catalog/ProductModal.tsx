import {
    Image,
    Text,
    Box,
    VStack,
    HStack,
    Button,
} from "@chakra-ui/react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
} from "@chakra-ui/modal";
import { Product } from "../../types/types";
import { StoreMap } from "../common/StoreMap";
import styles from "./ProductModal.module.css";
import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";

interface ProductModalProps {
    product: Product | null;
    onClose: () => void;
}

export function ProductModal({ product, onClose }: ProductModalProps) {
    const [imageError, setImageError] = useState(false);

    if (!product) return null;

    const handleImageError = () => {
        setImageError(true);
    };

    const getImageUrl = (url: string) =>
        imageError ? "https://via.placeholder.com/300x200/ffffff/cccccc?text=No+Image" : url;

    const getShelfText = (shelf: number): string => {
        switch (shelf) {
            case 1: return 'верхней';
            case 2: return 'средней';
            case 4: return 'нижней';
            default: return `${shelf}-й`;
        }
    };

    return (
        <Modal isOpen={!!product} onClose={onClose} size="lg" scrollBehavior="inside">
            <ModalOverlay bg="blackAlpha.600" />
            <ModalContent className={styles.modalContent}>

                <ModalHeader className={styles.modalHeader}>
                    <HStack justify="space-between" width="100%">
                        <Button
                            className={styles.backButton}
                            onClick={onClose}
                            variant="plain"
                        >
                            <FaArrowLeft />
                        </Button>
                        <Text flex="1" textAlign="center">{product.name}</Text>
                        <Box width="36px" />
                    </HStack>
                </ModalHeader>

                <ModalBody className={styles.modalBody}>
                    <VStack align="stretch" gap={4}>
                        <Image
                            src={getImageUrl(product.image)}
                            alt={product.name}
                            className={styles.productImage}
                            height="250px"
                            objectFit="contain"
                            onError={handleImageError}
                        />

                        <Box className={styles.priceSection}>
                            <HStack justify="space-between">
                                <Text className={styles.price}>{product.price} ₽</Text>
                                {product.weight && <Text className={styles.weight}>{product.weight} кг</Text>}
                            </HStack>
                        </Box>

                        {product.date && (
                            <Box className={styles.expirySection}>
                                <Text>Срок хранения: {product.date} дней</Text>
                            </Box>
                        )}

                        {product.description && (
                            <Box className={styles.description}>
                                <Text>{product.description}</Text>
                            </Box>
                        )}

                        <Box className={styles.mapSection}>
                            <Text className={styles.mapTitle}>Расположение в магазине</Text>
                            <Box className={styles.mapContainer}>
                                <StoreMap location={product.location} />
                            </Box>
                            <Box className={styles.shelfInfo}>
                                <Text>Товар находится на {getShelfText(product.shelf)} полке</Text>
                            </Box>
                        </Box>
                    </VStack>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}
