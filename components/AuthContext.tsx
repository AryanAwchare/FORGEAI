import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../supabaseClient';
import { UserProfile } from '../types';

interface AuthContextType {
    session: Session | null;
    user: User | null;
    profile: UserProfile | null;
    isLoading: boolean;
    signOut: () => Promise<void>;
    updateName: (name: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    session: null,
    user: null,
    profile: null,
    isLoading: true,
    signOut: async () => { },
    updateName: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchProfile(session.user.id);
            } else {
                setIsLoading(false);
            }
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);

            if (session?.user) {
                fetchProfile(session.user.id);
            } else {
                setProfile(null);
                setIsLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchProfile = async (userId: string) => {
        try {
            // Parallel fetch: Profile + User Name
            const [profileResult, userResult] = await Promise.all([
                supabase
                    .from('user_profiles')
                    .select('*')
                    .eq('user_id', userId)
                    .single(),
                supabase
                    .from('users')
                    .select('name')
                    .eq('id', userId)
                    .single()
            ]);

            if (profileResult.error && profileResult.error.code !== 'PGRST116') {
                console.error('Error fetching profile:', profileResult.error);
            }

            const userName = userResult.data?.name;

            if (profileResult.data) {
                const data = profileResult.data;
                // Map Supabase snake_case to UserProfile camelCase
                const mappedProfile: UserProfile = {
                    ...data, // keep other fields like goal, availability, etc. if names match
                    goal: data.goal,
                    equipment: data.equipment,
                    level: data.fitness_level, // map fitness_level -> level
                    availability: data.availability,
                    limitations: data.limitations,
                    initialWeight: data.initial_weight, // map initial_weight -> initialWeight
                    targetWeight: data.target_weight,   // map target_weight -> targetWeight
                    unit: data.unit,
                    user_id: data.user_id,
                    current_weight: data.current_weight,
                    name: userName // Inject name from users table
                };
                setProfile(mappedProfile);
            } else if (userName) {
                // Even if profile is missing, set generic profile with name
                setProfile({ name: userName } as any);
            }
        } catch (error) {
            console.error('Error in fetchProfile:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const updateName = async (name: string) => {
        if (!user) return;
        try {
            const { error } = await supabase
                .from('users')
                .update({ name })
                .eq('id', user.id);

            if (error) throw error;

            // Update local state
            setProfile(prev => prev ? { ...prev, name } : null);
        } catch (error) {
            console.error('Error updating name:', error);
            throw error;
        }
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        setProfile(null);
    };

    return (
        <AuthContext.Provider value={{ session, user, profile, isLoading, signOut, updateName }}>
            {children}
        </AuthContext.Provider>
    );
};
