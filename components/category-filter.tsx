"use client"

import { Button } from "@/components/ui/button"

interface CategoryFilterProps {
  categories: { id: string; name: string; icon: string }[]
  selectedCategory: string
  onSelectCategory: (category: string) => void
}

export function CategoryFilter({ categories, selectedCategory, onSelectCategory }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={selectedCategory === category.id ? "default" : "outline"}
          size="sm"
          onClick={() => onSelectCategory(category.id)}
          className={`whitespace-nowrap rounded-full px-3 sm:px-4 text-xs sm:text-sm shrink-0 ${
            selectedCategory === category.id
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "border-border hover:bg-secondary"
          }`}
        >
          <span className="mr-1 sm:mr-2">{category.icon}</span>
          {category.name}
        </Button>
      ))}
    </div>
  )
}
