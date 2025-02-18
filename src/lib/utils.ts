import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


type CurrencyCode = "USD" | "INR"

export const formatPrice = (price: number, currency: CurrencyCode = "INR") => {
  
  if(currency === "INR") {
    const formatter = new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    })
    return formatter.format(price * 84 / 100)
  }
  
  if(currency === "USD"){
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    })
    return formatter.format(price / 100)
  }

}