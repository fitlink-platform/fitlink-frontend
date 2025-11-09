import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthProvider.jsx';
import './index.css'; // import tailwind
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Environment } from './config/environment.js';
import { BookingProvider } from "~/contexts/BookingContext";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={Environment.GG_CLIENT_ID}>
      <BrowserRouter>
        <AuthProvider>
          <BookingProvider>
          <App />
          </BookingProvider>
        </AuthProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
