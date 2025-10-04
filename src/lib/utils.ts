import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// RTL-aware price formatting with Arabic numerals option
export function formatPrice(price: number, useArabicNumerals = false): string {
  const formatter = new Intl.NumberFormat("ar-SA", {
    style: "currency",
    currency: "SAR", // Saudi Riyal for GCC region
    currencyDisplay: "symbol",
  });
  
  let formatted = formatter.format(price);
  
  if (useArabicNumerals) {
    // Convert Western Arabic numerals to Eastern Arabic numerals
    formatted = formatted.replace(/[0-9]/g, (digit) => {
      const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
      return arabicDigits[parseInt(digit)];
    });
  }
  
  return formatted;
}

// Arabic date formatting
export function formatDate(date: string): string {
  return new Intl.DateTimeFormat("ar-SA", {
    year: "numeric",
    month: "long",
    day: "numeric",
    calendar: "gregorian",
  }).format(new Date(date));
}

// RTL-aware order number generation
export function generateOrderNumber(): string {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `طلب-${timestamp.slice(-6)}-${random}`;
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// RTL-aware text truncation
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

// RTL direction utility
export function getRTLDirection(): "rtl" | "ltr" {
  return "rtl"; // Always RTL for this implementation
}

// Arabic text utilities
export function isArabicText(text: string): boolean {
  const arabicRegex = /[\u0600-\u06FF]/;
  return arabicRegex.test(text);
}

// RTL-aware spacing utility
export function getRTLSpacing(direction: "start" | "end"): string {
  return direction === "start" ? "mr" : "ml";
}

// Currency symbol for GCC region
export function getCurrencySymbol(): string {
  return "ر.س"; // Saudi Riyal symbol
}
