import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext'; // <- IMPORTAMOS AQUI

// Importação das Telas
import Auth from './features/auth/Auth';
import Dashboard from './features/dashboard/Dashboard';
import VehicleManager from './features/vehicles/VehicleManager';
import History from './features/history/History';
import Settings from './features/settings/Settings';
import Layout from './components/Layout';

// Bloqueio de Segurança
function PrivateRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <AuthProvider>
      {/* EMBRULHAMOS O APP COM O TEMA AQUI */}
      <ThemeProvider> 
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Auth initialMode="login" />} />
            <Route path="/register" element={<Auth initialMode="register" />} />
            
            <Route path="/dashboard" element={<PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>} />
            <Route path="/manage" element={<PrivateRoute><Layout><VehicleManager /></Layout></PrivateRoute>} />
            <Route path="/history" element={<PrivateRoute><Layout><History /></Layout></PrivateRoute>} />
            <Route path="/settings" element={<PrivateRoute><Layout><Settings /></Layout></PrivateRoute>} />
            
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}