"use client";

import { Phone } from "lucide-react";

interface FloatingCallButtonProps {
  phoneNumber: string;
  label?: string;
}

export default function FloatingCallButton({
  phoneNumber,
  label = "1555",
}: FloatingCallButtonProps) {
  return (
    <a
      href={`tel:${label}`}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 
                 bg-green-600 hover:bg-green-700 
                 text-white px-5 py-3 rounded-full 
                 shadow-lg hover:shadow-xl 
                 transition-all duration-300 
                 animate-bounce"
    >
      <Phone size={15} />
      <span className=" sm:inline font-semibold">{label}</span>
    </a>
  );
}
