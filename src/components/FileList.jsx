import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { 
  File, 
  Image, 
  FileText, 
  Film, 
  Music, 
  Archive,
  MoreVertical,
  Download,
  Trash2,
  Share2,
  Star
} from 'lucide-react';

const FileList = ({ files = [], onDeleteFile, onShareFile }) => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  
  const toggleDropdown = (fileId) => {
    setActiveDropdown(activeDropdown === fileId ? null : fileId);
  };

  const getFileIcon = (fileType) => {
    if (!fileType) return <File size={20} />;
    
    if (fileType.startsWith('image/')) return <Image size={20} />;
    if (fileType.startsWith('text/')) return <FileText size={20} />;
    if (fileType.startsWith('video/')) return <Film size={20} />;
    if (fileType.startsWith('audio/')) return <Music size={20} />;
    if (fileType.includes('zip') || fileType.includes('tar') || fileType.includes('rar')) return <Archive size={20} />;
    
    return <File size={20} />;
  };

  const formatFileSize = (bytes) => {
    if (!bytes || isNaN(bytes)) return '0 B';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (files.length === 0) {
    return (
      <div className="bg-white dark:bg-surface-800 rounded-lg p-8 text-center shadow-sm border border-surface-200 dark:border-surface-700">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-surface-100 dark:bg-surface-700 flex items-center justify-center">
          <FileText size={24} className="text-surface-400" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No files yet</h3>
        <p className="text-surface-500 dark:text-surface-400 mb-6">
          Upload files to start managing your content
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-surface-800 rounded-lg shadow-sm border border-surface-200 dark:border-surface-700 overflow-hidden">
      <div className="grid grid-cols-12 gap-4 p-4 border-b border-surface-200 dark:border-surface-700 text-surface-500 dark:text-surface-400 font-medium text-sm">
        <div className="col-span-5">Name</div>
        <div className="col-span-2">Size</div>
        <div className="col-span-3">Created</div>
        <div className="col-span-1">Status</div>
        <div className="col-span-1 text-right">Actions</div>
      </div>
      
      {files.map((file) => (
        <div 
          key={file.Id} 
          className="grid grid-cols-12 gap-4 p-4 items-center border-b border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-700/50"
        >
          <div className="col-span-5">
            <Link to={`/files/${file.Id}`} className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-surface-100 dark:bg-surface-700">
                {getFileIcon(file.type)}
              </div>
              <div className="overflow-hidden">
                <p className="font-medium truncate">{file.Name}</p>
                <p className="text-sm text-surface-500 dark:text-surface-400">{file.type || 'Unknown'}</p>
              </div>
            </Link>
          </div>
          
          <div className="col-span-2 text-surface-500 dark:text-surface-400">
            {formatFileSize(file.size)}
          </div>
          
          <div className="col-span-3 text-surface-500 dark:text-surface-400">
            {file.CreatedOn ? format(new Date(file.CreatedOn), 'MMM d, yyyy') : 'Unknown'}
          </div>
          
          <div className="col-span-1">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              file.status === 'completed' 
                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
            }`}>
              {file.status || 'pending'}
            </span>
          </div>
          
          <div className="col-span-1 text-right relative">
            <button 
              className="p-1.5 rounded-full hover:bg-surface-200 dark:hover:bg-surface-700"
              onClick={() => toggleDropdown(file.Id)}
            >
              <MoreVertical size={16} />
            </button>
            
            {activeDropdown === file.Id && (
              <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-surface-800 rounded-md shadow-lg z-10 py-1 border border-surface-200 dark:border-surface-700">
                <button className="w-full text-left px-4 py-2 hover:bg-surface-100 dark:hover:bg-surface-700 flex items-center gap-2">
                  <Download size={16} /> Download
                </button>
                <button 
                  onClick={() => onShareFile(file)}
                  className="w-full text-left px-4 py-2 hover:bg-surface-100 dark:hover:bg-surface-700 flex items-center gap-2"
                >
                  <Share2 size={16} /> Share
                </button>
                <button className="w-full text-left px-4 py-2 hover:bg-surface-100 dark:hover:bg-surface-700 flex items-center gap-2">
                  <Star size={16} /> Star
                </button>
                <button 
                  onClick={() => {
                    setActiveDropdown(null);
                    onDeleteFile(file.Id);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-surface-100 dark:hover:bg-surface-700 text-red-600 dark:text-red-400 flex items-center gap-2"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FileList;