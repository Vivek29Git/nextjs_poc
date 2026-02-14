"use client"

import type { CartItem, Product } from "./types"

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem("wedding_cards_cart")
  return stored ? JSON.parse(stored) : []
}

export function setCart(cart: CartItem[]) {
  if (typeof window === "undefined") return
  localStorage.setItem("wedding_cards_cart", JSON.stringify(cart))
}

export function addToCart(product: Product, quantity = 1, customization?: CartItem["customization"]) {
  const cart = getCart()
  const existingIndex = cart.findIndex(
    (item) => item.product.id === product.id && JSON.stringify(item.customization) === JSON.stringify(customization),
  )

  if (existingIndex > -1) {
    cart[existingIndex].quantity += quantity
  } else {
    cart.push({ product, quantity, customization })
  }

  setCart(cart)
  return cart
}

export function removeFromCart(productId: string, customization?: CartItem["customization"]) {
  const cart = getCart()
  const filtered = cart.filter(
    (item) => !(item.product.id === productId && JSON.stringify(item.customization) === JSON.stringify(customization)),
  )
  setCart(filtered)
  return filtered
}

export function updateCartQuantity(productId: string, quantity: number, customization?: CartItem["customization"]) {
  const cart = getCart()
  const item = cart.find(
    (item) => item.product.id === productId && JSON.stringify(item.customization) === JSON.stringify(customization),
  )

  if (item) {
    item.quantity = quantity
    if (quantity <= 0) {
      return removeFromCart(productId, customization)
    }
  }

  setCart(cart)
  return cart
}

export function clearCart() {
  setCart([])
}

export function getCartTotal(): number {
  const cart = getCart()
  return cart.reduce((total, item) => total + item.product.price * item.quantity, 0)
}

export function getCartCount(): number {
  const cart = getCart()
  return cart.reduce((count, item) => count + item.quantity, 0)
}
