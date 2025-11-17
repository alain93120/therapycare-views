import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Calendar, Users, UserCircle, CreditCard, Home, LogOut, Menu, X, Settings } from 'lucide-react';

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
    { path: '/app/statistiques', label: 'Statistiques', icon: Home },
    { path: '/app/agenda', label: 'Agenda', icon: Calendar },
    { path: '/app/patients', label: 'Patients', icon: Users },
    { path: '/app/profil', label: 'Profil', icon: UserCircle },
    { path: '/app/tarifs', label: 'Tarifs', icon: CreditCard }
  ];

  const initials = user?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';

  const isExactActive = (path, exact) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.includes(path);
  };

  return (
    <div className="min-h-screen flex bg-[#F4F4F4]" data-testid="dashboard-layout">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex md:flex-col md:w-64 bg-white border-r border-gray-200">
        <div className="p-6 border-b border-gray-100">
          <div className="relative mb-6">
            <span className="text-xl font-bold bg-gradient-to-r from-[#3FA9F5] to-[#6FD0C5] bg-clip-text text-transparent">
              Therapy
            </span>
            <span className="text-xl font-bold text-gray-900">Care</span>
            <div className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-[#3FA9F5] to-[#6FD0C5] rounded-full"></div>
          </div>
          <div className="flex items-center space-x-3 px-3 py-3 bg-gray-50 rounded-xl">
            <Avatar className="w-10 h-10">
              {user?.photo_url ? (
                <AvatarImage src={user.photo_url} alt={user.full_name} />
              ) : (
                <AvatarFallback className="bg-gradient-to-br from-[#3FA9F5] to-[#6FD0C5] text-white text-sm font-medium">
                  {initials}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-gray-900 truncate">{user?.full_name}</p>
              <p className="text-xs text-gray-500 truncate">{user?.specialty}</p>
            </div>
            <button className="p-1.5 hover:bg-gray-200 rounded-lg transition">
              <Settings className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isExactActive(item.path, item.exact);
            return (
              <Link
                key={item.path}
                to={item.path}
                data-testid={`nav-${item.label.toLowerCase()}`}
                className={`flex items-center px-4 py-3.5 rounded-xl transition-all duration-200 ${
                  active
                    ? 'bg-gradient-to-r from-[#3FA9F5] to-[#6FD0C5] text-white shadow-lg shadow-[#3FA9F5]/30'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <Button
            data-testid="logout-button"
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-start text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-xl"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Déconnexion
          </Button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 p-4 z-50 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="relative">
            <span className="text-lg font-bold bg-gradient-to-r from-[#3FA9F5] to-[#6FD0C5] bg-clip-text text-transparent">
              Therapy
            </span>
            <span className="text-lg font-bold text-gray-900">Care</span>
            <div className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-gradient-to-r from-[#3FA9F5] to-[#6FD0C5] rounded-full"></div>
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
          <div className="mt-4 pb-4">
            <div className="flex items-center space-x-3 px-3 py-3 bg-gray-50 rounded-xl mb-4">
              <Avatar className="w-10 h-10">
                {user?.photo_url ? (
                  <AvatarImage src={user.photo_url} alt={user.full_name} />
                ) : (
                  <AvatarFallback className="bg-gradient-to-br from-[#3FA9F5] to-[#6FD0C5] text-white text-sm font-medium">
                    {initials}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-gray-900 truncate">{user?.full_name}</p>
                <p className="text-xs text-gray-500 truncate">{user?.specialty}</p>
              </div>
            </div>
            <nav className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = isExactActive(item.path, item.exact);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center px-4 py-3 rounded-xl ${
                      active 
                        ? 'bg-gradient-to-r from-[#3FA9F5] to-[#6FD0C5] text-white' 
                        : 'bg-gray-50 text-gray-700'
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
                variant="ghost"
                className="w-full justify-start text-gray-700 hover:bg-red-50 hover:text-red-600 mt-4"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Déconnexion
              </Button>
            </nav>
          </div>
        )}
      </div>

      {/* Main Content */}
      <main className="flex-1 md:mt-0 mt-16 overflow-auto">
        <div className="p-6 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
