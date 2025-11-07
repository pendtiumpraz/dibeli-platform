import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price)
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'long',
  }).format(new Date(date))
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
}

export function calculateTrialEndDate(startDate: Date): Date {
  const endDate = new Date(startDate)
  endDate.setDate(endDate.getDate() + 14)
  return endDate
}

export function isTrialExpired(trialEndDate: Date): boolean {
  return new Date() > new Date(trialEndDate)
}

export function generateWhatsAppLink(phoneNumber: string, productName: string, price: number): string {
  const message = encodeURIComponent(
    `Halo, saya tertarik dengan:\n\n` +
    `Produk: ${productName}\n` +
    `Harga: ${formatPrice(price)}\n\n` +
    `Apakah masih tersedia?`
  )
  
  return `https://wa.me/${phoneNumber}?text=${message}`
}
