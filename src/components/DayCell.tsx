import { format } from 'date-fns';
import { DayData } from '../types';
import './DayCell.css';

interface DayCellProps {
  date: Date;
  dayData: DayData;
  isHoliday: boolean;
  holidayName: string | null;
  isWeekend: boolean;
  isToday: boolean;
  isSelected: boolean;
  onClick: () => void;
  onTypeChange: (type: DayData['type']) => void;
}

const typeColors: Record<DayData['type'], string> = {
  'smart': '#4CAF50',
  'office': '#2196F3',
  'holiday': '#FF9800',
  'non-working': '#9E9E9E',
};

const typeLabels: Record<DayData['type'], string> = {
  'smart': 'SW',
  'office': 'UF',
  'holiday': 'FE',
  'non-working': 'NL',
};

export function DayCell({
  date,
  dayData,
  isHoliday,
  holidayName,
  isWeekend,
  isToday,
  isSelected,
  onClick,
}: DayCellProps) {
  const dayNumber = format(date, 'd');
  const type = dayData.type || 'non-working';
  const color = typeColors[type];
  const label = typeLabels[type];

  return (
    <div
      className={`day-cell ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${isWeekend ? 'weekend' : ''} ${isHoliday ? 'holiday' : ''}`}
      onClick={onClick}
      style={{ '--day-color': color } as React.CSSProperties}
    >
      <div className="day-number">{dayNumber}</div>
      {type !== 'non-working' && (
        <div className="day-type-badge" style={{ backgroundColor: color }}>
          {label}
        </div>
      )}
      {isHoliday && holidayName && (
        <div className="day-holiday-indicator" title={holidayName}>
          🎉
        </div>
      )}
    </div>
  );
}
