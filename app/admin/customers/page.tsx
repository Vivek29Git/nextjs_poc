"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getAllCustomers, getAllOrders } from "@/lib/admin"
import type { User, Order } from "@/lib/types"
import { Users, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<User[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<User | null>(null)
  const [customerOrders, setCustomerOrders] = useState<Order[]>([])

  useEffect(() => {
    loadCustomers()
  }, [])

  const loadCustomers = () => {
    const allCustomers = getAllCustomers()
    setCustomers(allCustomers)
  }

  const viewCustomerOrders = (customer: User) => {
    const allOrders = getAllOrders()
    const orders = allOrders.filter((order) => order.userId === customer.id)
    setCustomerOrders(orders)
    setSelectedCustomer(customer)
  }

  const getTotalSpent = (customerId: string) => {
    const allOrders = getAllOrders()
    const customerOrders = allOrders.filter((order) => order.userId === customerId && order.status !== "cancelled")
    return customerOrders.reduce((sum, order) => sum + order.total, 0)
  }

  const getOrderCount = (customerId: string) => {
    const allOrders = getAllOrders()
    return allOrders.filter((order) => order.userId === customerId).length
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
          Customers Management
        </h1>
        <p className="text-muted-foreground">View and manage customer information</p>
      </div>

      <Card className="border-2 border-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            All Customers ({customers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {customers.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">No customers found</div>
            ) : (
              customers.map((customer) => (
                <div
                  key={customer.id}
                  className="p-4 rounded-lg border-2 border-primary/10 hover:border-primary/30 transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-orange-600 flex items-center justify-center text-white font-bold text-lg">
                          {customer.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-lg">{customer.name}</p>
                          <p className="text-sm text-muted-foreground">{customer.email}</p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground ml-15">
                        Member since: {new Date(customer.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex flex-col md:items-end gap-2">
                      <div className="flex gap-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-primary">{getOrderCount(customer.id)}</p>
                          <p className="text-xs text-muted-foreground">Orders</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-primary">
                            ₹{getTotalSpent(customer.id).toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground">Total Spent</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => viewCustomerOrders(customer)}
                        className="border-primary/20 hover:bg-primary/5"
                      >
                        <ShoppingBag className="w-4 h-4 mr-2" />
                        View Orders
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Customer Orders Dialog */}
      <Dialog open={!!selectedCustomer} onOpenChange={() => setSelectedCustomer(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedCustomer?.name}'s Orders</DialogTitle>
            <DialogDescription>Order history for this customer</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {customerOrders.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No orders found for this customer</div>
            ) : (
              customerOrders.map((order) => (
                <div key={order.id} className="p-4 rounded-lg border border-primary/10 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold">Order #{order.id.slice(0, 8)}</p>
                      <p className="text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary text-lg">₹{order.total.toLocaleString()}</p>
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
                  <div className="text-sm text-muted-foreground">{order.items.length} item(s)</div>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
