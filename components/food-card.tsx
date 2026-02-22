"use client";

import Image from "next/image";
import { Clock, Flame, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { MenuItem } from "@/lib/menu-data";

interface FoodCardProps {
  item: MenuItem;
  onPreview: () => void;
}

export function FoodCard({ item, onPreview }: FoodCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-card border-border">
      <div className="flex flex-col sm:flex-row">
        {/* Image - full width on mobile, fixed width on larger screens */}
        <div className="relative w-full sm:w-48 md:w-56 h-48 sm:h-auto shrink-0">
          <Image
            src={item.image || "/placeholder.svg"}
            alt={item.name}
            fill
            className="object-cover"
          />
          {item.isPopular && (
            <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground">
              Popular
            </Badge>
          )}
        </div>

        {/* Content */}
        <CardContent className="flex-1 p-4 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
              <div>
                <h3 className="font-serif text-xl font-semibold text-card-foreground">
                  {item.name}
                </h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {item.description}
                </p>
              </div>
              <span className="text-2xl font-bold text-primary whitespace-nowrap">
                {item.price} SAR
                <p className="font-normal text-sm pt-2">inculding tax</p>
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Flame className="h-4 w-4 text-accent" />
                <span>{item.calories} kcal</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-primary" />
                <span>{item.prepTime} min</span>
              </div>
            </div>
          </div>
          <div className="flex mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={onPreview}
              className="w-full sm:w-auto bg-transparent"
            >
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
