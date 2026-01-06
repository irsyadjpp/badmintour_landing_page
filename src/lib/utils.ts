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


export const isValidIndonesianPhoneNumber = (phone: string): boolean => {
  // Remove non-digit characters
  const clean = phone.replace(/\D/g, '');

  // Regex: 
  // ^628... or ^08...
  // Length: Min 10 digits (including prefix), Max 14 digits
  // Example: 08123456789 (11 digits), 628123456789 (12 digits)
  const regex = /^(?:\+?62|0)8[1-9][0-9]{6,11}$/;

  return regex.test(clean);
};

export const formatIndonesianPhoneNumber = (phone: string): string => {
  let clean = phone.replace(/\D/g, '');

  // Normalize 08 -> 628
  if (clean.startsWith('08')) {
    clean = '62' + clean.slice(1);
  }

  return clean;
};

