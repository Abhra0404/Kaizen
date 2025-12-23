import { StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import ErrorBoundary from './ErrorBoundary';

console.log('main.tsx loaded');

try {
  const rootElement = document.getElementById('root');
  console.log('root element:', rootElement);
  
  createRoot(rootElement!).render(
    <StrictMode>
      <BrowserRouter>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </BrowserRouter>
    </StrictMode>
  );
  console.log('App rendered successfully');
} catch (error) {
  console.error('Error rendering app:', error);
  document.body.innerHTML = `<h1 style="color: red; padding: 20px;">Error: ${error instanceof Error ? error.message : String(error)}</h1>`;
}
