"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Globe, ChevronLeft, ChevronRight, X, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product, Category, Settings } from "@/types";
import { useLanguage } from "@/lib/language-context";
import { CountdownTimer } from "@/components/countdown-timer";
import { WelcomePopup } from "@/components/welcome-popup";

const fallbackImage =
  "https://i.pinimg.com/originals/df/15/2b/df152b83c5319606e166c3f936943f12.gif";

export default function MenuPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const { language, setLanguage, t, isRtl } = useLanguage();

  const isDiscountActive = (product: Product) => {
    if (!product.discount || product.discount <= 0) return false;

    const now = Date.now();

    if (product.discountStartsAt) {
      const start = new Date(product.discountStartsAt).getTime();
      if (now < start) return false;
    }

    if (product.discountEndsAt) {
      const end = new Date(product.discountEndsAt).getTime();
      if (now > end) return false;
    }

    return true;
  };

  const getDiscountedPrice = (price: number, discount?: number) => {
    if (!discount || discount <= 0) return null;
    return Math.round(price * (1 - discount / 100));
  };

  const getProductCategory = (product: Product) => {
    return product.category || (product as any).categorySlug;
  };

  const getImageSrc = (image?: string | null) => {
    if (!image || typeof image !== "string") return fallbackImage;

    const supportedFormats = [
      ".jpg",
      ".jpeg",
      ".png",
      ".webp",
      ".gif",
      ".avif",
      ".svg",
    ];

    const cleanImage = image.split("?")[0].toLowerCase();

    const isSupported =
      image.startsWith("/") ||
      image.startsWith("http://") ||
      image.startsWith("https://");

    if (!isSupported) return fallbackImage;

    const hasSupportedFormat = supportedFormats.some((format) =>
      cleanImage.endsWith(format),
    );

    return hasSupportedFormat ? image : fallbackImage;
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const [productsRes, categoriesRes, settingsRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/categories"),
          fetch("/api/settings"),
        ]);

        const productsData = await productsRes.json();
        const categoriesData = await categoriesRes.json();
        const settingsData = await settingsRes.json();

        setProducts(Array.isArray(productsData) ? productsData : []);
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
        setSettings(
          settingsData && Object.keys(settingsData).length > 0
            ? settingsData
            : null,
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const dealsProducts = useMemo(() => {
    return products.filter((product) => isDiscountActive(product));
  }, [products]);

  const visibleCategories = useMemo(() => {
    return [...categories]
      .filter((category) =>
        products.some(
          (product) => getProductCategory(product) === category.slug,
        ),
      )
      .sort(() => Math.random() - 0.5);
  }, [categories, products]);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "all") return products;

    if (selectedCategory === "offers") {
      return products.filter((product) => isDiscountActive(product));
    }

    return products.filter(
      (product) => getProductCategory(product) === selectedCategory,
    );
  }, [selectedCategory, products]);

  const scrollCategories = (direction: "left" | "right") => {
    if (categoryScrollRef.current) {
      const scrollAmount = 200;
      const dir = isRtl
        ? direction === "left"
          ? 1
          : -1
        : direction === "left"
          ? -1
          : 1;

      categoryScrollRef.current.scrollBy({
        left: scrollAmount * dir,
        behavior: "smooth",
      });
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "ar" : "en");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const heroTitle =
    language === "ar" && settings?.heroTitleAr
      ? settings.heroTitleAr
      : settings?.heroTitle;

  const heroSubtitle =
    language === "ar" && settings?.heroSubtitleAr
      ? settings.heroSubtitleAr
      : settings?.heroSubtitle;

  const heroContent =
    language === "ar" && settings?.heroContentAr
      ? settings.heroContentAr
      : settings?.heroContent;

  const websiteLogo = settings?.logo || "/warwick-logo.svg";
  const websiteTitle = settings?.restaurantName || "Warwick Restaurant";

  return (
    <div
      className={`min-h-screen bg-background ${isRtl ? "font-arabic" : ""}`}
      dir={isRtl ? "rtl" : "ltr"}
    >
      <WelcomePopup settings={settings} />

      <header className="bg-primary text-primary-foreground sticky top-0 z-30">
        <div className="container mx-auto px-4 py-3 md:py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img
              src={websiteLogo}
              alt={websiteTitle}
              className="h-10 md:h-12 w-auto"
            />
          </Link>

          <Button
            variant="outline"
            size="sm"
            onClick={toggleLanguage}
            className="border-primary-foreground/30 text-primary-foreground bg-transparent hover:bg-primary-foreground/10 hover:text-primary-foreground"
          >
            <Globe className="w-4 h-4 me-2" />
            {language === "en" ? "العربية" : "English"}
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-8 md:mb-10">
          {heroSubtitle && (
            <p className="text-secondary text-sm md:text-base font-medium tracking-wider uppercase mb-2">
              {heroSubtitle}
            </p>
          )}

          <h2 className="text-3xl md:text-4xl font-serif italic text-foreground capitalize mb-3 md:mb-4">
            {heroTitle || t("Our Menu", "قائمتنا")}
          </h2>

          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto px-4 leading-relaxed capitalize">
            {heroContent ||
              t(
                "Discover our carefully crafted dishes made with the finest ingredients. Each item shows calories, preparation time, and price in SAR.",
                "اكتشف أطباقنا المصنوعة بعناية من أجود المكونات. يعرض كل عنصر السعرات الحرارية ووقت التحضير والسعر بالريال السعودي.",
              )}
          </p>
        </div>

        <div className="relative flex items-center mb-8 md:mb-10">
          <button
            onClick={() => scrollCategories("left")}
            className="absolute start-0 z-10 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-background border border-border rounded-full shadow-sm hover:bg-muted"
            aria-label="Scroll left"
          >
            {isRtl ? (
              <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
            ) : (
              <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
            )}
          </button>

          <div
            ref={categoryScrollRef}
            className="flex gap-2 md:gap-3 overflow-x-auto scrollbar-hide mx-10 md:mx-12 py-2"
          >
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 md:px-6 py-1.5 md:py-2 rounded-full border whitespace-nowrap transition-colors text-sm md:text-base ${
                selectedCategory === "all"
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-foreground border-border hover:border-primary"
              }`}
            >
              {t("All", "الكل")}
            </button>

            {dealsProducts.length > 0 && (
              <button
                onClick={() => setSelectedCategory("offers")}
                className={`px-4 md:px-6 py-1.5 md:py-2 rounded-full border whitespace-nowrap transition-colors text-sm md:text-base flex items-center gap-1.5 ${
                  selectedCategory === "offers"
                    ? "bg-secondary text-secondary-foreground border-secondary"
                    : "bg-secondary/10 text-secondary border-secondary/50 hover:border-secondary"
                }`}
              >
                <Flame className="w-4 h-4" />
                {t("Offers", "العروض")}
                <span className="bg-white/20 text-xs px-1.5 py-0.5 rounded-full">
                  {dealsProducts.length}
                </span>
              </button>
            )}

            {visibleCategories.map((category) => (
              <button
                key={category.slug}
                onClick={() => setSelectedCategory(category.slug)}
                className={`px-4 md:px-6 py-1.5 md:py-2 rounded-full border whitespace-nowrap transition-colors text-sm md:text-base ${
                  selectedCategory === category.slug
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-foreground border-border hover:border-primary"
                }`}
              >
                {language === "ar" && category.nameAr
                  ? category.nameAr
                  : category.name}
              </button>
            ))}
          </div>

          <button
            onClick={() => scrollCategories("right")}
            className="absolute end-0 z-10 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-background border border-border rounded-full shadow-sm hover:bg-muted"
            aria-label="Scroll right"
          >
            {isRtl ? (
              <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
            ) : (
              <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
            )}
          </button>
        </div>

        {selectedCategory === "offers" &&
          settings?.dealsCountdown?.enabled &&
          settings?.dealsCountdown?.endDate && (
            <div className="mb-6 md:mb-8 bg-[#2E304C] border border-secondary/30 rounded-xl md:p-6 text-center">
              <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-6">
                <div className="flex items-center gap-2 text-secondary">
                  <Flame className="w-5 h-5 md:w-6 md:h-6" />
                  <span className="font-semibold text-base md:text-lg">
                    {t("Limited Time Offers!", "عروض لفترة محدودة!")}
                  </span>
                </div>

                <div className="text-foreground">
                  <CountdownTimer endDate={settings.dealsCountdown.endDate} />
                </div>
              </div>
            </div>
          )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {filteredProducts.map((product) => {
            const activeDiscount = isDiscountActive(product);
            const discountedPrice = activeDiscount
              ? getDiscountedPrice(product.price, product.discount)
              : null;

            return (
              <button
                key={product._id?.toString()}
                onClick={() => setSelectedProduct(product)}
                className="flex gap-3 md:gap-4 p-3 md:p-4 rounded-lg shadow-2xs hover:bg-muted/50 cursor-pointer transition-colors text-start"
              >
                <div className="relative w-24 h-24 md:w-32 md:h-32 flex-shrink-0">
                  <Image
                    src={getImageSrc(product.image)}
                    alt={
                      language === "ar" && product.nameAr
                        ? product.nameAr
                        : product.name
                    }
                    fill
                    className="object-cover rounded-lg"
                    onError={(e) => {
                      e.currentTarget.src = fallbackImage;
                    }}
                  />

                  {activeDiscount && (
                    <span className="absolute top-1 start-1 md:top-2 md:start-2 bg-primary text-primary-foreground text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 md:py-1 rounded">
                      -{product.discount}%
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-semibold text-foreground text-sm md:text-base line-clamp-1">
                      {language === "ar" && product.nameAr
                        ? product.nameAr
                        : product.name}
                    </h3>

                    <div className="flex flex-col items-end flex-shrink-0">
                      {discountedPrice ? (
                        <>
                          <span className="font-semibold text-primary text-sm md:text-base whitespace-nowrap">
                            {discountedPrice} {t("SAR", "ر.س")}
                          </span>
                          <span className="text-xs text-muted-foreground line-through whitespace-nowrap">
                            {product.price} {t("SAR", "ر.س")}
                          </span>
                        </>
                      ) : (
                        <span className="font-semibold text-foreground text-sm md:text-base whitespace-nowrap">
                          {product.price} {t("SAR", "ر.س")}
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs md:text-sm text-muted-foreground mt-1 line-clamp-2">
                    {language === "ar" && product.descriptionAr
                      ? product.descriptionAr
                      : product.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            {t(
              "No items found in this category.",
              "لا توجد عناصر في هذه الفئة.",
            )}
          </div>
        )}
      </main>

      {selectedProduct && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className={`bg-background rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto ${
              isRtl ? "font-arabic" : ""
            }`}
            onClick={(e) => e.stopPropagation()}
            dir={isRtl ? "rtl" : "ltr"}
          >
            <div className="relative h-56 md:h-72 overflow-hidden rounded-t-2xl">
              <Image
                src={getImageSrc(selectedProduct.image)}
                alt={
                  language === "ar" && selectedProduct.nameAr
                    ? selectedProduct.nameAr
                    : selectedProduct.name
                }
                fill
                className="object-cover transition-transform duration-500 hover:scale-105"
                onError={(e) => {
                  e.currentTarget.src = fallbackImage;
                }}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              <div className="absolute top-4 start-4 flex items-center gap-2 z-20">
                <span className="backdrop-blur-md bg-[#2E304C] border border-white/20 text-white px-3 py-1 rounded-full text-xs md:text-sm font-medium shadow-lg">
                  {categories.find(
                    (cat) => cat.slug === getProductCategory(selectedProduct),
                  )
                    ? language === "ar" &&
                      categories.find(
                        (cat) =>
                          cat.slug === getProductCategory(selectedProduct),
                      )?.nameAr
                      ? categories.find(
                          (cat) =>
                            cat.slug === getProductCategory(selectedProduct),
                        )?.nameAr
                      : categories.find(
                          (cat) =>
                            cat.slug === getProductCategory(selectedProduct),
                        )?.name
                    : getProductCategory(selectedProduct)}
                </span>

                {isDiscountActive(selectedProduct) &&
                  selectedProduct.discount && (
                    <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs md:text-sm font-bold shadow-lg animate-pulse">
                      🔥 {selectedProduct.discount}% OFF
                    </span>
                  )}
              </div>

              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 end-4 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-[#2E304C] transition-all duration-300 z-20 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 start-4 end-4 z-20">
                <h3 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">
                  {language === "ar" && selectedProduct.nameAr
                    ? selectedProduct.nameAr
                    : selectedProduct.name}
                </h3>
              </div>
            </div>

            <div className="p-4 md:p-6">
              {(selectedProduct.price ||
                selectedProduct.calories ||
                selectedProduct.cookTime) && (
                <div className="grid grid-cols-3 sm:grid-cols-3 gap-2 md:gap-4 mb-4 md:mb-6">
                  {selectedProduct.price && (
                    <div className="text-center p-2 md:p-4 bg-muted rounded-lg">
                      <p className="text-[10px] md:text-sm text-muted-foreground mb-1">
                        {t("Price", "السعر")}
                      </p>

                      {isDiscountActive(selectedProduct) ? (
                        <div>
                          <p className="font-bold text-primary text-sm md:text-base">
                            {getDiscountedPrice(
                              selectedProduct.price,
                              selectedProduct.discount,
                            )}{" "}
                            {t("SAR", "ر.س")}
                          </p>
                          <p className="text-[10px] md:text-xs text-muted-foreground line-through">
                            {selectedProduct.price} {t("SAR", "ر.س")}
                          </p>
                        </div>
                      ) : (
                        <p className="font-bold text-foreground text-sm md:text-base">
                          {selectedProduct.price} {t("SAR", "ر.س")}
                        </p>
                      )}
                    </div>
                  )}

                  {selectedProduct.calories && (
                    <div className="text-center p-2 md:p-4 bg-muted rounded-lg">
                      <p className="text-[10px] md:text-sm text-muted-foreground mb-1">
                        {t("Calories", "سعرات")}
                      </p>
                      <p className="font-bold text-foreground text-sm md:text-base">
                        {selectedProduct.calories} {t("kcal", "سعرة")}
                      </p>
                    </div>
                  )}

                  {selectedProduct.cookTime && (
                    <div className="text-center p-2 md:p-4 bg-muted rounded-lg">
                      <p className="text-[10px] md:text-sm text-muted-foreground mb-1">
                        {t("Cook Time", "وقت الطهي")}
                      </p>
                      <p className="font-bold text-foreground text-sm md:text-base">
                        {selectedProduct.cookTime} {t("min", "د")}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {(language === "ar" && selectedProduct.descriptionAr
                ? selectedProduct.descriptionAr
                : selectedProduct.description) && (
                <div className="mb-4 md:mb-6">
                  <h4 className="font-semibold text-foreground mb-2 text-sm md:text-base">
                    {t("Description", "الوصف")}
                  </h4>
                  <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                    {language === "ar" && selectedProduct.descriptionAr
                      ? selectedProduct.descriptionAr
                      : selectedProduct.description}
                  </p>
                </div>
              )}

              {(language === "ar" &&
              selectedProduct.ingredientsAr &&
              selectedProduct.ingredientsAr.length > 0
                ? selectedProduct.ingredientsAr
                : selectedProduct.ingredients
              )?.length > 0 && (
                <div>
                  <h4 className="font-semibold text-foreground mb-2 md:mb-3 text-sm md:text-base">
                    {t("Ingredients", "المكونات")}
                  </h4>

                  <div className="flex flex-wrap gap-1.5 md:gap-2">
                    {(language === "ar" &&
                    selectedProduct.ingredientsAr &&
                    selectedProduct.ingredientsAr.length > 0
                      ? selectedProduct.ingredientsAr
                      : selectedProduct.ingredients
                    ).map((ingredient, index) => (
                      <span
                        key={index}
                        className="px-2.5 md:px-4 py-1 md:py-2 bg-[#2E304C] text-white rounded-full text-xs md:text-sm cursor-pointer"
                      >
                        {ingredient}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <footer className="bg-primary text-primary-foreground mt-12 md:mt-16">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-4 text-center md:text-start">
            <p className="text-sm text-primary-foreground/60">
              &copy; Copyright All rights reserved - {new Date().getFullYear()}{" "}
              {websiteTitle}{" "}
              <a
                className="text-white font-bold"
                href="https://www.facebook.com/devs.sayeed"
                target="_blank"
                rel="noopener noreferrer"
              >
                Develop by Riday
              </a>
            </p>

            <div className="flex items-center justify-center md:justify-end gap-3">
              {settings?.facebookUrl && (
                <a
                  href={settings.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:opacity-80 transition"
                  aria-label="Facebook"
                >
                  Facebook
                </a>
              )}

              {settings?.instagramUrl && (
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:opacity-80 transition"
                  aria-label="Instagram"
                >
                  Instagram
                </a>
              )}

              {settings?.tiktokUrl && (
                <a
                  href={settings.tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:opacity-80 transition"
                  aria-label="TikTok"
                >
                  TikTok
                </a>
              )}

              {settings?.youtubeUrl && (
                <a
                  href={settings.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:opacity-80 transition"
                  aria-label="YouTube"
                >
                  YouTube
                </a>
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
