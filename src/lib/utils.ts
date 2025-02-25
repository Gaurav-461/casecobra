import { clsx, type ClassValue } from "clsx"
import { Metadata } from "next"
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

export function constructMetadata({
  title = 'CaseCobra - custom high-quality phone cases',
  description = 'Create custom high-quality phone cases in seconds',
  image = '/thumbnail.png',
  icons = '/favicon.ico',
}: {
  title?: string
  description?: string
  image?: string
  icons?: string
} = {}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: image }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
    icons,
    metadataBase: new URL("https://casecobra-rouge-delta.vercel.app/")
  }
}