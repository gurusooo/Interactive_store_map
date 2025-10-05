import { Product } from "../../types/types";
import { ProductModal } from "./ProductModal";

interface SearchProductModalProps {
    product: Product | null;
    onClose: () => void;
}

export function SearchProductModal({ product, onClose }: SearchProductModalProps) {
    if (!product) return null;

    return (
        <ProductModal
            product={product}
            onClose={onClose}
        />
    );
}