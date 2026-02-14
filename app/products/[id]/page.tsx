"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { mockProducts } from "@/lib/mock-data"
import { addToCart } from "@/lib/cart"
import { ShoppingCart, Heart, Check, ArrowLeft, Sparkles } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()

  console.log("[v0] Product ID from params:", params.id)
  console.log(
    "[v0] Available product IDs:",
    mockProducts.map((p) => p.id),
  )

  const product = mockProducts.find((p) => p.id === params.id)

  console.log("[v0] Found product:", product)

  const [quantity, setQuantity] = useState(1)
  const [customization, setCustomization] = useState({
    names: "",
    date: "",
    message: "",
  })
  const [addedToCart, setAddedToCart] = useState(false)

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-semibold text-foreground">Product not found</h1>
            <p className="text-muted-foreground">Product ID: {params.id}</p>
            <Button asChild>
              <Link href="/products">Back to Products</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const handleAddToCart = () => {
    addToCart(
      product,
      quantity,
      product.customizable && (customization.names || customization.date || customization.message)
        ? customization
        : undefined,
    )

    setAddedToCart(true)
    window.dispatchEvent(new Event("cartUpdated"))

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })

    setTimeout(() => setAddedToCart(false), 2000)
  }

  const relatedProducts = mockProducts.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 3)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-12 bg-background">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <Button variant="ghost" asChild className="mb-6 -ml-4">
            <Link href="/products">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Link>
          </Button>

          {/* Product Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
            {/* Product Image */}
            <div className="space-y-4">
              <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-muted border-2 border-border/50 shadow-lg">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
                {product.featured && (
                  <div className="absolute top-4 right-4 bg-primary text-primary-foreground text-sm font-medium px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
                    <Sparkles className="h-4 w-4" />
                    Featured
                  </div>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="capitalize">{product.category.replace("-", " ")}</span>
                  {product.customizable && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Check className="h-3 w-3" />
                        Customizable
                      </span>
                    </>
                  )}
                </div>
                <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground text-balance">
                  {product.name}
                </h1>
                <p className="text-3xl font-semibold text-primary">${product.price.toFixed(2)}</p>
              </div>

              <p className="text-lg text-muted-foreground leading-relaxed">{product.description}</p>

              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-4">
                  <Label htmlFor="quantity" className="text-base">
                    Quantity:
                  </Label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="h-10 w-10 bg-transparent"
                    >
                      -
                    </Button>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      max={product.stock}
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(Math.max(1, Math.min(product.stock, Number.parseInt(e.target.value) || 1)))
                      }
                      className="w-20 text-center bg-background"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="h-10 w-10 bg-transparent"
                    >
                      +
                    </Button>
                  </div>
                  <span className="text-sm text-muted-foreground">{product.stock} in stock</span>
                </div>

                {product.customizable && (
                  <Card className="border-2 border-border/50 bg-muted/30">
                    <CardContent className="p-6 space-y-4">
                      <h3 className="font-semibold text-foreground flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        Customize Your Card
                      </h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="names">Names (Optional)</Label>
                          <Input
                            id="names"
                            placeholder="e.g., Priya & Rahul"
                            value={customization.names}
                            onChange={(e) => setCustomization({ ...customization, names: e.target.value })}
                            className="bg-background"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="date">Wedding Date (Optional)</Label>
                          <Input
                            id="date"
                            type="date"
                            value={customization.date}
                            onChange={(e) => setCustomization({ ...customization, date: e.target.value })}
                            className="bg-background"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="message">Custom Message (Optional)</Label>
                          <Textarea
                            id="message"
                            placeholder="Add a personal message..."
                            value={customization.message}
                            onChange={(e) => setCustomization({ ...customization, message: e.target.value })}
                            rows={3}
                            className="bg-background resize-none"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="flex gap-3 pt-4">
                  <Button size="lg" onClick={handleAddToCart} className="flex-1 text-base" disabled={addedToCart}>
                    {addedToCart ? (
                      <>
                        <Check className="mr-2 h-5 w-5" />
                        Added to Cart
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="mr-2 h-5 w-5" />
                        Add to Cart
                      </>
                    )}
                  </Button>
                  <Button size="lg" variant="outline" className="bg-transparent">
                    <Heart className="h-5 w-5" />
                  </Button>
                </div>

                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => {
                    handleAddToCart()
                    router.push("/cart")
                  }}
                  className="w-full text-base bg-transparent"
                >
                  Buy Now
                </Button>
              </div>

              <div className="pt-6 space-y-3 border-t-2 border-border/50">
                <div className="flex items-center gap-3 text-sm">
                  <Check className="h-5 w-5 text-primary" />
                  <span className="text-muted-foreground">Premium quality paper and printing</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Check className="h-5 w-5 text-primary" />
                  <span className="text-muted-foreground">Fast production and shipping</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Check className="h-5 w-5 text-primary" />
                  <span className="text-muted-foreground">100% satisfaction guarantee</span>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="space-y-8">
              <h2 className="font-serif text-3xl font-bold text-foreground text-center">You May Also Like</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <Link key={relatedProduct.id} href={`/products/${relatedProduct.id}`} className="group">
                    <Card className="overflow-hidden border-2 border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                        <Image
                          src={relatedProduct.image || "/placeholder.svg"}
                          alt={relatedProduct.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <CardContent className="p-5 space-y-2">
                        <h3 className="font-serif text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                          {relatedProduct.name}
                        </h3>
                        <p className="text-lg font-semibold text-primary">${relatedProduct.price.toFixed(2)}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
