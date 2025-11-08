import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Calendar, Users, UserCircle, LogOut, Menu, X } from 'lucide-react';

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
    { path: '/app/agenda', label: 'Agenda', icon: Calendar },
    { path: '/app/patients', label: 'Patients', icon: Users },
    { path: '/app/profil', label: 'Profil', icon: UserCircle }
  ];

  const initials = user?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';

  return (
    <div className="min-h-screen flex bg-gray-50" data-testid="dashboard-layout">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex md:flex-col md:w-64 bg-white border-r border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="relative">
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
              Therapy
            </span>
            <span className="text-xl font-bold text-gray-900">Care</span>
            <div className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full"></div>
            <p className="text-xs text-gray-500 mt-3">Espace pro</p>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                data-testid={`nav-${item.label.toLowerCase()}`}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'bg-blue-50 text-blue-600 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 mb-3 px-2">
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-blue-600 text-white text-sm font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-gray-900 truncate">{user?.full_name}</p>
              <p className="text-xs text-gray-500 truncate">{user?.specialty}</p>
            </div>
          </div>
          <Button
            data-testid="logout-button"
            onClick={handleLogout}
            variant="outline"
            className="w-full border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Déconnexion
          </Button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 p-4 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-gray-900">TherapyCare</span>
          </div>
          <button
            data-testid="mobile-menu-button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-gray-600"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="mt-4 space-y-1 pb-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center px-4 py-3 rounded-lg ${
                    isActive(item.path) ? 'bg-blue-50 text-blue-600 font-medium' : 'bg-gray-50 text-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.label}
                </Link>
              );
            })}
            <Button
              onClick={() => {
                handleLogout();
                setMobileMenuOpen(false);
              }}
              variant="outline"
              className="w-full mt-4 border-gray-300 rounded-lg"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Déconnexion
            </Button>
          </nav>
        )}
      </div>

      {/* Main Content */}
      <main className="flex-1 md:mt-0 mt-16">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;