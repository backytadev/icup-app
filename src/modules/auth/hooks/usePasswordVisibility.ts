import { useState, useCallback } from 'react';

interface UsePasswordVisibilityReturn {
  isVisible: boolean;
  toggle: () => void;
  inputType: 'text' | 'password';
}

export const usePasswordVisibility = (): UsePasswordVisibilityReturn => {
  const [isVisible, setIsVisible] = useState(false);

  const toggle = useCallback(() => {
    setIsVisible((prev) => !prev);
  }, []);

  return {
    isVisible,
    toggle,
    inputType: isVisible ? 'text' : 'password',
  };
};
