
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { Toaster } from '@/components/ui/sonner';
import { DataProvider } from '@/context/DataContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DataProvider>
      <App />
      <Toaster />
    </DataProvider>
  </React.StrictMode>
);
