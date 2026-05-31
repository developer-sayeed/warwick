import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { getDatabase } from './mongodb'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            console.log('[v0] Missing credentials')
            return null
          }

          const db = await getDatabase()
          const user = await db.collection('users').findOne({
            email: credentials.email,
          })

          console.log('[v0] User found:', user?.email)

          if (!user) {
            console.log('[v0] User not found')
            return null
          }

          // Plain text password comparison (as requested - no bcrypt)
          if (user.password !== credentials.password) {
            console.log('[v0] Password mismatch')
            return null
          }

          console.log('[v0] Login successful')
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
          }
        } catch (error) {
          console.error('[v0] Auth error:', error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string
        session.user.id = token.id as string
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  trustHost: true,
})
