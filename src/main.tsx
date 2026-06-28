import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Global secure admin fetch interceptor to automatically attach authorization headers
const originalFetch = window.fetch;
window.fetch = async (input, init) => {
  const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
  
  // If calling any administrative endpoint, automatically append the current logged in user ID from local storage
  if (url.includes("/api/admin")) {
    const userStr = localStorage.getItem("agribot_active_user") || localStorage.getItem("agribot_user");
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        if (u && u.id) {
          init = init || {};
          const headers = new Headers(init.headers || {});
          if (!headers.has("x-admin-userid")) {
            headers.set("x-admin-userid", u.id);
          }
          init.headers = headers;
        }
      } catch (e) {
        console.error("Error patching administrative headers:", e);
      }
    }
  }
  return originalFetch(input, init);
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
