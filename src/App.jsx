import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Importação das Telas
import LandingPage from './features/landing/LandingPage'; // <- IMPORTAMOS A NOVA PÁGINA AQUI
import Auth from './features/auth/Auth';
import Dashboard from './features/dashboard/Dashboard';
import VehicleManager from './features/vehicles/VehicleManager';
import History from './features/history/History';
import Settings from './features/settings/Settings';
import Layout from './components/Layout';

// Bloqueio de Segurança para a Área Logada
function PrivateRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider> 
        <BrowserRouter>
          <Routes>
            {/* Rota Pública Principal (A Landing Page) */}
            <Route path="/" element={<LandingPage />} />
            
            {/* Rotas de Autenticação */}
            <Route path="/login" element={<Auth initialMode="login" />} />
            <Route path="/register" element={<Auth initialMode="register" />} />
            
            {/* Rotas Privadas (App) */}
            <Route path="/dashboard" element={<PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>} />
            <Route path="/manage" element={<PrivateRoute><Layout><VehicleManager /></Layout></PrivateRoute>} />
            <Route path="/history" element={<PrivateRoute><Layout><History /></Layout></PrivateRoute>} />
            <Route path="/settings" element={<PrivateRoute><Layout><Settings /></Layout></PrivateRoute>} />
            
            {/* Fallback de rotas não encontradas */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}