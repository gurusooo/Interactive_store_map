import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';

interface User {
    id: string;
    email: string;
}

interface AuthStore {
    user: User | null;
    session: any | null;
    isLoading: boolean;
    signUp: (email: string, password: string) => Promise<void>;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    initializeAuth: () => Promise<void>;
}

let authSubscription: { unsubscribe: () => void } | null = null;

const getErrorMessage = (error: any): string => {
    const message = error?.message || '';

    if (message === 'Invalid login credentials') {
        return 'Неверный email или пароль. Попробуйте ещё раз.';
    }
    if (message.includes('User already registered')) {
        return 'Пользователь с таким email уже зарегистрирован.';
    }
    if (message.includes('Password should be at least 6 characters')) {
        return 'Пароль должен содержать минимум 6 символов.';
    }
    return 'Что-то пошло не так. Попробуйте позже.';
};

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            user: null,
            session: null,
            isLoading: true,

            initializeAuth: async () => {
                set({ isLoading: true });

                if (authSubscription) {
                    authSubscription.unsubscribe();
                }

                const { data: { session } } = await supabase.auth.getSession();

                if (session) {
                    set({
                        user: {
                            id: session.user.id,
                            email: session.user.email!,
                        },
                        session,
                        isLoading: false,
                    });
                } else {
                    set({ isLoading: false });
                }

                const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
                    if (session) {
                        set({
                            user: {
                                id: session.user.id,
                                email: session.user.email!,
                            },
                            session,
                        });
                    } else {
                        set({ user: null, session: null });
                    }
                });

                authSubscription = subscription;
            },

            signUp: async (email: string, password: string) => {
                set({ isLoading: true });

                if (!email || !email.includes('@') || !email.includes('.')) {
                    set({ isLoading: false });
                    throw new Error('Введите корректный email');
                }

                if (!password || password.length < 6) {
                    set({ isLoading: false });
                    throw new Error('Пароль должен быть не менее 6 символов');
                }

                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: window.location.origin,
                    },
                });

                if (error) {
                    set({ isLoading: false });
                    throw new Error(getErrorMessage(error));
                }

                if (data.user) {
                    set({
                        user: { id: data.user.id, email: data.user.email! },
                        session: data.session,
                        isLoading: false,
                    });
                } else {
                    set({ isLoading: false });
                    throw new Error('Проблема с созданием пользователя. Проверьте настройки Supabase.');
                }
            },

            signIn: async (email: string, password: string) => {
                set({ isLoading: true });

                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });

                if (error) {
                    set({ isLoading: false });
                    throw new Error(getErrorMessage(error));
                }

                set({
                    user: {
                        id: data.user.id,
                        email: data.user.email!,
                    },
                    session: data.session,
                    isLoading: false,
                });
            },

            signOut: async () => {
                set({ isLoading: true });
                await supabase.auth.signOut();
                set({ user: null, session: null, isLoading: false });
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({ user: state.user }),
        }
    )
);