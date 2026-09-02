import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const stats = [
  { value: '3.7', label: 'CGPA', suffix: '' },
  { value: '10', label: 'Projects', suffix: '+' },
  { value: '1', label: 'Internship', suffix: '' },
];

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

const About = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="about" className="py-12 sm:py-16 md:py-20 bg-gray-50 dark:bg-gray-800/50">
      <div className="container-padding mx-auto">
        
        {/* Section Header - Responsive */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="text-center mb-8 sm:mb-10 md:mb-12"
        >
          <h2 className="section-title">About Me</h2>
          <div className="w-20 sm:w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
        </motion.div>

        {/* Responsive Layout: Stack on mobile, side by side on desktop */}
        <div className="flex flex-col lg:flex-row gap-8 md:gap-12 items-center max-w-6xl mx-auto">
          
          {/* LEFT COLUMN - Photo + Stats (Full width on mobile, half on desktop) */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="w-full lg:w-1/2 flex flex-col gap-6"
          >
            {/* Profile Picture - Responsive size */}
            <motion.div variants={itemVariants} className="flex justify-center">
              <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64">
                {/* Offset decorative block */}
                <div className="absolute inset-0 translate-x-2 sm:translate-x-3 translate-y-2 sm:translate-y-3 rounded-2xl bg-blue-100 dark:bg-blue-900/30" />
                <div className="relative w-full h-full rounded-2xl overflow-hidden ring-1 ring-gray-200 dark:ring-gray-700 bg-gray-100 dark:bg-gray-800">
                  <img
                    src="/images/profile/Picture_2.jpeg"
                    alt="Muhammad Aqeel"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </motion.div>

            {/* Stats Row - Responsive grid */}
            <motion.div variants={itemVariants} className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 w-full">
              {stats.map((s, i) => (
                <div
                  key={s.label}
                  className="flex flex-col items-center p-2 sm:p-3 md:p-4 rounded-xl bg-white dark:bg-gray-900 shadow-md hover:shadow-lg transition-shadow"
                >
                  <span className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tabular-nums">
                    {s.value}<span className="text-blue-500">{s.suffix}</span>
                  </span>
                  <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-0.5 text-center">{s.label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* RIGHT COLUMN - Biography (Full width on mobile, half on desktop) */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="w-full lg:w-1/2 space-y-3 sm:space-y-4 text-gray-600 dark:text-gray-400 text-sm sm:text-base md:text-[1.05rem] leading-relaxed"
          >
            <motion.p variants={itemVariants}>
              I'm <span className="font-semibold text-gray-900 dark:text-white">Muhammad Aqeel</span>, a Full Stack Developer with hands-on experience building production-ready web applications using <span className="font-medium text-blue-600 dark:text-blue-400">React, ASP.NET Core, and Angular</span>.
            </motion.p>
            <motion.p variants={itemVariants}>
              During my internship at <span className="font-medium text-gray-800 dark:text-gray-200">DevelopersHub Corporation</span>, I built and deployed two complete projects: an <span className="font-medium text-green-600 dark:text-green-400">E‑Commerce Platform</span> and <span className="font-medium text-purple-600 dark:text-purple-400">Nexus</span> – a collaboration platform for investors and entrepreneurs. I have also developed <span className="font-medium text-blue-600 dark:text-blue-400">DineStay AI</span>, <span className="font-medium text-orange-600 dark:text-orange-400">Smart Study Companion</span>,  <span className="font-medium text-emerald-600 dark:text-emerald-400">Coin Collector</span> and others projects during my university coursework.
            </motion.p>
            <motion.p variants={itemVariants}>
              I focus on writing <span className="font-medium text-blue-600 dark:text-blue-400">clean, maintainable code</span> and creating <span className="font-medium text-blue-600 dark:text-blue-400">responsive, user-friendly interfaces</span>. Currently in my final year of Computer Science <span className="font-medium">(3.7 CGPA)</span> at the <span className="font-semibold text-blue-600 dark:text-blue-400"> University of Poonch Rawalakot</span>, I'm looking for opportunities to grow as a developer and contribute to meaningful projects. I turn ideas into working applications – from database design to deployed APIs to responsive frontends.
            </motion.p>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default About;