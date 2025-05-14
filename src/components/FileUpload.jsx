import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Check, File, Image, FileText } from 'lucide-react';
import { createFile } from '../services/fileService';

const FileUpload = ({ isOpen, onClose, onUploadComplete }) => {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
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
    
    // Upload each file
    newFiles.forEach(fileObj => {
      simulateFileUpload(fileObj);
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

  // Simulate file upload with progress and create file record
  const simulateFileUpload = (fileObj) => {
    setUploadProgress(prev => ({ ...prev, [fileObj.id]: 0 }));
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        const currentProgress = prev[fileObj.id] || 0;
        const newProgress = Math.min(currentProgress + Math.random() * 10, 100);
        
        if (newProgress === 100) {
          clearInterval(interval);
          
          // Mark file as completed after upload finishes
          setFiles(prevFiles => 
            prevFiles.map(f => 
              f.id === fileObj.id ? { ...f, status: 'completed' } : f
            )
          );

          // Create file record in database
          createFile({
            Name: fileObj.name,
            size: fileObj.size,
            type: fileObj.type,
            status: 'completed'
          }).then(response => {
            // When all files are uploaded, notify parent component
            const allUploaded = Object.values(uploadProgress).every(progress => progress === 100);
            if (allUploaded) {
              setTimeout(() => {
                onUploadComplete && onUploadComplete();
              }, 1000);
            }
          }).catch(err => {
            console.error('Error creating file record:', err);
          });
        }
        
        return { ...prev, [fileObj.id]: newProgress };
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white dark:bg-surface-800 w-full max-w-2xl rounded-lg shadow-xl p-6 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Upload Files</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700"
          >
            <X size={20} />
          </button>
        </div>
        
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
            <h3 className="text-lg font-semibold mb-4">Files to Upload</h3>
            <div className="space-y-3">
              <AnimatePresence>
                {files.map(file => (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="bg-surface-50 dark:bg-surface-700 p-4 rounded-lg flex items-center gap-4"
                  >
                    <div className="p-2 rounded-lg bg-surface-100 dark:bg-surface-600">
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
                        <div className="h-2 w-full bg-surface-200 dark:bg-surface-600 rounded-full overflow-hidden">
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
        
        <div className="mt-6 flex justify-end">
          <button onClick={onClose} className="btn btn-outline mr-3">Cancel</button>
          <button 
            onClick={onClose} 
            className="btn btn-primary"
            disabled={files.length === 0 || !Object.values(uploadProgress).every(p => p === 100)}
          >
            Done
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default FileUpload;