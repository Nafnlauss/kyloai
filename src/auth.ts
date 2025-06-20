import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth/auth-options'

export const { auth, handlers, signIn, signOut } = NextAuth(authOptions)