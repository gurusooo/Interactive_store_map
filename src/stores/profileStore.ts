import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface Profile {
    id: string;
    username: string | null;
    display_name: string | null;
    created_at: string;
}

interface ProfileStore {
    profile: Profile | null;
    isLoading: boolean;
    loadProfile: (userId: string) => Promise<void>;
    updateDisplayName: (name: string) => Promise<void>;
}

export const useProfileStore = create<ProfileStore>((set) => ({
    profile: null,
    isLoading: false,

    loadProfile: async (userId: string) => {
        set({ isLoading: true });

        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) {
            console.error('Error loading profile:', error);
            set({ isLoading: false });
            return;
        }

        set({ profile: data, isLoading: false });
    },

    updateDisplayName: async (name: string) => {
        const { profile } = useProfileStore.getState();
        if (!profile) {
            console.error('No profile found');
            return;
        }

        set({ isLoading: true });

        const { error } = await supabase
            .from('profiles')
            .update({
                display_name: name,
                username: name,
            })
            .eq('id', profile.id);

        if (error) {
            console.error('Error updating profile:', error);
            set({ isLoading: false });
            throw error;
        }

        set({
            profile: { ...profile, display_name: name, username: name },
            isLoading: false,
        });
    },
}));
