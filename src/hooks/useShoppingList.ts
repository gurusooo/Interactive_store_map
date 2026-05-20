import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';

export interface CartItem {
    id: number;
    product_id: number;
    quantity: number;
    checked: boolean;
}

export function useShoppingList() {
    const { user } = useAuthStore();
    const [cartItems, setCartItems] = useState<Map<number, CartItem>>(new Map());
    const [loading, setLoading] = useState(true);

    const loadCart = useCallback(async () => {
        if (!user) {
            setLoading(false);
            return;
        }

        setLoading(true);
        const { data, error } = await supabase
            .from('user_cart')
            .select('id, product_id, quantity, checked')
            .eq('user_id', user.id);

        if (error) {
            console.error('Error loading cart:', error);
            setLoading(false);
            return;
        }

        const itemsMap = new Map<number, CartItem>();
        data?.forEach((item) => {
            itemsMap.set(item.product_id, item);
        });
        setCartItems(itemsMap);
        setLoading(false);
    }, [user]);

    useEffect(() => {
        loadCart();
    }, [loadCart]);

    const getQuantity = useCallback(
        (productId: number): number => {
            return cartItems.get(productId)?.quantity || 0;
        },
        [cartItems]
    );

    const isInCart = useCallback(
        (productId: number): boolean => {
            return cartItems.has(productId);
        },
        [cartItems]
    );

    const addToCart = useCallback(
        async (productId: number) => {
            if (!user) return;

            const { data, error } = await supabase
                .from('user_cart')
                .insert({
                    user_id: user.id,
                    product_id: productId,
                    quantity: 1,
                    checked: false,
                })
                .select()
                .single();

            if (error) {
                console.error('Error adding to cart:', error);
                return;
            }

            if (data) {
                setCartItems((prev) => new Map(prev).set(productId, data));
            }
        },
        [user]
    );

    const updateQuantity = useCallback(
        async (productId: number, newQuantity: number) => {
            const existingItem = cartItems.get(productId);

            if (!existingItem || !user) return;

            if (newQuantity <= 0) {
                const { error } = await supabase
                    .from('user_cart')
                    .delete()
                    .eq('id', existingItem.id);

                if (!error) {
                    setCartItems((prev) => {
                        const newMap = new Map(prev);
                        newMap.delete(productId);
                        return newMap;
                    });
                }
            } else {
                const { data, error } = await supabase
                    .from('user_cart')
                    .update({ quantity: newQuantity })
                    .eq('id', existingItem.id)
                    .select()
                    .single();

                if (!error && data) {
                    setCartItems((prev) => new Map(prev).set(productId, data));
                }
            }
        },
        [user, cartItems]
    );

    return {
        cartItems,
        loading,
        getQuantity,
        isInCart,
        addToCart,
        updateQuantity,
        refreshCart: loadCart,
    };
}
