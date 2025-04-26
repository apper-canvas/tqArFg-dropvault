import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Check, AlertCircle, File, Image, FileText, FilePlus, Link as LinkIcon, Lock, Clock } from 'lucide-react';

const MainFeature = ({ activeFeature }) => {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [shareSettings, setShareSettings] = useState({
    isPublic: false,
    password: '',
    expiresIn: '7',
    hasPassword: false
  });
  const [shareLink, setShareLink] = useState('');
  const fileInputRef = useRef(null);

  // Handle drag events
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  // Handle file selection
  const handleFileSelect = useCallback((selectedFiles) => {
    const newFiles = Array.from(selectedFiles).map(file => ({
      id: `${file.name}-${Date.now()}`,
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'pending'
    }));

    setFiles(prev => [...prev, ...newFiles]);
    
    // Simulate upload for each file
    newFiles.forEach(fileObj => {
      simulateFileUpload(fileObj.id);
    });
  }, []);

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // Simulate file upload with progress
  const simulateFileUpload = (fileId) => {
    setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        const currentProgress = prev[fileId] || 0;
        const newProgress = Math.min(currentProgress + Math.random() * 10, 100);
        
        if (newProgress === 100) {
          clearInterval(interval);
          
          // Mark file as completed after upload finishes
          setFiles(prevFiles => 
            prevFiles.map(f => 
              f.id === fileId ? { ...f, status: 'completed' } : f
            )
          );
        }
        
        return { ...prev, [fileId]: newProgress };
      });
    }, 300);
  };

  const removeFile = (fileId) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
    setUploadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[fileId];
      return newProgress;
    });
  };

  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) return <Image size={20} />;
    if (fileType.startsWith('text/')) return <FileText size={20} />;
    return <File size={20} />;
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleShareSettingChange = (e) => {
    const { name, value, type, checked } = e.target;
    setShareSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const generateShareLink = () => {
    // In a real app, this would call an API to generate a link
    const token = Math.random().toString(36).substring(2, 15);
    setShareLink(`https://dropvault.example.com/share/${token}`);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink);
    // In a real app, show a toast notification
  };

  // Render different features based on activeFeature prop
  if (activeFeature === 'upload') {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold mb-4">Upload Files</h2>
        
        {/* Upload Zone */}
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
            isDragging 
              ? 'border-primary bg-primary/5 dark:bg-primary/10' 
              : 'border-surface-300 dark:border-surface-600 hover:border-primary dark:hover:border-primary-light'
          }`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileInputChange}
            multiple
          />
          
          <motion.div 
            initial={{ scale: 1 }}
            animate={{ scale: isDragging ? 1.05 : 1 }}
            className="flex flex-col items-center"
          >
            <div className="w-16 h-16 mb-4 rounded-full bg-surface-100 dark:bg-surface-700 flex items-center justify-center">
              <Upload size={28} className="text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {isDragging ? 'Drop files here' : 'Drag & Drop Files'}
            </h3>
            <p className="text-surface-500 dark:text-surface-400 mb-4">
              or
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={triggerFileInput}
              className="btn btn-primary"
            >
              Browse Files
            </motion.button>
            <p className="text-sm text-surface-500 dark:text-surface-400 mt-4">
              Supports all file types up to 100MB
            </p>
          </motion.div>
        </div>
        
        {/* File List */}
        {files.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Uploaded Files</h3>
            <div className="space-y-3">
              <AnimatePresence>
                {files.map(file => (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="card p-4 flex items-center gap-4"
                  >
                    <div className="p-2 rounded-lg bg-surface-100 dark:bg-surface-700">
                      {getFileIcon(file.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div className="truncate pr-4">
                          <p className="font-medium truncate">{file.name}</p>
                          <p className="text-sm text-surface-500 dark:text-surface-400">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                        
                        <button 
                          onClick={() => removeFile(file.id)}
                          className="p-1 rounded-full hover:bg-surface-200 dark:hover:bg-surface-700"
                        >
                          <X size={16} />
                        </button>
                      </div>
                      
                      <div className="mt-2">
                        <div className="h-2 w-full bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${uploadProgress[file.id] || 0}%` }}
                            className={`h-full rounded-full ${
                              file.status === 'completed' 
                                ? 'bg-secondary' 
                                : 'bg-primary'
                            }`}
                          />
                        </div>
                        
                        <div className="flex justify-between mt-1 text-xs">
                          <span className="text-surface-500 dark:text-surface-400">
                            {file.status === 'completed' 
                              ? 'Completed' 
                              : `${Math.round(uploadProgress[file.id] || 0)}%`}
                          </span>
                          
                          {file.status === 'completed' && (
                            <span className="text-secondary flex items-center gap-1">
                              <Check size={12} /> Uploaded
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    );
  }
  
  if (activeFeature === 'share') {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold mb-4">Share Files Securely</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="card p-6">
              <h3 className="text-lg font-semibold mb-4">Share Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="flex items-center gap-2 mb-2">
                    <input
                      type="checkbox"
                      name="isPublic"
                      checked={shareSettings.isPublic}
                      onChange={handleShareSettingChange}
                      className="w-4 h-4 text-primary rounded focus:ring-primary"
                    />
                    <span>Public link (anyone with the link can access)</span>
                  </label>
                </div>
                
                <div>
                  <label className="flex items-center gap-2 mb-2">
                    <input
                      type="checkbox"
                      name="hasPassword"
                      checked={shareSettings.hasPassword}
                      onChange={handleShareSettingChange}
                      className="w-4 h-4 text-primary rounded focus:ring-primary"
                    />
                    <span>Password protection</span>
                  </label>
                  
                  {shareSettings.hasPassword && (
                    <input
                      type="password"
                      name="password"
                      value={shareSettings.password}
                      onChange={handleShareSettingChange}
                      placeholder="Enter password"
                      className="input mt-2"
                    />
                  )}
                </div>
                
                <div>
                  <label className="block mb-2">Link expiration</label>
                  <select
                    name="expiresIn"
                    value={shareSettings.expiresIn}
                    onChange={handleShareSettingChange}
                    className="input"
                  >
                    <option value="1">1 day</option>
                    <option value="7">7 days</option>
                    <option value="30">30 days</option>
                    <option value="never">Never expires</option>
                  </select>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={generateShareLink}
                  className="btn btn-primary w-full mt-4"
                >
                  Generate Share Link
                </motion.button>
              </div>
            </div>
          </div>
          
          <div>
            <div className="card p-6 h-full">
              <h3 className="text-lg font-semibold mb-4">Share Summary</h3>
              
              {shareLink ? (
                <div className="space-y-4">
                  <div className="p-4 bg-surface-100 dark:bg-surface-700 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <LinkIcon size={16} className="text-primary" />
                      <span className="font-medium">Share Link</span>
                    </div>
                    <div className="flex">
                      <input
                        type="text"
                        value={shareLink}
                        readOnly
                        className="input rounded-r-none flex-1"
                      />
                      <button
                        onClick={copyToClipboard}
                        className="btn btn-primary rounded-l-none"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-surface-100 dark:bg-surface-700 rounded-lg flex items-center gap-2">
                      <Lock size={16} className="text-secondary" />
                      <div>
                        <p className="text-sm font-medium">Protection</p>
                        <p className="text-xs text-surface-500 dark:text-surface-400">
                          {shareSettings.hasPassword ? 'Password protected' : 'No password'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-surface-100 dark:bg-surface-700 rounded-lg flex items-center gap-2">
                      <Clock size={16} className="text-accent" />
                      <div>
                        <p className="text-sm font-medium">Expires</p>
                        <p className="text-xs text-surface-500 dark:text-surface-400">
                          {shareSettings.expiresIn === 'never' 
                            ? 'Never expires' 
                            : `In ${shareSettings.expiresIn} days`}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[calc(100%-2rem)] text-center">
                  <div className="w-16 h-16 mb-4 rounded-full bg-surface-100 dark:bg-surface-700 flex items-center justify-center">
                    <LinkIcon size={24} className="text-surface-400" />
                  </div>
                  <p className="text-surface-500 dark:text-surface-400">
                    Configure your share settings and generate a link
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (activeFeature === 'manage') {
    // Simplified file management UI
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold mb-4">Manage Your Files</h2>
        
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2">
            <button className="btn btn-outline">All Files</button>
            <button className="btn btn-outline">Recent</button>
            <button className="btn btn-outline">Shared</button>
          </div>
          
          <button className="btn btn-primary flex items-center gap-2">
            <FilePlus size={18} />
            <span>New Folder</span>
          </button>
        </div>
        
        <div className="card p-6">
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-surface-100 dark:bg-surface-700 flex items-center justify-center">
              <FileText size={24} className="text-surface-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No files yet</h3>
            <p className="text-surface-500 dark:text-surface-400 mb-6">
              Upload files to start managing your content
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {}}
              className="btn btn-primary mx-auto"
            >
              Upload Files
            </motion.button>
          </div>
        </div>
      </div>
    );
  }
  
  if (activeFeature === 'security') {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold mb-4">Security Features</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-primary/10 dark:bg-primary/20">
                <Lock size={24} className="text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">End-to-End Encryption</h3>
                <p className="text-surface-600 dark:text-surface-400">
                  Your files are encrypted during transfer and storage, ensuring only authorized users can access them.
                </p>
              </div>
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-secondary/10 dark:bg-secondary/20">
                <AlertCircle size={24} className="text-secondary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Access Controls</h3>
                <p className="text-surface-600 dark:text-surface-400">
                  Set permissions for who can view, edit, or share your files with granular access controls.
                </p>
              </div>
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-accent/10 dark:bg-accent/20">
                <Clock size={24} className="text-accent" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Expiring Links</h3>
                <p className="text-surface-600 dark:text-surface-400">
                  Create share links that automatically expire after a set time period for temporary access.
                </p>
              </div>
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-primary-dark/10 dark:bg-primary-dark/20">
                <Shield size={24} className="text-primary-dark" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Password Protection</h3>
                <p className="text-surface-600 dark:text-surface-400">
                  Add an extra layer of security with password-protected file sharing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return null;
};

export default MainFeature;