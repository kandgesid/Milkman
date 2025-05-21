import { Platform } from 'react-native';

// Timezone constant - set to US/Los Angeles
const TIMEZONE = 'America/Los_Angeles';

/**
 * Formats a date to YYYY-MM-DD format for API calls
 * @param date The date to format
 * @returns String in YYYY-MM-DD format
 */
export const formatDateForAPI = (date: Date): string => {
  const timeZone = 'America/Los_Angeles';
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return formatter.format(date);
};

/**
 * Creates a date object set to the start of day (00:00:00.000) in local timezone
 * @param date The input date
 * @returns A new Date object set to the start of day
 */
export const formatDateToLocalTimezone = (date: Date): Date => {
  // Extract the date parts in local timezone
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  
  // Create a date with time set to midnight
  return new Date(year, month, day); 
};

/**
 * Creates a date object set to the end of day (23:59:59.999) in local timezone
 * @param date The input date
 * @returns A new Date object set to the end of day
 */
export const formatEndOfDayDateToLocalTimezone = (date: Date): Date => {
  // Extract the date parts in local timezone
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  
  return new Date(year, month, day, 23, 59, 59, 999);
};

/**
 * Formats a date for display in the UI
 * @param date The date to format
 * @returns Formatted date string
 */
export const formatDateForDisplay = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Parses a date string from API (YYYY-MM-DD) to a Date object
 * @param dateString The date string to parse
 * @returns Date object
 */
export const parseDateFromAPI = (dateString: string): Date => {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day, 0, 0, 0, 0);
};

/**
 * Creates a new date object for the current date in local timezone
 * @returns Date object for current date
 */
export const getCurrentDate = (): Date => {
  const now = new Date();
  return new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    0, 0, 0, 0
  );
};

/**
 * Checks if a date is today
 * @param date The date to check
 * @returns boolean indicating if the date is today
 */
export const isToday = (date: Date): boolean => {
  const today = getCurrentDate();
  return date.getTime() === today.getTime();
};

/**
 * Gets the minimum date that can be selected (today)
 * @returns Date object for today
 */
export const getMinimumSelectableDate = (): Date => {
  return getCurrentDate();
}; 