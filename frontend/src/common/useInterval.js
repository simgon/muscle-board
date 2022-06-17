import { useEffect, useRef } from 'react';

export const useInterval = ({ onUpdate, delay = 1000 }) => {
  const onUpdateRef = useRef(() => {});

  useEffect(() => {
    onUpdateRef.current = onUpdate;
  }, [onUpdate]);

  useEffect(() => {
    const timerId = setInterval(() => onUpdateRef.current(), delay);
    return () => clearInterval(timerId);
  }, []);
};
