import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

export interface TypewriterOptions {
  /** Speed of typing in milliseconds per character */
  typeSpeed?: number;
  /** Speed of deleting in milliseconds per character */
  deleteSpeed?: number;
  /** Pause duration after typing is complete (in milliseconds) */
  pauseDuration?: number;
  /** Gap between phrases (in milliseconds) */
  phrasesGap?: number;
  /** Whether to loop through phrases infinitely */
  loop?: boolean;
  /** Whether to start animation immediately */
  autoStart?: boolean;
}

export interface TypewriterState {
  /** Current displayed text */
  displayText: string;
  /** Whether the animation is currently running */
  isAnimating: boolean;
  /** Current phrase index */
  currentPhraseIndex: number;
  /** Whether currently typing (true) or deleting (false) */
  isTyping: boolean;
}

export interface TypewriterControls {
  /** Start the animation */
  start: () => void;
  /** Stop the animation */
  stop: () => void;
  /** Reset to initial state */
  reset: () => void;
  /** Skip to next phrase */
  skipToNext: () => void;
}

const DEFAULT_OPTIONS: Required<TypewriterOptions> = {
    typeSpeed: 50,
    deleteSpeed: 10,
    pauseDuration: 200,
    phrasesGap: 200,
    loop: true,
    autoStart: true,
};

export function useTypewriter(
  phrases: string[],
  fixedPrefix: string = '',
  options: TypewriterOptions = {}
): [TypewriterState, TypewriterControls] {
  // Create stable options object
  const typeSpeed = options.typeSpeed ?? DEFAULT_OPTIONS.typeSpeed;
  const deleteSpeed = options.deleteSpeed ?? DEFAULT_OPTIONS.deleteSpeed;
  const pauseDuration = options.pauseDuration ?? DEFAULT_OPTIONS.pauseDuration;
  const phrasesGap = options.phrasesGap ?? DEFAULT_OPTIONS.phrasesGap;
  const loop = options.loop ?? DEFAULT_OPTIONS.loop;
  const autoStart = options.autoStart ?? DEFAULT_OPTIONS.autoStart;

  const [displayText, setDisplayText] = useState(fixedPrefix);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentCharIndexRef = useRef(0);
  const isStoppedRef = useRef(false);

  // Use refs for frequently changing values to avoid callback recreation
  const displayTextRef = useRef(displayText);
  const currentPhraseIndexRef = useRef(currentPhraseIndex);
  const isTypingRef = useRef(isTyping);

  // Update refs when state changes
  useEffect(() => {
    displayTextRef.current = displayText;
  }, [displayText]);

  useEffect(() => {
    currentPhraseIndexRef.current = currentPhraseIndex;
  }, [currentPhraseIndex]);

  useEffect(() => {
    isTypingRef.current = isTyping;
  }, [isTyping]);

  const clearCurrentTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const animateText = useCallback(() => {
    if (isStoppedRef.current || phrases.length === 0) {
      return;
    }

    const currentPhrase = phrases[currentPhraseIndexRef.current];
    const targetText = fixedPrefix + currentPhrase;
    const currentText = displayTextRef.current;

    if (isTypingRef.current) {
      // Typing phase
      if (currentText.length < targetText.length) {
        const nextChar = targetText[currentText.length];
        setDisplayText(currentText + nextChar);
        currentCharIndexRef.current = currentText.length + 1;

        timeoutRef.current = setTimeout(animateText, typeSpeed);
      } else {
        // Finished typing, pause then start deleting
        setIsTyping(false);
        timeoutRef.current = setTimeout(animateText, pauseDuration);
      }
    } else {
      // Deleting phase
      if (currentText.length > fixedPrefix.length) {
        setDisplayText(currentText.slice(0, -1));
        timeoutRef.current = setTimeout(animateText, deleteSpeed);
      } else {
        // Finished deleting, move to next phrase
        const nextIndex = (currentPhraseIndexRef.current + 1) % phrases.length;

        if (!loop && nextIndex === 0 && currentPhraseIndexRef.current === phrases.length - 1) {
          // Animation complete, stop
          setIsAnimating(false);
          return;
        }

        setCurrentPhraseIndex(nextIndex);
        setIsTyping(true);
        currentCharIndexRef.current = fixedPrefix.length;

        timeoutRef.current = setTimeout(animateText, phrasesGap);
      }
    }
  }, [phrases, fixedPrefix, typeSpeed, deleteSpeed, pauseDuration, phrasesGap, loop]);

  const start = useCallback(() => {
    if (phrases.length === 0) return;
    
    isStoppedRef.current = false;
    setIsAnimating(true);
    
    // If we're at the beginning, start typing
    if (displayTextRef.current === fixedPrefix) {
      setIsTyping(true);
      setCurrentPhraseIndex(0);
      currentCharIndexRef.current = fixedPrefix.length;
    }
    
    // Start animation on next tick to ensure state is updated
    timeoutRef.current = setTimeout(animateText, 0);
  }, [phrases.length, fixedPrefix, animateText]);

  const stop = useCallback(() => {
    isStoppedRef.current = true;
    setIsAnimating(false);
    clearCurrentTimeout();
  }, [clearCurrentTimeout]);

  const reset = useCallback(() => {
    stop();
    setDisplayText(fixedPrefix);
    setCurrentPhraseIndex(0);
    setIsTyping(true);
    currentCharIndexRef.current = fixedPrefix.length;
  }, [stop, fixedPrefix]);

  const skipToNext = useCallback(() => {
    if (!isAnimating || phrases.length === 0) return;
    
    clearCurrentTimeout();
    
    const nextIndex = (currentPhraseIndex + 1) % phrases.length;
    setCurrentPhraseIndex(nextIndex);
    setDisplayText(fixedPrefix);
    setIsTyping(true);
    currentCharIndexRef.current = fixedPrefix.length;
    
    timeoutRef.current = setTimeout(animateText, phrasesGap);
  }, [
    isAnimating,
    phrases.length,
    currentPhraseIndex,
    fixedPrefix,
    clearCurrentTimeout,
    animateText,
    phrasesGap,
  ]);

  // Auto-start effect
  // Auto-start only once; guard against re-runs
  const startedRef = useRef(false);
  useEffect(() => {
    if (!autoStart) return;
    if (startedRef.current) return;
    if (phrases.length === 0) return;
    startedRef.current = true;
    start();
    return () => {
      clearCurrentTimeout();
    };
  }, [autoStart, phrases.length, start, clearCurrentTimeout]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearCurrentTimeout();
    };
  }, [clearCurrentTimeout]);

  const state: TypewriterState = {
    displayText,
    isAnimating,
    currentPhraseIndex,
    isTyping,
  };

  const controls: TypewriterControls = {
    start,
    stop,
    reset,
    skipToNext,
  };

  return [state, controls];
}
