import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { BriefProvider } from './context/BriefContext';
import { CatalogPage } from './components/Home/CatalogPage';
import { BriefRunner } from './components/TypeformRunner/BriefRunner';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { WorkPage } from './components/Portfolio/WorkPage';
import { ProjectDetail } from './components/Portfolio/ProjectDetail';
import { Toaster } from 'sonner';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <BriefProvider>
        <BrowserRouter>
          <Toaster richColors position="top-center" />
          <Routes>
            <Route path="/" element={<CatalogPage />} />
            <Route path="/trabajo" element={<WorkPage />} />
            <Route path="/trabajo/:slug" element={<ProjectDetail />} />
            <Route path="/brief/:slug" element={<BriefRunner />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </BriefProvider>
    </ThemeProvider>
  );
};

export default App;
