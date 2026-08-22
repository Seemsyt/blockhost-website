import React from 'react';
import { motion } from 'motion/react';

export type ScrollAnimationVariant = 
  | 'fade-up' 
  | 'fade-down' 
  | 'fade-left' 
  | 'fade-right' 
  | 'fade-in' 
  | 'zoom-in' 
  | 'glass-reveal';

interface ScrollRevealProps {
  children: React.ReactNode;
  variant?: ScrollAnimationVariant;
  delay?: number;
  duration?: number;
  className?: string;
  id?: string;
  viewportMargin?: string;
  once?: boolean;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  variant = 'fade-up',
  delay = 0,
  duration = 0.6,
  className = '',
  id,
  viewportMargin = '-40px',
  once = true,
}) => {
  const getVariants = () => {
    switch (variant) {
      case 'fade-up':
        return {
          hidden: { opacity: 0, y: 35, filter: 'blur(4px)' },
          visible: { opacity: 1, y: 0, filter: 'blur(0px)' }
        };
      case 'fade-down':
        return {
          hidden: { opacity: 0, y: -35, filter: 'blur(4px)' },
          visible: { opacity: 1, y: 0, filter: 'blur(0px)' }
        };
      case 'fade-left':
        return {
          hidden: { opacity: 0, x: -40, filter: 'blur(4px)' },
          visible: { opacity: 1, x: 0, filter: 'blur(0px)' }
        };
      case 'fade-right':
        return {
          hidden: { opacity: 0, x: 40, filter: 'blur(4px)' },
          visible: { opacity: 1, x: 0, filter: 'blur(0px)' }
        };
      case 'zoom-in':
        return {
          hidden: { opacity: 0, scale: 0.92, filter: 'blur(4px)' },
          visible: { opacity: 1, scale: 1, filter: 'blur(0px)' }
        };
      case 'glass-reveal':
        return {
          hidden: { opacity: 0, y: 25, scale: 0.97, filter: 'blur(8px)' },
          visible: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }
        };
      case 'fade-in':
      default:
        return {
          hidden: { opacity: 0, filter: 'blur(3px)' },
          visible: { opacity: 1, filter: 'blur(0px)' }
        };
    }
  };

  return (
    <motion.div
      id={id}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: viewportMargin as any }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1], // Smooth natural spring-like deceleration
      }}
      variants={getVariants()}
      className={className}
    >
      {children}
    </motion.div>
  );
};
