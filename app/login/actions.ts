'use server'

import { signIn } from '@/lib/auth'
import { AuthError } from 'next-auth'

export async function loginAction(email: string, password: string) {
  try {
    await signIn('credentials', {
      email,
      password,
      redirect: false,
    })
    return { success: true }
  } catch (error) {
    if (error instanceof AuthError) {
      return { success: false, error: 'Invalid email or password' }
    }
    // The "NEXT_REDIRECT" error is thrown internally for redirects, ignore it
    if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
      return { success: true }
    }
    console.error('[v0] Login action error:', error)
    return { success: false, error: 'An error occurred. Please try again.' }
  }
}
