// File location: /src/lib/utils.ts (adding cn function implementation)
import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combine class names with tailwind-merge to avoid conflicts
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date to a locale string
 */
export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Default options
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  
  return dateObj.toLocaleDateString('de-DE', options || defaultOptions);
}

/**
 * Format a date to a relative time string (e.g., "2 days ago")
 */
export function formatRelativeTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
  
  // Less than a minute
  if (diffInSeconds < 60) {
    return 'gerade eben';
  }
  
  // Less than an hour
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `vor ${minutes} ${minutes === 1 ? 'Minute' : 'Minuten'}`;
  }
  
  // Less than a day
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `vor ${hours} ${hours === 1 ? 'Stunde' : 'Stunden'}`;
  }
  
  // Less than a week
  if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `vor ${days} ${days === 1 ? 'Tag' : 'Tagen'}`;
  }
  
  // Less than a month
  if (diffInSeconds < 2592000) {
    const weeks = Math.floor(diffInSeconds / 604800);
    return `vor ${weeks} ${weeks === 1 ? 'Woche' : 'Wochen'}`;
  }
  
  // Less than a year
  if (diffInSeconds < 31536000) {
    const months = Math.floor(diffInSeconds / 2592000);
    return `vor ${months} ${months === 1 ? 'Monat' : 'Monaten'}`;
  }
  
  // More than a year
  const years = Math.floor(diffInSeconds / 31536000);
  return `vor ${years} ${years === 1 ? 'Jahr' : 'Jahren'}`;
}

/**
 * Truncate text to a certain length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

/**
 * Convert a file size in bytes to a human-readable string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Extract file extension from filename
 */
export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || '';
}

/**
 * Detect if the current environment is a browser
 */
export const isBrowser = typeof window !== 'undefined';

/**
 * Sleep for a specified amount of time
 */
export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));