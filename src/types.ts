export type DayType = 'smart' | 'office' | 'holiday' | 'non-working';

export interface DayData {
  date: string; // YYYY-MM-DD format
  type: DayType;
  isHoliday?: boolean;
  isCustomHoliday?: boolean;
  customHolidayName?: string;
}

export interface WeeklyRule {
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  type: DayType;
}

export interface CustomHoliday {
  id: string;
  name: string;
  month: number; // 1-12
  day: number; // 1-31
}

export interface AppData {
  days: Record<string, DayData>; // key: YYYY-MM-DD
  weeklyRules: WeeklyRule[];
  customHolidays: CustomHoliday[];
  password: string | null;
}

export interface MonthlyStats {
  totalDays: number;
  workingDays: number;
  smartDays: number;
  officeDays: number;
  holidayDays: number;
  nonWorkingDays: number;
  smartQuotaExceeded: boolean;
}
