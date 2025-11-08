import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Avatar, AvatarFallback } from '../components/ui/avatar';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('therapycare_user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('therapycare_token');
    localStorage.removeItem('therapycare_user');
    navigate('/login');
  };

  const isActive = (path) => location.pathname.includes(path);

  const menuItems = [
    { path: '/dashboard/agenda', label: 'Agenda', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { path: '/dashboard/patients', label: 'Patients', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
    { path: '/dashboard/profil', label: 'Profil', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' }
  ];

  const initials = user?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';

  return (
    <div className="min-h-screen flex" data-testid="dashboard-layout">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex md:flex-col md:w-64 bg-gradient-to-b from-blue-500 to-blue-600 text-white">
        <div className="p-6 border-b border-blue-400">
          <h1 className="text-2xl font-bold">TherapyCare</h1>
          <p className="text-sm text-blue-100 mt-1">Espace professionnel</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              data-testid={`nav-${item.label.toLowerCase()}`}
              className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive(item.path)
                  ? 'bg-white text-blue-600 shadow-md'
                  : 'text-white hover:bg-blue-400'
              }`}
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
              </svg>
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-blue-400">
          <div className="flex items-center space-x-3 mb-3">
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-blue-700 text-white text-sm">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate text-sm">{user?.full_name}</p>
              <p className="text-xs text-blue-100 truncate">{user?.specialty}</p>
            </div>
          </div>
          <Button
            data-testid="logout-button"
            onClick={handleLogout}
            variant="outline"
            className="w-full rounded-full border-white text-white hover:bg-blue-400 transition-colors"
          >
            Déconnexion
          </Button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-blue-500 text-white p-4 shadow-lg z-50">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">TherapyCare</h1>
          <button
            data-testid="mobile-menu-button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="mt-4 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center px-4 py-3 rounded-lg ${
                  isActive(item.path) ? 'bg-white text-blue-600' : 'bg-blue-400 text-white'
                }`}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
                {item.label}
              </Link>
            ))}
            <Button
              onClick={() => {
                handleLogout();
                setMobileMenuOpen(false);
              }}
              className="w-full rounded-full bg-white text-blue-600 hover:bg-blue-50"
            >
              Déconnexion
            </Button>
          </nav>
        )}
      </div>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 md:mt-0 mt-16">
        <div className="p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;