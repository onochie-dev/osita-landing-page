import { create } from 'zustand'
import { supabase, Profile } from '../lib/supabase'
import type { User, Session } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  profile: Profile | null
  session: Session | null
  isLoading: boolean
  isInitialized: boolean
  error: string | null
  
  // Actions
  initialize: () => Promise<void>
  signUp: (email: string, password: string, username: string) => Promise<{ error: string | null }>
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  clearError: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  session: null,
  isLoading: true,
  isInitialized: false,
  error: null,

  initialize: async () => {
    try {
      // Get initial session
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('Error getting session:', error)
        set({ isLoading: false, isInitialized: true })
        return
      }

      if (session?.user) {
        // Fetch profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()

        set({
          user: session.user,
          session,
          profile: profile || null,
          isLoading: false,
          isInitialized: true,
        })
      } else {
        set({ isLoading: false, isInitialized: true })
      }

      // Listen for auth changes
      supabase.auth.onAuthStateChange(async (event, session) => {
        console.log('Auth state changed:', event)
        
        if (session?.user) {
          // Fetch profile on auth change
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()

          set({
            user: session.user,
            session,
            profile: profile || null,
          })
        } else {
          set({
            user: null,
            session: null,
            profile: null,
          })
        }
      })
    } catch (error) {
      console.error('Error initializing auth:', error)
      set({ isLoading: false, isInitialized: true })
    }
  },

  signUp: async (email: string, password: string, username: string) => {
    set({ isLoading: true, error: null })

    try {
      // Check if username is already taken
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .single()

      if (existingProfile) {
        set({ isLoading: false, error: 'Username is already taken' })
        return { error: 'Username is already taken' }
      }

      // Sign up with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        },
      })

      if (error) {
        set({ isLoading: false, error: error.message })
        return { error: error.message }
      }

      if (data.user) {
        // Create profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            username,
            email,
          })

        if (profileError) {
          console.error('Error creating profile:', profileError)
          // Don't fail signup if profile creation fails - it might be handled by trigger
        }

        // Fetch the created profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single()

        set({
          user: data.user,
          session: data.session,
          profile: profile || { id: data.user.id, username, email, created_at: new Date().toISOString() },
          isLoading: false,
        })
      }

      return { error: null }
    } catch (error: any) {
      const message = error?.message || 'An unexpected error occurred'
      set({ isLoading: false, error: message })
      return { error: message }
    }
  },

  signIn: async (email: string, password: string) => {
    set({ isLoading: true, error: null })

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        set({ isLoading: false, error: error.message })
        return { error: error.message }
      }

      if (data.user) {
        // Fetch profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single()

        set({
          user: data.user,
          session: data.session,
          profile: profile || null,
          isLoading: false,
        })
      }

      return { error: null }
    } catch (error: any) {
      const message = error?.message || 'An unexpected error occurred'
      set({ isLoading: false, error: message })
      return { error: message }
    }
  },

  signOut: async () => {
    set({ isLoading: true })
    
    try {
      await supabase.auth.signOut()
      set({
        user: null,
        session: null,
        profile: null,
        isLoading: false,
      })
    } catch (error) {
      console.error('Error signing out:', error)
      set({ isLoading: false })
    }
  },

  clearError: () => set({ error: null }),
}))

// Convenience hook
export const useAuth = () => {
  const store = useAuthStore()
  return {
    user: store.user,
    profile: store.profile,
    session: store.session,
    isLoading: store.isLoading,
    isInitialized: store.isInitialized,
    isAuthenticated: !!store.user,
    error: store.error,
    signUp: store.signUp,
    signIn: store.signIn,
    signOut: store.signOut,
    clearError: store.clearError,
    initialize: store.initialize,
  }
}

