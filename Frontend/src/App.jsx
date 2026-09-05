import './app.css';   // import global styles
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import RegisterPage from './Pages/register';
import LoginPage from './Pages/login';
import { AuthProvider } from './context/authContext';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<h2>404 - Page Not Found</h2>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
