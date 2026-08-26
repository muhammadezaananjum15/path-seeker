import React, { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import gsap from 'gsap';

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

  // Framer Motion 3D Mouse Movement Values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [12, -12]), { damping: 20, stiffness: 200 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), { damping: 20, stiffness: 200 });

  const handleMouseMove3D = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enable3DTilt || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseXPos = (e.clientX - rect.left) / width - 0.5;
    const mouseYPos = (e.clientY - rect.top) / height - 0.5;
    mouseX.set(mouseXPos);
    mouseY.set(mouseYPos);
  };

  const handleMouseLeave3D = () => {
    if (!enable3DTilt) return;
    mouseX.set(0);
    mouseY.set(0);
  };

  // GSAP 3D Tilt Fallback & Acceleration
  useEffect(() => {
    if (!enable3DTilt || !cardRef.current) return;

    const el = cardRef.current;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(el, {
        rotationY: x * 0.04,
        rotationX: -y * 0.04,
        ease: 'power1.out',
        duration: 0.3,
        transformPerspective: 1200,
        transformOrigin: 'center',
      });
    };

    const handleMouseLeave = () => {
      gsap.to(el, {
        rotationY: 0,
        rotationX: 0,
        ease: 'power2.out',
        duration: 0.5,
      });
    };

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [enable3DTilt]);

  // Framer Motion 3D entrance variants
  const getVariants = () => {
    switch (direction) {
      case '3d-flip':
        return {
          hidden: { opacity: 0, rotateX: 45, rotateY: -15, scale: 0.85, y: 50 },
          visible: { opacity: 1, rotateX: 0, rotateY: 0, scale: 1, y: 0 },
        };
      case '3d-float':
        return {
          hidden: { opacity: 0, y: 40, rotateX: 20 },
          visible: { opacity: 1, y: 0, rotateX: 0 },
        };
      case 'up':
        return { hidden: { opacity: 0, y: 35, rotateX: 10 }, visible: { opacity: 1, y: 0, rotateX: 0 } };
      case 'down':
        return { hidden: { opacity: 0, y: -35 }, visible: { opacity: 1, y: 0 } };
      case 'left':
        return { hidden: { opacity: 0, x: -35, rotateY: 15 }, visible: { opacity: 1, x: 0, rotateY: 0 } };
      case 'right':
        return { hidden: { opacity: 0, x: 35, rotateY: -15 }, visible: { opacity: 1, x: 0, rotateY: 0 } };
      case 'fade':
      default:
        return { hidden: { opacity: 0, scale: 0.94 }, visible: { opacity: 1, scale: 1 } };
    }
  };

  return (
    <motion.div
      ref={cardRef}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      variants={getVariants()}
      onMouseMove={handleMouseMove3D}
      onMouseLeave={handleMouseLeave3D}
      style={{
        perspective: 1200,
        transformStyle: 'preserve-3d',
        rotateX: enable3DTilt ? rotateX : 0,
        rotateY: enable3DTilt ? rotateY : 0,
      }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`transform-gpu ${className}`}
    >
      {children}
    </motion.div>
  );
};
