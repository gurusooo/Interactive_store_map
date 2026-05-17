import { HStack, Heading, VStack, Box } from '@chakra-ui/react';
import cartIcon from '../../assets/cart.svg';
import styles from './SearchHeader.module.css';
import { useNavigate } from 'react-router-dom';
import { SearchWithSuggestions } from './SearchWithSuggestions';

export function SearchHeader() {
    const navigate = useNavigate();

    return (
        <VStack className={styles.container} gap={4} align="stretch">
            <Box className={styles.titleWrapper}>
                <Heading as="h1" size="lg" className={styles.h1}>
                    Каталог
                </Heading>
            </Box>

            <HStack className={styles.header} justifyContent="space-between">
                <button onClick={() => navigate('/')} className={styles.cartWrapper}>
                    <img src={cartIcon} alt="cart" className={styles.cartIcon} />
                </button>

                <SearchWithSuggestions />
            </HStack>
        </VStack>
    );
}
