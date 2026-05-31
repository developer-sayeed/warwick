'use client'

import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Settings } from '@/types'

const defaultSettings: Settings = {
  restaurantName: '',
  restaurantNameAr: '',
  logo: '',
  favicon: '',
  heroTitle: '',
  heroTitleAr: '',
  heroSubtitle: '',
  heroSubtitleAr: '',
  heroContent: '',
  heroContentAr: '',
  phone: '',
  whatsapp: '',
  email: '',
  address: '',
  addressAr: '',
  facebookUrl: '',
  instagramUrl: '',
  tiktokUrl: '',
  youtubeUrl: '',
  welcomePopup: {
    enabled: true,
    title: '',
    titleAr: '',
    subtitle: '',
    subtitleAr: '',
    discountText: '',
    discountTextAr: '',
    codeText: '',
    message: '',
    messageAr: '',
  },
  dealsCountdown: {
    enabled: true,
    endDate: '',
  },
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(defaultSettings)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  async function fetchSettings() {
    try {
      const res = await fetch('/api/settings')
      const data = await res.json()
      if (data && Object.keys(data).length > 0) {
        setSettings({
          ...defaultSettings,
          ...data,
          welcomePopup: { ...defaultSettings.welcomePopup, ...(data.welcomePopup || {}) },
          dealsCountdown: { ...defaultSettings.dealsCountdown, ...(data.dealsCountdown || {}) },
        })
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
      toast.error('Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    setSaving(true)
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })
      if (res.ok) {
        toast.success('Settings saved successfully!')
      } else {
        const data = await res.json().catch(() => ({}))
        toast.error(data.error || 'Failed to save settings')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      toast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="p-4 md:p-8 flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground text-sm md:text-base">Manage restaurant information and content</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="bg-primary hover:bg-primary/90 w-full md:w-auto">
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div className="space-y-6 max-w-4xl">
        {/* Branding */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base md:text-lg font-semibold italic">Branding</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="restaurantName">Restaurant Name (English) - Website Title</Label>
              <Input
                id="restaurantName"
                value={settings.restaurantName}
                onChange={(e) => setSettings({ ...settings, restaurantName: e.target.value })}
                placeholder="Warwick Restaurant"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="restaurantNameAr">Restaurant Name (Arabic)</Label>
              <Input
                id="restaurantNameAr"
                dir="rtl"
                value={settings.restaurantNameAr || ''}
                onChange={(e) => setSettings({ ...settings, restaurantNameAr: e.target.value })}
                placeholder="مطعم واريك"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="logo">Logo URL (Shows on Website & Dashboard)</Label>
              <Input
                id="logo"
                value={settings.logo}
                onChange={(e) => setSettings({ ...settings, logo: e.target.value })}
                placeholder="https://example.com/logo.svg"
              />
              {settings.logo && (
                <div className="mt-2 p-2 bg-muted rounded-lg inline-block">
                  <img src={settings.logo} alt="Logo Preview" className="h-10 w-auto" />
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="favicon">Favicon URL (Browser Tab Icon)</Label>
              <Input
                id="favicon"
                value={settings.favicon || ''}
                onChange={(e) => setSettings({ ...settings, favicon: e.target.value })}
                placeholder="https://example.com/favicon.ico"
              />
              {settings.favicon && (
                <div className="mt-2 p-2 bg-muted rounded-lg inline-block">
                  <img src={settings.favicon} alt="Favicon Preview" className="h-6 w-6" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Hero Banner */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base md:text-lg font-semibold italic">Hero Banner</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="heroSubtitle">Explore Text (English)</Label>
              <Input
                id="heroSubtitle"
                value={settings.heroSubtitle}
                onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
                placeholder="Explore Our"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="heroSubtitleAr">Explore Text (Arabic)</Label>
              <Input
                id="heroSubtitleAr"
                dir="rtl"
                value={settings.heroSubtitleAr || ''}
                onChange={(e) => setSettings({ ...settings, heroSubtitleAr: e.target.value })}
                placeholder="استكشف"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="heroTitle">Title (English)</Label>
              <Input
                id="heroTitle"
                value={settings.heroTitle}
                onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
                placeholder="Our Menu"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="heroTitleAr">Title (Arabic)</Label>
              <Input
                id="heroTitleAr"
                dir="rtl"
                value={settings.heroTitleAr || ''}
                onChange={(e) => setSettings({ ...settings, heroTitleAr: e.target.value })}
                placeholder="قائمتنا"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="heroContent">Content (English)</Label>
              <Textarea
                id="heroContent"
                value={settings.heroContent || ''}
                onChange={(e) => setSettings({ ...settings, heroContent: e.target.value })}
                placeholder="Discover our carefully crafted dishes..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="heroContentAr">Content (Arabic)</Label>
              <Textarea
                id="heroContentAr"
                dir="rtl"
                value={settings.heroContentAr || ''}
                onChange={(e) => setSettings({ ...settings, heroContentAr: e.target.value })}
                placeholder="اكتشف أطباقنا المصنوعة بعناية..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base md:text-lg font-semibold italic">Contact</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp (digits only!)</Label>
              <Input
                id="whatsapp"
                value={settings.whatsapp}
                onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address (English)</Label>
              <Input
                id="address"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="addressAr">Address (Arabic)</Label>
              <Input
                id="addressAr"
                dir="rtl"
                value={settings.addressAr || ''}
                onChange={(e) => setSettings({ ...settings, addressAr: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Social Links */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base md:text-lg font-semibold italic">Social Links</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="facebookUrl">Facebook URL</Label>
              <Input
                id="facebookUrl"
                value={settings.facebookUrl}
                onChange={(e) => setSettings({ ...settings, facebookUrl: e.target.value })}
                placeholder="https://facebook.com/yourpage"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instagramUrl">Instagram URL</Label>
              <Input
                id="instagramUrl"
                value={settings.instagramUrl}
                onChange={(e) => setSettings({ ...settings, instagramUrl: e.target.value })}
                placeholder="https://instagram.com/yourpage"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tiktokUrl">TikTok URL</Label>
              <Input
                id="tiktokUrl"
                value={settings.tiktokUrl}
                onChange={(e) => setSettings({ ...settings, tiktokUrl: e.target.value })}
                placeholder="https://tiktok.com/@yourpage"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="youtubeUrl">YouTube URL</Label>
              <Input
                id="youtubeUrl"
                value={settings.youtubeUrl || ''}
                onChange={(e) => setSettings({ ...settings, youtubeUrl: e.target.value })}
                placeholder="https://youtube.com/@yourchannel"
              />
            </div>
          </CardContent>
        </Card>

        {/* Welcome Popup */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base md:text-lg font-semibold italic">
                Welcome Popup
              </CardTitle>
              <div className="flex items-center gap-2">
                <Label htmlFor="popupEnabled" className="text-sm font-normal cursor-pointer">
                  {settings.welcomePopup.enabled ? 'Enabled' : 'Disabled'}
                </Label>
                <Switch
                  id="popupEnabled"
                  checked={settings.welcomePopup.enabled}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      welcomePopup: { ...settings.welcomePopup, enabled: checked },
                    })
                  }
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="popupTitle">Title (English)</Label>
                <Input
                  id="popupTitle"
                  value={settings.welcomePopup.title}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      welcomePopup: { ...settings.welcomePopup, title: e.target.value },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="popupTitleAr">Title (Arabic)</Label>
                <Input
                  id="popupTitleAr"
                  dir="rtl"
                  value={settings.welcomePopup.titleAr || ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      welcomePopup: { ...settings.welcomePopup, titleAr: e.target.value },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="popupSubtitle">Subtitle (English)</Label>
                <Input
                  id="popupSubtitle"
                  value={settings.welcomePopup.subtitle}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      welcomePopup: { ...settings.welcomePopup, subtitle: e.target.value },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="popupSubtitleAr">Subtitle (Arabic)</Label>
                <Input
                  id="popupSubtitleAr"
                  dir="rtl"
                  value={settings.welcomePopup.subtitleAr || ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      welcomePopup: { ...settings.welcomePopup, subtitleAr: e.target.value },
                    })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="popupDiscount">Discount Text</Label>
                <Input
                  id="popupDiscount"
                  value={settings.welcomePopup.discountText}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      welcomePopup: { ...settings.welcomePopup, discountText: e.target.value },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="popupCode">Code Text</Label>
                <Input
                  id="popupCode"
                  value={settings.welcomePopup.codeText}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      welcomePopup: { ...settings.welcomePopup, codeText: e.target.value },
                    })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="popupMessage">Message (English)</Label>
                <Textarea
                  id="popupMessage"
                  value={settings.welcomePopup.message}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      welcomePopup: { ...settings.welcomePopup, message: e.target.value },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="popupMessageAr">Message (Arabic)</Label>
                <Textarea
                  id="popupMessageAr"
                  dir="rtl"
                  value={settings.welcomePopup.messageAr || ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      welcomePopup: { ...settings.welcomePopup, messageAr: e.target.value },
                    })
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Deals Countdown */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base md:text-lg font-semibold italic">
                Global Deals Countdown
              </CardTitle>
              <div className="flex items-center gap-2">
                <Label htmlFor="dealsEnabled" className="text-sm font-normal cursor-pointer">
                  {settings.dealsCountdown.enabled ? 'Enabled' : 'Disabled'}
                </Label>
                <Switch
                  id="dealsEnabled"
                  checked={settings.dealsCountdown.enabled}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      dealsCountdown: { ...settings.dealsCountdown, enabled: checked },
                    })
                  }
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="dealsCountdown">Deadline (used as default for items without their own end date)</Label>
              <Input
                id="dealsCountdown"
                type="datetime-local"
                value={
                  settings.dealsCountdown?.endDate
                    ? new Date(settings.dealsCountdown.endDate).toISOString().slice(0, 16)
                    : ''
                }
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    dealsCountdown: { ...settings.dealsCountdown, endDate: e.target.value },
                  })
                }
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end pb-8">
          <Button onClick={handleSave} disabled={saving} className="bg-primary hover:bg-primary/90 w-full md:w-auto">
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  )
}
