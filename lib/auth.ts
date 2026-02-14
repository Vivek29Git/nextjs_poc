"use client"

import type { User } from "./types"

// Mock authentication - replace with real auth later
export function getStoredUser(): User | null {
  if (typeof window === "undefined") return null
  const stored = localStorage.getItem("wedding_cards_user")
  return stored ? JSON.parse(stored) : null
}

export function setStoredUser(user: User | null) {
  if (typeof window === "undefined") return
  if (user) {
    localStorage.setItem("wedding_cards_user", JSON.stringify(user))
  } else {
    localStorage.removeItem("wedding_cards_user")
  }
}

export async function login(email: string, password: string): Promise<User> {
  // Mock login - replace with real API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const user: User = {
    id: Math.random().toString(36).substr(2, 9),
    email,
    name: email.split("@")[0],
    createdAt: new Date().toISOString(),
  }

  setStoredUser(user)
  return user
}

export async function signup(email: string, password: string, name: string): Promise<User> {
  // Mock signup - replace with real API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const user: User = {
    id: Math.random().toString(36).substr(2, 9),
    email,
    name,
    createdAt: new Date().toISOString(),
  }

  setStoredUser(user)
  return user
}

export async function adminLogin(username: string, password: string): Promise<User | null> {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Hardcoded admin credentials
  if (username === "admin" && password === "12345") {
    const adminUser: User = {
      id: "admin-001",
      email: "admin@weddingcards.com",
      name: "Admin",
      createdAt: new Date().toISOString(),
      role: "admin",
    }
    setStoredUser(adminUser)
    return adminUser
  }

  return null
}

export function isAdmin(user: User | null): boolean {
  return user?.role === "admin"
}

export function logout() {
  setStoredUser(null)
}
