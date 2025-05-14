import { NavLink } from 'react-router-dom';
import { 
  Home, 
  FileText, 
  Share2, 
  Star, 
  Trash2, 
  FolderPlus,
  Upload
} from 'lucide-react';

const Sidebar = ({ openUploadModal }) => {
  return (
    <aside className="w-64 h-screen sticky top-0 bg-white dark:bg-surface-800 border-r border-surface-200 dark:border-surface-700 overflow-y-auto transition-colors duration-300">
      <div className="px-4 py-6">
        <button 
          onClick={openUploadModal}
          className="btn btn-primary w-full flex items-center gap-2 justify-center mb-6"
        >
          <Upload size={18} />
          <span>Upload Files</span>
        </button>

        <nav className="space-y-1">
          <NavLink 
            to="/dashboard" 
            end
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2 rounded-md 
              ${isActive ? 'bg-primary/10 text-primary dark:bg-primary/20' : 'hover:bg-surface-100 dark:hover:bg-surface-700'}
              transition-colors duration-200
            `}
          >
            <Home size={18} />
            <span>Dashboard</span>
          </NavLink>
          
          <NavLink 
            to="/dashboard/files" 
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2 rounded-md 
              ${isActive ? 'bg-primary/10 text-primary dark:bg-primary/20' : 'hover:bg-surface-100 dark:hover:bg-surface-700'}
              transition-colors duration-200
            `}
          >
            <FileText size={18} />
            <span>My Files</span>
          </NavLink>
          
          <NavLink 
            to="/dashboard/shared" 
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2 rounded-md 
              ${isActive ? 'bg-primary/10 text-primary dark:bg-primary/20' : 'hover:bg-surface-100 dark:hover:bg-surface-700'}
              transition-colors duration-200
            `}
          >
            <Share2 size={18} />
            <span>Shared</span>
          </NavLink>
        </nav>
        
        <div className="mt-8">
          <h3 className="px-3 text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-2">
            Quick Access
          </h3>
          
          <nav className="space-y-1">
            <NavLink 
              to="/dashboard/starred" 
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2 rounded-md 
                ${isActive ? 'bg-primary/10 text-primary dark:bg-primary/20' : 'hover:bg-surface-100 dark:hover:bg-surface-700'}
                transition-colors duration-200
              `}
            >
              <Star size={18} />
              <span>Starred</span>
            </NavLink>
            
            <NavLink 
              to="/dashboard/trash" 
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2 rounded-md 
                ${isActive ? 'bg-primary/10 text-primary dark:bg-primary/20' : 'hover:bg-surface-100 dark:hover:bg-surface-700'}
                transition-colors duration-200
              `}
            >
              <Trash2 size={18} />
              <span>Trash</span>
            </NavLink>
          </nav>
        </div>
        
        <div className="mt-8">
          <h3 className="px-3 text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-2">
            Folders
          </h3>
          
          <button className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-surface-100 dark:hover:bg-surface-700 w-full text-left">
            <FolderPlus size={18} />
            <span>New Folder</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;