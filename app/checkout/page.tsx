"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PaymentForm } from "@/components/payment-form"
import { getCart, getCartTotal, clearCart } from "@/lib/cart"
import { getStoredUser } from "@/lib/auth"
import { saveOrder } from "@/lib/orders"
import { processPayment } from "@/lib/payment"
import type { CartItem, Order } from "@/lib/types"
import { Lock, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function CheckoutPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [user, setUser] = useState(getStoredUser())

  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "United States",
  })

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
  })

  useEffect(() => {
    const currentUser = getStoredUser()
    if (!currentUser) {
      router.push("/login?redirect=/checkout")
      return
    }

    const items = getCart()
    if (items.length === 0) {
      router.push("/cart")
      return
    }

    setUser(currentUser)
    setCartItems(items)
    setShippingInfo((prev) => ({ ...prev, email: currentUser.email, name: currentUser.name }))
    setIsLoading(false)
  }, [router])

  const subtotal = getCartTotal()
  const shipping = subtotal > 50 ? 0 : 5.99
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    if (!user) return

    setIsProcessing(true)

    try {
      // Process payment
      const paymentResult = await processPayment(total, paymentInfo)
      console.log('payment done');

      if (!paymentResult.success) {
        toast({
          title: "Payment failed",
          description: paymentResult.error || "Please check your payment details and try again.",
          variant: "destructive",
        })
        setIsProcessing(false)
        console.log('return to')
        return
      }

      // Create order
      const order: Order = {
        id: Math.random().toString(36).substr(2, 9),
        userId: user.id,
        items: cartItems,
        total,
        status: "processing",
        shippingAddress: {
          name: shippingInfo.name,
          address: shippingInfo.address,
          city: shippingInfo.city,
          state: shippingInfo.state,
          zip: shippingInfo.zip,
          country: shippingInfo.country,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      console.log('before saving order')
      saveOrder(order)
      console.log('after save order')
      clearCart()
      window.dispatchEvent(new Event("cartUpdated"))
      console.log('cart update event')

      toast({
        title: "Order placed successfully!",
        description: "Thank you for your purchase.",
      })

      console.log('router push')
      router.push(`/order-confirmation/${order.id}`)
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      })
      setIsProcessing(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading checkout...</p>
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
            <Link href="/cart">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Cart
            </Link>
          </Button>

          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-8">Checkout</h1>

          <form onSubmit={(e) => handleSubmit(e)}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Checkout Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Shipping Information */}
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="font-serif text-2xl">Shipping Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          required
                          value={shippingInfo.name}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, name: e.target.value })}
                          className="bg-background"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          required
                          value={shippingInfo.email}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                          className="bg-background"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Street Address *</Label>
                      <Input
                        id="address"
                        required
                        value={shippingInfo.address}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                        className="bg-background"
                      />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          required
                          value={shippingInfo.city}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                          className="bg-background"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State *</Label>
                        <Input
                          id="state"
                          required
                          value={shippingInfo.state}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })}
                          className="bg-background"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zip">ZIP Code *</Label>
                        <Input
                          id="zip"
                          required
                          value={shippingInfo.zip}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, zip: e.target.value })}
                          className="bg-background"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Information */}
                <PaymentForm paymentInfo={paymentInfo} setPaymentInfo={setPaymentInfo} />
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="border-border/50 sticky top-20">
                  <CardHeader>
                    <CardTitle className="font-serif text-2xl">Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {cartItems.map((item) => (
                        <div key={`${item.product.id}-${JSON.stringify(item.customization)}`} className="flex gap-3">
                          <div className="relative w-16 h-20 flex-shrink-0 rounded overflow-hidden bg-muted">
                            <Image
                              src={item.product.image || "/placeholder.svg"}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium text-foreground line-clamp-1">{item.product.name}</p>
                            <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                            <p className="text-sm font-semibold text-primary">
                              ${(item.product.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-3 pt-4 border-t border-border/50">
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
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Tax</span>
                        <span className="font-medium text-foreground">${tax.toFixed(2)}</span>
                      </div>
                      <div className="pt-3 border-t border-border/50">
                        <div className="flex justify-between">
                          <span className="font-semibold text-foreground">Total</span>
                          <span className="text-2xl font-bold text-primary">${total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    <Button type="submit" size="lg" className="w-full text-base" disabled={isProcessing}>
                      {isProcessing ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground mr-2" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Lock className="mr-2 h-5 w-5" />
                          Place Order
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  )
}
