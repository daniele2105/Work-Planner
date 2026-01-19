import { eachDayOfInterval, startOfMonth, endOfMonth, getDay } from 'date-fns';
import { AppData } from '../types';
import { isItalianHoliday, isCustomHoliday } from './holidays';
import { setDayData, formatDate } from './storage';

/**
 * Apply weekly rules to a given month.
 * - Does NOT overwrite days that already have a manual override in data.days[YYYY-MM-DD]
 * - Skips weekends and holidays (national + custom)
 */
export function applyWeeklyRules(year: number, month: number, data: AppData): AppData {
  const start = startOfMonth(new Date(year, month, 1));
  const end = endOfMonth(start);
  const days = eachDayOfInterval({ start, end });

  let newData: AppData = { ...data };

  days.forEach((date) => {
    const dayOfWeek = getDay(date); // 0=Sun..6=Sat

    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    if (isWeekend) return;

    const isNationalHoliday = isItalianHoliday(date);
    const customHoliday = isCustomHoliday(date, data.customHolidays);
    const isHoliday = isNationalHoliday || !!customHoliday;
    if (isHoliday) return;

    const dateStr = formatDate(date);
    const isManuallySet = !!data.days?.[dateStr]; // any explicit override -> keep it

    if (isManuallySet) return;

    const rule = data.weeklyRules?.find((r) => r.dayOfWeek === dayOfWeek);
    if (!rule) return;

    newData = setDayData(date, rule.type, newData);
  });

  return newData;
}
