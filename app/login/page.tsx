'use client'

import { useState } from 'react'
import { getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'react-toastify'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { loginAction } from './actions'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await loginAction(email, password)

      if (result.success) {
        // Verify the session was created
        const session = await getSession()
        if (session?.user) {
          toast.success('Welcome back, ' + (session.user.name || 'Admin') + '!')
          router.push('/dashboard')
          router.refresh()
        } else {
          // Wait a moment and retry session check
          await new Promise((r) => setTimeout(r, 300))
          const retrySession = await getSession()
          if (retrySession?.user) {
            toast.success('Welcome back!')
            router.push('/dashboard')
            router.refresh()
          } else {
            setError('Login succeeded but session not found. Please try again.')
            toast.error('Session error. Please try again.')
          }
        }
      } else {
        setError(result.error || 'Invalid email or password')
        toast.error(result.error || 'Invalid email or password')
      }
    } catch (err) {
      console.error('[v0] Login exception:', err)
      setError('An error occurred. Please try again.')
      toast.error('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center gap-2">
            <div className="bg-primary p-4 rounded-xl">
              <img
                src="/warwick-logo.svg"
                alt="Warwick"
                className="h-12 w-auto"
              />
            </div>
          </Link>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-sm">
          <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-2 text-center">
            Admin Login
          </h2>
          <p className="text-sm text-muted-foreground text-center mb-6">
            Sign in to manage your restaurant
          </p>

          {error && (
            <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
                className="h-11 md:h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="h-11 md:h-12"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-11 md:h-12 bg-primary hover:bg-primary/90"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </div>

        <p className="text-center mt-6 text-muted-foreground">
          <Link href="/" className="text-primary hover:underline">
            Back to Menu
          </Link>
        </p>
      </div>
    </div>
  )
}
