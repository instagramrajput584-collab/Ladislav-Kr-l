import React from 'react';
import { HashRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { HomeIcon, CalendarDaysIcon, UsersIcon, UserCircleIcon, GlobeAltIcon } from './components/icons';
import Feed from './pages/Feed';
import GlobalCalendar from './pages/GlobalCalendar';
import Contacts from './pages/Contacts';
import Profile from './pages/Profile';

const navItems = [
  { path: '/', label: 'Feed', icon: <HomeIcon className="w-6 h-6" /> },
  { path: '/calendar', label: 'Global Calendar', icon: <GlobeAltIcon className="w-6 h-6" /> },
  { path: '/contacts', label: 'Contacts', icon: <UsersIcon className="w-6 h-6" /> },
  { path: '/profile', label: 'Profile', icon: <UserCircleIcon className="w-6 h-6" /> },
];

const AppLogo: React.FC<{ size?: 'normal' | 'large' }> = ({ size = 'normal' }) => (
    <div className="flex items-center space-x-3">
        <CalendarDaysIcon className={`text-primary ${size === 'large' ? 'h-10 w-10' : 'h-8 w-8'}`} />
        <span className={`font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent ${size === 'large' ? 'text-2xl' : 'text-xl'}`}>
            365 Daily
        </span>
    </div>
);

const Header: React.FC = () => {
  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-40 md:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <AppLogo />
        </div>
      </div>
    </header>
  );
};

const Sidebar: React.FC = () => {
  return (
    <aside className="hidden md:flex md:flex-col md:w-64 bg-white shadow-lg">
      <div className="flex items-center justify-center h-20 border-b border-base-200">
        <AppLogo size="large" />
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 text-lg font-medium rounded-lg transition-all duration-200 group ${
                isActive
                  ? 'bg-primary/10 text-primary shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="relative">
                  {item.icon}
                  <div className={`absolute -left-4 h-full w-1 rounded-r-lg bg-primary transition-transform duration-300 scale-y-0 group-hover:scale-y-100 ${isActive ? 'scale-y-100' : ''}`}></div>
                </div>
                <span className="ml-4">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

const BottomNav: React.FC = () => {
    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-base-300 shadow-t-lg z-50">
            <div className="flex justify-around h-16">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => 
                            `flex flex-col items-center justify-center w-full pt-1 text-xs font-medium transition-colors duration-200 relative ${
                                isActive ? 'text-primary' : 'text-gray-500 hover:text-primary'
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                {item.icon}
                                <span className="mt-1">{item.label}</span>
                                {isActive && <div className="absolute top-0 h-1 w-10 rounded-b-full bg-primary"></div>}
                            </>
                        )}
                    </NavLink>
                ))}
            </div>
        </nav>
    );
};


const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="min-h-screen flex bg-base-100">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-20 md:pb-8">
            <Routes>
              <Route path="/" element={<Feed />} />
              <Route path="/calendar" element={<GlobalCalendar />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </main>
          <BottomNav />
        </div>
      </div>
    </HashRouter>
  );
};

export default App;