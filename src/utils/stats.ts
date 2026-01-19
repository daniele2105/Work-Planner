import { startOfMonth, endOfMonth, eachDayOfInterval, getDay, format } from 'date-fns';
import { it } from 'date-fns/locale/it';
import { DayData, MonthlyStats } from '../types';
import { isItalianHoliday, isCustomHoliday, getHolidayName } from './holidays';
import { getDayData, formatDate } from './storage';
import { AppData } from '../types';

export function calculateMonthlyStats(year: number, month: number, data: AppData): MonthlyStats {
  const start = startOfMonth(new Date(year, month, 1));
  const end = endOfMonth(start);
  const days = eachDayOfInterval({ start, end });
  
  let totalDays = 0;
  let workingDays = 0;
  let smartDays = 0;
  let officeDays = 0;
  let holidayDays = 0;
  let nonWorkingDays = 0;
  
  days.forEach(date => {
    totalDays++;
    const dayData = getDayData(date, data);
    const dayOfWeek = getDay(date);
    
    // Check if it's a weekend (Saturday = 6, Sunday = 0)
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    // Check if it's a holiday (national or custom)
    const isNationalHoliday = isItalianHoliday(date);
    const customHoliday = isCustomHoliday(date, data.customHolidays);
    const isHoliday = isNationalHoliday || !!customHoliday;
    
    // Determine actual type
    let actualType = dayData.type;
    
    // If it's a holiday or weekend, it's non-working unless explicitly set
    if ((isHoliday || isWeekend) && !dayData.type) {
      actualType = 'non-working';
    }
    
    switch (actualType) {
      case 'smart':
        smartDays++;
        workingDays++;
        break;
      case 'office':
        officeDays++;
        workingDays++;
        break;
      case 'holiday':
        holidayDays++;
        break;
      case 'non-working':
      default:
        nonWorkingDays++;
        break;
    }
  });
  
  const smartQuotaExceeded = smartDays > 12;
  
  return {
    totalDays,
    workingDays,
    smartDays,
    officeDays,
    holidayDays,
    nonWorkingDays,
    smartQuotaExceeded,
  };
}

export function exportToCSV(year: number, month: number, data: AppData): string {
  const start = startOfMonth(new Date(year, month, 1));
  const end = endOfMonth(start);
  const days = eachDayOfInterval({ start, end });
  
  const headers = ['Data', 'Giorno', 'Tipo', 'Festività'];
  const rows: string[][] = [headers];
  
  days.forEach(date => {
    const dayData = getDayData(date, data);
    const dateStr = format(date, 'dd/MM/yyyy', { locale: it });
    const dayName = format(date, 'EEEE', { locale: it });
    const typeMap: Record<string, string> = {
      'smart': 'Smart Working',
      'office': 'Ufficio',
      'holiday': 'Ferie',
      'non-working': 'Non Lavorativo',
    };
    const typeStr = typeMap[dayData.type] || 'Non Lavorativo';
    
    // Check for holidays
    const isNationalHoliday = isItalianHoliday(date);
    const customHoliday = isCustomHoliday(date, data.customHolidays);
    let holidayStr = '';
    if (isNationalHoliday) {
      holidayStr = getHolidayName(date) || 'Festività';
    } else if (customHoliday) {
      holidayStr = customHoliday.name;
    }
    
    rows.push([dateStr, dayName, typeStr, holidayStr]);
  });
  
  return rows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
}
