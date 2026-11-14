import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind classes safely without style conflicts.
 * Example: cn("p-4", isHovered && "bg-blue-600", className)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
