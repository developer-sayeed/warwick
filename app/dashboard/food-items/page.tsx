"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Plus, Pencil, Trash2, Clock, Filter } from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Product, Category } from "@/types";

const emptyForm = {
  name: "",
  nameAr: "",
  description: "",
  descriptionAr: "",
  price: "",
  calories: "",
  cookTime: "",
  category: "",
  image: "",
  ingredients: "",
  ingredientsAr: "",
  discountEnabled: false,
  discount: "",
  discountStartsAt: "",
  discountEndsAt: "",
};

export default function FoodItemsPage() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState(initialCategory);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/categories"),
      ]);

      const productsData = await productsRes.json();
      const categoriesData = await categoriesRes.json();

      setProducts(Array.isArray(productsData) ? productsData : []);
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  }

  const categoriesWithItems = useMemo(() => {
    return [...categories]
      .filter((cat) =>
        products.some((product) => product.category === cat.slug),
      )
      .sort(() => Math.random() - 0.5);
  }, [categories, products]);

  const filteredProducts = useMemo(() => {
    if (filterCategory === "all") return products;

    return products.filter((product) => product.category === filterCategory);
  }, [filterCategory, products]);

  function resetForm() {
    setFormData(emptyForm);
    setEditingProduct(null);
  }

  function openAddDialog() {
    resetForm();
    setIsDialogOpen(true);
  }

  function openEditDialog(product: Product) {
    const hasDiscount = !!product.discount && product.discount > 0;

    setEditingProduct(product);
    setFormData({
      name: product.name || "",
      nameAr: product.nameAr || "",
      description: product.description || "",
      descriptionAr: product.descriptionAr || "",
      price: product.price?.toString() || "",
      calories: product.calories?.toString() || "",
      cookTime: product.cookTime?.toString() || "",
      category: product.category || "",
      image: product.image || "",
      ingredients: product.ingredients?.join(", ") || "",
      ingredientsAr: product.ingredientsAr?.join(", ") || "",
      discountEnabled: hasDiscount,
      discount: hasDiscount ? product.discount?.toString() || "" : "",
      discountStartsAt: product.discountStartsAt
        ? new Date(product.discountStartsAt).toISOString().slice(0, 16)
        : "",
      discountEndsAt: product.discountEndsAt
        ? new Date(product.discountEndsAt).toISOString().slice(0, 16)
        : "",
    });

    setIsDialogOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    const productData = {
      name: formData.name,
      nameAr: formData.nameAr,
      description: formData.description,
      descriptionAr: formData.descriptionAr,
      price: parseFloat(formData.price),
      calories: parseInt(formData.calories),
      cookTime: parseInt(formData.cookTime),
      category: formData.category,
      image: formData.image,
      ingredients: formData.ingredients
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      ingredientsAr: formData.ingredientsAr
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),

      discount: formData.discountEnabled
        ? parseInt(formData.discount || "0")
        : 0,

      discountStartsAt:
        formData.discountEnabled && formData.discountStartsAt
          ? new Date(formData.discountStartsAt).toISOString()
          : "",

      discountEndsAt:
        formData.discountEnabled && formData.discountEndsAt
          ? new Date(formData.discountEndsAt).toISOString()
          : "",
    };

    try {
      const isEditing = !!editingProduct;

      const res = await fetch("/api/products", {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isEditing ? { _id: editingProduct._id, ...productData } : productData,
        ),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to save");
      }

      toast.success(
        isEditing ? "Item updated successfully!" : "Item created successfully!",
      );

      setIsDialogOpen(false);
      resetForm();
      fetchData();
    } catch (error: unknown) {
      console.error("Error saving product:", error);
      const message =
        error instanceof Error ? error.message : "Failed to save product";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  async function confirmDelete() {
    if (!deleteId) return;

    try {
      const res = await fetch(`/api/products?id=${deleteId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to delete");
      }

      toast.success("Item deleted successfully!");
      setDeleteId(null);
      fetchData();
    } catch (error: unknown) {
      console.error("Error deleting product:", error);
      const message =
        error instanceof Error ? error.message : "Failed to delete";
      toast.error(message);
    }
  }

  if (loading) {
    return (
      <div className="p-4 md:p-8 flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Food Items
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Manage your menu items in English & Arabic
          </p>
        </div>

        <Button
          onClick={openAddDialog}
          className="bg-primary hover:bg-primary/90 w-full md:w-auto"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Item
        </Button>
      </div>

      {/* Category Filter */}
      <div className="mb-6 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Filter className="w-4 h-4" />
          <span className="text-sm font-medium">Filter by Category:</span>
        </div>

        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-full sm:w-[220px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>

            {categoriesWithItems.map((cat) => (
              <SelectItem key={cat.slug} value={cat.slug}>
                {cat.name} {cat.nameAr ? `(${cat.nameAr})` : ""}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <span className="text-sm text-muted-foreground">
          Showing {filteredProducts.length} item
          {filteredProducts.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}
      >
        <DialogContent
          className="max-w-2xl max-h-[90vh] overflow-y-auto"
          size="xl"
          variant="large"
        >
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? "Edit Item" : "Add New Item"}
            </DialogTitle>
            <DialogDescription>
              Fill in the details for the menu item in both English and Arabic.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name (English) *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nameAr">Name (Arabic)</Label>
                <Input
                  id="nameAr"
                  dir="rtl"
                  value={formData.nameAr}
                  onChange={(e) =>
                    setFormData({ ...formData, nameAr: e.target.value })
                  }
                  placeholder="الاسم بالعربية"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Categories */}
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>

                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.slug} value={cat.slug}>
                        {cat.name} {cat.nameAr ? `- ${cat.nameAr}` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Image */}
              <div className="space-y-2">
                <Label htmlFor="image">Image URL *</Label>
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  placeholder="https://..."
                  className="w-full"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="description">Description (English) *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description: e.target.value,
                    })
                  }
                  required
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="descriptionAr">Description (Arabic)</Label>
                <Textarea
                  id="descriptionAr"
                  dir="rtl"
                  value={formData.descriptionAr}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      descriptionAr: e.target.value,
                    })
                  }
                  placeholder="الوصف بالعربية"
                  rows={3}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (SAR) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="calories">Calories *</Label>
                <Input
                  id="calories"
                  type="number"
                  value={formData.calories}
                  onChange={(e) =>
                    setFormData({ ...formData, calories: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cookTime">Cook Time (min) *</Label>
                <Input
                  id="cookTime"
                  type="number"
                  value={formData.cookTime}
                  onChange={(e) =>
                    setFormData({ ...formData, cookTime: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Discount Section */}
            <div className="border-t pt-4 space-y-4">
              <div className="flex items-center justify-between gap-4">
                <h4 className="font-semibold text-foreground flex items-center gap-2">
                  <Clock className="w-4 h-4 text-secondary" />
                  Discount & Countdown
                </h4>

                <div className="flex items-center gap-2">
                  <Label htmlFor="discountEnabled" className="text-sm">
                    Enable Discount
                  </Label>

                  <Switch
                    id="discountEnabled"
                    checked={formData.discountEnabled}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        discountEnabled: checked,
                        discount: checked ? formData.discount : "",
                        discountStartsAt: checked
                          ? formData.discountStartsAt
                          : "",
                        discountEndsAt: checked ? formData.discountEndsAt : "",
                      })
                    }
                  />
                </div>
              </div>

              {formData.discountEnabled && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="discount">Discount (%)</Label>
                      <Input
                        id="discount"
                        type="number"
                        min="0"
                        max="100"
                        value={formData.discount}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            discount: e.target.value,
                          })
                        }
                        placeholder="0"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="discountStartsAt">Discount Starts</Label>
                      <Input
                        id="discountStartsAt"
                        type="datetime-local"
                        value={formData.discountStartsAt}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            discountStartsAt: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="discountEndsAt">Discount Ends</Label>
                      <Input
                        id="discountEndsAt"
                        type="datetime-local"
                        value={formData.discountEndsAt}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            discountEndsAt: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Set a countdown end time. The countdown will appear above
                    the description on the product modal.
                  </p>
                </>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ingredients">
                  Ingredients (English, comma-separated) *
                </Label>
                <Input
                  id="ingredients"
                  value={formData.ingredients}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      ingredients: e.target.value,
                    })
                  }
                  placeholder="Egg, Bread, Cheese, ..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ingredientsAr">
                  Ingredients (Arabic, comma-separated)
                </Label>
                <Input
                  id="ingredientsAr"
                  dir="rtl"
                  value={formData.ingredientsAr}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      ingredientsAr: e.target.value,
                    })
                  }
                  placeholder="بيض، خبز، جبنة، ..."
                />
              </div>
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
                {submitting
                  ? "Saving..."
                  : editingProduct
                    ? "Update"
                    : "Create"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Item</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this menu item? This action cannot
              be undone.
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

            <Button
              onClick={confirmDelete}
              variant="destructive"
              className="w-full md:w-auto"
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Mobile Cards View */}
      <div className="block md:hidden space-y-4">
        {filteredProducts.map((product) => (
          <div
            key={product._id?.toString()}
            className="bg-card border border-border rounded-lg p-4"
          >
            <div className="flex gap-3">
              <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-foreground truncate">
                  {product.name}
                </h3>

                {product.nameAr && (
                  <p
                    className="text-sm text-muted-foreground truncate"
                    dir="rtl"
                  >
                    {product.nameAr}
                  </p>
                )}

                <p className="text-sm text-muted-foreground mt-1">
                  {product.category}
                </p>

                <div className="flex items-center gap-2 mt-1">
                  <span className="font-semibold text-foreground">
                    {product.price} SAR
                  </span>

                  {product.discount && product.discount > 0 && (
                    <span className="bg-secondary/20 text-secondary px-1.5 py-0.5 rounded text-xs">
                      -{product.discount}%
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-3 pt-3 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                onClick={() => openEditDialog(product)}
                className="flex-1"
              >
                <Pencil className="w-4 h-4 mr-1" />
                Edit
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeleteId(product._id?.toString() || "")}
                className="text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">
                  Image
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">
                  Name
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">
                  Category
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">
                  Price
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">
                  Discount
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.map((product) => (
                <tr
                  key={product._id?.toString()}
                  className="border-t border-border"
                >
                  <td className="px-6 py-4">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <p className="font-medium text-foreground">
                      {product.name}
                    </p>

                    {product.nameAr && (
                      <p className="text-sm text-muted-foreground" dir="rtl">
                        {product.nameAr}
                      </p>
                    )}
                  </td>

                  <td className="px-6 py-4 text-muted-foreground">
                    {product.category}
                  </td>

                  <td className="px-6 py-4 text-foreground">
                    {product.price} SAR
                  </td>

                  <td className="px-6 py-4">
                    {product.discount && product.discount > 0 ? (
                      <span className="bg-secondary/20 text-secondary px-2 py-1 rounded text-sm">
                        {product.discount}%
                      </span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditDialog(product)}
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                      >
                        <Pencil className="w-4 h-4 text-muted-foreground" />
                      </button>

                      <button
                        onClick={() =>
                          setDeleteId(product._id?.toString() || "")
                        }
                        className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredProducts.length === 0 && (
            <div className="text-center py-10 text-muted-foreground">
              No items found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
