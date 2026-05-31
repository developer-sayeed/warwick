'use client'

import { useEffect, useState } from 'react'
import { Settings } from '@/types'

export function DynamicFavicon() {
  const [settings, setSettings] = useState<Settings | null>(null)

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

  useEffect(() => {
    if (!settings) return

    // Update page title
    if (settings.restaurantName) {
      document.title = `${settings.restaurantName} - Our Menu`
    }

    // Update favicon
    if (settings.favicon) {
      const existingFavicon = document.querySelector("link[rel='icon']") as HTMLLinkElement
      if (existingFavicon) {
        existingFavicon.href = settings.favicon
      } else {
        const favicon = document.createElement('link')
        favicon.rel = 'icon'
        favicon.href = settings.favicon
        document.head.appendChild(favicon)
      }
    }
  }, [settings])

  return null
}
