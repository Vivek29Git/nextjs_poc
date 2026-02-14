"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getSettings, saveSettings, type SiteSettings } from "@/lib/admin"
import { SettingsIcon, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = () => {
    const currentSettings = getSettings()
    setSettings(currentSettings)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (settings) {
      saveSettings(settings)
      toast({
        title: "Settings saved",
        description: "Your settings have been updated successfully",
      })
    }
  }

  if (!settings) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
          Settings
        </h1>
        <p className="text-muted-foreground">Manage your store settings and configuration</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="border-2 border-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="w-5 h-5 text-primary" />
              Pricing Settings
            </CardTitle>
            <CardDescription>Configure shipping and tax rates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="shippingRate">Shipping Rate (₹)</Label>
              <Input
                id="shippingRate"
                type="number"
                value={settings.shippingRate}
                onChange={(e) => setSettings({ ...settings, shippingRate: Number(e.target.value) })}
                min="0"
                className="border-primary/20"
              />
              <p className="text-sm text-muted-foreground">Flat shipping rate applied to all orders</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="taxRate">Tax Rate (%)</Label>
              <Input
                id="taxRate"
                type="number"
                value={settings.taxRate * 100}
                onChange={(e) => setSettings({ ...settings, taxRate: Number(e.target.value) / 100 })}
                min="0"
                max="100"
                step="0.1"
                className="border-primary/20"
              />
              <p className="text-sm text-muted-foreground">Tax percentage applied to orders (e.g., 18 for 18% GST)</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-primary/10">
          <CardHeader>
            <CardTitle>Categories</CardTitle>
            <CardDescription>Product categories available in your store</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {settings.categories.map((category, index) => (
                <div
                  key={index}
                  className="p-3 rounded-lg bg-gradient-to-r from-orange-50 to-red-50 border border-primary/10"
                >
                  <p className="font-medium capitalize">{category.replace("-", " ")}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" className="bg-gradient-to-r from-primary via-orange-600 to-red-600 hover:opacity-90">
            <Save className="w-4 h-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </form>
    </div>
  )
}
