"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { getCart, updateCartQuantity, removeFromCart, getCartTotal } from "@/lib/cart"
import type { CartItem } from "@/lib/types"
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react"

export default function CartPage() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setCartItems(getCart())
    setIsLoading(false)
  }, [])

  const handleUpdateQuantity = (productId: string, newQuantity: number, customization?: CartItem["customization"]) => {
    updateCartQuantity(productId, newQuantity, customization)
    setCartItems(getCart())
    window.dispatchEvent(new Event("cartUpdated"))
  }

  const handleRemove = (productId: string, customization?: CartItem["customization"]) => {
    removeFromCart(productId, customization)
    setCartItems(getCart())
    window.dispatchEvent(new Event("cartUpdated"))
  }

  const subtotal = getCartTotal()
  const shipping = subtotal > 50 ? 0 : 5.99
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading cart...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center py-20">
          <div className="text-center space-y-6 max-w-md mx-auto px-4">
            <div className="w-24 h-24 mx-auto rounded-full bg-muted flex items-center justify-center">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </div>
            <h1 className="font-serif text-3xl font-bold text-foreground">Your Cart is Empty</h1>
            <p className="text-muted-foreground leading-relaxed">
              Start adding beautiful wedding stationery to your cart and make your special day unforgettable.
            </p>
            <Button size="lg" asChild>
              <Link href="/products">
                Browse Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
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
        <div className="container mx-auto px-4">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-8">Shopping Cart</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item, index) => (
                <Card
                  key={`${item.product.id}-${JSON.stringify(item.customization)}`}
                  className="overflow-hidden border-border/50 animate-fade-in-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <CardContent className="p-4 md:p-6">
                    <div className="flex gap-4">
                      <Link
                        href={`/products/${item.product.id}`}
                        className="relative w-24 h-32 md:w-32 md:h-40 flex-shrink-0 rounded-lg overflow-hidden bg-muted"
                      >
                        <Image
                          src={item.product.image || "/placeholder.svg"}
                          alt={item.product.name}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </Link>

                      <div className="flex-1 space-y-3">
                        <div className="flex justify-between gap-4">
                          <div className="space-y-1">
                            <Link href={`/products/${item.product.id}`}>
                              <h3 className="font-serif text-lg md:text-xl font-semibold text-foreground hover:text-primary transition-colors">
                                {item.product.name}
                              </h3>
                            </Link>
                            <p className="text-sm text-muted-foreground capitalize">
                              {item.product.category.replace("-", " ")}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemove(item.product.id, item.customization)}
                            className="flex-shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        {item.customization && (
                          <div className="text-sm space-y-1 p-3 bg-muted/50 rounded-lg">
                            <p className="font-medium text-foreground">Customization:</p>
                            {item.customization.names && (
                              <p className="text-muted-foreground">Names: {item.customization.names}</p>
                            )}
                            {item.customization.date && (
                              <p className="text-muted-foreground">Date: {item.customization.date}</p>
                            )}
                            {item.customization.message && (
                              <p className="text-muted-foreground">Message: {item.customization.message}</p>
                            )}
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 bg-transparent"
                              onClick={() =>
                                handleUpdateQuantity(item.product.id, item.quantity - 1, item.customization)
                              }
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <Input
                              type="number"
                              min="1"
                              max={item.product.stock}
                              value={item.quantity}
                              onChange={(e) =>
                                handleUpdateQuantity(
                                  item.product.id,
                                  Math.max(1, Math.min(item.product.stock, Number.parseInt(e.target.value) || 1)),
                                  item.customization,
                                )
                              }
                              className="w-16 text-center h-8 bg-background"
                            />
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 bg-transparent"
                              onClick={() =>
                                handleUpdateQuantity(item.product.id, item.quantity + 1, item.customization)
                              }
                              disabled={item.quantity >= item.product.stock}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <p className="text-lg font-semibold text-primary">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="border-border/50 sticky top-20">
                <CardContent className="p-6 space-y-6">
                  <h2 className="font-serif text-2xl font-bold text-foreground">Order Summary</h2>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium text-foreground">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="font-medium text-foreground">
                        {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                      </span>
                    </div>
                    {shipping > 0 && <p className="text-xs text-muted-foreground">Free shipping on orders over $50</p>}
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax (8%)</span>
                      <span className="font-medium text-foreground">${tax.toFixed(2)}</span>
                    </div>
                    <div className="pt-3 border-t border-border/50">
                      <div className="flex justify-between">
                        <span className="font-semibold text-foreground">Total</span>
                        <span className="text-2xl font-bold text-primary">${total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <Button size="lg" className="w-full text-base" onClick={() => router.push("/checkout")}>
                    Proceed to Checkout
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>

                  <Button variant="outline" size="lg" className="w-full text-base bg-transparent" asChild>
                    <Link href="/products">Continue Shopping</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
