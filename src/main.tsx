import React from 'react';
import { createRoot } from 'react-dom/client';
import MempoolRadar from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MempoolRadar />
  </React.StrictMode>,
);