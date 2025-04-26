import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import Home from './pages/Home';
import NotFound from './pages/NotFound';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : 
      window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900 text-surface-800 dark:text-surface-100 transition-colors duration-300">
      <header className="px-6 py-4 border-b border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 sticky top-0 z-10 transition-colors duration-300">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">D</span>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              DropVault
            </h1>
          </div>
          
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </motion.button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer className="mt-auto py-6 border-t border-surface-200 dark:border-surface-700 transition-colors duration-300">
        <div className="container mx-auto px-4 text-center text-surface-500 dark:text-surface-400 text-sm">
          © {new Date().getFullYear()} DropVault. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default App;