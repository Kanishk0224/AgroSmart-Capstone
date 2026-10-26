import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../src/hooks/useAuth';
import { AppRoutes } from '../../src/routes/AppRoutes';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
