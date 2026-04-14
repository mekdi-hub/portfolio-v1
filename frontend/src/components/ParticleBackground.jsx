import { useEffect, useRef } from 'react';

function ParticleBackground() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const particlesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particleCount = 100;

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.baseX = this.x;
        this.baseY = this.y;
        this.size = Math.random() * 3 + 1;
        this.speedX = (Math.random() * 3 - 1.5) * 1.5;
        this.speedY = (Math.random() * 3 - 1.5) * 1.5;
        this.color = Math.random() > 0.5 ? 'rgba(34, 211, 238, 0.9)' : 'rgba(59, 130, 246, 0.9)';
        this.density = (Math.random() * 30) + 1;
      }

      update() {
        // Base movement
        this.baseX += this.speedX;
        this.baseY += this.speedY;

        // Wrap around screen
        if (this.baseX > canvas.width) this.baseX = 0;
        if (this.baseX < 0) this.baseX = canvas.width;
        if (this.baseY > canvas.height) this.baseY = 0;
        if (this.baseY < 0) this.baseY = canvas.height;

        // Mouse interaction - attraction and repulsion
        const dx = mouseRef.current.x - this.baseX;
        const dy = mouseRef.current.y - this.baseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 200;

        if (distance < maxDistance) {
          const force = (maxDistance - distance) / maxDistance;
          const angle = Math.atan2(dy, dx);
          
          // Repulsion effect - particles move away from cursor
          const moveX = Math.cos(angle) * force * this.density * 0.8;
          const moveY = Math.sin(angle) * force * this.density * 0.8;
          
          this.x = this.baseX - moveX;
          this.y = this.baseY - moveY;
        } else {
          // Smoothly return to base position
          this.x += (this.baseX - this.x) * 0.15;
          this.y += (this.baseY - this.y) * 0.15;
        }
      }

      draw() {
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 20;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Add extra glow for particles near mouse
        const dx = mouseRef.current.x - this.x;
        const dy = mouseRef.current.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 150) {
          const glowIntensity = (150 - distance) / 150;
          ctx.shadowBlur = 30 * glowIntensity;
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size * 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // Create particles
    particlesRef.current = [];
    for (let i = 0; i < particleCount; i++) {
      particlesRef.current.push(new Particle());
    }

    // Mouse move handler
    const handleMouseMove = (e) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    // Animation loop
    let animationFrameId;
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connections between nearby particles
      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const dx = particlesRef.current[i].x - particlesRef.current[j].x;
          const dy = particlesRef.current[i].y - particlesRef.current[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            const opacity = 0.3 * (1 - distance / 120);
            ctx.strokeStyle = `rgba(34, 211, 238, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particlesRef.current[i].x, particlesRef.current[i].y);
            ctx.lineTo(particlesRef.current[j].x, particlesRef.current[j].y);
            ctx.stroke();
          }
        }
        
        // Draw connections to mouse
        const dx = mouseRef.current.x - particlesRef.current[i].x;
        const dy = mouseRef.current.y - particlesRef.current[i].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 150) {
          const opacity = 0.5 * (1 - distance / 150);
          ctx.strokeStyle = `rgba(59, 130, 246, ${opacity})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(particlesRef.current[i].x, particlesRef.current[i].y);
          ctx.lineTo(mouseRef.current.x, mouseRef.current.y);
          ctx.stroke();
        }
      }

      // Update and draw particles
      particlesRef.current.forEach(particle => {
        particle.update();
        particle.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    }

    animate();

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
  );
}

export default ParticleBackground;
