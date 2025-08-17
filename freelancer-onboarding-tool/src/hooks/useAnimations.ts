'use client';

import { useEffect, useRef, useState } from 'react';

interface AnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export function useInView(options: AnimationOptions = {}) {
  const [isInView, setIsInView] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const inView = entry.isIntersecting;
        
        if (inView && (!options.triggerOnce || !hasTriggered)) {
          setIsInView(true);
          setHasTriggered(true);
        } else if (!options.triggerOnce) {
          setIsInView(inView);
        }
      },
      {
        threshold: options.threshold ?? 0.1,
        rootMargin: options.rootMargin ?? '0px',
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [options.threshold, options.rootMargin, options.triggerOnce, hasTriggered]);

  return { ref, isInView, hasTriggered };
}

export function useStaggeredAnimation(itemCount: number, delay: number = 100) {
  const [visibleItems, setVisibleItems] = useState<number[]>([]);
  const [isTriggered, setIsTriggered] = useState(false);

  const trigger = () => {
    if (isTriggered) return;
    
    setIsTriggered(true);
    
    for (let i = 0; i < itemCount; i++) {
      setTimeout(() => {
        setVisibleItems(prev => [...prev, i]);
      }, i * delay);
    }
  };

  const reset = () => {
    setVisibleItems([]);
    setIsTriggered(false);
  };

  return { visibleItems, trigger, reset, isTriggered };
}

export function useHover() {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return { ref, isHovered };
}

export function useClickAnimation() {
  const [isClicked, setIsClicked] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleClick = () => {
      setIsClicked(true);
      setTimeout(() => setIsClicked(false), 150);
    };

    element.addEventListener('click', handleClick);

    return () => {
      element.removeEventListener('click', handleClick);
    };
  }, []);

  return { ref, isClicked };
}

export function useFadeIn(delay: number = 0) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return { 
    ref, 
    isVisible, 
    className: isVisible ? 'animate-fadeIn' : 'opacity-0' 
  };
}

export default {
  useInView,
  useStaggeredAnimation,
  useHover,
  useClickAnimation,
  useFadeIn
};