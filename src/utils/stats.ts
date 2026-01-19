import { startOfMonth, endOfMonth, eachDayOfInterval, getDay, format } from 'date-fns';
import it from 'date-fns/locale/it';
import { AppData, MonthlyStats, DayType } from '../types';
import { isItalianHoliday, isCustomHoliday, getHolidayName } from './holidays';
import { getDayData, formatDate } from './storage';

const TYPE_LABEL: Record<DayType, string> = {
  smart: 'Smart Working',
  office: 'Ufficio',
  holiday: 'Ferie',
  'non-working': 'Non Lavorativo',
};

export function calculateMonthlyStats(year: number, month: number, data: AppData): MonthlyStats {
  const start = startOfMonth(new Date(year, month, 1));
  const end = endOfMonth(start);
  const days = eachDayOfInterval({ start, end });

  let totalDays = 0;
  let workingDays = 0; // potential working days: Mon-Fri excluding holidays (national + custom)
  let smartDays = 0;
  let officeDays = 0;
  let holidayDays = 0; // FERIE
  let nonWorkingDays = 0; // weekends + national/custom holidays + explicit non-working

  days.forEach((date) => {
    totalDays += 1;

    const dayOfWeek = getDay(date); // 0=Sun..6=Sat
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    const isNationalHoliday = isItalianHoliday(date);
    const customHoliday = isCustomHoliday(date, data.customHolidays);
    const isHoliday = isNationalHoliday || !!customHoliday;

    const dayData = getDayData(date, data);

    // Potential working day (Mon-Fri excluding holidays)
    if (!isWeekend && !isHoliday) {
      workingDays += 1;
    }

    // Count explicit day types
    if (dayData?.type === 'smart') smartDays += 1;
    else if (dayData?.type === 'office') officeDays += 1;
    else if (dayData?.type === 'holiday') holidayDays += 1;

    // Non-working bucket (weekend OR holiday OR explicit non-working)
    if (isWeekend || isHoliday || dayData?.type === 'non-working') {
      nonWorkingDays += 1;
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

  const header = ['Data', 'Giorno', 'Tipo', 'Festivo', 'NomeFestivita'].join(',');

  const rows = days.map((date) => {
    const dateISO = formatDate(date);
    const weekdayName = format(date, 'EEEE', { locale: it });

    const isNationalHoliday = isItalianHoliday(date);
    const customHoliday = isCustomHoliday(date, data.customHolidays);
    const isHoliday = isNationalHoliday || !!customHoliday;

    const holidayName = isNationalHoliday ? getHolidayName(date) : customHoliday?.name ?? '';

    const dayData = getDayData(date, data);
    const tipo = isHoliday ? 'Festività' : (dayData?.type ? TYPE_LABEL[dayData.type] : '');

    const festivo = isHoliday ? 'S' : 'N';

    // CSV safe: wrap fields with quotes, escape quotes
    const esc = (v: string) => `"${String(v).replace(/"/g, '""')}"`;

    return [dateISO, weekdayName, tipo, festivo, holidayName].map(esc).join(',');
  });

  return [header, ...rows].join('\n');
}
