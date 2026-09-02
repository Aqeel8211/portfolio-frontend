import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { AcademicCapIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { getEducation } from '../services/api';

const Education = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEducation();
  }, []);

  const fetchEducation = async () => {
    try {
      setLoading(true);
      const response = await getEducation();
      setEducation(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load education. Please try again later.');
      console.error('Error fetching education:', err);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

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

  if (loading) {
    return (
      <section id="education" className="py-12 sm:py-16 md:py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="container-padding mx-auto text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400 text-sm sm:text-base">Loading education...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="education" className="py-12 sm:py-16 md:py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="container-padding mx-auto text-center">
          <p className="text-red-600 dark:text-red-400 text-sm sm:text-base">{error}</p>
          <button 
            onClick={fetchEducation}
            className="mt-4 px-4 py-2 sm:px-6 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="education" className="py-12 sm:py-16 md:py-20 bg-gray-50 dark:bg-gray-800/50">
      <div className="container-padding mx-auto">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="text-center mb-8 sm:mb-10 md:mb-12"
        >
          <h2 className="section-title">Education</h2>
          <p className="section-subtitle">
            My academic journey from Matriculation to University
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="max-w-4xl mx-auto px-4 sm:px-0"
        >
          {education.map((edu, index) => (
            <motion.div
              key={edu.id}
              variants={itemVariants}
              className="relative pl-6 sm:pl-8 pb-8 sm:pb-12 last:pb-0"
            >
              {/* Timeline line - Responsive */}
              {index < education.length - 1 && (
                <div className="absolute left-2 sm:left-3 top-6 sm:top-8 bottom-0 w-0.5 bg-gradient-to-b from-blue-600 to-purple-600"></div>
              )}
              
              {/* Timeline dot - Responsive */}
              <div className={`absolute left-0 top-1 sm:top-2 w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r ${
                index === 0 ? 'from-blue-600 to-purple-600' : 
                index === 1 ? 'from-green-600 to-teal-600' : 
                'from-orange-600 to-red-600'
              } rounded-full flex items-center justify-center`}>
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full"></div>
              </div>

              {/* Content - Responsive */}
              <div className="bg-white dark:bg-gray-900 rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center mb-4 gap-3 sm:gap-0">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r ${
                    index === 0 ? 'from-blue-600 to-purple-600' : 
                    index === 1 ? 'from-green-600 to-teal-600' : 
                    'from-orange-600 to-red-600'
                  } rounded-lg flex items-center justify-center text-white`}>
                    <AcademicCapIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <div className="flex-1 sm:ml-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <h3 className="text-base sm:text-lg md:text-xl font-bold">{edu.degree}</h3>
                      <span className={`text-xs sm:text-sm bg-gradient-to-r ${
                        index === 0 ? 'from-blue-600 to-purple-600' : 
                        index === 1 ? 'from-green-600 to-teal-600' : 
                        'from-orange-600 to-red-600'
                      } text-white px-2 py-0.5 sm:px-3 sm:py-1 rounded-full self-start sm:self-center`}>
                        {edu.duration}
                      </span>
                    </div>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">{edu.institution}</p>
                  </div>
                </div>
                
                {/* Date Section - Responsive */}
                {(edu.startDate || edu.endDate) && (
                  <div className="flex items-center mb-3 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    <CalendarIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    <span>
                      {edu.startDate && formatDate(edu.startDate)}
                      {edu.startDate && edu.endDate && ' - '}
                      {edu.endDate ? formatDate(edu.endDate) : 'Present'}
                    </span>
                  </div>
                )}
                
                <p className="text-gray-600 dark:text-gray-400 mb-3 sm:mb-4 italic text-xs sm:text-sm">
                  "{edu.description}"
                </p>
                
                {edu.achievements && (
                  <ul className="space-y-1 sm:space-y-2">
                    {edu.achievements.split(';').map((achievement, i) => (
                      <li key={i} className="flex items-start text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
                        <span className={`text-transparent bg-gradient-to-r ${
                          index === 0 ? 'from-blue-600 to-purple-600' : 
                          index === 1 ? 'from-green-600 to-teal-600' : 
                          'from-orange-600 to-red-600'
                        } bg-clip-text mr-1 sm:mr-2 font-bold`}>✓</span>
                        {achievement.trim()}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Education;