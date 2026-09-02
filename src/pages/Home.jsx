import { Helmet } from 'react-helmet-async';
import Hero from '../components/Hero';
import About from '../components/About';
import Skills from '../components/Skills';
import Projects from '../components/Projects';
import Experience from '../components/Experience';
import Education from '../components/Education';
import Certifications from '../components/Certifications';
import Contact from '../components/Contact';

const Home = () => {
  return (
    <>
      <Helmet>
        <title>Muhammad Aqeel - Full Stack Developer Portfolio</title>
        <meta name="description" content="Full Stack Developer specializing in React and .NET. View my projects, skills, and experience." />
      </Helmet>
      
      <Hero />
      <About />
      <Projects />
      <Skills />
      <Experience />
      <Education />
      <Certifications />
      <Contact />
    </>
  );
};

export default Home;