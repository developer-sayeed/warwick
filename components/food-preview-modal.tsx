"use client";

import Image from "next/image";
import { X, Clock, Flame, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { MenuItem } from "@/lib/menu-data";

interface FoodPreviewModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function FoodPreviewModal({
  item,
  isOpen,
  onClose,
}: FoodPreviewModalProps) {
  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-card rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-auto animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-card/80 hover:bg-card rounded-full cursor-pointer"
        >
          <X className="h-5 w-5" />
        </Button>

        <div className="grid md:grid-cols-2">
          {/* Image Section */}
          <div className="relative aspect-square md:aspect-auto md:h-full min-h-[250px]">
            <Image
              src={item.image || "/placeholder.svg"}
              alt={item.name}
              fill
              className="object-cover"
            />
            {item.isPopular && (
              <Badge className="absolute top-4 left-4 bg-[#2e304c] text-amber-50 text-sm px-3 py-1">
                Popular Choice
              </Badge>
            )}
          </div>

          {/* Content Section */}
          <div className="p-5 sm:p-6 md:p-8 flex flex-col">
            <div className="flex-1">
              <span className="text-sm font-medium text-primary uppercase tracking-wider">
                {item.category}
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-card-foreground mt-2 mb-3">
                {item.name}
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {item.description}
              </p>

              {/* Info Cards */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-6">
                <div className="bg-secondary rounded-xl p-3 sm:p-4 text-center">
                  <Flame className="h-5 w-5 sm:h-6 sm:w-6 text-accent mx-auto mb-1 sm:mb-2" />
                  <span className="block text-base sm:text-lg font-bold text-card-foreground">
                    {item.calories}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Calories
                  </span>
                </div>
                <div className="bg-secondary rounded-xl p-3 sm:p-4 text-center">
                  <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-primary mx-auto mb-1 sm:mb-2" />
                  <span className="block text-base sm:text-lg font-bold text-card-foreground">
                    {item.prepTime}
                  </span>
                  <span className="text-xs text-muted-foreground">Minutes</span>
                </div>
                <div className="bg-secondary rounded-xl p-3 sm:p-4 text-center">
                  <Utensils className="h-5 w-5 sm:h-6 sm:w-6 text-primary mx-auto mb-1 sm:mb-2" />
                  <span className="block text-base sm:text-lg font-bold text-card-foreground">
                    {item.servings}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Servings
                  </span>
                </div>
              </div>

              {/* Ingredients */}
              {item.ingredients && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-card-foreground mb-2">
                    Key Ingredients
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {item.ingredients.map((ingredient, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="text-xs border-border"
                      >
                        {ingredient}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-border pt-6 mt-auto">
              <div className="flex items-center justify-between">
                <span className="text-2xl sm:text-3xl font-bold text-primary">
                  {item.price} SAR
                </span>
                <Button
                  onClick={onClose}
                  className="bg-primary hover:bg-primary/90 cursor-pointer"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
