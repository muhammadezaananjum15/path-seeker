import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useInView } from 'framer-motion';

interface ScrollAnimationProps {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade' | '3d-flip' | '3d-float';
  enable3DTilt?: boolean;
  className?: string;
}

export const ScrollAnimation: React.FC<ScrollAnimationProps> = ({
  children,
  delay = 0,
  direction = 'up',
  enable3DTilt = false,
  className = '',
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: '-40px' });

  // Framer Motion 3D Mouse Tilt Values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring-damped tilt — purely via Framer Motion (no GSAP conflict)
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), {
    damping: 22,
    stiffness: 180,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), {
    damping: 22,
    stiffness: 180,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enable3DTilt || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    if (!enable3DTilt) return;
    mouseX.set(0);
    mouseY.set(0);
  };

  // Entrance animation variants — clean and purposeful
  const getVariants = () => {
    switch (direction) {
      case '3d-flip':
        return {
          hidden: { opacity: 0, rotateX: 40, rotateY: -12, scale: 0.88, y: 48 },
          visible: { opacity: 1, rotateX: 0, rotateY: 0, scale: 1, y: 0 },
        };
      case '3d-float':
        return {
          hidden: { opacity: 0, y: 36, rotateX: 18 },
          visible: { opacity: 1, y: 0, rotateX: 0 },
        };
      case 'up':
        return {
          hidden: { opacity: 0, y: 32 },
          visible: { opacity: 1, y: 0 },
        };
      case 'down':
        return {
          hidden: { opacity: 0, y: -32 },
          visible: { opacity: 1, y: 0 },
        };
      case 'left':
        return {
          hidden: { opacity: 0, x: -36 },
          visible: { opacity: 1, x: 0 },
        };
      case 'right':
        return {
          hidden: { opacity: 0, x: 36 },
          visible: { opacity: 1, x: 0 },
        };
      case 'fade':
      default:
        return {
          hidden: { opacity: 0, scale: 0.95 },
          visible: { opacity: 1, scale: 1 },
        };
    }
  };

  const variants = getVariants();

  return (
    <motion.div
      ref={cardRef}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: enable3DTilt ? 1200 : undefined,
        transformStyle: enable3DTilt ? 'preserve-3d' : undefined,
        rotateX: enable3DTilt ? rotateX : 0,
        rotateY: enable3DTilt ? rotateY : 0,
      }}
      transition={{
        duration: 0.55,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`transform-gpu ${className}`}
    >
      {children}
    </motion.div>
  );
};
