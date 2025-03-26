
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

type MotionProps = {
  children: React.ReactNode;
  initial?: Record<string, any>;
  animate?: Record<string, any>;
  transition?: Record<string, any>;
  className?: string;
  [key: string]: any;
};

// Create a separate component to handle the client-side animation
const ClientSideMotion = ({
  children,
  initial = {},
  animate = {},
  transition = {},
  className = '',
  ...props
}: MotionProps) => {
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
};

// Memoize the animation div to prevent unnecessary re-renders
const MemoizedClientSideMotion = React.memo(ClientSideMotion);

// The main motion component that handles SSR
export const motion = {
  div: (props: MotionProps) => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
      setIsClient(true);
    }, []);

    if (!isClient) {
      return (
        <div className={props.className} {...props}>
          {props.children}
        </div>
      );
    }

    return <MemoizedClientSideMotion {...props} />;
  },
};

export default motion;
