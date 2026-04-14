import { useEffect, useRef } from 'react';

function AboutBackground() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const particlesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particleCount = 80;

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.size = Math.random() * 2 + 0.5;
        this.alpha = Math.random() * 0.5 + 0.1;
      }

      update() {
        const dx = mouseRef.current.x - this.x;
        const dy = mouseRef.current.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 150) {
          this.vx -= dx / dist * 0.02;
          this.vy -= dy / dist * 0.02;
        }
        
        this.x += this.vx;
        this.y += this.vy;
        
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
          this.reset();
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(34, 211, 238, ${this.alpha})`;
        ctx.fill();
      }
    }

    // Create particles
    particlesRef.current = [];
    for (let i = 0; i < particleCount; i++) {
      particlesRef.current.push(new Particle());
    }

    function drawConnections() {
      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const dx = particlesRef.current[i].x - particlesRef.current[j].x;
          const dy = particlesRef.current[i].y - particlesRef.current[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particlesRef.current[i].x, particlesRef.current[i].y);
            ctx.lineTo(particlesRef.current[j].x, particlesRef.current[j].y);
            ctx.strokeStyle = `rgba(34, 211, 238, ${0.08 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    }

    // Animation loop
    let animationFrameId;
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particlesRef.current.forEach(p => {
        p.update();
        p.draw();
      });
      
      drawConnections();
      animationFrameId = requestAnimationFrame(animate);
    }

    animate();

    // Mouse move handler
    const handleMouseMove = (e) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    // Handle resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          pointerEvents: 'none'
        }}
      />
      
      {/* Hex grid */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          opacity: 0.04,
          pointerEvents: 'none',
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='52'%3E%3Cpath d='M30 0L60 15v22L30 52 0 37V15z' fill='none' stroke='%2322D3EE' stroke-width='0.5'/%3E%3C/svg%3E\")",
          backgroundSize: '60px 52px'
        }}
      />
      
      {/* Scan lines */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(34, 211, 238, 0.015) 2px, rgba(34, 211, 238, 0.015) 4px)',
          pointerEvents: 'none'
        }}
      />
      
      {/* Orbit rings */}
      <div
        className="orbit-ring-1"
        style={{
          position: 'absolute',
          width: '500px',
          height: '500px',
          top: '50%',
          left: '50%',
          marginTop: '-250px',
          marginLeft: '-250px',
          borderRadius: '50%',
          border: '1px solid rgba(34, 211, 238, 0.15)',
          pointerEvents: 'none',
          animation: 'orbit 20s linear infinite'
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: '8px',
            height: '8px',
            background: '#22D3EE',
            borderRadius: '50%',
            top: '-4px',
            left: '50%',
            transform: 'translateX(-50%)',
            boxShadow: '0 0 10px #22D3EE, 0 0 20px rgba(34, 211, 238, 0.5)'
          }}
        />
      </div>
      
      <div
        className="orbit-ring-2"
        style={{
          position: 'absolute',
          width: '700px',
          height: '700px',
          top: '50%',
          left: '50%',
          marginTop: '-350px',
          marginLeft: '-350px',
          borderRadius: '50%',
          border: '1px solid rgba(34, 211, 238, 0.08)',
          pointerEvents: 'none',
          animation: 'orbitReverse 30s linear infinite'
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: '8px',
            height: '8px',
            background: '#22D3EE',
            borderRadius: '50%',
            top: '-4px',
            left: '50%',
            transform: 'translateX(-50%)',
            boxShadow: '0 0 10px #22D3EE, 0 0 20px rgba(34, 211, 238, 0.5)'
          }}
        />
      </div>
      
      <div
        className="orbit-ring-3"
        style={{
          position: 'absolute',
          width: '900px',
          height: '900px',
          top: '50%',
          left: '50%',
          marginTop: '-450px',
          marginLeft: '-450px',
          borderRadius: '50%',
          border: '1px solid rgba(34, 211, 238, 0.05)',
          pointerEvents: 'none',
          animation: 'orbit 40s linear infinite'
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: '8px',
            height: '8px',
            background: '#22D3EE',
            borderRadius: '50%',
            top: '-4px',
            left: '50%',
            transform: 'translateX(-50%)',
            boxShadow: '0 0 10px #22D3EE, 0 0 20px rgba(34, 211, 238, 0.5)'
          }}
        />
      </div>
      
      {/* Diagonal accents */}
      <div
        style={{
          position: 'absolute',
          width: '1px',
          height: '100%',
          top: 0,
          left: '15%',
          background: 'linear-gradient(to bottom, transparent, rgba(34, 211, 238, 0.27), transparent)',
          transform: 'rotate(15deg)',
          pointerEvents: 'none'
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: '1px',
          height: '100%',
          top: 0,
          right: '20%',
          background: 'linear-gradient(to bottom, transparent, rgba(34, 211, 238, 0.27), transparent)',
          transform: 'rotate(-20deg)',
          pointerEvents: 'none'
        }}
      />
    </>
  );
}

export default AboutBackground;
