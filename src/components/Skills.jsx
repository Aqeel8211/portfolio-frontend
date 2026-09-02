import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  CodeBracketIcon, 
  ServerIcon, 
  CircleStackIcon,
  CommandLineIcon,
  UserGroupIcon,
  LightBulbIcon 
} from '@heroicons/react/24/outline';
import { getSkills } from '../services/api';

const Skills = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const response = await getSkills();
      setSkills(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load skills. Please try again later.');
      console.error('Error fetching skills:', err);
    } finally {
      setLoading(false);
    }
  };

  // Group skills by category
  const skillCategories = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {});

  // Category icons mapping
  const categoryIcons = {
    'Frontend': <CodeBracketIcon className="h-8 w-8 text-blue-600" />,
    'Backend': <ServerIcon className="h-8 w-8 text-purple-600" />,
    'Database': <CircleStackIcon className="h-8 w-8 text-green-600" />,
    'Tools': <CommandLineIcon className="h-8 w-8 text-orange-600" />,
    'Soft Skills': <UserGroupIcon className="h-8 w-8 text-red-600" />,
    'Other': <LightBulbIcon className="h-8 w-8 text-yellow-600" />
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
      <section id="skills" className="py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="container-padding mx-auto text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading skills...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="skills" className="py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="container-padding mx-auto text-center">
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <button 
            onClick={fetchSkills}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="skills" className="py-20 bg-gray-50 dark:bg-gray-800/50">
      <div className="container-padding mx-auto">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="text-center mb-12"
        >
          <h2 className="section-title">Technical Skills</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            A comprehensive overview of my technical expertise and proficiency levels
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {Object.entries(skillCategories).map(([category, categorySkills], index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center mb-4">
                {categoryIcons[category] || <CodeBracketIcon className="h-8 w-8 text-blue-600" />}
                <h3 className="text-xl font-semibold ml-2">{category}</h3>
              </div>
              <div className="space-y-4">
                {categorySkills.map((skill) => (
                  <div key={skill.id}>
                    <div className="flex justify-between mb-1 text-sm">
                      <span className="text-gray-700 dark:text-gray-300">{skill.name}</span>
                      <span className="text-gray-500 dark:text-gray-400">{skill.proficiency}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={inView ? { width: `${skill.proficiency}%` } : { width: 0 }}
                        transition={{ duration: 1, delay: 0.2 + index * 0.1 }}
                        className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;