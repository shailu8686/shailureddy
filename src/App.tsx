import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LoginPage } from './components/LoginPage';
import { SignUpPage } from './components/SignUpPage';
import { Dashboard } from './components/Dashboard';
import { UPIDataView } from './components/UPIDataView';
import { ReportsList } from './components/ReportsList';
import { ReportDetail } from './components/ReportDetail';
import { ProtectedRoute } from './components/ProtectedRoute';

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <ProtectedRoute inverse>{children}</ProtectedRoute>;
};

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <SignUpPage />
            </PublicRoute>
          }
        />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Dashboard>
                <Routes>
                  <Route index element={<UPIDataView />} />
                  <Route path="reports" element={<ReportsList />} />
                  <Route path="reports/:reportId" element={<ReportDetail />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Dashboard>
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
