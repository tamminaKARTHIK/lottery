import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatApt(amount: number | bigint): string {
  const APT_DECIMALS = 8;
  const amountBigInt = BigInt(amount);
  const wholePart = amountBigInt / BigInt(10 ** APT_DECIMALS);
  const fractionalPart = amountBigInt % BigInt(10 ** APT_DECIMALS);
  
  const formattedFractionalPart = fractionalPart.toString().padStart(APT_DECIMALS, '0');
  const trimmedFractionalPart = formattedFractionalPart.replace(/0+$/, '');

  if (trimmedFractionalPart === '') {
    return wholePart.toString();
  }

  return `${wholePart}.${trimmedFractionalPart}`;
}

export const formatTime = (seconds: number): string => {
  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  return `${days}d ${hours}h ${minutes}m ${remainingSeconds}s`;
};