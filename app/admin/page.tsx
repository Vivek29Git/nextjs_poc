"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getAnalytics } from "@/lib/admin"
import { IndianRupee, ShoppingBag, Clock, Package, Truck, CheckCircle, TrendingUp } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<any>(null)

  useEffect(() => {
    setAnalytics(getAnalytics())
  }, [])

  if (!analytics) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  const stats = [
    {
      title: "Total Revenue",
      value: `₹${analytics.totalRevenue.toLocaleString()}`,
      icon: IndianRupee,
      color: "from-green-500 to-emerald-600",
    },
    {
      title: "Total Orders",
      value: analytics.totalOrders,
      icon: ShoppingBag,
      color: "from-blue-500 to-cyan-600",
    },
    {
      title: "Pending Orders",
      value: analytics.pendingOrders,
      icon: Clock,
      color: "from-yellow-500 to-orange-600",
    },
    {
      title: "Processing",
      value: analytics.processingOrders,
      icon: Package,
      color: "from-purple-500 to-pink-600",
    },
    {
      title: "Shipped",
      value: analytics.shippedOrders,
      icon: Truck,
      color: "from-indigo-500 to-blue-600",
    },
    {
      title: "Delivered",
      value: analytics.deliveredOrders,
      icon: CheckCircle,
      color: "from-green-500 to-teal-600",
    },
    {
      title: "Avg Order Value",
      value: `₹${Math.round(analytics.averageOrderValue).toLocaleString()}`,
      icon: TrendingUp,
      color: "from-red-500 to-orange-600",
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
          Dashboard
        </h1>
        <p className="text-muted-foreground">Welcome back! Here's your store overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card
              key={stat.title}
              className="border-2 border-primary/10 hover:border-primary/30 transition-all hover:shadow-lg"
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.color}`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Popular Products */}
      <Card className="border-2 border-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Popular Products
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.popularProducts.map((item: any, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-orange-50 to-red-50 border border-primary/10"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-primary to-orange-600 flex items-center justify-center text-white font-bold text-lg">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-semibold">{item.product?.name || "Unknown Product"}</p>
                    <p className="text-sm text-muted-foreground">{item.quantity} sold</p>
                  </div>
                </div>
                <p className="font-bold text-primary">₹{item.product?.price.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Orders */}
      <Card className="border-2 border-primary/10">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary" />
            Recent Orders
          </CardTitle>
          <Link href="/admin/orders">
            <Button variant="outline" size="sm" className="border-primary/20 hover:bg-primary/5 bg-transparent">
              View All
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analytics.recentOrders.slice(0, 5).map((order: any) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-4 rounded-lg border border-primary/10 hover:bg-primary/5 transition-colors"
              >
                <div>
                  <p className="font-semibold">Order #{order.id.slice(0, 8)}</p>
                  <p className="text-sm text-muted-foreground">{order.shippingAddress.name}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">₹{order.total.toLocaleString()}</p>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      order.status === "delivered"
                        ? "bg-green-100 text-green-700"
                        : order.status === "shipped"
                          ? "bg-blue-100 text-blue-700"
                          : order.status === "processing"
                            ? "bg-purple-100 text-purple-700"
                            : order.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
