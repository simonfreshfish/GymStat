import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { VisualSettingsProvider } from './components/VisualSettingsProvider.tsx';
import { WrappedPreferencesProvider } from './components/WrappedPreferencesProvider.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <VisualSettingsProvider>
      <WrappedPreferencesProvider>
        <App />
      </WrappedPreferencesProvider>
    </VisualSettingsProvider>
  </StrictMode>
);