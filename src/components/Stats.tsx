import { useState } from 'react';
import { format, getMonth, getYear } from 'date-fns';
import { AppData } from '../types';
import { calculateMonthlyStats, exportToCSV } from '../utils/stats';
import './Stats.css';

interface StatsProps {
  data: AppData;
  currentDate: Date;
}

export function Stats({ data, currentDate }: StatsProps) {
  const year = getYear(currentDate);
  const month = getMonth(currentDate);
  const stats = calculateMonthlyStats(year, month, data);

  const handleExport = () => {
    const csv = exportToCSV(year, month, data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `work-planner-${year}-${String(month + 1).padStart(2, '0')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="stats-container">
      <h2>Statistiche Mensili</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Giorni Totali</div>
          <div className="stat-value">{stats.totalDays}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Giorni Lavorativi</div>
          <div className="stat-value">{stats.workingDays}</div>
        </div>
        <div className="stat-card smart">
          <div className="stat-label">
            Smart Working
            {stats.smartQuotaExceeded && <span className="warning-badge">⚠️</span>}
          </div>
          <div className={`stat-value ${stats.smartQuotaExceeded ? 'exceeded' : ''}`}>
            {stats.smartDays} / 12
          </div>
          {stats.smartQuotaExceeded && (
            <div className="warning-text">Soglia superata!</div>
          )}
        </div>
        <div className="stat-card">
          <div className="stat-label">Ufficio</div>
          <div className="stat-value">{stats.officeDays}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Ferie</div>
          <div className="stat-value">{stats.holidayDays}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Non Lavorativi</div>
          <div className="stat-value">{stats.nonWorkingDays}</div>
        </div>
      </div>
      <button onClick={handleExport} className="btn-export">
        📥 Esporta CSV
      </button>
    </div>
  );
}
