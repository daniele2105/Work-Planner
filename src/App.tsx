import { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { Calendar } from './components/Calendar';
import { Stats } from './components/Stats';
import { Settings } from './components/Settings';
import { AppData } from './types';
import { loadData, saveData } from './utils/storage';
import { isAuthenticated, clearSession } from './utils/auth';
import './App.css';

function App() {
  const [data, setData] = useState<AppData>(loadData());
  const [authenticated, setAuthenticated] = useState(isAuthenticated());
  const [currentView, setCurrentView] = useState<'calendar' | 'stats' | 'settings'>('calendar');
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    saveData(data);
  }, [data]);

  const handleLogin = () => {
    setAuthenticated(true);
  };

  const handleLogout = () => {
    clearSession();
    setAuthenticated(false);
  };

  const handleDataChange = (newData: AppData) => {
    setData(newData);
  };

  const handlePasswordChange = (password: string) => {
    const newData = { ...data, password };
    setData(newData);
  };

  const handleCalendarDateChange = (date: Date) => {
    setCurrentDate(date);
  };

  if (!authenticated) {
    return (
      <Login
        data={data}
        onLogin={handleLogin}
        onSetPassword={handlePasswordChange}
      />
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>📅 Work Planner</h1>
        <nav className="app-nav">
          <button
            className={`nav-btn ${currentView === 'calendar' ? 'active' : ''}`}
            onClick={() => setCurrentView('calendar')}
          >
            📆 Calendario
          </button>
          <button
            className={`nav-btn ${currentView === 'stats' ? 'active' : ''}`}
            onClick={() => setCurrentView('stats')}
          >
            📊 Statistiche
          </button>
          <button
            className={`nav-btn ${currentView === 'settings' ? 'active' : ''}`}
            onClick={() => setCurrentView('settings')}
          >
            ⚙️ Impostazioni
          </button>
        </nav>
      </header>

      <main className="app-main">
        {currentView === 'calendar' && (
          <Calendar
            data={data}
            onDataChange={handleDataChange}
            onDateChange={handleCalendarDateChange}
          />
        )}
        {currentView === 'stats' && (
          <Stats
            data={data}
            currentDate={currentDate}
          />
        )}
        {currentView === 'settings' && (
          <Settings
            data={data}
            onDataChange={handleDataChange}
            onPasswordChange={handlePasswordChange}
            onLogout={handleLogout}
          />
        )}
      </main>
    </div>
  );
}

export default App;
