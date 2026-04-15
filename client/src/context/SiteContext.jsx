import { createContext, useContext, useState, useEffect } from 'react';
import { fetchSiteData, saveSiteData } from '../api';

const SiteContext = createContext(null);

export function SiteProvider({ children }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSiteData()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  async function save(newData) {
    setData(newData);
    await saveSiteData(newData);
  }

  function update(section, value) {
    setData(prev => ({ ...prev, [section]: value }));
  }

  return (
    <SiteContext.Provider value={{ data, loading, save, update, setData }}>
      {children}
    </SiteContext.Provider>
  );
}

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error('useSite must be used within SiteProvider');
  return ctx;
}
