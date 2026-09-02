// ============================================
// OPTION B — Breathing Pulse Glow
// Soft colored shadow that pulses in and out like a heartbeat
// ============================================
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { useInView } from 'react-intersection-observer';
import { FaLinkedin, FaGithub, FaWhatsapp } from 'react-icons/fa';
import { EnvelopeIcon, DocumentArrowDownIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut', delay },
  }),
};

const Hero = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const socialLinks = [
    { icon: <FaLinkedin className="h-4 w-4 sm:h-5 sm:w-5" />, url: 'https://www.linkedin.com/in/muhammad-aqeel-51ba09343', label: 'LinkedIn', hoverClass: 'hover:bg-[#0077b5] hover:border-[#0077b5] hover:text-white' },
    { icon: <FaGithub className="h-4 w-4 sm:h-5 sm:w-5" />, url: 'https://github.com/Aqeel8211', label: 'GitHub', hoverClass: 'hover:bg-gray-800 hover:border-gray-800 hover:text-white' },
    { icon: <EnvelopeIcon className="h-4 w-4 sm:h-5 sm:w-5" />, url: 'mailto:m.aqeelch8211@gmail.com', label: 'Email', hoverClass: 'hover:bg-red-500 hover:border-red-500 hover:text-white' },
    { icon: <FaWhatsapp className="h-4 w-4 sm:h-5 sm:w-5" />, url: 'https://wa.me/923558608211', label: 'WhatsApp', hoverClass: 'hover:bg-green-500 hover:border-green-500 hover:text-white' },
  ];

  const navButtons = [
    { icon: '📁', label: 'Projects',   section: '#projects',   color: 'from-blue-600 to-blue-500' },
    { icon: '⚡', label: 'Skills',     section: '#skills',     color: 'from-purple-600 to-purple-500' },
    { icon: '💼', label: 'Experience', section: '#experience', color: 'from-emerald-600 to-emerald-500' },
    { icon: '🎓', label: 'Education',  section: '#education',  color: 'from-amber-600 to-amber-500' },
  ];

  const scrollToSection = (sectionId) => {
    const section = document.querySelector(sectionId);
    if (section) section.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden pt-24 pb-12">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950" />

      <div className="w-full max-w-3xl mx-auto px-5 sm:px-8 text-center" ref={ref}>

        {/* Profile Image — Option B: Breathing Pulse Glow */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          custom={0}
          className="mb-8 inline-block"
        >
          <div className="relative w-40 h-40 sm:w-44 sm:h-44 md:w-52 md:h-52 mx-auto">
            {/* Outer pulse glow — slow breathing */}
            <motion.div
              animate={{
                boxShadow: [
                  '0 0 0 0px rgba(59,130,246,0.4), 0 0 0 0px rgba(139,92,246,0.3)',
                  '0 0 0 14px rgba(59,130,246,0.15), 0 0 0 28px rgba(139,92,246,0.08)',
                  '0 0 0 0px rgba(59,130,246,0.4), 0 0 0 0px rgba(139,92,246,0.3)',
                ],
              }}
              transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-0 rounded-full"
            />
            {/* Gradient border */}
            <div className="absolute inset-0 rounded-full p-[3px]"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899)' }}>
              <div className="w-full h-full rounded-full bg-white dark:bg-gray-900" />
            </div>
            {/* Photo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              className="absolute inset-[3px] rounded-full overflow-hidden cursor-pointer z-10"
            >
              <img
                src="/images/profile/Picture_1.jpeg"
                alt="Muhammad Aqeel"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Name */}
        <motion.h1 variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'} custom={0.15}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-3 leading-tight">
          Muhammad Aqeel
        </motion.h1>

        {/* Typing animation */}
        <motion.div variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'} custom={0.22}
          className="text-base sm:text-lg md:text-xl text-gray-500 dark:text-gray-400 mb-4 h-7">
          <TypeAnimation
            sequence={['Full Stack Web Developer', 2000, 'ASP.NET Core + React + Angular', 2000, 'Available for Remote Work', 2000, 'Based in Pakistan · Open to Work', 2000]}
            wrapper="span" speed={55} repeat={Infinity}
            className="text-blue-600 dark:text-blue-400 font-semibold"
          />
        </motion.div>

        {/* Bio */}
        <motion.p variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'} custom={0.28}
          className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-xl mx-auto mb-7 leading-relaxed">
          Full Stack Developer specializing in ASP.NET Core, React and Angular. Shipped production web apps
          during my internship at DevelopersHub Corporation. Final-year CS student with a 3.7 CGPA — open to remote freelance work.
        </motion.p>

        {/* Social icons */}
        <motion.div variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'} custom={0.34}
          className="flex justify-center gap-3 mb-8">
          {socialLinks.map((social, index) => (
            <motion.a key={index} href={social.url} target="_blank" rel="noopener noreferrer" aria-label={social.label}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 transition-all duration-200 ${social.hoverClass}`}
              whileHover={{ scale: 1.15, rotate: 5 }} whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.08 }}>
              {social.icon}
            </motion.a>
          ))}
        </motion.div>

        {/* Nav buttons */}
        <motion.div variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'} custom={0.42}
          className="grid grid-cols-4 gap-2 sm:gap-3 mb-8 max-w-sm sm:max-w-md mx-auto">
          {navButtons.map((button, index) => (
            <motion.button key={button.label} onClick={() => scrollToSection(button.section)}
              className={`flex flex-col items-center gap-1 py-2.5 px-1 rounded-xl bg-gradient-to-r ${button.color} text-white font-medium shadow-md`}
              whileHover={{ scale: 1.06, y: -2, boxShadow: '0 10px 20px -5px rgba(0,0,0,0.2)' }}
              whileTap={{ scale: 0.96 }}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.08, type: 'spring', stiffness: 400, damping: 17 }}>
              <span className="text-lg leading-none">{button.icon}</span>
              <span className="text-[10px] sm:text-xs">{button.label}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* CTA buttons */}
        <motion.div variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'} custom={0.55}
          className="flex flex-col sm:flex-row gap-3 justify-center">
          <motion.a href="#contact"
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold shadow-lg"
            whileHover={{ scale: 1.05, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)' }} whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}>
            Hire Me
          </motion.a>
          <motion.a href="/cv/Muhammad_Aqeel_CV.pdf" download
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm font-semibold hover:border-blue-600 hover:text-blue-600 dark:hover:border-blue-400 dark:hover:text-blue-400 transition-colors duration-200 group"
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}>
            <DocumentArrowDownIcon className="h-4 w-4 group-hover:animate-bounce" />
            Download CV
            <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full">PDF</span>
          </motion.a>
          <motion.a href="/cv/Muhammad_Aqeel_CV.pdf" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm font-semibold hover:border-green-600 hover:text-green-600 dark:hover:border-green-400 dark:hover:text-green-400 transition-colors duration-200"
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}>
            <DocumentTextIcon className="h-4 w-4" />
            View CV
          </motion.a>
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;