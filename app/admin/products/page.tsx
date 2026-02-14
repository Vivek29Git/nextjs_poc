"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getAllProducts, addProduct, updateProduct, deleteProduct } from "@/lib/admin"
import type { Product } from "@/lib/types"
import { Plus, Edit, Trash2, Package } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    description: "",
    price: 0,
    category: "invitation",
    stock: 0,
    featured: false,
    customizable: true,
    image: "/placeholder.svg?height=400&width=400",
  })
  const { toast } = useToast()

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = () => {
    const allProducts = getAllProducts()
    setProducts(allProducts)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingProduct) {
      updateProduct(editingProduct.id, formData)
      toast({
        title: "Product updated",
        description: "Product has been updated successfully",
      })
    } else {
      const newProduct: Product = {
        id: Date.now().toString(),
        name: formData.name!,
        description: formData.description!,
        price: formData.price!,
        category: formData.category as Product["category"],
        stock: formData.stock!,
        featured: formData.featured!,
        customizable: formData.customizable!,
        image: formData.image!,
      }
      addProduct(newProduct)
      toast({
        title: "Product added",
        description: "New product has been added successfully",
      })
    }

    loadProducts()
    closeDialog()
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData(product)
    setIsDialogOpen(true)
  }

  const handleDelete = (productId: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteProduct(productId)
      loadProducts()
      toast({
        title: "Product deleted",
        description: "Product has been deleted successfully",
      })
    }
  }

  const closeDialog = () => {
    setIsDialogOpen(false)
    setEditingProduct(null)
    setFormData({
      name: "",
      description: "",
      price: 0,
      category: "invitation",
      stock: 0,
      featured: false,
      customizable: true,
      image: "/placeholder.svg?height=400&width=400",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
            Products Management
          </h1>
          <p className="text-muted-foreground">Manage your wedding card products</p>
        </div>
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="bg-gradient-to-r from-primary via-orange-600 to-red-600 hover:opacity-90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      <Card className="border-2 border-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            All Products ({products.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <div
                key={product.id}
                className="rounded-lg border-2 border-primary/10 hover:border-primary/30 transition-all overflow-hidden"
              >
                <div className="aspect-square relative bg-gradient-to-br from-orange-50 to-red-50">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  {product.featured && (
                    <span className="absolute top-2 right-2 bg-gradient-to-r from-primary to-orange-600 text-white text-xs px-2 py-1 rounded-full">
                      Featured
                    </span>
                  )}
                </div>
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-bold text-lg line-clamp-1">{product.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-primary">₹{product.price.toLocaleString()}</span>
                    <span className="text-sm text-muted-foreground">Stock: {product.stock}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(product)}
                      className="flex-1 border-primary/20 hover:bg-primary/5"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(product.id)}
                      className="flex-1 border-red-200 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Product Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={closeDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
            <DialogDescription>
              {editingProduct ? "Update product information" : "Add a new wedding card product"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="border-primary/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={3}
                className="border-primary/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (₹)</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  required
                  min="0"
                  className="border-primary/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                  required
                  min="0"
                  className="border-primary/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value as Product["category"] })}
              >
                <SelectTrigger className="border-primary/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="invitation">Invitation</SelectItem>
                  <SelectItem value="save-the-date">Save the Date</SelectItem>
                  <SelectItem value="thank-you">Thank You</SelectItem>
                  <SelectItem value="rsvp">RSVP</SelectItem>
                  <SelectItem value="menu">Menu</SelectItem>
                  <SelectItem value="program">Program</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="/placeholder.svg?height=400&width=400"
                className="border-primary/20"
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border border-primary/20">
              <Label htmlFor="featured" className="cursor-pointer">
                Featured Product
              </Label>
              <Switch
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border border-primary/20">
              <Label htmlFor="customizable" className="cursor-pointer">
                Customizable
              </Label>
              <Switch
                id="customizable"
                checked={formData.customizable}
                onCheckedChange={(checked) => setFormData({ ...formData, customizable: checked })}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeDialog}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-primary via-orange-600 to-red-600 hover:opacity-90"
              >
                {editingProduct ? "Update Product" : "Add Product"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
