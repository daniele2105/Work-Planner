import { eachDayOfInterval, startOfMonth, endOfMonth, getDay } from 'date-fns';
import { AppData, DayData, WeeklyRule } from '../types';
import { isItalianHoliday, isCustomHoliday } from './holidays';
import { getDayData, setDayData, formatDate } from './storage';

/**
 * Apply weekly rules to a month
 */
export function applyWeeklyRules(year: number, month: number, data: AppData): AppData {
  const start = startOfMonth(new Date(year, month, 1));
  const end = endOfMonth(start);
  const days = eachDayOfInterval({ start, end });
  
  let newData = { ...data };
  
  days.forEach(date => {
    const dayOfWeek = getDay(date);
    const rule = data.weeklyRules.find(r => r.dayOfWeek === dayOfWeek);
    
    // Don't override if it's a holiday or if day is already manually set
    const dayData = getDayData(date, data);
    const isNationalHoliday = isItalianHoliday(date);
    const customHoliday = isCustomHoliday(date, data.customHolidays);
    const isHoliday = isNationalHoliday || !!customHoliday;
    const dateStr = formatDate(date);
    const isManuallySet = data.days[dateStr] && data.days[dateStr].type !== 'non-working';
    
    if (rule && !isHoliday && !isManuallySet) {
      newData = setDayData(date, rule.type, newData);
    }
  });
  
  return newData;
}
