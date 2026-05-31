'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Pencil, Trash2, UtensilsCrossed } from 'lucide-react'
import { toast } from 'react-toastify'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Category, Product } from '@/types'

const emptyForm = { name: '', nameAr: '', slug: '' }

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState(emptyForm)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const [categoriesRes, productsRes] = await Promise.all([
        fetch('/api/categories'),
        fetch('/api/products'),
      ])
      const categoriesData = await categoriesRes.json()
      const productsData = await productsRes.json()
      setCategories(Array.isArray(categoriesData) ? categoriesData : [])
      setProducts(Array.isArray(productsData) ? productsData : [])
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  function getItemCount(categorySlug: string) {
    return products.filter(p => p.category === categorySlug).length
  }

  function resetForm() {
    setFormData(emptyForm)
    setEditingCategory(null)
  }

  function openAddDialog() {
    resetForm()
    setIsDialogOpen(true)
  }

  function openEditDialog(category: Category) {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      nameAr: category.nameAr || '',
      slug: category.slug,
    })
    setIsDialogOpen(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)

    const categoryData = {
      name: formData.name,
      nameAr: formData.nameAr,
      slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '_'),
    }

    try {
      const isEditing = !!editingCategory
      const res = await fetch('/api/categories', {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          isEditing ? { _id: editingCategory._id, ...categoryData } : categoryData
        ),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to save')
      }

      toast.success(
        isEditing ? 'Category updated successfully!' : 'Category created successfully!'
      )
      setIsDialogOpen(false)
      resetForm()
      fetchData()
    } catch (error: unknown) {
      console.error('Error saving category:', error)
      const message = error instanceof Error ? error.message : 'Failed to save'
      toast.error(message)
    } finally {
      setSubmitting(false)
    }
  }

  async function confirmDelete() {
    if (!deleteId) return

    try {
      const res = await fetch(`/api/categories?id=${deleteId}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to delete')
      }
      toast.success('Category deleted successfully!')
      setDeleteId(null)
      fetchData()
    } catch (error: unknown) {
      console.error('Error deleting category:', error)
      const message = error instanceof Error ? error.message : 'Failed to delete'
      toast.error(message)
    }
  }

  if (loading) {
    return (
      <div className="p-4 md:p-8 flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Categories</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Manage menu categories in English & Arabic
          </p>
        </div>
        <Button onClick={openAddDialog} className="bg-primary hover:bg-primary/90 w-full md:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Button>
      </div>

      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) resetForm()
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </DialogTitle>
            <DialogDescription>Enter category details in English and Arabic.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name (English) *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nameAr">Name (Arabic)</Label>
              <Input
                id="nameAr"
                dir="rtl"
                value={formData.nameAr}
                onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                placeholder="الاسم بالعربية"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="auto-generated if empty"
              />
            </div>
            <div className="flex flex-col-reverse md:flex-row justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="w-full md:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="bg-primary hover:bg-primary/90 w-full md:w-auto"
              >
                {submitting ? 'Saving...' : editingCategory ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this category? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col-reverse md:flex-row justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteId(null)}
              className="w-full md:w-auto"
            >
              Cancel
            </Button>
            <Button onClick={confirmDelete} variant="destructive" className="w-full md:w-auto">
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Mobile Cards View */}
      <div className="block md:hidden space-y-3">
        {categories.map((category) => {
          const itemCount = getItemCount(category.slug)
          return (
            <div
              key={category._id?.toString()}
              className="bg-card border border-border rounded-lg p-4"
            >
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium text-foreground truncate">{category.name}</h3>
                  {category.nameAr && (
                    <p className="text-sm text-muted-foreground truncate" dir="rtl">
                      {category.nameAr}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">Slug: {category.slug}</p>
                  <Link
                    href={`/dashboard/food-items?category=${category.slug}`}
                    className="inline-flex items-center gap-1.5 mt-2 text-sm text-primary hover:underline"
                  >
                    <UtensilsCrossed className="w-3.5 h-3.5" />
                    {itemCount} item{itemCount !== 1 ? 's' : ''}
                  </Link>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => openEditDialog(category)}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                  >
                    <Pencil className="w-4 h-4 text-muted-foreground" />
                  </button>
                  <button
                    onClick={() => setDeleteId(category._id?.toString() || '')}
                    className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">
                Name (English)
              </th>
              <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">
                Name (Arabic)
              </th>
              <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">
                Slug
              </th>
              <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">
                Items
              </th>
              <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => {
              const itemCount = getItemCount(category.slug)
              return (
                <tr key={category._id?.toString()} className="border-t border-border">
                  <td className="px-6 py-4 font-medium text-foreground">{category.name}</td>
                  <td className="px-6 py-4 text-muted-foreground" dir="rtl">
                    {category.nameAr || '-'}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{category.slug}</td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/dashboard/food-items?category=${category.slug}`}
                      className="inline-flex items-center gap-1.5 text-primary hover:underline"
                    >
                      <UtensilsCrossed className="w-4 h-4" />
                      {itemCount} item{itemCount !== 1 ? 's' : ''}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditDialog(category)}
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                      >
                        <Pencil className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <button
                        onClick={() => setDeleteId(category._id?.toString() || '')}
                        className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
