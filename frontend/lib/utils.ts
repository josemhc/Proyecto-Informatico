import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const emailDominio = /^[\w.-]+@[a-zA-Z\d-]+(\.[a-zA-Z\d-]+)+$/;
