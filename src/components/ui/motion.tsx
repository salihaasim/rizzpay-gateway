
import React from 'react';
import { cn } from '@/lib/utils';

type MotionProps = {
  children: React.ReactNode;
  initial?: Record<string, any>;
  animate?: Record<string, any>;
  transition?: Record<string, any>;
  className?: string;
  [key: string]: any;
};

export const motion = {
  div: ({
    children,
    initial = {},
    animate = {},
    transition = {},
    className = '',
    ...props
  }: MotionProps) => {
    const [isClient, setIsClient] = React.useState(false);

    React.useEffect(() => {
      setIsClient(true);
    }, []);

    if (!isClient) {
      return (
        <div className={className} {...props}>
          {children}
        </div>
      );
    }

    // Apply simple CSS animation classes based on the provided props
    const getAnimationClasses = () => {
      const classes = [];

      // Handle fade
      if (initial?.opacity === 0 && animate?.opacity === 1) {
        classes.push('animate-fade-in');
      }

      // Handle slide from top
      if (initial?.y < 0 && animate?.y === 0) {
        classes.push('animate-slide-in');
      }
      
      // Handle slide from bottom
      if (initial?.y > 0 && animate?.y === 0) {
        classes.push('animate-slide-up');
      }
      
      // Handle slide from right
      if (initial?.x > 0 && animate?.x === 0) {
        classes.push('animate-slide-in');
      }
      
      // Handle scale
      if (initial?.scale < 1 && animate?.scale === 1) {
        classes.push('animate-scale-in');
      }

      return classes.join(' ');
    };

    const animationStyle = {
      ...props.style,
      animationDelay: transition?.delay ? `${transition.delay}s` : undefined,
      animationDuration: transition?.duration ? `${transition.duration}s` : undefined,
    };

    return (
      <div
        className={cn(className, getAnimationClasses())}
        style={animationStyle}
        {...props}
      >
        {children}
      </div>
    );
  },
};

export default motion;
