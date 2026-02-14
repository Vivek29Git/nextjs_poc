"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getStoredUser, logout } from "@/lib/auth"
import { getOrders } from "@/lib/orders"
import type { User, Order } from "@/lib/types"
import { UserIcon, Package, Heart, LogOut, ShoppingBag } from "lucide-react"

export default function AccountPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const currentUser = getStoredUser()
    if (!currentUser) {
      router.push("/login?redirect=/account")
      return
    }

    setUser(currentUser)
    setOrders(getOrders(currentUser.id))
    setIsLoading(false)
  }, [router])

  const handleLogout = () => {
    logout()
    window.dispatchEvent(new Event("authUpdated"))
    router.push("/")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading account...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!user) return null

  const recentOrders = orders.slice(0, 3)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-12 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center justify-between mb-8">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground">My Account</h1>
            <Button variant="outline" onClick={handleLogout} className="bg-transparent">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Account Info */}
            <Card className="border-border/50 animate-fade-in-up">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserIcon className="h-5 w-5" />
                  Account Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium text-foreground">{user.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium text-foreground">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Member Since</p>
                  <p className="font-medium text-foreground">
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Orders Summary */}
            <Card className="border-border/50 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Orders
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-center py-4">
                  <p className="text-4xl font-bold text-primary">{orders.length}</p>
                  <p className="text-sm text-muted-foreground mt-1">Total Orders</p>
                </div>
                <Button variant="outline" className="w-full bg-transparent" asChild>
                  <Link href="/orders">View All Orders</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Wishlist */}
            <Card className="border-border/50 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Wishlist
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-center py-4">
                  <p className="text-4xl font-bold text-primary">0</p>
                  <p className="text-sm text-muted-foreground mt-1">Saved Items</p>
                </div>
                <Button variant="outline" className="w-full bg-transparent" asChild>
                  <Link href="/products">Browse Products</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Orders */}
          <Card className="border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="font-serif text-2xl">Recent Orders</CardTitle>
                  <CardDescription>Your latest wedding stationery orders</CardDescription>
                </div>
                {orders.length > 3 && (
                  <Button variant="outline" asChild className="bg-transparent">
                    <Link href="/orders">View All</Link>
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
                    <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">No orders yet</h3>
                  <p className="text-muted-foreground mb-6">Start shopping for your perfect wedding stationery</p>
                  <Button asChild>
                    <Link href="/products">Browse Products</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <Link
                      key={order.id}
                      href={`/order-confirmation/${order.id}`}
                      className="block p-4 rounded-lg border border-border/50 hover:border-primary/50 transition-all hover:shadow-md"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-semibold text-foreground">Order #{order.id}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-primary">${order.total.toFixed(2)}</p>
                          <span className="inline-flex items-center px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium capitalize">
                            {order.status}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                      </p>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
