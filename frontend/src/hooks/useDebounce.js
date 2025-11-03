// src/hooks/useDebounce.js
import { useState, useEffect } from 'react';

export default function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// import { useEffect, useState } from 'react';

// export default function useDebounce(text: string, delay: number) {
//   const [value, setValue] = useState('');

//   useEffect(() => {
//     const timerId = setTimeout(() => {
//       setValue(text);
//     }, delay);
//     return () => {
//       clearTimeout(timerId);
//     };
//   }, [text, delay]);
//   return value;
// } 2488146324507
// 2488146324507 
// 2482197208960
//   2482197208960

