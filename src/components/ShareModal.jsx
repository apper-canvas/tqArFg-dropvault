import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Link as LinkIcon, Lock, Clock, Check } from 'lucide-react';
import { createShare } from '../services/shareService';

const ShareModal = ({ isOpen, onClose, file }) => {
  const [shareSettings, setShareSettings] = useState({
    isPublic: false,
    password: '',
    expiresIn: '7',
    hasPassword: false
  });
  const [shareLink, setShareLink] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen || !file) return null;

  const handleShareSettingChange = (e) => {
    const { name, value, type, checked } = e.target;
    setShareSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const generateShareLink = async () => {
    try {
      setIsGenerating(true);
      
      // Create share record in database
      const shareData = {
        Name: `Share: ${file.Name}`,
        is_public: shareSettings.isPublic,
        has_password: shareSettings.hasPassword,
        password: shareSettings.hasPassword ? shareSettings.password : '',
        expires_in: shareSettings.expiresIn,
        file_id: file.Id
      };
      
      const result = await createShare(shareData);
      setShareLink(result.link);
    } catch (error) {
      console.error('Error generating share link:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white dark:bg-surface-800 w-full max-w-2xl rounded-lg shadow-xl p-6"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Share File</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="mb-4">
          <p className="text-surface-600 dark:text-surface-300 mb-2">
            Share "<span className="font-medium">{file.Name}</span>"
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="bg-surface-50 dark:bg-surface-700 p-6 rounded-lg">
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
                  disabled={isGenerating}
                >
                  {isGenerating ? 'Generating...' : 'Generate Share Link'}
                </motion.button>
              </div>
            </div>
          </div>
          
          <div>
            <div className="bg-surface-50 dark:bg-surface-700 p-6 rounded-lg h-full">
              <h3 className="text-lg font-semibold mb-4">Share Summary</h3>
              
              {shareLink ? (
                <div className="space-y-4">
                  <div className="p-4 bg-surface-100 dark:bg-surface-600 rounded-lg">
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
                        className="btn btn-primary rounded-l-none flex items-center gap-2"
                      >
                        {isCopied ? <Check size={16} /> : 'Copy'}
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-surface-100 dark:bg-surface-600 rounded-lg flex items-center gap-2">
                      <Lock size={16} className="text-secondary" />
                      <div>
                        <p className="text-sm font-medium">Protection</p>
                        <p className="text-xs text-surface-500 dark:text-surface-400">
                          {shareSettings.hasPassword ? 'Password protected' : 'No password'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-surface-100 dark:bg-surface-600 rounded-lg flex items-center gap-2">
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
                  <div className="w-16 h-16 mb-4 rounded-full bg-surface-100 dark:bg-surface-600 flex items-center justify-center">
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
        
        <div className="mt-6 flex justify-end">
          <button onClick={onClose} className="btn btn-outline">Done</button>
        </div>
      </motion.div>
    </div>
  );
};

export default ShareModal;