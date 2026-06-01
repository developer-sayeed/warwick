"use client";

import { useEffect, useState } from "react";
import { X, Gift, Copy, Check } from "lucide-react";
import { Settings } from "@/types";
import { useLanguage } from "@/lib/language-context";
import { toast } from "react-toastify";

interface WelcomePopupProps {
  settings: Settings | null;
}

const POPUP_COOLDOWN_KEY = "welcomePopupClosedAt";
const POPUP_COOLDOWN_MINUTES = 10;

export function WelcomePopup({ settings }: WelcomePopupProps) {
  const [show, setShow] = useState(false);
  const [copied, setCopied] = useState(false);
  const { language, t, isRtl } = useLanguage();

  useEffect(() => {
    if (!settings?.welcomePopup?.enabled) return;

    // Check if popup was closed within the last 10 minutes
    const closedAt = localStorage.getItem(POPUP_COOLDOWN_KEY);
    if (closedAt) {
      const closedTime = parseInt(closedAt, 10);
      const now = Date.now();
      const minutesSinceClosed = (now - closedTime) / (1000 * 60);
      if (minutesSinceClosed < POPUP_COOLDOWN_MINUTES) {
        return; // Don't show popup
      }
    }

    // Show popup after 1 second delay
    const timer = setTimeout(() => setShow(true), 1000);
    return () => clearTimeout(timer);
  }, [settings]);

  const handleClose = () => {
    setShow(false);
    // Store the time when popup was closed
    localStorage.setItem(POPUP_COOLDOWN_KEY, Date.now().toString());
  };

  const handleCopy = () => {
    const code = settings?.welcomePopup?.codeText || "";
    if (!code) return;
    const codeMatch = code.match(/[A-Z0-9]+/i);
    const codeText = codeMatch ? codeMatch[0] : code;
    navigator.clipboard.writeText(codeText);
    setCopied(true);
    toast.success(t("Code copied!", "تم نسخ الكود!"));
    setTimeout(() => setCopied(false), 2000);
  };

  if (!show || !settings?.welcomePopup?.enabled) return null;

  const popup = settings.welcomePopup;

  return (
    <div
      className="fixed inset-0  bg-black/60 flex items-center justify-center z-50 p-4 animate-in fade-in duration-300"
      onClick={handleClose}
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div
        className={`bg-background rounded-2xl max-w-md w-full overflow-hidden  shadow-2xl ${isRtl ? "font-arabic" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-br from-primary via-primary to-primary/80 text-primary-foreground p-6 md:p-8 text-center relative">
          <button
            onClick={handleClose}
            className="absolute top-3 end-3 w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Gift className="w-8 h-8 text-secondary " />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            {language === "ar" && popup.titleAr ? popup.titleAr : popup.title}
          </h2>
          <p className="text-sm md:text-base opacity-90">
            {language === "ar" && popup.subtitleAr
              ? popup.subtitleAr
              : popup.subtitle}
          </p>
        </div>

        <div className="p-6 md:p-8 text-center">
          <div className="bg-secondary/10 border-2 border-dashed border-secondary rounded-lg p-4 mb-4">
            <p className="text-3xl md:text-4xl font-bold text-secondary mb-2">
              {language === "ar" && popup.discountTextAr
                ? popup.discountTextAr
                : popup.discountText}
            </p>
            {popup.codeText && (
              <span className="font-mono text-2xl font-medium text-primary">
                {popup.codeText}
              </span>
              // <button
              //   onClick={handleCopy}
              //   className="flex items-center gap-2 mx-auto text-xs md:text-sm text-foreground bg-background border border-border rounded-md px-3 py-1.5 hover:bg-muted transition-colors"
              // >
              //   <span className="font-mono">{popup.codeText}</span>
              //   {copied ? (
              //     <Check className="w-3.5 h-3.5 text-green-600" />
              //   ) : (
              //     <Copy className="w-3.5 h-3.5" />
              //   )}
              // </button>
            )}
          </div>
          <p className="text-sm md:text-base text-muted-foreground">
            {language === "ar" && popup.messageAr
              ? popup.messageAr
              : popup.message}
          </p>
          <button
            onClick={handleClose}
            className="mt-6 w-full cursor-pointer bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            {t("Close for 10 minutes", "إغلاق لمدة 10 دقائق")}
          </button>
        </div>
      </div>
    </div>
  );
}
