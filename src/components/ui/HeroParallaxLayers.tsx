import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, MotionValue } from 'framer-motion';
import {
  Sparkles, ArrowRight, Brain, Briefcase, Award, TrendingUp,
  Star, Compass, Layers, Zap
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export interface ParallaxProduct {
  title: string;
  link: string;
  thumbnail: string;
  domain: string;
  salary: string;
  demand: 'high' | 'very_high' | 'emerging';
  matchScore: number;
}

export const HeroParallaxLayers: React.FC<{
  products?: ParallaxProduct[];
  headerTitle?: string;
  headerHighlight?: string;
  headerSubtitle?: string;
  onTakeQuiz?: () => void;
  onExploreCareers?: () => void;
}> = ({
  products = DEFAULT_PRODUCTS,
  headerTitle = 'Architect Your Future.',
  headerHighlight = 'Own Your Trajectory.',
  headerSubtitle = 'The unified career platform empowering students, graduates, and professionals with AI career matching, 150+ masterclasses, ATS resume tools, and real-time hiring benchmarks.',
  onTakeQuiz,
  onExploreCareers,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Silky smooth spring damping for high-end feel
  const springConfig = { stiffness: 85, damping: 24, mass: 0.1 };

  const translateX = useSpring(useTransform(scrollYProgress, [0, 1], [0, 360]), springConfig);
  const translateXReverse = useSpring(useTransform(scrollYProgress, [0, 1], [0, -360]), springConfig);
  const rotateX = useSpring(useTransform(scrollYProgress, [0, 0.45], [16, 0]), springConfig);
  const opacity = useSpring(useTransform(scrollYProgress, [0, 0.25], [0.8, 1]), springConfig);
  const rotateZ = useSpring(useTransform(scrollYProgress, [0, 0.45], [8, 0]), springConfig);
  const translateY = useSpring(useTransform(scrollYProgress, [0, 0.45], [-80, 50]), springConfig);

  const firstRow = products.slice(0, 5);
  const secondRow = products.slice(5, 10);
  const thirdRow = products.slice(10, 15);

  return (
    <div
      ref={containerRef}
      className="relative min-h-[115vh] sm:min-h-[130vh] pt-6 pb-20 overflow-hidden flex flex-col items-center [perspective:1200px] [transform-style:preserve-3d]"
    >
      {/* Dynamic Ambient Background Glows & Mesh */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[1100px] h-[400px] bg-gradient-to-tr from-purple-600/20 via-indigo-600/15 to-transparent blur-[120px] pointer-events-none rounded-full animate-pulse" style={{ animationDuration: '6s' }} />
      <div className="absolute top-1/3 right-10 w-[350px] h-[350px] bg-fuchsia-500/10 blur-[90px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 left-10 w-[350px] h-[350px] bg-blue-500/10 blur-[90px] pointer-events-none rounded-full" />

      {/* ── Top Hero Header Section ── */}
      <Header
        title={headerTitle}
        highlight={headerHighlight}
        subtitle={headerSubtitle}
        onTakeQuiz={onTakeQuiz}
        onExploreCareers={onExploreCareers}
      />

      {/* ── 3D Parallax Layers Container (Silky & Responsive) ── */}
      <motion.div
        style={{
          rotateX,
          rotateZ,
          translateY,
          opacity,
        }}
        className="w-full space-y-6 sm:space-y-8 mt-2 sm:mt-6 will-change-transform"
      >
        {/* Layer Row 1 — Smooth Right Shift + Gentle Ambient Drift */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-row-reverse space-x-reverse space-x-5 sm:space-x-8"
        >
          {firstRow.map((product, idx) => (
            <ProductCard product={product} translate={translateX} index={idx} key={product.title} />
          ))}
        </motion.div>

        {/* Layer Row 2 — Smooth Left Shift + Gentle Ambient Drift */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 8.5, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-row space-x-5 sm:space-x-8"
        >
          {secondRow.map((product, idx) => (
            <ProductCard product={product} translate={translateXReverse} index={idx + 5} key={product.title} />
          ))}
        </motion.div>

        {/* Layer Row 3 — Smooth Right Shift + Gentle Ambient Drift */}
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-row-reverse space-x-reverse space-x-5 sm:space-x-8"
        >
          {thirdRow.map((product, idx) => (
            <ProductCard product={product} translate={translateX} index={idx + 10} key={product.title} />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

const Header: React.FC<{
  title: string;
  highlight: string;
  subtitle: string;
  onTakeQuiz?: () => void;
  onExploreCareers?: () => void;
}> = ({ title, highlight, subtitle, onTakeQuiz, onExploreCareers }) => {
  const navigate = useNavigate();

  return (
    <div className="max-w-5xl relative mx-auto pt-4 sm:pt-6 pb-8 px-4 sm:px-6 lg:px-8 w-full text-center flex flex-col items-center z-10">
      {/* Top Badge — enters first */}
      <motion.div
        initial={{ opacity: 0, y: -16, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-50/90 backdrop-blur-md border border-purple-200/90 text-[#4F20C9] text-xs font-bold tracking-wide mb-6 shadow-sm hover:shadow-md transition-shadow cursor-default"
      >
        <Sparkles className="w-3.5 h-3.5 text-[#4F20C9] animate-spin" style={{ animationDuration: '8s' }} />
        <span>Next-Gen Career Intelligence Platform</span>
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
      </motion.div>

      {/* Main Hero Headline — enters second with smooth spring delay */}
      <motion.h1
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
        className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-slate-900 mb-5 tracking-tight leading-[1.04]"
        style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
      >
        {title}
        <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F20C9] via-indigo-600 to-purple-500">
          {highlight}
        </span>
      </motion.h1>

      {/* Subtitle — enters third */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, delay: 0.26, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-2xl text-sm sm:text-base md:text-lg text-slate-600 font-medium leading-relaxed mb-8 px-2"
      >
        {subtitle}
      </motion.p>

      {/* Hero CTAs — enter last with hover springs */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.38, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full max-w-md px-2"
      >
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => (onTakeQuiz ? onTakeQuiz() : navigate('/quiz'))}
          className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-[#4F20C9] via-indigo-600 to-purple-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs uppercase tracking-wider shadow-xl shadow-purple-500/30 flex items-center justify-center gap-2.5 transition-all cursor-pointer whitespace-nowrap"
        >
          <Brain className="w-4 h-4 text-purple-200" />
          <span>Take Career Assessment</span>
          <ArrowRight className="w-4 h-4" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => (onExploreCareers ? onExploreCareers() : navigate('/careers'))}
          className="w-full sm:w-auto px-8 py-4 rounded-full bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 shadow-md font-bold text-xs uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap"
        >
          Explore Career Bank
        </motion.button>
      </motion.div>
    </div>
  );
};

const ProductCard: React.FC<{
  product: ParallaxProduct;
  translate: MotionValue<number>;
  index?: number;
}> = ({ product, translate, index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: (index % 5) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      style={{
        x: translate,
      }}
      whileHover={{
        y: -12,
        scale: 1.04,
      }}
      key={product.title}
      className="group/product h-64 sm:h-76 w-[250px] sm:w-[330px] relative shrink-0 rounded-[28px] overflow-hidden bg-slate-950 border border-white/10 shadow-lg hover:shadow-2xl hover:shadow-purple-500/25 hover:border-purple-400/80 transition-all duration-300 backdrop-blur-sm cursor-pointer"
    >
      <Link to={product.link} className="block h-full w-full relative">
        {/* High-Resolution Background Image with Cinematic Hover Zoom */}
        <img
          src={product.thumbnail}
          alt={product.title}
          className="object-cover object-center absolute h-full w-full inset-0 group-hover/product:scale-110 transition-transform duration-700 ease-out"
        />

        {/* Multi-Stop Gradient Vignette for Maximum Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
        <div className="absolute inset-0 bg-purple-900/10 opacity-0 group-hover/product:opacity-100 transition-opacity duration-300" />

        {/* Top Badges: Match Score & Demand */}
        <div className="absolute top-3.5 inset-x-3.5 flex items-center justify-between z-10">
          <span className="px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-emerald-300 border border-emerald-500/40 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-sm">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            {product.matchScore}% Match
          </span>
          <span className="px-2.5 py-1 rounded-full bg-purple-900/70 backdrop-blur-md text-purple-200 border border-purple-400/30 text-[10px] font-bold uppercase tracking-wider shadow-sm">
            {product.domain}
          </span>
        </div>

        {/* Bottom Information Overlay */}
        <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 text-white space-y-1.5 z-10">
          <h3 className="font-extrabold text-sm sm:text-base leading-snug text-white group-hover/product:text-purple-200 transition-colors line-clamp-1">
            {product.title}
          </h3>
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300 pt-0.5">
            <span className="text-slate-200 font-bold">{product.salary}</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30 text-[10px]">
              <TrendingUp className="w-3 h-3" /> High Growth
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export const DEFAULT_PRODUCTS: ParallaxProduct[] = [
  {
    title: 'Senior Full-Stack Engineer',
    link: '/careers',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop',
    domain: 'Software & Cloud',
    salary: '$120,000 - $165,000',
    demand: 'high',
    matchScore: 96,
  },
  {
    title: 'AI & Neural Network Architect',
    link: '/careers',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
    domain: 'AI & Data Science',
    salary: '$140,000 - $190,000',
    demand: 'very_high',
    matchScore: 94,
  },
  {
    title: 'Lead UI/UX Product Designer',
    link: '/careers',
    thumbnail: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=800&auto=format&fit=crop',
    domain: 'Design Systems',
    salary: '$95,000 - $140,000',
    demand: 'high',
    matchScore: 91,
  },
  {
    title: 'Cybersecurity Incident Analyst',
    link: '/careers',
    thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop',
    domain: 'Cybersecurity',
    salary: '$105,000 - $150,000',
    demand: 'high',
    matchScore: 89,
  },
  {
    title: 'Cloud DevOps & Kubernetes Lead',
    link: '/careers',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop',
    domain: 'Cloud Infra',
    salary: '$130,000 - $175,000',
    demand: 'very_high',
    matchScore: 95,
  },
  {
    title: 'Product Growth Manager',
    link: '/careers',
    thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop',
    domain: 'Product Strategy',
    salary: '$110,000 - $160,000',
    demand: 'high',
    matchScore: 88,
  },
  {
    title: 'Machine Learning Research Engineer',
    link: '/careers',
    thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop',
    domain: 'AI Research',
    salary: '$150,000 - $210,000',
    demand: 'very_high',
    matchScore: 97,
  },
  {
    title: 'Blockchain & Smart Contract Dev',
    link: '/careers',
    thumbnail: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=800&auto=format&fit=crop',
    domain: 'Web3 & Fintech',
    salary: '$125,000 - $180,000',
    demand: 'emerging',
    matchScore: 87,
  },
  {
    title: 'Data Platform Engineer',
    link: '/careers',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
    domain: 'Big Data',
    salary: '$115,000 - $160,000',
    demand: 'high',
    matchScore: 92,
  },
  {
    title: 'Mobile iOS/Android Engineer',
    link: '/careers',
    thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=800&auto=format&fit=crop',
    domain: 'Mobile Dev',
    salary: '$105,000 - $155,000',
    demand: 'high',
    matchScore: 90,
  },
  {
    title: 'Enterprise Solutions Architect',
    link: '/careers',
    thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop',
    domain: 'Architecture',
    salary: '$160,000 - $220,000',
    demand: 'very_high',
    matchScore: 98,
  },
  {
    title: 'Digital Marketing & SEO Lead',
    link: '/careers',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop',
    domain: 'Growth Marketing',
    salary: '$85,000 - $130,000',
    demand: 'high',
    matchScore: 86,
  },
  {
    title: 'Autonomous Systems Engineer',
    link: '/careers',
    thumbnail: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=800&auto=format&fit=crop',
    domain: 'Robotics & IoT',
    salary: '$135,000 - $185,000',
    demand: 'emerging',
    matchScore: 93,
  },
  {
    title: 'Fintech Quantitative Analyst',
    link: '/careers',
    thumbnail: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=800&auto=format&fit=crop',
    domain: 'Quant & Finance',
    salary: '$140,000 - $200,000',
    demand: 'high',
    matchScore: 94,
  },
  {
    title: 'DevSecOps Specialist',
    link: '/careers',
    thumbnail: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=800&auto=format&fit=crop',
    domain: 'Security & DevOps',
    salary: '$125,000 - $170,000',
    demand: 'very_high',
    matchScore: 95,
  },
];
