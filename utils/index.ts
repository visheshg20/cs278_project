import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isIOS() {
  return /iPad|iPhone|iPod|Android/.test(navigator.userAgent);
}

export function getNextWednesdayAt6PM() {
  const now = new Date();
  const dayOfWeek = now.getDay(); // Sunday - Saturday : 0 - 6
  let nextWednesday = new Date(now);

  // Calculate days until next Wednesday
  let daysUntilNextWednesday = (3 - dayOfWeek + 7) % 7;

  // If today is Wednesday and the current time is before 6 PM
  if (dayOfWeek === 3 && now.getHours() < 23) {
    daysUntilNextWednesday = 0;
  } else if (dayOfWeek === 3 && now.getHours() >= 23) {
    // If today is Wednesday and the current time is after 6 PM, set to next Wednesday
    daysUntilNextWednesday = 7;
  } else if (daysUntilNextWednesday === 0) {
    // If we are on the same day after 6 PM, set to next Wednesday
    daysUntilNextWednesday = 7;
  }

  nextWednesday.setDate(now.getDate() + daysUntilNextWednesday);
  nextWednesday.setHours(23, 0, 0, 0); // Set to 6:00 PM

  return nextWednesday;
}

export const padZero = (num: number) => num.toString().padStart(2, "0");

export const SECONDS_PER_DAY = 86400;
