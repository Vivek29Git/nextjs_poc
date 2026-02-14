"use client"

import Link from "next/link"
import { ShoppingCart, User, Heart, Menu, X, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { getCartCount } from "@/lib/cart"
import { getStoredUser, isAdmin } from "@/lib/auth"

export function Header() {
  const [cartCount, setCartCount] = useState(0)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAdminUser, setIsAdminUser] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    setCartCount(getCartCount())
    const user = getStoredUser()
    setIsAuthenticated(!!user)
    setIsAdminUser(isAdmin(user))

    const handleStorage = () => {
      setCartCount(getCartCount())
      const currentUser = getStoredUser()
      setIsAuthenticated(!!currentUser)
      setIsAdminUser(isAdmin(currentUser))
    }

    window.addEventListener("storage", handleStorage)
    window.addEventListener("cartUpdated", handleStorage)
    window.addEventListener("authUpdated", handleStorage)

    return () => {
      window.removeEventListener("storage", handleStorage)
      window.removeEventListener("cartUpdated", handleStorage)
      window.removeEventListener("authUpdated", handleStorage)
    }
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-primary fill-primary" />
            <span className="font-serif text-xl font-bold text-foreground">Eternal Moments</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/products"
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
            >
              Shop All
            </Link>
            <Link
              href="/products?category=invitation"
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
            >
              Invitations
            </Link>
            <Link
              href="/products?category=save-the-date"
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
            >
              Save the Dates
            </Link>
            <Link
              href="/products?category=thank-you"
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
            >
              Thank You Cards
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2">
            {isAdminUser && (
              <Button variant="ghost" size="icon" asChild>
                <Link href="/admin">
                  <Shield className="h-5 w-5 text-primary" />
                </Link>
              </Button>
            )}
            <Button variant="ghost" size="icon" asChild>
              <Link href={isAuthenticated ? "/account" : "/login"}>
                <User className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild className="relative">
              <Link href="/cart">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
                    {cartCount}
                  </span>
                )}
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/40 animate-fade-in-up">
            <nav className="flex flex-col gap-4">
              <Link
                href="/products"
                className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Shop All
              </Link>
              <Link
                href="/products?category=invitation"
                className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Invitations
              </Link>
              <Link
                href="/products?category=save-the-date"
                className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Save the Dates
              </Link>
              <Link
                href="/products?category=thank-you"
                className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Thank You Cards
              </Link>
              <div className="flex items-center gap-2 pt-2 border-t border-border/40">
                {isAdminUser && (
                  <Button variant="outline" size="sm" asChild className="flex-1 bg-transparent border-primary/20">
                    <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
                      <Shield className="h-4 w-4 mr-2 text-primary" />
                      Admin
                    </Link>
                  </Button>
                )}
                <Button variant="outline" size="sm" asChild className="flex-1 bg-transparent">
                  <Link href={isAuthenticated ? "/account" : "/login"} onClick={() => setMobileMenuOpen(false)}>
                    <User className="h-4 w-4 mr-2" />
                    Account
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild className="flex-1 relative bg-transparent">
                  <Link href="/cart" onClick={() => setMobileMenuOpen(false)}>
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Cart
                    {cartCount > 0 && <span className="ml-1 text-primary font-medium">({cartCount})</span>}
                  </Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
