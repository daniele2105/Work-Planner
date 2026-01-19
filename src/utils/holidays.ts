import { getYear, getMonth, getDate, isSameDay, addDays } from 'date-fns';
import { CustomHoliday } from '../types';

/**
 * Calculate Easter date using the Computus algorithm
 */
function calculateEaster(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  
  return new Date(year, month - 1, day);
}

/**
 * Get all Italian national holidays for a given year
 */
export function getItalianHolidays(year: number): Date[] {
  const holidays: Date[] = [];
  
  // Fixed holidays
  holidays.push(new Date(year, 0, 1));   // Capodanno
  holidays.push(new Date(year, 0, 6));   // Epifania
  holidays.push(new Date(year, 3, 25));  // Liberazione
  holidays.push(new Date(year, 4, 1));    // Festa del Lavoro
  holidays.push(new Date(year, 5, 2));    // Festa della Repubblica
  holidays.push(new Date(year, 7, 15));  // Ferragosto
  holidays.push(new Date(year, 10, 1));   // Tutti i Santi
  holidays.push(new Date(year, 11, 8));   // Immacolata Concezione
  holidays.push(new Date(year, 11, 25));  // Natale
  holidays.push(new Date(year, 11, 26)); // Santo Stefano
  
  // Variable holidays (Easter-based)
  const easter = calculateEaster(year);
  holidays.push(easter); // Pasqua
  holidays.push(addDays(easter, 1)); // Lunedì dell'Angelo (Pasquetta)
  
  return holidays;
}

/**
 * Check if a date is an Italian national holiday
 */
export function isItalianHoliday(date: Date): boolean {
  const year = getYear(date);
  const holidays = getItalianHolidays(year);
  return holidays.some(holiday => isSameDay(holiday, date));
}

/**
 * Get holiday name for a date
 */
export function getHolidayName(date: Date): string | null {
  const year = getYear(date);
  const month = getMonth(date);
  const day = getDate(date);
  
  const holidayNames: Record<string, string> = {
    [`${year}-1-1`]: 'Capodanno',
    [`${year}-1-6`]: 'Epifania',
    [`${year}-4-25`]: 'Liberazione',
    [`${year}-5-1`]: 'Festa del Lavoro',
    [`${year}-6-2`]: 'Festa della Repubblica',
    [`${year}-8-15`]: 'Ferragosto',
    [`${year}-11-1`]: 'Tutti i Santi',
    [`${year}-12-8`]: 'Immacolata Concezione',
    [`${year}-12-25`]: 'Natale',
    [`${year}-12-26`]: 'Santo Stefano',
  };
  
  const easter = calculateEaster(year);
  if (isSameDay(date, easter)) {
    return 'Pasqua';
  }
  if (isSameDay(date, addDays(easter, 1))) {
    return 'Lunedì dell\'Angelo';
  }
  
  return holidayNames[`${year}-${month + 1}-${day}`] || null;
}

/**
 * Check if a date matches a custom holiday
 */
export function isCustomHoliday(date: Date, customHolidays: CustomHoliday[]): CustomHoliday | null {
  const month = getMonth(date) + 1; // getMonth returns 0-11
  const day = getDate(date);
  
  return customHolidays.find(h => h.month === month && h.day === day) || null;
}
