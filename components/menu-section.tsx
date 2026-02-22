"use client";

import { useState } from "react";
import { FoodCard } from "./food-card";
import { FoodPreviewModal } from "./food-preview-modal";
import { CategoryFilter } from "./category-filter";
import { menuItems, categories, type MenuItem } from "@/lib/menu-data";

export function MenuSection() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  const filteredItems =
    selectedCategory === "all"
      ? menuItems
      : menuItems.filter((item) => item.category === selectedCategory);

  return (
    <section
      id="menu"
      className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
    >
      {/* Section Header */}
      <div className="text-center mb-8 sm:mb-10">
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-3 sm:mb-4">
          Our Menu
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base px-4">
          Discover our carefully crafted dishes made with the finest
          ingredients. Each item shows calories, preparation time, and price in
          SAR.
        </p>
      </div>

      <div className="mb-6 sm:mb-8 w-full overflow-x-auto pb-2">
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </div>

      <div className="flex flex-col gap-4">
        {filteredItems.map((item) => (
          <FoodCard
            key={item.id}
            item={item}
            onPreview={() => setSelectedItem(item)}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg">
            No items found in this category.
          </p>
        </div>
      )}

      {/* Preview Modal */}
      <FoodPreviewModal
        item={selectedItem}
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </section>
  );
}
