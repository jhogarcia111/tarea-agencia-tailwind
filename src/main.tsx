
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import './index.css';
import { Toaster } from '@/components/ui/sonner';
import { DataProvider } from '@/context/DataContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DataProvider>
      <Router>
        <App />
        <Toaster />
      </Router>
    </DataProvider>
  </React.StrictMode>
);
