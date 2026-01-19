import { useState } from 'react';
import { AppData, WeeklyRule, CustomHoliday, DayType } from '../types';
import { addWeeklyRule, removeWeeklyRule, addCustomHoliday, removeCustomHoliday } from '../utils/storage';
import './Settings.css';

interface SettingsProps {
  data: AppData;
  onDataChange: (data: AppData) => void;
  onPasswordChange: (password: string) => void;
  onLogout: () => void;
}

const dayNames = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
const typeOptions: { value: DayType; label: string }[] = [
  { value: 'smart', label: 'Smart Working' },
  { value: 'office', label: 'Ufficio' },
  { value: 'holiday', label: 'Ferie' },
  { value: 'non-working', label: 'Non Lavorativo' },
];

export function Settings({ data, onDataChange, onPasswordChange, onLogout }: SettingsProps) {
  const [activeTab, setActiveTab] = useState<'rules' | 'holidays' | 'security'>('rules');
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [selectedType, setSelectedType] = useState<DayType>('smart');
  const [newHolidayName, setNewHolidayName] = useState('');
  const [newHolidayMonth, setNewHolidayMonth] = useState(1);
  const [newHolidayDay, setNewHolidayDay] = useState(1);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleAddRule = () => {
    const rule: WeeklyRule = {
      dayOfWeek: selectedDay,
      type: selectedType,
    };
    const newData = addWeeklyRule(rule, data);
    onDataChange(newData);
  };

  const handleRemoveRule = (dayOfWeek: number) => {
    const newData = removeWeeklyRule(dayOfWeek, data);
    onDataChange(newData);
  };

  const handleAddHoliday = () => {
    if (!newHolidayName.trim()) return;
    
    const holiday: CustomHoliday = {
      id: `${newHolidayMonth}-${newHolidayDay}-${Date.now()}`,
      name: newHolidayName,
      month: newHolidayMonth,
      day: newHolidayDay,
    };
    const newData = addCustomHoliday(holiday, data);
    onDataChange(newData);
    setNewHolidayName('');
    setNewHolidayMonth(1);
    setNewHolidayDay(1);
  };

  const handleRemoveHoliday = (id: string) => {
    const newData = removeCustomHoliday(id, data);
    onDataChange(newData);
  };

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      alert('Le password non corrispondono');
      return;
    }
    if (newPassword.length < 4) {
      alert('La password deve essere di almeno 4 caratteri');
      return;
    }
    onPasswordChange(newPassword);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    alert('Password cambiata con successo');
  };

  return (
    <div className="settings-container">
      <h2>Impostazioni</h2>
      <div className="settings-tabs">
        <button
          className={`tab ${activeTab === 'rules' ? 'active' : ''}`}
          onClick={() => setActiveTab('rules')}
        >
          Regole Settimanali
        </button>
        <button
          className={`tab ${activeTab === 'holidays' ? 'active' : ''}`}
          onClick={() => setActiveTab('holidays')}
        >
          Festività Locali
        </button>
        <button
          className={`tab ${activeTab === 'security' ? 'active' : ''}`}
          onClick={() => setActiveTab('security')}
        >
          Sicurezza
        </button>
      </div>

      {activeTab === 'rules' && (
        <div className="settings-content">
          <h3>Regole Automatiche</h3>
          <p className="settings-description">
            Imposta i giorni della settimana che vuoi applicare automaticamente al calendario.
          </p>
          <div className="rule-form">
            <select value={selectedDay} onChange={(e) => setSelectedDay(Number(e.target.value))}>
              {dayNames.map((name, idx) => (
                <option key={idx} value={idx}>{name}</option>
              ))}
            </select>
            <select value={selectedType} onChange={(e) => setSelectedType(e.target.value as DayType)}>
              {typeOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <button onClick={handleAddRule} className="btn-add">Aggiungi</button>
          </div>
          <div className="rules-list">
            {data.weeklyRules.map(rule => (
              <div key={rule.dayOfWeek} className="rule-item">
                <span>{dayNames[rule.dayOfWeek]}: {typeOptions.find(o => o.value === rule.type)?.label}</span>
                <button onClick={() => handleRemoveRule(rule.dayOfWeek)} className="btn-remove">
                  Rimuovi
                </button>
              </div>
            ))}
            {data.weeklyRules.length === 0 && (
              <p className="empty-state">Nessuna regola impostata</p>
            )}
          </div>
        </div>
      )}

      {activeTab === 'holidays' && (
        <div className="settings-content">
          <h3>Festività Personalizzate</h3>
          <p className="settings-description">
            Aggiungi festività locali o personali che si ripetono ogni anno.
          </p>
          <div className="holiday-form">
            <input
              type="text"
              placeholder="Nome festività (es. Santo Patrono)"
              value={newHolidayName}
              onChange={(e) => setNewHolidayName(e.target.value)}
            />
            <select value={newHolidayMonth} onChange={(e) => setNewHolidayMonth(Number(e.target.value))}>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
                    'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'][i]}
                </option>
              ))}
            </select>
            <select value={newHolidayDay} onChange={(e) => setNewHolidayDay(Number(e.target.value))}>
              {Array.from({ length: 31 }, (_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}</option>
              ))}
            </select>
            <button onClick={handleAddHoliday} className="btn-add">Aggiungi</button>
          </div>
          <div className="holidays-list">
            {data.customHolidays.map(holiday => (
              <div key={holiday.id} className="holiday-item">
                <span>
                  {holiday.name} - {holiday.day}/{holiday.month}
                </span>
                <button onClick={() => handleRemoveHoliday(holiday.id)} className="btn-remove">
                  Rimuovi
                </button>
              </div>
            ))}
            {data.customHolidays.length === 0 && (
              <p className="empty-state">Nessuna festività personalizzata</p>
            )}
          </div>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="settings-content">
          <h3>Sicurezza</h3>
          <div className="password-form">
            <div className="form-group">
              <label>Nuova Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimo 4 caratteri"
              />
            </div>
            <div className="form-group">
              <label>Conferma Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <button onClick={handleChangePassword} className="btn-primary">
              Cambia Password
            </button>
          </div>
          <div className="logout-section">
            <button onClick={onLogout} className="btn-logout">
              Esci
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
