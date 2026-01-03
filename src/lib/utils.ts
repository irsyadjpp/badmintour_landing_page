import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatRupiah = (number: number | string) => {
  if (number === '' || number === undefined || number === null) return '';
  const num = typeof number === 'string' ? Number(number.replace(/\D/g, '')) : number;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
};

export const cleanCurrency = (formatted: string) => {
  return formatted.replace(/\D/g, '');
}

