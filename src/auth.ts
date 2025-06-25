import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth/auth-options'

console.log('🔧 Initializing NextAuth with custom error handling...');

// Create NextAuth instance with error logging
const createAuth = () => {
  try {
    return NextAuth({
      ...authOptions,
      callbacks: {
        ...authOptions.callbacks,
        async signIn(params) {
          console.log('🔵 OAuth SignIn attempt:', {
            provider: params.account?.provider,
            email: params.user?.email,
            timestamp: new Date().toISOString()
          });
          
          try {
            // Call original signIn callback
            if (authOptions.callbacks?.signIn) {
              const result = await authOptions.callbacks.signIn(params);
              console.log('✅ SignIn callback successful');
              return result;
            }
            return true;
          } catch (error: any) {
            console.error('🔴 SignIn callback error details:', {
              message: error.message,
              code: error.code,
              cause: error.cause,
              stack: error.stack?.split('\n').slice(0, 5).join('\n')
            });
            // Log the specific database error if it exists
            if (error.message?.includes('database')) {
              console.error('🔴 Database-specific error:', error);
            }
            throw error;
          }
        }
      }
    });
  } catch (error: any) {
    console.error('🔴 Failed to create NextAuth instance:', error);
    throw error;
  }
};

export const { auth, handlers, signIn, signOut } = createAuth();