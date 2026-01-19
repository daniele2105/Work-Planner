import { useState } from 'react';
import { startOfMonth, endOfMonth, eachDayOfInterval, format, getDay, addMonths, subMonths, isToday } from 'date-fns';
import it from 'date-fns/locale/it';
import { AppData, DayType } from '../types';
import { getDayData, setDayData, formatDate } from '../utils/storage';
import { isItalianHoliday, getHolidayName, isCustomHoliday } from '../utils/holidays';
import { applyWeeklyRules } from '../utils/rules';
import { DayCell } from './DayCell';
import './Calendar.css';

interface CalendarProps {
  data: AppData;
  onDataChange: (data: AppData) => void;
  onDateChange?: (date: Date) => void;
}

export function Calendar({ data, onDataChange, onDateChange }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleDateChange = (date: Date) => {
    setCurrentDate(date);
    onDateChange?.(date);
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const start = startOfMonth(currentDate);
  const end = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start, end });

  // Get first day of week for the month
  const firstDayOfWeek = getDay(start);
  const emptyDays = Array(firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1).fill(null);

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
  };

  const handleDayTypeChange = (date: Date, type: DayType) => {
    const newData = setDayData(date, type, data);
    onDataChange(newData);
    setSelectedDate(null);
  };

  const handleApplyRules = () => {
    const newData = applyWeeklyRules(year, month, data);
    onDataChange(newData);
  };

  const monthName = format(currentDate, 'MMMM yyyy', { locale: it });

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button onClick={() => handleDateChange(subMonths(currentDate, 1))} className="btn-nav">
          ←
        </button>
        <h2 className="month-title">{monthName}</h2>
        <button onClick={() => handleDateChange(addMonths(currentDate, 1))} className="btn-nav">
          →
        </button>
      </div>

      {data.weeklyRules.length > 0 && (
        <div className="rules-info">
          <span>Regole settimanali attive</span>
          <button onClick={handleApplyRules} className="btn-apply-rules">
            Applica Regole
          </button>
        </div>
      )}

      <div className="calendar-grid">
        <div className="calendar-weekdays">
          {['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'].map(day => (
            <div key={day} className="weekday">{day}</div>
          ))}
        </div>
        <div className="calendar-days">
          {emptyDays.map((_, i) => (
            <div key={`empty-${i}`} className="day-cell empty"></div>
          ))}
          {days.map(date => {
            const dayData = getDayData(date, data);
            const isNationalHoliday = isItalianHoliday(date);
            const customHoliday = isCustomHoliday(date, data.customHolidays);
            const isHoliday = isNationalHoliday || !!customHoliday;
            const holidayName = isNationalHoliday 
              ? getHolidayName(date) 
              : customHoliday?.name || null;
            const dayOfWeek = getDay(date);
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
            
            return (
              <DayCell
                key={formatDate(date)}
                date={date}
                dayData={dayData}
                isHoliday={isHoliday}
                holidayName={holidayName}
                isWeekend={isWeekend}
                isToday={isToday(date)}
                isSelected={selectedDate ? formatDate(selectedDate) === formatDate(date) : false}
                onClick={() => handleDayClick(date)}
                onTypeChange={(type) => handleDayTypeChange(date, type)}
              />
            );
          })}
        </div>
      </div>

      {selectedDate && (
        <div className="day-selector-overlay" onClick={() => setSelectedDate(null)}>
          <div className="day-selector" onClick={(e) => e.stopPropagation()}>
            <h3>{format(selectedDate, 'EEEE d MMMM yyyy', { locale: it })}</h3>
            <div className="type-buttons">
              <button
                className={`type-btn ${getDayData(selectedDate, data).type === 'smart' ? 'active' : ''}`}
                onClick={() => handleDayTypeChange(selectedDate, 'smart')}
              >
                📱 Smart Working
              </button>
              <button
                className={`type-btn ${getDayData(selectedDate, data).type === 'office' ? 'active' : ''}`}
                onClick={() => handleDayTypeChange(selectedDate, 'office')}
              >
                🏢 Ufficio
              </button>
              <button
                className={`type-btn ${getDayData(selectedDate, data).type === 'holiday' ? 'active' : ''}`}
                onClick={() => handleDayTypeChange(selectedDate, 'holiday')}
              >
                🏖️ Ferie
              </button>
              <button
                className={`type-btn ${getDayData(selectedDate, data).type === 'non-working' ? 'active' : ''}`}
                onClick={() => handleDayTypeChange(selectedDate, 'non-working')}
              >
                ❌ Non Lavorativo
              </button>
            </div>
            <button className="btn-close" onClick={() => setSelectedDate(null)}>
              Chiudi
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
