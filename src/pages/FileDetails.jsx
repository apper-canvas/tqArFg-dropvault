import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { 
  ArrowLeft, 
  Download, 
  Pencil, 
  Share2, 
  Trash2, 
  File, 
  Image, 
  FileText, 
  Film, 
  Music, 
  Archive,
  Tag,
  User
} from 'lucide-react';
import { getFileById, deleteFile, updateFile } from '../services/fileService';
import { fetchShares } from '../services/shareService';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import ShareModal from '../components/ShareModal';

const FileDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [file, setFile] = useState(null);
  const [shares, setShares] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch file details
        const fileData = await getFileById(id);
        setFile(fileData);
        setEditedName(fileData.Name);
        
        // Fetch shares for this file
        const sharesData = await fetchShares({ fileId: id });
        setShares(sharesData);
      } catch (error) {
        console.error('Error loading file details:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [id]);
  
  const getFileIcon = (fileType) => {
    if (!fileType) return <File size={24} />;
    
    if (fileType.startsWith('image/')) return <Image size={24} />;
    if (fileType.startsWith('text/')) return <FileText size={24} />;
    if (fileType.startsWith('video/')) return <Film size={24} />;
    if (fileType.startsWith('audio/')) return <Music size={24} />;
    if (fileType.includes('zip') || fileType.includes('tar') || fileType.includes('rar')) return <Archive size={24} />;
    
    return <File size={24} />;
  };
  
  const formatFileSize = (bytes) => {
    if (!bytes || isNaN(bytes)) return '0 B';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };
  
  const handleDeleteFile = async () => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      try {
        await deleteFile(id);
        navigate('/dashboard');
      } catch (error) {
        console.error('Error deleting file:', error);
      }
    }
  };
  
  const handleUpdateFileName = async () => {
    try {
      await updateFile({
        Id: parseInt(id),
        Name: editedName
      });
      
      setFile(prev => ({
        ...prev,
        Name: editedName
      }));
      
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating file name:', error);
    }
  };

  return (
    <div className="flex min-h-screen bg-surface-50 dark:bg-surface-900 text-surface-800 dark:text-surface-100">
      <Sidebar />
      
      <div className="flex-1">
        <Header />
        
        <main className="p-6">
          <Link 
            to="/dashboard" 
            className="inline-flex items-center gap-2 mb-6 text-surface-600 dark:text-surface-400 hover:text-primary dark:hover:text-primary-light"
          >
            <ArrowLeft size={18} />
            <span>Back to dashboard</span>
          </Link>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <p>Loading file details...</p>
            </div>
          ) : file ? (
            <div>
              <div className="bg-white dark:bg-surface-800 rounded-lg shadow-sm border border-surface-200 dark:border-surface-700 p-6 mb-6">
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-surface-100 dark:bg-surface-700 rounded-lg">
                      {getFileIcon(file.type)}
                    </div>
                    
                    <div>
                      {isEditing ? (
                        <div className="flex items-center gap-2 mb-2">
                          <input 
                            type="text" 
                            value={editedName} 
                            onChange={(e) => setEditedName(e.target.value)}
                            className="input"
                          />
                          <button 
                            onClick={handleUpdateFileName}
                            className="btn btn-primary btn-sm"
                          >
                            Save
                          </button>
                          <button 
                            onClick={() => {
                              setIsEditing(false);
                              setEditedName(file.Name);
                            }}
                            className="btn btn-outline btn-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 mb-2">
                          <h1 className="text-2xl font-bold">{file.Name}</h1>
                          <button 
                            onClick={() => setIsEditing(true)}
                            className="p-1 rounded-full hover:bg-surface-200 dark:hover:bg-surface-700"
                          >
                            <Pencil size={16} />
                          </button>
                        </div>
                      )}
                      
                      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-surface-600 dark:text-surface-400">
                        <p>{file.type || 'Unknown type'}</p>
                        <p>{formatFileSize(file.size)}</p>
                        <p>Uploaded: {file.CreatedOn ? format(new Date(file.CreatedOn), 'MMM d, yyyy') : 'Unknown'}</p>
                        <p>Status: {file.status || 'Unknown'}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button className="btn btn-outline flex items-center gap-1">
                      <Download size={18} />
                      <span>Download</span>
                    </button>
                    
                    <button 
                      onClick={() => setShareModalOpen(true)}
                      className="btn btn-primary flex items-center gap-1"
                    >
                      <Share2 size={18} />
                      <span>Share</span>
                    </button>
                    
                    <button 
                      onClick={handleDeleteFile}
                      className="btn btn-outline-danger flex items-center gap-1"
                    >
                      <Trash2 size={18} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="bg-white dark:bg-surface-800 rounded-lg shadow-sm border border-surface-200 dark:border-surface-700 p-6">
                    <h2 className="text-xl font-bold mb-4">Preview</h2>
                    
                    <div className="flex items-center justify-center min-h-[300px] bg-surface-100 dark:bg-surface-700 rounded-lg p-6">
                      {/* File preview would go here - simple placeholder for now */}
                      <div className="p-6 rounded-full bg-surface-200 dark:bg-surface-600">
                        {getFileIcon(file.type)}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="bg-white dark:bg-surface-800 rounded-lg shadow-sm border border-surface-200 dark:border-surface-700 p-6 mb-6">
                    <h2 className="text-xl font-bold mb-4">Details</h2>
                    
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <User className="w-5 h-5 mt-0.5 text-surface-500" />
                        <div>
                          <h3 className="font-medium">Owner</h3>
                          <p className="text-surface-600 dark:text-surface-400">{file.Owner?.Name || 'You'}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <Tag className="w-5 h-5 mt-0.5 text-surface-500" />
                        <div>
                          <h3 className="font-medium">Tags</h3>
                          <div className="mt-1">
                            {file.Tags && file.Tags.length > 0 ? (
                              <div className="flex flex-wrap gap-2">
                                {file.Tags.map(tag => (
                                  <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary dark:bg-primary/20">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <p className="text-surface-600 dark:text-surface-400">No tags</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-surface-800 rounded-lg shadow-sm border border-surface-200 dark:border-surface-700 p-6">
                    <h2 className="text-xl font-bold mb-4">Shares</h2>
                    
                    {shares.length > 0 ? (
                      <div className="space-y-3">
                        {shares.map(share => (
                          <div key={share.Id} className="p-3 bg-surface-100 dark:bg-surface-700 rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                              <div className="truncate">
                                <p className="font-medium">{share.Name}</p>
                                <p className="text-xs text-surface-500 dark:text-surface-400 truncate">{share.link}</p>
                              </div>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <span className={`${share.is_public ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`}>
                                {share.is_public ? 'Public' : 'Private'}
                              </span>
                              <span className="text-surface-500 dark:text-surface-400">
                                {share.CreatedOn ? format(new Date(share.CreatedOn), 'MMM d, yyyy') : 'Unknown'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-surface-600 dark:text-surface-400">No shares created yet.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-xl font-bold mb-2">File not found</h2>
              <p className="text-surface-600 dark:text-surface-400 mb-6">
                The file you're looking for doesn't exist or has been deleted.
              </p>
              <Link to="/dashboard" className="btn btn-primary">
                Return to Dashboard
              </Link>
            </div>
          )}
        </main>
      </div>
      
      <ShareModal 
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        file={file}
      />
    </div>
  );
};

export default FileDetails;