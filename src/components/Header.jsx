import { useState, useContext } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Moon, Sun, LogOut, User, Settings, Bell } from 'lucide-react';
import { AuthContext } from '../App';

function Header() {
  const [profileOpen, setProfileOpen] = useState(false);
  const { user } = useSelector(state => state.user);
  const { darkMode, toggleDarkMode, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
  };

  return (
    <header className="px-6 py-4 border-b border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 sticky top-0 z-10 transition-colors duration-300">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">D</span>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              DropVault
            </h1>
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </motion.button>
          
          <button className="p-2 rounded-full bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors">
            <Bell size={20} />
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700"
            >
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white">
                {user?.firstName?.charAt(0) || user?.emailAddress?.charAt(0) || 'U'}
              </div>
            </button>
            
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-surface-800 rounded-md shadow-lg z-20 py-1 border border-surface-200 dark:border-surface-700">
                <div className="px-4 py-2 border-b border-surface-200 dark:border-surface-700">
                  <p className="font-medium">{user?.firstName} {user?.lastName}</p>
                  <p className="text-sm text-surface-500 truncate">{user?.emailAddress}</p>
                </div>
                <button className="w-full text-left px-4 py-2 hover:bg-surface-100 dark:hover:bg-surface-700 flex items-center gap-2">
                  <Settings size={16} /> Settings
                </button>
                <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-surface-100 dark:hover:bg-surface-700 text-red-600 dark:text-red-400 flex items-center gap-2">
                  <LogOut size={16} /> Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;