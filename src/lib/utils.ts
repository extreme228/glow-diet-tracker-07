
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  };
  return new Date(dateString).toLocaleDateString('pt-BR', options);
}

export function formatTime(timeString: string): string {
  // Expected format: "HH:MM"
  return timeString;
}

export function formatDateYYYYMMDD(date: Date): string {
  // Format date as YYYY-MM-DD
  return date.toISOString().split('T')[0];
}

export function getToday(): string {
  return formatDateYYYYMMDD(new Date());
}

export function getNutrientColor(nutrient: string): string {
  switch (nutrient.toLowerCase()) {
    case 'protein':
    case 'proteína':
    case 'proteinas':
    case 'proteínas':
      return 'nutritrack-green';
    case 'carbs':
    case 'carboidratos':
    case 'carbo':
    case 'carboidrato':
      return 'nutritrack-blue';
    case 'fat':
    case 'gordura':
    case 'gorduras':
      return 'nutritrack-purple';
    default:
      return 'white';
  }
}
