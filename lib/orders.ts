"use client"

import type { Order } from "./types"

export function getOrders(userId: string): Order[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(`wedding_cards_orders_${userId}`)
  return stored ? JSON.parse(stored) : []
}

export function saveOrder(order: Order) {
  if (typeof window === "undefined") return
  const orders = getOrders(order.userId)
  orders.unshift(order)
  localStorage.setItem(`wedding_cards_orders_${order.userId}`, JSON.stringify(orders))
}

export function getOrder(orderId: string, userId: string): Order | null {
  const orders = getOrders(userId)
  return orders.find((order) => order.id === orderId) || null
}
