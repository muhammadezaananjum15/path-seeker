import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, MotionValue } from 'framer-motion';
import {
  Sparkles, ArrowRight, Brain, Briefcase, Award, TrendingUp,
  Star, Compass, ExternalLink, ShieldCheck, Video, Code, Layers
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
  headerSubtitle = 'The unified career passport platform powering students, graduates, and working professionals with AI matching, 150+ masterclasses, ATS resume tools, and live hiring feeds.',
  onTakeQuiz,
  onExploreCareers,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

  const translateX = useSpring(useTransform(scrollYProgress, [0, 1], [0, 600]), springConfig);
  const translateXReverse = useSpring(useTransform(scrollYProgress, [0, 1], [0, -600]), springConfig);
  const rotateX = useSpring(useTransform(scrollYProgress, [0, 0.2], [15, 0]), springConfig);
  const opacity = useSpring(useTransform(scrollYProgress, [0, 0.2], [0.2, 1]), springConfig);
  const rotateZ = useSpring(useTransform(scrollYProgress, [0, 0.2], [15, 0]), springConfig);
  const translateY = useSpring(useTransform(scrollYProgress, [0, 0.2], [-500, 300]), springConfig);

  const firstRow = products.slice(0, 5);
  const secondRow = products.slice(5, 10);
  const thirdRow = products.slice(10, 15);

  return (
    <div
      ref={containerRef}
      className="relative min-h-[220vh] py-12 sm:py-20 overflow-hidden antialiased flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d]"
    >
      {/* ── Top Hero Header Section ── */}
      <Header
        title={headerTitle}
        highlight={headerHighlight}
        subtitle={headerSubtitle}
        onTakeQuiz={onTakeQuiz}
        onExploreCareers={onExploreCareers}
      />

      {/* ── 3D Parallax Layers Container ── */}
      <motion.div
        style={{
          rotateX,
          rotateZ,
          translateY,
          opacity,
        }}
        className="space-y-10 sm:space-y-16 mt-8"
      >
        {/* Layer Row 1 — Moves Right */}
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-8 sm:space-x-12 mb-6 sm:mb-10">
          {firstRow.map((product) => (
            <ProductCard product={product} translate={translateX} key={product.title} />
          ))}
        </motion.div>

        {/* Layer Row 2 — Moves Left */}
        <motion.div className="flex flex-row space-x-8 sm:space-x-12 mb-6 sm:mb-10">
          {secondRow.map((product) => (
            <ProductCard product={product} translate={translateXReverse} key={product.title} />
          ))}
        </motion.div>

        {/* Layer Row 3 — Moves Right */}
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-8 sm:space-x-12">
          {thirdRow.map((product) => (
            <ProductCard product={product} translate={translateX} key={product.title} />
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
    <div className="max-w-7xl relative mx-auto pt-6 sm:pt-10 pb-12 px-4 sm:px-6 lg:px-8 w-full left-0 top-0 text-center flex flex-col items-center">
      {/* Top Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-purple-50 border border-purple-200 text-[#4F20C9] text-[10px] sm:text-xs font-black uppercase tracking-wider mb-6 sm:mb-8 shadow-sm"
      >
        <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#4F20C9] animate-spin" />
        <span>Next-Gen Career Intelligence OS</span>
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
      </motion.div>

      {/* Main Hero Headline */}
      <h1
        className="text-3xl xs:text-4xl sm:text-6xl md:text-7xl lg:text-[88px] xl:text-[96px] font-extrabold text-[#07031A] mb-4 sm:mb-6 tracking-tighter leading-[1.08] sm:leading-[0.95] max-w-5xl break-words px-2"
        style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
      >
        {title}
        <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F20C9] via-indigo-500 to-purple-400">
          {highlight}
        </span>
      </h1>

      {/* Subtitle */}
      <p className="max-w-2xl text-xs sm:text-base md:text-lg text-slate-600 font-normal leading-relaxed mb-8 sm:mb-10 px-2">
        {subtitle}
      </p>

      {/* Hero CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full max-w-md px-2"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => (onTakeQuiz ? onTakeQuiz() : navigate('/quiz'))}
          className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-[#4F20C9] hover:bg-purple-700 text-white font-bold text-[11px] sm:text-xs uppercase tracking-wider shadow-xl shadow-purple-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap"
        >
          <Brain className="w-4 h-4 text-purple-200 shrink-0" />
          <span>Take AI Assessment</span>
          <ArrowRight className="w-4 h-4 shrink-0" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => (onExploreCareers ? onExploreCareers() : navigate('/careers'))}
          className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300 font-bold text-[11px] sm:text-xs uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap"
        >
          Explore 1,000+ Careers
        </motion.button>
      </motion.div>

      {/* Floating Scroll Hint */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        className="mt-8 flex items-center gap-2 text-[10px] font-black uppercase text-purple-600 bg-purple-50 px-3 py-1 rounded-full border border-purple-200"
      >
        <Layers className="w-3.5 h-3.5" />
        <span>Scroll to explore 3D career roadmap layers</span>
      </motion.div>
    </div>
  );
};

const ProductCard: React.FC<{
  product: ParallaxProduct;
  translate: MotionValue<number>;
}> = ({ product, translate }) => {
  return (
    <motion.div
      style={{
        x: translate,
      }}
      whileHover={{
        y: -20,
        scale: 1.03,
      }}
      key={product.title}
      className="group/product h-80 sm:h-96 w-[280px] sm:w-[380px] relative shrink-0 rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-xl hover:shadow-2xl hover:border-purple-300 transition-all duration-300"
    >
      <Link to={product.link} className="block group-hover/product:shadow-2xl h-full w-full">
        {/* Card Background Image */}
        <img
          src={product.thumbnail}
          alt={product.title}
          className="object-cover object-center absolute h-full w-full inset-0 group-hover/product:scale-108 transition-transform duration-700"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#07031A] via-[#07031A]/40 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
          <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#4F20C9] text-[10px] font-black uppercase shadow-sm">
            {product.domain}
          </span>
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-black shadow-sm">
            <Sparkles className="w-3 h-3" /> {product.matchScore}% Match
          </span>
        </div>

        {/* Bottom Information Details */}
        <div className="absolute bottom-0 inset-x-0 p-5 sm:p-6 text-white space-y-2">
          <h3 className="font-black text-lg sm:text-xl leading-tight group-hover/product:text-purple-300 transition-colors line-clamp-1">
            {product.title}
          </h3>
          <div className="flex items-center justify-between text-xs font-bold text-slate-200 pt-1 border-t border-white/20">
            <span>Avg: <span className="text-amber-300 font-extrabold">{product.salary}</span></span>
            <span className="text-emerald-300 font-extrabold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> High Demand
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
