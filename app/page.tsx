import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { mockProducts } from "@/lib/mock-data"
import { ArrowRight, Sparkles, Heart, Star } from "lucide-react"

export default function HomePage() {
  const featuredProducts = mockProducts.filter((p) => p.featured).slice(0, 3)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-secondary/20 to-accent/10">
        <div className="absolute inset-0 bg-[url('/delicate-floral-pattern.png')] opacity-5" />
        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <div className="max-w-3xl mx-auto text-center space-y-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              <span>Customizable Wedding Stationery</span>
            </div>

            <h1 className="font-serif text-5xl md:text-7xl font-bold text-foreground leading-tight text-balance">
              Your Love Story,{" "}
              <span className="text-primary">
                Beautifully
                <br />
                Told
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed text-pretty max-w-2xl mx-auto">
              Create unforgettable first impressions with our elegant, customizable wedding invitations and stationery.
              Each design is crafted with love for your special day.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" asChild className="text-base group">
                <Link href="/products">
                  Shop Collections
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-base bg-transparent">
                <Link href="/products?category=invitation">View Invitations</Link>
              </Button>
            </div>

            <div className="flex items-center justify-center gap-8 pt-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 fill-primary text-primary" />
                <span>Premium Quality</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 fill-primary text-primary" />
                <span>Fully Customizable</span>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span>Fast Shipping</span>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-20 right-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        />
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground text-balance">
              Featured Collections
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Discover our most loved designs, handpicked for their timeless elegance and romantic charm.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {featuredProducts.map((product, index) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="group animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Card className="overflow-hidden border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-sm font-medium">View Details</p>
                    </div>
                  </div>
                  <CardContent className="p-6 space-y-2">
                    <h3 className="font-serif text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{product.description}</p>
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-lg font-semibold text-primary">${product.price.toFixed(2)}</span>
                      <span className="text-xs text-muted-foreground bg-secondary px-3 py-1 rounded-full">
                        Customizable
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" variant="outline" asChild className="bg-transparent">
              <Link href="/products">
                View All Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground text-balance">Shop by Category</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              From save the dates to thank you cards, we have everything you need for your wedding journey.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
            {[
              { name: "Invitations", category: "invitation", count: 4 },
              { name: "Save the Dates", category: "save-the-date", count: 2 },
              { name: "Thank You Cards", category: "thank-you", count: 1 },
              { name: "RSVP Cards", category: "rsvp", count: 1 },
              { name: "Menu Cards", category: "menu", count: 1 },
              { name: "Programs", category: "program", count: 1 },
            ].map((cat, index) => (
              <Link
                key={cat.category}
                href={`/products?category=${cat.category}`}
                className="group animate-fade-in-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Card className="overflow-hidden border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <CardContent className="p-6 text-center space-y-2">
                    <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                      <Heart className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{cat.count} designs</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground text-balance">
              Why Choose Eternal Moments
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                title: "Premium Quality",
                description: "Luxurious paper stocks and printing techniques that make your invitations unforgettable.",
              },
              {
                title: "Fully Customizable",
                description: "Personalize every detail from colors to text to make your stationery uniquely yours.",
              },
              {
                title: "Fast Turnaround",
                description: "Quick production and shipping so you can focus on planning your perfect day.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="text-center space-y-3 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground text-balance">
              Ready to Create Your Perfect Invitation?
            </h2>
            <p className="text-lg text-muted-foreground text-pretty">
              Start designing your dream wedding stationery today. Every love story deserves a beautiful beginning.
            </p>
            <Button size="lg" asChild className="text-base">
              <Link href="/products">
                Start Shopping
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
