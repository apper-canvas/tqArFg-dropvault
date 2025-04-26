import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MainFeature from '../components/MainFeature';
import { FileText, Upload, Shield, Share2 } from 'lucide-react';

const Home = () => {
  const [activeTab, setActiveTab] = useState('upload');
  
  const features = [
    {
      id: 'upload',
      title: "Upload Files",
      icon: <Upload className="text-primary" />,
      description: "Drag & drop or select files to upload securely to your vault."
    },
    {
      id: 'manage',
      title: "Manage Files",
      icon: <FileText className="text-secondary" />,
      description: "Organize your files with folders, tags, and powerful search."
    },
    {
      id: 'share',
      title: "Share Securely",
      icon: <Share2 className="text-accent" />,
      description: "Generate secure links with custom permissions and expiration dates."
    },
    {
      id: 'security',
      title: "Enhanced Security",
      icon: <Shield className="text-primary-dark" />,
      description: "End-to-end encryption and password protection for your sensitive files."
    }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <section className="mb-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Secure File Sharing Made Simple
          </h1>
          <p className="text-lg text-surface-600 dark:text-surface-300 max-w-2xl mx-auto">
            Upload, organize, and share your files with confidence using DropVault's secure platform.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className={`card p-6 cursor-pointer ${activeTab === feature.id ? 'ring-2 ring-primary dark:ring-primary-light' : ''}`}
              onClick={() => setActiveTab(feature.id)}
            >
              <div className="mb-4 p-3 rounded-full inline-flex bg-surface-100 dark:bg-surface-700">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-surface-600 dark:text-surface-400 text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="card p-6 md:p-8"
          >
            <MainFeature activeFeature={activeTab} />
          </motion.div>
        </AnimatePresence>
      </section>
    </div>
  );
};

export default Home;