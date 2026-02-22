"use client";

import Image from "next/image";
import { useState } from "react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-primary text-primary-foreground shadow-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-center">
          {/* Centered Logo */}
          <div className="flex items-center gap-3">
            <Image
              src="https://image-tc.galaxy.tf/wisvg-cdprptjd6y51ekf7yn1bbwxd7/corporate-logo-white.svg?width=600"
              alt="Warwick Hotel"
              width={100}
              height={400}
              priority
            />
            {/* <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent">
              <span className="font-serif text-2xl font-bold text-primary">W</span>
            </div>
            <div>
              <h1 className="font-serif text-2xl font-bold tracking-wide">Warwick</h1>
              <p className="text-xs text-primary-foreground/70">Fine Dining</p>
            </div> */}
          </div>
        </div>
      </div>
    </header>
  );
}
