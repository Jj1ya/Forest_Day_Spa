import { useState, useEffect } from 'react';

const STORAGE_KEY = 'fds_admin_auth';
const PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || '';

export default function AdminGate({ children }) {
  const [ok, setOk] = useState(false);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!PASSWORD) {
      setOk(true);
      return;
    }
    if (sessionStorage.getItem(STORAGE_KEY) === '1') setOk(true);
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    if (input === PASSWORD) {
      sessionStorage.setItem(STORAGE_KEY, '1');
      setOk(true);
      setError('');
    } else {
      setError('Incorrect password.');
    }
  }

  if (ok) return children;

  return (
    <div className="min-h-screen bg-forest-700 flex items-center justify-center p-6">
      <form onSubmit={handleSubmit}
        className="bg-white w-full max-w-sm p-8 shadow-xl">
        <h1 className="font-serif text-2xl text-forest-700 mb-1">Forest Day Spa</h1>
        <p className="text-sm text-gray-500 mb-6">Admin — enter password to continue</p>
        <input
          type="password"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Password"
          autoFocus
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
