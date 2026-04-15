import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SiteProvider } from './context/SiteContext';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';

export default function App() {
  return (
    <SiteProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin/*" element={<AdminPage />} />
        </Routes>
      </BrowserRouter>
    </SiteProvider>
  );
}
