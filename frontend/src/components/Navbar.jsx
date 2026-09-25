import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Heart,
  Calendar,
  History,
  BarChart3,
  BookOpen,
  HelpCircle,
  Award,
  Sparkles,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);
    await logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const authNavItems = [
    { label: 'Dashboard', path: '/dashboard', icon: BarChart3 },
    { label: 'Track', path: '/track', icon: Calendar },
    { label: 'History', path: '/history', icon: History },
    { label: 'Analytics', path: '/analytics', icon: BarChart3 },
    { label: 'Learn', path: '/education', icon: BookOpen },
    { label: 'Myths & Facts', path: '/myths-facts', icon: HelpCircle },
    { label: 'Quiz', path: '/quiz', icon: Award },
    { label: 'AI Assistant', path: '/ai-assistant', icon: Sparkles },
  ];

  const guestNavItems = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Learn', path: '/education' },
    { label: 'Myths & Facts', path: '/myths-facts' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-rose-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link
            to={isAuthenticated ? '/dashboard' : '/'}
            className="flex items-center gap-2.5 group transition-transform active:scale-95"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 via-rose-500 to-pink-500 flex items-center justify-center text-white shadow-md shadow-rose-500/20 group-hover:shadow-rose-500/30 transition-shadow">
              <Heart className="w-5 h-5 fill-white" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-rose-700 via-rose-600 to-pink-600 bg-clip-text text-transparent">
                MenstruAI
              </span>
              <span className="hidden sm:inline-block ml-1.5 px-1.5 py-0.5 text-[10px] font-semibold bg-rose-100 text-rose-700 rounded-full">
                Intelligence
              </span>
            </div>
          </Link>

          {/* Desktop Navigation for Logged-In Users */}
          {isAuthenticated ? (
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {authNavItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      active
                        ? 'bg-rose-50 text-rose-700 font-semibold'
                        : 'text-slate-600 hover:text-rose-600 hover:bg-rose-50/50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-rose-600' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.2 rounded-full font-semibold">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          ) : (
            /* Desktop Navigation for Guests */
            <nav className="hidden md:flex items-center gap-6">
              {guestNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? 'text-rose-600 font-semibold'
                      : 'text-slate-600 hover:text-rose-600'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          )}

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-rose-200 hover:border-rose-300 bg-rose-50/60 hover:bg-rose-50 transition-all text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                >
                  <div className="w-7 h-7 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs font-bold">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="max-w-[120px] truncate">{user?.name || 'Account'}</span>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {profileDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                    onMouseLeave={() => setProfileDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs text-slate-500">Signed in as</p>
                      <p className="text-sm font-semibold text-slate-900 truncate">{user?.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-rose-50 hover:text-rose-700 transition-colors"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      Profile
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-rose-50 hover:text-rose-700 transition-colors"
                    >
                      <Settings className="w-4 h-4 text-slate-400" />
                      Settings & Privacy
                    </Link>
                    <div className="border-t border-slate-100 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-rose-600 hover:bg-rose-50/50 rounded-lg transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm hover:shadow shadow-rose-600/20 transition-all active:scale-95"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-rose-600 hover:bg-rose-50 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-rose-100 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg">
          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-3 p-3 bg-rose-50 rounded-xl mb-3">
                <div className="w-10 h-10 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{user?.name}</p>
                  <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                </div>
              </div>

              {authNavItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-base font-medium ${
                      active
                        ? 'bg-rose-100 text-rose-800'
                        : 'text-slate-700 hover:bg-rose-50 hover:text-rose-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-rose-600" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-semibold">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}

              <div className="border-t border-slate-100 my-2 pt-2 space-y-1">
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 text-slate-700 hover:bg-rose-50 rounded-lg text-sm"
                >
                  <User className="w-4 h-4 text-slate-500" />
                  Profile
                </Link>
                <Link
                  to="/settings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 text-slate-700 hover:bg-rose-50 rounded-lg text-sm"
                >
                  <Settings className="w-4 h-4 text-slate-500" />
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium text-left"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              {guestNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-rose-50 hover:text-rose-700"
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center py-2.5 px-4 text-sm font-semibold text-rose-600 border border-rose-200 rounded-xl hover:bg-rose-50"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center py-2.5 px-4 text-sm font-semibold text-white bg-rose-600 rounded-xl shadow-sm hover:bg-rose-700"
                >
                  Get Started
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
