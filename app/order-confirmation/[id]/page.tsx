"use client"

import { use, useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getOrder } from "@/lib/orders"
import { getStoredUser } from "@/lib/auth"
import type { Order } from "@/lib/types"
import { CheckCircle, Package, ArrowRight, Download } from "lucide-react"

// Required for static export: tells Next.js which [id] pages to pre-generate at build time
export function generateStaticParams() {
  return [
    { id: "1" }, { id: "2" }, { id: "3" }, { id: "4" },
    { id: "5" }, { id: "6" }, { id: "7" }, { id: "8" },
    { id: "9" }, { id: "10" }, { id: "11" }, { id: "12" },
  ]
}

export default function OrderConfirmationPage({ params }: { params: { id: string } }) {
  const resolvedParams = params
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const user = getStoredUser()
    if (!user) {
      window.location.href = "/login"
      return
    }

    const foundOrder = getOrder(resolvedParams.id, user.id)
    setOrder(foundOrder)
    setIsLoading(false)
  }, [resolvedParams.id])

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading order...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-semibold text-foreground">Order not found</h1>
            <Button asChild>
              <Link href="/orders">View Orders</Link>
            </Button>
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
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Success Message */}
          <div className="text-center space-y-6 mb-12 animate-fade-in-up">
            <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle className="h-12 w-12 text-primary" />
            </div>
            <div className="space-y-2">
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground">Order Confirmed!</h1>
              <p className="text-lg text-muted-foreground">
                Thank you for your order. We'll send you a confirmation email shortly.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" asChild>
                <Link href="/orders">
                  View All Orders
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="bg-transparent">
                <Link href="/products">Continue Shopping</Link>
              </Button>
            </div>
          </div>

          {/* Order Details */}
          <div className="space-y-6">
            <Card className="border-border/50">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-border/50">
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-foreground">Order Details</h2>
                    <p className="text-sm text-muted-foreground mt-1">Order #{order.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Order Date</p>
                    <p className="font-medium text-foreground">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-foreground flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Shipping Address
                    </h3>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>{order.shippingAddress.name}</p>
                      <p>{order.shippingAddress.address}</p>
                      <p>
                        {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
                      </p>
                      <p>{order.shippingAddress.country}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold text-foreground">Order Status</h3>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium capitalize">
                      {order.status}
                    </div>
                    <p className="text-sm text-muted-foreground pt-2">
                      Your order is being processed and will be shipped soon.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card className="border-border/50">
              <CardContent className="p-6 space-y-4">
                <h2 className="font-serif text-2xl font-bold text-foreground pb-4 border-b border-border/50">
                  Order Items
                </h2>

                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div
                      key={`${item.product.id}-${JSON.stringify(item.customization)}`}
                      className="flex gap-4 pb-4 border-b border-border/50 last:border-0 last:pb-0"
                    >
                      <div className="relative w-20 h-28 flex-shrink-0 rounded overflow-hidden bg-muted">
                        <Image
                          src={item.product.image || "/placeholder.svg"}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1 space-y-2">
                        <h3 className="font-serif text-lg font-semibold text-foreground">{item.product.name}</h3>
                        <p className="text-sm text-muted-foreground capitalize">
                          {item.product.category.replace("-", " ")}
                        </p>

                        {item.customization && (
                          <div className="text-sm space-y-1 p-2 bg-muted/50 rounded">
                            <p className="font-medium text-foreground text-xs">Customization:</p>
                            {item.customization.names && (
                              <p className="text-muted-foreground text-xs">Names: {item.customization.names}</p>
                            )}
                            {item.customization.date && (
                              <p className="text-muted-foreground text-xs">Date: {item.customization.date}</p>
                            )}
                            {item.customization.message && (
                              <p className="text-muted-foreground text-xs">Message: {item.customization.message}</p>
                            )}
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-1">
                          <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                          <p className="text-lg font-semibold text-primary">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 pt-4 border-t border-border/50">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium text-foreground">
                      ${order.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium text-foreground">Included</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="font-medium text-foreground">Included</span>
                  </div>
                  <div className="pt-3 border-t border-border/50">
                    <div className="flex justify-between">
                      <span className="font-semibold text-foreground text-lg">Total</span>
                      <span className="text-2xl font-bold text-primary">${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <Button variant="outline" className="w-full bg-transparent">
                  <Download className="mr-2 h-4 w-4" />
                  Download Invoice
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
