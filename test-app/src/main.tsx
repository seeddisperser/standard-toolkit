import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './TestApp';
import './index.css';
import { ThemeProvider } from '../../design-toolkit/components/src/providers/theme-provider';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);
