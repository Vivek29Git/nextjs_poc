"use client"

import type { Order, Product, User } from "./types"
import { products } from "./mock-data"

// Admin functions for managing the store

// Orders Management
export function getAllOrders(): Order[] {
  if (typeof window === "undefined") return []
  const allOrders: Order[] = []

  // Get all orders from localStorage
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key?.startsWith("wedding_cards_orders_")) {
      const orders = JSON.parse(localStorage.getItem(key) || "[]")
      allOrders.push(...orders)
    }
  }

  return allOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export function updateOrderStatus(orderId: string, status: Order["status"]) {
  if (typeof window === "undefined") return

  // Find and update the order
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key?.startsWith("wedding_cards_orders_")) {
      const orders: Order[] = JSON.parse(localStorage.getItem(key) || "[]")
      const orderIndex = orders.findIndex((o) => o.id === orderId)

      if (orderIndex !== -1) {
        orders[orderIndex].status = status
        orders[orderIndex].updatedAt = new Date().toISOString()
        localStorage.setItem(key, JSON.stringify(orders))
        break
      }
    }
  }
}

// Products Management
export function getAllProducts(): Product[] {
  if (typeof window === "undefined") return products
  const stored = localStorage.getItem("wedding_cards_products")
  return stored ? JSON.parse(stored) : products
}

export function saveProducts(updatedProducts: Product[]) {
  if (typeof window === "undefined") return
  localStorage.setItem("wedding_cards_products", JSON.stringify(updatedProducts))
}

export function addProduct(product: Product) {
  const allProducts = getAllProducts()
  allProducts.push(product)
  saveProducts(allProducts)
}

export function updateProduct(productId: string, updates: Partial<Product>) {
  const allProducts = getAllProducts()
  const index = allProducts.findIndex((p) => p.id === productId)
  if (index !== -1) {
    allProducts[index] = { ...allProducts[index], ...updates }
    saveProducts(allProducts)
  }
}

export function deleteProduct(productId: string) {
  const allProducts = getAllProducts()
  const filtered = allProducts.filter((p) => p.id !== productId)
  saveProducts(filtered)
}

// Customers Management
export function getAllCustomers(): User[] {
  if (typeof window === "undefined") return []
  const customers: User[] = []

  // Get all unique customers from orders
  const orders = getAllOrders()
  const uniqueUserIds = new Set(orders.map((o) => o.userId))

  uniqueUserIds.forEach((userId) => {
    // Try to get user info from stored user data
    const userOrders = orders.filter((o) => o.userId === userId)
    if (userOrders.length > 0) {
      customers.push({
        id: userId,
        email: userOrders[0].shippingAddress.name + "@customer.com",
        name: userOrders[0].shippingAddress.name,
        createdAt: userOrders[0].createdAt,
      })
    }
  })

  return customers
}

// Analytics
export function getAnalytics() {
  const orders = getAllOrders()
  const products = getAllProducts()

  const totalRevenue = orders.filter((o) => o.status !== "cancelled").reduce((sum, order) => sum + order.total, 0)

  const totalOrders = orders.length
  const pendingOrders = orders.filter((o) => o.status === "pending").length
  const processingOrders = orders.filter((o) => o.status === "processing").length
  const shippedOrders = orders.filter((o) => o.status === "shipped").length
  const deliveredOrders = orders.filter((o) => o.status === "delivered").length

  // Calculate popular products
  const productSales: Record<string, number> = {}
  orders.forEach((order) => {
    order.items.forEach((item) => {
      productSales[item.product.id] = (productSales[item.product.id] || 0) + item.quantity
    })
  })

  const popularProducts = Object.entries(productSales)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([productId, quantity]) => ({
      product: products.find((p) => p.id === productId),
      quantity,
    }))

  // Recent orders
  const recentOrders = orders.slice(0, 10)

  return {
    totalRevenue,
    totalOrders,
    pendingOrders,
    processingOrders,
    shippedOrders,
    deliveredOrders,
    popularProducts,
    recentOrders,
    averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
  }
}

// Settings
export interface SiteSettings {
  shippingRate: number
  taxRate: number
  categories: string[]
  featuredProductIds: string[]
}

export function getSettings(): SiteSettings {
  if (typeof window === "undefined") {
    return {
      shippingRate: 500,
      taxRate: 0.18,
      categories: ["invitation", "save-the-date", "thank-you", "rsvp", "menu", "program"],
      featuredProductIds: [],
    }
  }

  const stored = localStorage.getItem("wedding_cards_settings")
  return stored
    ? JSON.parse(stored)
    : {
        shippingRate: 500,
        taxRate: 0.18,
        categories: ["invitation", "save-the-date", "thank-you", "rsvp", "menu", "program"],
        featuredProductIds: [],
      }
}

export function saveSettings(settings: SiteSettings) {
  if (typeof window === "undefined") return
  localStorage.setItem("wedding_cards_settings", JSON.stringify(settings))
}
