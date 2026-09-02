import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { BriefcaseIcon } from '@heroicons/react/24/outline';
import { getExperiences } from '../services/api';

const Experience = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      setLoading(true);
      const response = await getExperiences();
      setExperiences(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load experiences. Please try again later.');
      console.error('Error fetching experiences:', err);
    } finally {
      setLoading(false);
    }
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
      <section id="experience" className="py-12 sm:py-16 md:py-20">
        <div className="container-padding mx-auto text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400 text-sm sm:text-base">Loading experience...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="experience" className="py-12 sm:py-16 md:py-20">
        <div className="container-padding mx-auto text-center">
          <p className="text-red-600 dark:text-red-400 text-sm sm:text-base">{error}</p>
          <button 
            onClick={fetchExperiences}
            className="mt-4 px-4 py-2 sm:px-6 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="experience" className="py-12 sm:py-16 md:py-20">
      <div className="container-padding mx-auto">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="text-center mb-8 sm:mb-10 md:mb-12"
        >
          <h2 className="section-title">Work Experience</h2>
          <p className="section-subtitle">
            Professional experience and internships
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="max-w-4xl mx-auto px-4 sm:px-0"
        >
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.id}
              variants={itemVariants}
              className="relative pl-6 sm:pl-8 pb-8 sm:pb-12 last:pb-0"
            >
              {/* Timeline line - Responsive */}
              {index < experiences.length - 1 && (
                <div className="absolute left-2 sm:left-3 top-6 sm:top-8 bottom-0 w-0.5 bg-gradient-to-b from-blue-600 to-purple-600"></div>
              )}
              
              {/* Timeline dot - Responsive */}
              <div className="absolute left-0 top-1 sm:top-2 w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full"></div>
              </div>

              {/* Content - Responsive */}
              <div className="bg-white dark:bg-gray-900 rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3 sm:gap-0">
                  <div className="flex items-center">
                    <BriefcaseIcon className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 mr-2 sm:mr-3" />
                    <div>
                      <h3 className="text-base sm:text-lg md:text-xl font-bold">{exp.position}</h3>
                      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">{exp.company}</p>
                    </div>
                  </div>
                  <span className="text-xs sm:text-sm bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full self-start sm:self-center">
                    {exp.duration}
                  </span>
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 mb-3 sm:mb-4 text-xs sm:text-sm">{exp.description}</p>
                
                {exp.achievements && (
                  <ul className="space-y-1 sm:space-y-2 mb-3 sm:mb-4">
                    {exp.achievements.split(';').map((achievement, i) => (
                      <li key={i} className="flex items-start text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
                        <span className="text-blue-600 mr-1 sm:mr-2">✓</span>
                        {achievement.trim()}
                      </li>
                    ))}
                  </ul>
                )}

                {exp.technologies && (
                  <div className="flex flex-wrap gap-1 sm:gap-2">
                    {exp.technologies.split(',').map((tech, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 sm:px-3 sm:py-1 bg-gray-200 dark:bg-gray-800 rounded-full text-[10px] sm:text-xs"
                      >
                        {tech.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Experience;