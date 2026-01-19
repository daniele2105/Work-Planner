import { AppData, DayData, WeeklyRule, CustomHoliday, DayType } from '../types';

const STORAGE_KEY = 'work-planner-data';

const defaultData: AppData = {
  days: {},
  weeklyRules: [],
  customHolidays: [],
  password: null,
};

export function loadData(): AppData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading data:', error);
  }
  return { ...defaultData };
}

export function saveData(data: AppData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving data:', error);
  }
}

export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getDayData(date: Date, data: AppData): DayData {
  const dateStr = formatDate(date);
  return data.days[dateStr] || {
    date: dateStr,
    type: 'non-working',
  };
}

export function setDayData(date: Date, type: DayType, data: AppData): AppData {
  const dateStr = formatDate(date);
  const newData = { ...data };
  newData.days = { ...newData.days };
  newData.days[dateStr] = {
    date: dateStr,
    type,
  };
  return newData;
}

export function addWeeklyRule(rule: WeeklyRule, data: AppData): AppData {
  const newData = { ...data };
  newData.weeklyRules = [...newData.weeklyRules.filter(
    r => r.dayOfWeek !== rule.dayOfWeek
  ), rule];
  return newData;
}

export function removeWeeklyRule(dayOfWeek: number, data: AppData): AppData {
  const newData = { ...data };
  newData.weeklyRules = newData.weeklyRules.filter(r => r.dayOfWeek !== dayOfWeek);
  return newData;
}

export function addCustomHoliday(holiday: CustomHoliday, data: AppData): AppData {
  const newData = { ...data };
  newData.customHolidays = [...newData.customHolidays.filter(
    h => h.id !== holiday.id
  ), holiday];
  return newData;
}

export function removeCustomHoliday(id: string, data: AppData): AppData {
  const newData = { ...data };
  newData.customHolidays = newData.customHolidays.filter(h => h.id !== id);
  return newData;
}
