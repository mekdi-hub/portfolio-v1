import { useEffect, useRef } from 'react';

function CustomCursor() {
  const cursorRef = useRef(null);
  const cursorDotRef = useRef(null);
  const mouseX = useRef(0);
  const mouseY = useRef(0);
  const cursorX = useRef(0);
  const cursorY = useRef(0);

  useEffect(() => {
    let rafId;
    
    const handleMouseMove = (e) => {
      mouseX.current = e.clientX;
      mouseY.current = e.clientY;

      // Instantly move the dot
      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
    };

    const animateCursor = () => {
      // Smooth follow effect for the circle - optimized speed
      const speed = 0.2;
      cursorX.current += (mouseX.current - cursorX.current) * speed;
      cursorY.current += (mouseY.current - cursorY.current) * speed;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${cursorX.current}px, ${cursorY.current}px)`;
      }

      rafId = requestAnimationFrame(animateCursor);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    animateCursor();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      {/* Main cursor circle */}
      <div ref={cursorRef} className="custom-cursor" />
      
      {/* Center dot */}
      <div ref={cursorDotRef} className="custom-cursor-dot" />
    </>
  );
}

export default CustomCursor;
