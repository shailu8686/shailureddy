import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Database, LogOut, User, AlertTriangle, FileText } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const Dashboard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const navLinkClasses = "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors";
  const activeNavLinkClasses = "bg-blue-100 text-blue-700";
  const inactiveNavLinkClasses = "text-gray-600 hover:bg-gray-100 hover:text-gray-900";

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r flex flex-col">
        <div className="flex items-center justify-center h-16 border-b">
          <div className="flex items-center gap-2 text-blue-600">
            <Database className="w-7 h-7" />
            <span className="text-xl font-bold">UPI Shield</span>
          </div>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : inactiveNavLinkClasses}`}
          >
            <Database className="w-5 h-5" />
            UPI Records
          </NavLink>
          <NavLink
            to="/reports"
            className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : inactiveNavLinkClasses}`}
          >
            <FileText className="w-5 h-5" />
            My Reports
          </NavLink>
        </nav>
        <div className="px-4 py-4 border-t">
          <div className="flex items-center gap-3 mb-4 p-2 bg-gray-50 rounded-lg">
            <User className="w-8 h-8 p-1.5 bg-gray-200 text-gray-600 rounded-full" />
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium text-gray-800 truncate">{user?.email}</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b h-16 flex items-center justify-end px-6">
          <button
            onClick={() => navigate('/reports')}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
          >
            <AlertTriangle className="w-4 h-4" />
            Report Fraud
          </button>
        </header>
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
