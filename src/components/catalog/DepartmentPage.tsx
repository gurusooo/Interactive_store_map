import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Product } from '../../types/types';
import { ProductCard } from './ProductCard.tsx';
import styles from './DepartmentPage.module.css';
import { ProductModal } from './ProductModal';
import { Box, Text, VStack, Spinner } from '@chakra-ui/react';
import { FaArrowLeft } from 'react-icons/fa';

const departmentNames: Record<string, string> = {
    'dept-ready': 'Готовая еда',
    'dept-coffee-takeaway': 'Кофе с собой',
    'dept-bread': 'Хлеб и выпечка',
    'dept-nuts': 'Орехи и сухофрукты',
    'dept-canned': 'Консервы',
    'dept-veggies': 'Овощи',
    'dept-fruits': 'Фрукты и ягоды',
    'dept-cereals': 'Крупы и готовые завтраки',
    'dept-meat': 'Мясо, птица, рыба, колбасы',
    'dept-milk': 'Молочная продукция и яйцо',
    'dept-drinks': 'Вода, газировка и энергетики',
    'dept-juice-kids': 'Детское питание и соки',
    'dept-tea-cookies': 'Чай и к чаю',
    'dept-grocery-cakes': 'Бакалея, торты и пирожные',
    'dept-sweets': 'Конфеты и сладости',
    'dept-frozen': 'Заморозка',
    'dept-spice': 'Соусы и специи',
    'dept-snacks': 'Чипсы и снеки',
    'dept-ice-cream': 'Мороженое',
    'dept-school': 'Товары для школы',
    'dept-toys': 'Игрушки',
    'dept-home': 'Для дома и дачи',
    'dept-beauty': 'Красота',
    'dept-cleaning': 'Стирка и уборка',
    'dept-hygiene': 'Гигиена и аптека',
    'dept-pets': 'Для животных',
    'dept-beer': 'Пиво 18+',
    'dept-alcohol': 'Алкоголь 18+',
    'dept-cash': 'Кассы',
    'dept-el-cash': 'Электронные кассы',
};

export function DepartmentPage() {
    const { departmentId } = useParams<{ departmentId: string }>();
    const navigate = useNavigate();
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!departmentId) return;

        setLoading(true);

        (async () => {
            try {
                const { data, error } = await supabase
                    .from('products')
                    .select('*')
                    .eq('category', departmentId);

                if (error) {
                    console.error('Ошибка загрузки товаров:', error);
                    return;
                }

                const items: Product[] = data || [];
                setProducts(items);
            } catch (err) {
                console.error('Ошибка загрузки товаров:', err);
            } finally {
                setLoading(false);
            }
        })();
    }, [departmentId]);

    const departmentName = departmentId ? departmentNames[departmentId] || 'Отдел' : 'Отдел';

    if (loading) {
        return (
            <div className={styles.page}>
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    height="50vh"
                    flexDirection="column"
                >
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
            <div className={styles.departmentHeader}>
                <button
                    className={styles.backButton}
                    onClick={() => navigate('/catalog')}
                    aria-label="Назад к каталогу"
                >
                    <FaArrowLeft />
                </button>
                <h1 className={styles.departmentTitle}>{departmentName}</h1>
            </div>

            {products.length === 0 ? (
                <Box textAlign="center" py={8}>
                    <Text color="var(--color-base-500)">В этом отделе пока нет товаров</Text>
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
                <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
            )}
        </div>
    );
}
