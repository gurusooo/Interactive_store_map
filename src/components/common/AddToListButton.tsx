import { Box } from '@chakra-ui/react';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { MouseEvent } from 'react';
import { useShoppingList } from '../../hooks/useShoppingList';
import styles from './AddToListButton.module.css';

interface AddToListButtonProps {
    productId: number;
}

export function AddToListButton({ productId }: AddToListButtonProps) {
    const { isInCart, getQuantity, addToCart, updateQuantity, loading } = useShoppingList();

    const quantity: number = getQuantity(productId);

    const inCart: boolean = isInCart(productId);

    const handleAdd = async (e: MouseEvent<HTMLButtonElement>): Promise<void> => {
        e.stopPropagation();

        await addToCart(productId);
    };

    const handleIncrement = async (e: MouseEvent<HTMLButtonElement>): Promise<void> => {
        e.stopPropagation();

        try {
            await updateQuantity(productId, quantity + 1);
        } catch (error) {
            console.error('Ошибка обновления количества', error);
        }
    };

    const handleDecrement = async (e: MouseEvent<HTMLButtonElement>): Promise<void> => {
        e.stopPropagation();

        try {
            if (quantity <= 1) {
                await updateQuantity(productId, 0);
                return;
            }

            await updateQuantity(productId, quantity - 1);
        } catch (error) {
            console.error('Ошибка уменьшения количества', error);
        }
    };

    return (
        <Box className={styles.wrapper}>
            <div className={styles.content}>
                <div className={styles.left}>{inCart ? 'В списке!' : 'Добавить в список'}</div>

                <div className={styles.right}>
                    {!inCart ? (
                        <button
                            type="button"
                            onClick={handleAdd}
                            className={styles.addButton}
                            disabled={loading}
                            aria-label="Добавить в список"
                        >
                            <FaPlus />
                        </button>
                    ) : (
                        <div className={styles.quantityBox}>
                            <button
                                type="button"
                                onClick={handleDecrement}
                                className={styles.qtyButton}
                                disabled={loading}
                                aria-label="Уменьшить количество"
                            >
                                <FaMinus />
                            </button>

                            <div className={styles.quantity}>{quantity} шт</div>

                            <button
                                type="button"
                                onClick={handleIncrement}
                                className={styles.qtyButton}
                                disabled={loading}
                                aria-label="Увеличить количество"
                            >
                                <FaPlus />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </Box>
    );
}
