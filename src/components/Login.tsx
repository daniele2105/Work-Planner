import { useState } from 'react';
import { AppData } from '../types';
import { checkPassword, setSession } from '../utils/auth';
import './Login.css';

interface LoginProps {
  data: AppData;
  onLogin: () => void;
  onSetPassword: (password: string) => void;
}

export function Login({ data, onLogin, onSetPassword }: LoginProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSettingPassword] = useState(!data.password);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (checkPassword(password, data.password)) {
      setSession();
      onLogin();
    } else {
      setError('Password errata');
    }
  };

  const handleSetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Le password non corrispondono');
      return;
    }
    if (newPassword.length < 4) {
      setError('La password deve essere di almeno 4 caratteri');
      return;
    }
    onSetPassword(newPassword);
    setSession();
    onLogin();
  };

  if (isSettingPassword) {
    return (
      <div className="login-container">
        <div className="login-box">
          <h1>Work Planner</h1>
          <p className="subtitle">Imposta una password per proteggere i tuoi dati</p>
          <form onSubmit={handleSetPassword}>
            <div className="form-group">
              <label htmlFor="new-password">Nuova Password</label>
              <input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setError('');
                }}
                required
                autoFocus
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirm-password">Conferma Password</label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError('');
                }}
                required
              />
            </div>
            {error && <div className="error">{error}</div>}
            <button type="submit" className="btn-primary">Imposta Password</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Work Planner</h1>
        <p className="subtitle">Inserisci la password per accedere</p>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              required
              autoFocus
            />
          </div>
          {error && <div className="error">{error}</div>}
          <button type="submit" className="btn-primary">Accedi</button>
        </form>
      </div>
    </div>
  );
}
