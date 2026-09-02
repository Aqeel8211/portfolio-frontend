import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  DocumentArrowDownIcon, 
  LinkIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  PhotoIcon,
  XMarkIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { getCertifications, getAchievements } from '../services/api';

const Certifications = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [certifications, setCertifications] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [certResponse, achResponse] = await Promise.all([
        getCertifications(),
        getAchievements()
      ]);
      setCertifications(certResponse.data);
      setAchievements(achResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Combine certifications and achievements into one array
  const allItems = [
    ...certifications.map(item => ({ ...item, type: 'certification' })),
    ...achievements.map(item => ({ ...item, type: 'achievement' }))
  ].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  // Function to get layout classes based on number of items
  const getLayoutClasses = (itemCount) => {
    if (itemCount === 1) {
      return "flex justify-center";
    } else if (itemCount === 2) {
      return "grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto";
    } else {
      return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6";
    }
  };

  // Function to handle special positioning for items
  const getItemWrapperClasses = (index, totalItems) => {
    if (totalItems === 2) {
      return "";
    }
    if (totalItems === 4 && index === 3) {
      return "md:col-span-2 lg:col-span-3 flex justify-center mt-4";
    }
    return "";
  };

  const openModal = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
    document.body.style.overflow = 'auto';
  };

  if (loading) {
    return (
      <section id="certifications" className="py-20">
        <div className="container-padding mx-auto text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </section>
    );
  }

  if (allItems.length === 0) {
    return null;
  }

  const itemCount = allItems.length;

  return (
    <>
      <section id="certifications" className="py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="container-padding mx-auto">
          <motion.div
            ref={ref}
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="text-center mb-12"
          >
            <h2 className="section-title">Certifications & Achievements</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Professional certifications, courses completed, and notable achievements
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className={getLayoutClasses(itemCount)}
          >
            {allItems.map((item, index) => (
              <motion.div
                key={`${item.type}-${item.id}`}
                variants={itemVariants}
                className={`bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group flex flex-col ${
                  getItemWrapperClasses(index, itemCount)
                }`}
                style={itemCount === 4 && index === 3 ? { maxWidth: '400px', margin: '0 auto' } : {}}
              >
                {/* Image Section - 50% of card - FIXED */}
                <div className="relative h-64 overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600">
                  {(item.type === 'certification' || item.type === 'achievement') && item.imageUrl ? (
                    <img 
                      key={item.imageUrl}
                      src={item.imageUrl} 
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="eager"
                      onError={(e) => {
                        console.error('Image failed to load:', item.imageUrl);
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                        const parent = e.target.parentElement;
                        if (parent) {
                          const fallback = document.createElement('div');
                          fallback.className = 'w-full h-full flex items-center justify-center text-white text-4xl font-bold';
                          fallback.innerHTML = item.type === 'certification' ? '📜' : '🏆';
                          parent.appendChild(fallback);
                        }
                      }}
                      onLoad={() => console.log('Image loaded successfully:', item.imageUrl)}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white text-4xl font-bold">
                      {item.type === 'certification' ? '📜' : '🏆'}
                    </div>
                  )}
                  {/* Type Badge Overlay */}
                  <div className="absolute top-4 right-4">
                    {item.type === 'certification' && (
                      <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full">
                        Certificate
                      </span>
                    )}
                    {item.type === 'achievement' && (
                      <span className="text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded-full">
                        Achievement
                      </span>
                    )}
                  </div>
                </div>

                {/* Content Section - 50% of card */}
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  
                  {item.issuer && (
                    <div className="flex items-center mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <BuildingOfficeIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                      <span className="truncate">{item.issuer}</span>
                    </div>
                  )}

                  {(item.date || item.year) && (
                    <div className="flex items-center mb-3 text-sm text-gray-500 dark:text-gray-400">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      {item.date ? new Date(item.date).getFullYear() : item.year}
                    </div>
                  )}

                  {item.description && (
                    <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm line-clamp-3">
                      {item.description}
                    </p>
                  )}

                  {/* View Details Button */}
                  <button
                    onClick={() => openModal(item)}
                    className="mt-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium hover:shadow-lg transition-all duration-300 hover:scale-105"
                  >
                    <EyeIcon className="h-4 w-4" />
                    View Details
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Modal/Popup - FIXED */}
      <AnimatePresence>
        {isModalOpen && selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative bg-white dark:bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 z-10 p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <XMarkIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>

              {/* Modal Image - FIXED */}
              <div className="relative h-80 overflow-hidden rounded-t-2xl bg-gradient-to-r from-blue-600 to-purple-600">
                {(selectedItem.type === 'certification' || selectedItem.type === 'achievement') && selectedItem.imageUrl ? (
                  <img 
                    key={selectedItem.imageUrl}
                    src={selectedItem.imageUrl} 
                    alt={selectedItem.title}
                    className="w-full h-full object-cover"
                    loading="eager"
                    onError={(e) => {
                      console.error('Modal image failed to load:', selectedItem.imageUrl);
                      e.target.onerror = null;
                      e.target.style.display = 'none';
                      const parent = e.target.parentElement;
                      if (parent) {
                        const fallback = document.createElement('div');
                        fallback.className = 'w-full h-full flex items-center justify-center text-white text-6xl';
                        fallback.innerHTML = selectedItem.type === 'certification' ? '📜' : '🏆';
                        parent.appendChild(fallback);
                      }
                    }}
                    onLoad={() => console.log('Modal image loaded successfully:', selectedItem.imageUrl)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white text-6xl">
                    {selectedItem.type === 'certification' ? '📜' : '🏆'}
                  </div>
                )}
                <div className="absolute bottom-4 left-4">
                  {selectedItem.type === 'certification' && (
                    <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full">
                      Certificate
                    </span>
                  )}
                  {selectedItem.type === 'achievement' && (
                    <span className="text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-3 py-1 rounded-full">
                      Achievement
                    </span>
                  )}
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                  {selectedItem.title}
                </h2>

                {selectedItem.issuer && (
                  <div className="flex items-center mb-3 text-gray-600 dark:text-gray-400">
                    <BuildingOfficeIcon className="h-5 w-5 mr-2" />
                    <span>{selectedItem.issuer}</span>
                  </div>
                )}

                {(selectedItem.date || selectedItem.year) && (
                  <div className="flex items-center mb-4 text-gray-600 dark:text-gray-400">
                    <CalendarIcon className="h-5 w-5 mr-2" />
                    <span>{selectedItem.date ? new Date(selectedItem.date).getFullYear() : selectedItem.year}</span>
                  </div>
                )}

                {selectedItem.description && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Description</h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {selectedItem.description}
                    </p>
                  </div>
                )}

                {selectedItem.credentialId && (
                  <div className="mb-6 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-semibold">Credential ID:</span> {selectedItem.credentialId}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 mt-4">
                  {selectedItem.type === 'certification' && selectedItem.certificateUrl && (
                    <a
                      href={selectedItem.certificateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-all"
                    >
                      <DocumentArrowDownIcon className="h-4 w-4" />
                      View Certificate
                    </a>
                  )}
                  
                  {selectedItem.type === 'achievement' && selectedItem.imageUrl && (
                    <a
                      href={selectedItem.imageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium transition-all"
                    >
                      <PhotoIcon className="h-4 w-4" />
                      View Full Image
                    </a>
                  )}
                  
                  {selectedItem.credentialUrl && (
                    <a
                      href={selectedItem.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-600 hover:text-blue-600 transition-all text-sm font-medium"
                    >
                      <LinkIcon className="h-4 w-4" />
                      Verify Online
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Certifications;