import { createContext, useContext, useState, useEffect } from 'react';
import { fetchSiteData, saveSiteData } from '../api';

const SiteContext = createContext(null);

export function SiteProvider({ children }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dataVersion, setDataVersion] = useState(0);

  async function refetch() {
    const fresh = await fetchSiteData();
    setData(fresh);
    setDataVersion(v => v + 1);
    return fresh;
  }

  useEffect(() => {
    refetch()
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // When another tab saves in admin, refresh homepage data
  useEffect(() => {
    function onStorage(e) {
      if (e.key === 'fds_site_updated') refetch().catch(console.error);
    }
    function onVisible() {
      if (document.visibilityState === 'visible') refetch().catch(console.error);
    }
    window.addEventListener('storage', onStorage);
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      window.removeEventListener('storage', onStorage);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, []);

  async function save(newData) {
    setData(newData);
    await saveSiteData(newData);
    setDataVersion(v => v + 1);
    localStorage.setItem('fds_site_updated', String(Date.now()));
  }

  function update(section, value) {
    setData(prev => ({ ...prev, [section]: value }));
  }

  return (
    <SiteContext.Provider value={{ data, loading, save, update, setData, refetch, dataVersion }}>
      {children}
    </SiteContext.Provider>
  );
}

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error('useSite must be used within SiteProvider');
  return ctx;
}
