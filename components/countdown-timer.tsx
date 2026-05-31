"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { useLanguage } from "@/lib/language-context";

interface CountdownTimerProps {
  endDate: string | Date;
  variant?: "default" | "compact";
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
}

function calculateTimeLeft(endDate: string | Date): TimeLeft {
  const end = new Date(endDate).getTime();
  const now = Date.now();
  const diff = end - now;

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    expired: false,
  };
}

export function CountdownTimer({
  endDate,
  variant = "default",
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    setTimeLeft(calculateTimeLeft(endDate));
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(endDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [endDate]);

  if (!timeLeft || timeLeft.expired) return null;

  if (variant === "compact") {
    return (
      <div className="flex items-center gap-1 text-xs text-secondary">
        <Clock className="w-3 h-3" />
        <span>
          {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m
        </span>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground rounded-lg p-3 md:p-4">
      <div className="grid grid-cols-4 gap-2 text-center">
        <div className="bg-white/10 rounded p-2">
          <div className="text-lg md:text-2xl font-bold">
            {String(timeLeft.days).padStart(2, "0")}
          </div>
          <div className="text-[10px] md:text-xs opacity-80">
            {t("Days", "يوم")}
          </div>
        </div>
        <div className="bg-white/10 rounded p-2">
          <div className="text-lg md:text-2xl font-bold">
            {String(timeLeft.hours).padStart(2, "0")}
          </div>
          <div className="text-[10px] md:text-xs opacity-80">
            {t("Hours", "ساعة")}
          </div>
        </div>
        <div className="bg-white/10 rounded p-2">
          <div className="text-lg md:text-2xl font-bold">
            {String(timeLeft.minutes).padStart(2, "0")}
          </div>
          <div className="text-[10px] md:text-xs opacity-80">
            {t("Min", "دقيقة")}
          </div>
        </div>
        <div className="bg-white/10 rounded p-2">
          <div className="text-lg md:text-2xl font-bold">
            {String(timeLeft.seconds).padStart(2, "0")}
          </div>
          <div className="text-[10px] md:text-xs opacity-80">
            {t("Sec", "ثانية")}
          </div>
        </div>
      </div>
    </div>
  );
}
