import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combines multiple class names or conditional class objects and merges Tailwind CSS classes cleanly.
 * @param {...any} inputs - Class names, arrays, or objects
 * @returns {string} Merged class string
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export default cn

