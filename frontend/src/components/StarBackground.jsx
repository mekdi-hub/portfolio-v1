import { useEffect, useRef } from 'react';

function StarBackground() {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    let width = window.innerWidth;
    let height = window.innerHeight;
    
    canvas.width = width;
    canvas.height = height;

    // Reduce star count for better performance
    const stars = [];
    const starCount = 50; // Reduced from 150

    class Star {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 1.5 + 0.5;
        this.opacity = Math.random() * 0.5 + 0.3;
      }

      draw() {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.fillRect(this.x, this.y, this.size, this.size);
      }
    }

    // Create stars
    for (let i = 0; i < starCount; i++) {
      stars.push(new Star());
    }

    // Simple animation - just draw static stars
    function animate() {
      ctx.clearRect(0, 0, width, height);
      stars.forEach(star => star.draw());
      animationRef.current = requestAnimationFrame(animate);
    }

    animate();

    // Debounced resize handler
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        stars.forEach(star => star.reset());
      }, 250);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        opacity: 0.6
      }}
    />
  );
}

export default StarBackground;
