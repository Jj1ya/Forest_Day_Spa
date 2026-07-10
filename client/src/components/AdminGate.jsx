import { useState, useEffect } from 'react';
import { loginAdmin, verifyAdminSession } from '../api';

const STORAGE_KEY = 'fds_admin_token';

export default function AdminGate({ children }) {
  const [ok, setOk] = useState(false);
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    verifyAdminSession()
      .then(valid => setOk(valid))
      .catch(() => setOk(false))
      .finally(() => setChecking(false));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const { token } = await loginAdmin(email.trim(), password);
      sessionStorage.setItem(STORAGE_KEY, token);
      setOk(true);
    } catch (err) {
      setError(err?.message || 'Sign in failed.');
    }
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-forest-700 flex items-center justify-center text-white/60 text-sm">
        Loading...
      </div>
    );
  }

  if (ok) return children;

  return (
    <div className="min-h-screen bg-forest-700 flex items-center justify-center p-6">
      <form onSubmit={handleSubmit}
        className="bg-white w-full max-w-sm p-8 shadow-xl">
        <h1 className="font-serif text-2xl text-forest-700 mb-1">Forest Day Spa</h1>
        <p className="text-sm text-gray-500 mb-6">Admin — sign in to continue</p>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          autoComplete="username"
          autoFocus
          required
          className="w-full border border-gray-200 px-4 py-3 text-sm mb-3 focus:outline-none focus:border-forest-500"
        />
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          autoComplete="current-password"
          required
          className="w-full border border-gray-200 px-4 py-3 text-sm mb-4 focus:outline-none focus:border-forest-500"
        />
        {error && <p className="text-sm text-red-500 mb-3">{error}</p>}
        <button type="submit" className="btn-gold w-full justify-center">
          Sign in
        </button>
        <p className="text-xs text-gray-400 mt-6 text-center">
          Public site: <a href="/" className="text-forest-500 underline">forestdayspa.com</a>
        </p>
      </form>
    </div>
  );
}

export function getAdminToken() {
  return sessionStorage.getItem(STORAGE_KEY);
}
