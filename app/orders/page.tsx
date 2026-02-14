"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getStoredUser } from "@/lib/auth"
import { getOrders } from "@/lib/orders"
import type { Order } from "@/lib/types"
import { Package, ArrowLeft, ShoppingBag } from "lucide-react"

export default function OrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>("all")

  useEffect(() => {
    const user = getStoredUser()
    if (!user) {
      router.push("/login?redirect=/orders")
      return
    }

    const userOrders = getOrders(user.id)
    setOrders(userOrders)
    setFilteredOrders(userOrders)
    setIsLoading(false)
  }, [router])

  useEffect(() => {
    if (statusFilter === "all") {
      setFilteredOrders(orders)
    } else {
      setFilteredOrders(orders.filter((order) => order.status === statusFilter))
    }
  }, [statusFilter, orders])

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading orders...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-12 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <Button variant="ghost" asChild className="mb-6 -ml-4">
            <Link href="/account">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Account
            </Link>
          </Button>

          <div className="flex items-center justify-between mb-8">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground">Order History</h1>
            {orders.length > 0 && (
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px] bg-background">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Orders</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>

          {filteredOrders.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto rounded-full bg-muted flex items-center justify-center mb-6">
                <ShoppingBag className="h-12 w-12 text-muted-foreground" />
              </div>
              <h2 className="font-serif text-3xl font-bold text-foreground mb-3">
                {statusFilter === "all" ? "No orders yet" : `No ${statusFilter} orders`}
              </h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
                {statusFilter === "all"
                  ? "Start shopping for beautiful wedding stationery to see your orders here."
                  : "Try selecting a different status filter."}
              </p>
              <Button size="lg" asChild>
                <Link href="/products">Browse Products</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredOrders.map((order, index) => (
                <Card
                  key={order.id}
                  className="border-border/50 hover:border-primary/50 transition-all hover:shadow-lg animate-fade-in-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Order Info */}
                      <div className="flex-1 space-y-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <Package className="h-5 w-5 text-primary" />
                              <h3 className="font-serif text-xl font-semibold text-foreground">Order #{order.id}</h3>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Placed on{" "}
                              {new Date(order.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </p>
                          </div>
                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium capitalize">
                            {order.status}
                          </span>
                        </div>

                        {/* Order Items Preview */}
                        <div className="flex gap-3 overflow-x-auto pb-2">
                          {order.items.slice(0, 4).map((item) => (
                            <div
                              key={`${item.product.id}-${JSON.stringify(item.customization)}`}
                              className="relative w-20 h-24 flex-shrink-0 rounded overflow-hidden bg-muted"
                            >
                              <Image
                                src={item.product.image || "/placeholder.svg"}
                                alt={item.product.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ))}
                          {order.items.length > 4 && (
                            <div className="w-20 h-24 flex-shrink-0 rounded bg-muted flex items-center justify-center">
                              <p className="text-sm font-medium text-muted-foreground">+{order.items.length - 4}</p>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-border/50">
                          <p className="text-sm text-muted-foreground">
                            {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                          </p>
                          <p className="text-2xl font-bold text-primary">${order.total.toFixed(2)}</p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex lg:flex-col gap-2 lg:justify-center">
                        <Button variant="outline" asChild className="flex-1 lg:flex-none bg-transparent">
                          <Link href={`/order-confirmation/${order.id}`}>View Details</Link>
                        </Button>
                        <Button variant="outline" className="flex-1 lg:flex-none bg-transparent">
                          Track Order
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
