'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { LayoutDashboard, UtensilsCrossed, FolderOpen, Settings, LogOut, Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { Button } from '@/components/ui/button'
import { Settings as SettingsType } from '@/types'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/food-items', label: 'Food Items', icon: UtensilsCrossed },
  { href: '/dashboard/categories', label: 'Categories', icon: FolderOpen },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [settings, setSettings] = useState<SettingsType | null>(null)

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data && Object.keys(data).length > 0) {
          setSettings(data)
        }
      })
      .catch(console.error)
  }, [])

  const logoUrl = settings?.logo || '/warwick-logo.svg'
  const restaurantName = settings?.restaurantName || 'Warwick Restaurant'

  const handleSignOut = async () => {
    try {
      toast.loading('Signing out...')
      await signOut({ callbackUrl: '/login' })
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Failed to logout')
    }
  }

  const NavContent = ({ onNavigate }: { onNavigate?: () => void }) => (
    <>
      <div className="p-4 md:p-6 border-b border-sidebar-border">
        <Link href="/" className="flex items-center gap-3">
          <div className="bg-white/10 p-2 rounded-lg flex-shrink-0">
            <img
              src={logoUrl}
              alt={restaurantName}
              className="h-8 w-8 md:h-10 md:w-10 object-contain"
            />
          </div>
          <div className="min-w-0">
            <h1 className="text-sm md:text-base font-bold truncate">Admin Panel</h1>
            <p className="text-[10px] md:text-xs opacity-70 truncate">{restaurantName}</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-2 md:p-4">
        <ul className="space-y-1 md:space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  className={`flex items-center gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-lg transition-colors text-sm md:text-base ${
                    isActive
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent'
                  }`}
                >
                  <Icon className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="p-2 md:p-4 border-t border-sidebar-border">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-lg w-full text-sidebar-foreground hover:bg-sidebar-accent transition-colors text-sm md:text-base"
        >
          <LogOut className="w-4 h-4 md:w-5 md:h-5" />
          Logout
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-sidebar text-sidebar-foreground flex items-center justify-between px-4 py-3 border-b border-sidebar-border">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="bg-white/10 p-1 rounded">
            <img
              src={logoUrl}
              alt={restaurantName}
              className="h-6 w-6 object-contain"
            />
          </div>
          <span className="font-bold text-sm">Admin Panel</span>
        </Link>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-30 bg-black/50"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`md:hidden fixed top-[53px] left-0 bottom-0 z-30 w-64 bg-sidebar text-sidebar-foreground flex flex-col transform transition-transform duration-200 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <NavContent onNavigate={() => setMobileOpen(false)} />
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-sidebar text-sidebar-foreground h-screen flex-col flex-shrink-0 sticky top-0">
        <NavContent />
      </aside>
    </>
  )
}
