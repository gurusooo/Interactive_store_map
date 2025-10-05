import { Product } from "../../types/types";
import styles from "./ProductCard.module.css";
import { useState } from "react";

interface ProductCardProps {
    product: Product;
    onClick?: () => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
    const [imageError, setImageError] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);

    const handleImageError = () => {
        setImageError(true);
        setImageLoading(false);
    };

    const handleImageLoad = () => {
        setImageLoading(false);
    };

    const getImageUrl = () => {
        if (imageError) {
            return "https://via.placeholder.com/400x400/ffffff/cccccc?text=No+Image";
        }
        return product.image;
    };

    return (
        <div className={styles.card} onClick={onClick}>
            <div className={styles.imageContainer}>
                {imageLoading && (
                    <div className={styles.imageSkeleton}>
                        <div className={styles.skeletonShimmer}></div>
                    </div>
                )}
                <img
                    src={getImageUrl()}
                    alt={product.name}
                    className={`${styles.image} ${imageLoading ? styles.imageHidden : ''}`}
                    onError={handleImageError}
                    onLoad={handleImageLoad}
                    loading="lazy"
                />
            </div>

            <div className={styles.content}>
                <h3 className={styles.title}>{product.name}</h3>

                {product.weight && (
                    <div className={styles.weight}>{product.weight} кг</div>
                )}

                <div className={styles.details}>
                    <div className={styles.price}>{product.price} ₽</div>
                </div>
            </div>
        </div>
    );
}