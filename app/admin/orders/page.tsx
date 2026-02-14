"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getAllOrders, updateOrderStatus } from "@/lib/admin"
import type { Order } from "@/lib/types"
import { Search, Package, Eye } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    loadOrders()
  }, [])

  useEffect(() => {
    filterOrders()
  }, [orders, searchQuery, statusFilter])

  const loadOrders = () => {
    const allOrders = getAllOrders()
    setOrders(allOrders)
  }

  const filterOrders = () => {
    let filtered = [...orders]

    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter)
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.shippingAddress.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    setFilteredOrders(filtered)
  }

  const handleStatusChange = (orderId: string, newStatus: Order["status"]) => {
    updateOrderStatus(orderId, newStatus)
    loadOrders()
    toast({
      title: "Order updated",
      description: `Order status changed to ${newStatus}`,
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-700 border-green-200"
      case "shipped":
        return "bg-blue-100 text-blue-700 border-blue-200"
      case "processing":
        return "bg-purple-100 text-purple-700 border-purple-200"
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200"
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
          Orders Management
        </h1>
        <p className="text-muted-foreground">Manage and track all customer orders</p>
      </div>

      {/* Filters */}
      <Card className="border-2 border-primary/10">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by order ID or customer name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-primary/20"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48 border-primary/20">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <Card className="border-2 border-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            Orders ({filteredOrders.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">No orders found</div>
            ) : (
              filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-4 rounded-lg border-2 border-primary/10 hover:border-primary/30 transition-all space-y-4"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-lg">Order #{order.id.slice(0, 8)}</p>
                        <span className={`text-xs px-3 py-1 rounded-full border ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">Customer: {order.shippingAddress.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Date: {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex flex-col md:items-end gap-2">
                      <p className="text-2xl font-bold text-primary">₹{order.total.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">{order.items.length} items</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Select
                      value={order.status}
                      onValueChange={(value) => handleStatusChange(order.id, value as Order["status"])}
                    >
                      <SelectTrigger className="w-40 border-primary/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedOrder(order)}
                      className="border-primary/20 hover:bg-primary/5"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>Order #{selectedOrder?.id.slice(0, 8)}</DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Customer Information</h3>
                <div className="p-4 rounded-lg bg-muted space-y-1">
                  <p>
                    <span className="font-medium">Name:</span> {selectedOrder.shippingAddress.name}
                  </p>
                  <p>
                    <span className="font-medium">Address:</span> {selectedOrder.shippingAddress.address}
                  </p>
                  <p>
                    <span className="font-medium">City:</span> {selectedOrder.shippingAddress.city},{" "}
                    {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zip}
                  </p>
                  <p>
                    <span className="font-medium">Country:</span> {selectedOrder.shippingAddress.country}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Order Items</h3>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-lg border border-primary/10 flex justify-between items-start"
                    >
                      <div>
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                        {item.customization && (
                          <div className="text-sm text-muted-foreground mt-1">
                            {item.customization.names && <p>Names: {item.customization.names}</p>}
                            {item.customization.date && <p>Date: {item.customization.date}</p>}
                            {item.customization.message && <p>Message: {item.customization.message}</p>}
                          </div>
                        )}
                      </div>
                      <p className="font-bold text-primary">₹{(item.product.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-lg bg-gradient-to-r from-orange-50 to-red-50 border border-primary/20">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-lg">Total Amount</span>
                  <span className="text-2xl font-bold text-primary">₹{selectedOrder.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
