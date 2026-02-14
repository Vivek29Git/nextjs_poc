export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: "invitation" | "save-the-date" | "thank-you" | "rsvp" | "menu" | "program"
  featured: boolean
  customizable: boolean
  stock: number
}

export interface CartItem {
  product: Product
  quantity: number
  customization?: {
    names?: string
    date?: string
    message?: string
  }
}

export interface User {
  id: string
  email: string
  name: string
  createdAt: string
  role?: "user" | "admin"
}

export interface Order {
  id: string
  userId: string
  items: CartItem[]
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  shippingAddress: {
    name: string
    address: string
    city: string
    state: string
    zip: string
    country: string
  }
  createdAt: string
  updatedAt: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
}
