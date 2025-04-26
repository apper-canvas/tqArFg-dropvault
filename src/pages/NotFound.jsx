import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, AlertCircle } from 'lucide-react';

const NotFound = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ 
          type: "spring",
          stiffness: 260,
          damping: 20 
        }}
        className="w-24 h-24 mb-8 rounded-full bg-surface-100 dark:bg-surface-800 flex items-center justify-center neu-light"
      >
        <AlertCircle size={48} className="text-primary" />
      </motion.div>
      
      <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
        404
      </h1>
      
      <p className="text-xl mb-2 font-semibold">Page Not Found</p>
      
      <p className="text-surface-600 dark:text-surface-400 mb-8 max-w-md">
        The page you're looking for doesn't exist or has been moved.
      </p>
      
      <Link to="/">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn btn-primary flex items-center gap-2"
        >
          <Home size={18} />
          <span>Back to Home</span>
        </motion.button>
      </Link>
    </motion.div>
  );
};

export default NotFound;