'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { UtensilsCrossed, FolderOpen, TrendingUp, Tag, ArrowRight, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Product, Category } from '@/types'

export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/categories'),
        ])
        const productsData = await productsRes.json()
        const categoriesData = await categoriesRes.json()
        setProducts(Array.isArray(productsData) ? productsData : [])
        setCategories(Array.isArray(categoriesData) ? categoriesData : [])
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="p-4 md:p-8 flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const recentProducts = products.slice(0, 5)
  const dealsProducts = products.filter((p) => p.discount && p.discount > 0).slice(0, 5)
  const productCountByCategory = categories.map((cat) => ({
    ...cat,
    count: products.filter((p) => p.category === cat.slug).length,
  }))

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Welcome back to your restaurant admin panel
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 px-4 md:px-6">
            <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
              Total Items
            </CardTitle>
            <UtensilsCrossed className="w-4 h-4 md:w-5 md:h-5 text-secondary" />
          </CardHeader>
          <CardContent className="px-4 md:px-6">
            <div className="text-2xl md:text-3xl font-bold text-foreground">
              {products.length}
            </div>
            <p className="text-[10px] md:text-xs text-muted-foreground mt-1">Food items</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 px-4 md:px-6">
            <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
              Categories
            </CardTitle>
            <FolderOpen className="w-4 h-4 md:w-5 md:h-5 text-secondary" />
          </CardHeader>
          <CardContent className="px-4 md:px-6">
            <div className="text-2xl md:text-3xl font-bold text-foreground">
              {categories.length}
            </div>
            <p className="text-[10px] md:text-xs text-muted-foreground mt-1">Menu groups</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 px-4 md:px-6">
            <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
              Active Deals
            </CardTitle>
            <Tag className="w-4 h-4 md:w-5 md:h-5 text-secondary" />
          </CardHeader>
          <CardContent className="px-4 md:px-6">
            <div className="text-2xl md:text-3xl font-bold text-foreground">
              {dealsProducts.length}
            </div>
            <p className="text-[10px] md:text-xs text-muted-foreground mt-1">With discount</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 px-4 md:px-6">
            <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
              Avg. Price
            </CardTitle>
            <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-secondary" />
          </CardHeader>
          <CardContent className="px-4 md:px-6">
            <div className="text-2xl md:text-3xl font-bold text-foreground">
              {products.length > 0
                ? Math.round(products.reduce((sum, p) => sum + p.price, 0) / products.length)
                : 0}
            </div>
            <p className="text-[10px] md:text-xs text-muted-foreground mt-1">SAR</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Recent Items */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base md:text-lg">Recent Items</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">Latest 5 menu items</p>
            </div>
            <Link
              href="/dashboard/food-items"
              className="text-secondary hover:text-secondary/80 flex items-center gap-1 text-sm"
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </CardHeader>
          <CardContent>
            {recentProducts.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">No items yet</p>
            ) : (
              <div className="space-y-3">
                {recentProducts.map((product) => (
                  <div
                    key={product._id?.toString()}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={product.image || '/placeholder.svg'}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground text-sm md:text-base truncate">
                        {product.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {product.category}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-semibold text-foreground text-sm md:text-base">
                        {product.price} SAR
                      </p>
                      {product.discount && product.discount > 0 && (
                        <span className="text-[10px] md:text-xs bg-secondary/20 text-secondary px-1.5 py-0.5 rounded">
                          -{product.discount}%
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Categories with Counts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base md:text-lg">Categories</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">Items per category</p>
            </div>
            <Link
              href="/dashboard/categories"
              className="text-secondary hover:text-secondary/80 flex items-center gap-1 text-sm"
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </CardHeader>
          <CardContent>
            {productCountByCategory.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">
                No categories yet
              </p>
            ) : (
              <div className="space-y-2">
                {productCountByCategory.map((cat) => (
                  <div
                    key={cat._id?.toString()}
                    className="flex items-center justify-between p-2 md:p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <FolderOpen className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-foreground text-sm md:text-base truncate">
                          {cat.name}
                        </p>
                        {cat.nameAr && (
                          <p className="text-xs text-muted-foreground truncate" dir="rtl">
                            {cat.nameAr}
                          </p>
                        )}
                      </div>
                    </div>
                    <span className="bg-secondary/20 text-secondary px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium flex-shrink-0">
                      {cat.count} items
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Deals */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base md:text-lg flex items-center gap-2">
                <Tag className="w-5 h-5 text-secondary" />
                Active Deals
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-1">Items with active discounts</p>
            </div>
          </CardHeader>
          <CardContent>
            {dealsProducts.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">
                No active deals. Add a discount to a food item to feature it here.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {dealsProducts.map((product) => (
                  <div
                    key={product._id?.toString()}
                    className="flex items-center gap-3 p-3 border border-border rounded-lg hover:border-secondary transition-colors"
                  >
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={product.image || '/placeholder.svg'}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                      <span className="absolute top-0 left-0 bg-primary text-primary-foreground text-[10px] px-1 py-0.5 rounded-br">
                        -{product.discount}%
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground text-sm truncate">
                        {product.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-semibold text-primary text-sm">
                          {Math.round(product.price * (1 - (product.discount || 0) / 100))} SAR
                        </span>
                        <span className="text-xs text-muted-foreground line-through">
                          {product.price}
                        </span>
                      </div>
                      {product.discountEndsAt && (
                        <p className="text-[10px] text-secondary flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3" />
                          Ends {new Date(product.discountEndsAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
