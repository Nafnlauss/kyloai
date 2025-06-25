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
            userId: params.user?.id,
            accountId: params.account?.providerAccountId,
            timestamp: new Date().toISOString()
          });
          
          try {
            // Call original signIn callback
            if (authOptions.callbacks?.signIn) {
              const result = await authOptions.callbacks.signIn(params);
              console.log('✅ SignIn callback returned:', result);
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
            // Don't throw, return false to prevent error page
            return false;
          }
        },
        async redirect(params) {
          console.log('🔵 Redirect callback:', params);
          if (authOptions.callbacks?.redirect) {
            return authOptions.callbacks.redirect(params);
          }
          return params.baseUrl + '/studio/video';
        },
        async session(params) {
          console.log('🔵 Session callback');
          if (authOptions.callbacks?.session) {
            return authOptions.callbacks.session(params);
          }
          return params.session;
        },
        async jwt(params) {
          console.log('🔵 JWT callback:', {
            trigger: params.trigger,
            hasUser: !!params.user,
            hasAccount: !!params.account
          });
          if (authOptions.callbacks?.jwt) {
            return authOptions.callbacks.jwt(params);
          }
          return params.token;
        }
      },
      events: {
        ...authOptions.events,
        async signIn(message) {
          console.log('📌 Event: signIn', {
            userId: message.user.id,
            email: message.user.email
          });
          if (authOptions.events?.signIn) {
            await authOptions.events.signIn(message);
          }
        },
        async createUser(message) {
          console.log('📌 Event: createUser', {
            userId: message.user.id,
            email: message.user.email
          });
        },
        async linkAccount(message) {
          console.log('📌 Event: linkAccount', {
            provider: message.account.provider,
            userId: message.user.id
          });
        }
      }
    });
  } catch (error: any) {
    console.error('🔴 Failed to create NextAuth instance:', error);
    throw error;
  }
};

export const { auth, handlers, signIn, signOut } = createAuth();