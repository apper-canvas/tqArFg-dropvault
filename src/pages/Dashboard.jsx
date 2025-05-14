import { useState, useEffect, useContext } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { PieChart, Users, Clock, Upload } from 'lucide-react';
import { fetchFiles } from '../services/fileService';
import { fetchShares } from '../services/shareService';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import FileList from '../components/FileList';
import FileUpload from '../components/FileUpload';
import ShareModal from '../components/ShareModal';
import { AuthContext } from '../App';

const Dashboard = () => {
  const { user } = useSelector(state => state.user);
  const { darkMode } = useContext(AuthContext);
  
  const [files, setFiles] = useState([]);
  const [recentShares, setRecentShares] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  
  // Fetch data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch files
        const filesData = await fetchFiles();
        setFiles(filesData);
        
        // Fetch recent shares
        const sharesData = await fetchShares({}, 0, 5);
        setRecentShares(sharesData);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  const handleDeleteFile = (fileId) => {
    // In a real app, implement delete confirmation
    console.log(`Delete file ${fileId}`);
  };
  
  const handleShareFile = (file) => {
    setSelectedFile(file);
    setShareModalOpen(true);
  };
  
  const refreshData = async () => {
    try {
      const filesData = await fetchFiles();
      setFiles(filesData);
    } catch (error) {
      console.error('Error refreshing files:', error);
    }
  };

  return (
    <div className="flex min-h-screen bg-surface-50 dark:bg-surface-900 text-surface-800 dark:text-surface-100">
      <Sidebar openUploadModal={() => setShowUploadModal(true)} />
      
      <div className="flex-1">
        <Header />
        
        <main className="p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-surface-600 dark:text-surface-400">
              Welcome back, {user?.firstName || 'User'}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-surface-800 rounded-lg p-6 shadow-sm border border-surface-200 dark:border-surface-700">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-semibold">Storage Used</h3>
                <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                  <PieChart size={18} />
                </div>
              </div>
              <p className="text-2xl font-bold mb-1">2.4 GB</p>
              <p className="text-sm text-surface-500 dark:text-surface-400">of 10 GB (24%)</p>
              <div className="w-full h-2 bg-surface-200 dark:bg-surface-700 rounded-full mt-3">
                <div className="h-2 bg-blue-500 rounded-full" style={{ width: '24%' }}></div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-surface-800 rounded-lg p-6 shadow-sm border border-surface-200 dark:border-surface-700">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-semibold">Active Shares</h3>
                <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400">
                  <Users size={18} />
                </div>
              </div>
              <p className="text-2xl font-bold">{recentShares?.length || 0}</p>
              <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">active share links</p>
            </div>
            
            <div className="bg-white dark:bg-surface-800 rounded-lg p-6 shadow-sm border border-surface-200 dark:border-surface-700">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-semibold">Recent Activity</h3>
                <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400">
                  <Clock size={18} />
                </div>
              </div>
              <p className="text-2xl font-bold">
                {files.length > 0 ? format(new Date(files[0]?.CreatedOn || new Date()), 'MMM d') : 'No activity'}
              </p>
              <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">last upload</p>
            </div>
            
            <div className="bg-white dark:bg-surface-800 rounded-lg p-6 shadow-sm border border-surface-200 dark:border-surface-700">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-semibold">Total Files</h3>
                <div className="p-2 rounded-full bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400">
                  <Upload size={18} />
                </div>
              </div>
              <p className="text-2xl font-bold">{files?.length || 0}</p>
              <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">files uploaded</p>
            </div>
          </div>
          
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Recent Files</h2>
              <button className="btn btn-outline" onClick={refreshData}>Refresh</button>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <p>Loading files...</p>
              </div>
            ) : (
              <FileList 
                files={files} 
                onDeleteFile={handleDeleteFile}
                onShareFile={handleShareFile}
              />
            )}
          </div>
        </main>
        
        <footer className="px-6 py-4 border-t border-surface-200 dark:border-surface-700 text-center text-surface-500 dark:text-surface-400 text-sm">
          © {new Date().getFullYear()} DropVault. All rights reserved.
        </footer>
      </div>
      
      {/* Modals */}
      <FileUpload 
        isOpen={showUploadModal} 
        onClose={() => setShowUploadModal(false)}
        onUploadComplete={() => {
          setShowUploadModal(false);
          refreshData();
        }}
      />
      
      <ShareModal 
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        file={selectedFile}
      />
    </div>
  );
};

export default Dashboard;