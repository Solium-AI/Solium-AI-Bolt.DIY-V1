// Performant background with canvas particles
'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import Spline with no SSR
const SplineComponent = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-[#0f172a]" />
});

class Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  alpha: number;
  alphaSpeed: number;

  constructor(canvas: HTMLCanvasElement) {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 1;
    this.speedX = Math.random() * 0.2 - 0.1;
    this.speedY = Math.random() * 0.2 - 0.1;
    this.color = ['#34d399', '#3b82f6', '#ffffff'][Math.floor(Math.random() * 3)];
    this.alpha = Math.random() * 0.5 + 0.2;
    this.alphaSpeed = Math.random() * 0.02 - 0.01;
  }

  update(canvas: HTMLCanvasElement) {
    this.x += this.speedX;
    this.y += this.speedY;
    this.alpha += this.alphaSpeed;

    if (this.alpha <= 0.2 || this.alpha >= 0.7) {
      this.alphaSpeed *= -1;
    }

    if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
    if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color.replace(')', `,${this.alpha})`).replace('rgb', 'rgba');
    ctx.fill();
  }
}

export default function Background() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize particles
    particlesRef.current = Array(50)
      .fill(null)
      .map(() => new Particle(canvas));

    // Animation loop
    let animationFrame: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle) => {
        particle.update(canvas);
        particle.draw(ctx);
      });

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#0f172a]">
      {/* Spline 3D Globe - Only render on client */}
      {isMounted && (
        <div className="absolute inset-0 opacity-75">
          <SplineComponent scene="https://prod.spline.design/b1R9sgmJL5c7PZ3K/scene.splinecode" />
        </div>
      )}

      {/* Particle Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ mixBlendMode: 'screen' }}
      />

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 animate-gradient-slow" />
      <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 to-blue-500/10 animate-gradient-slow-reverse" />

      {/* Floating Orbs */}
      <div className="absolute top-1/4 left-1/4 w-4 h-4 rounded-full bg-[#34d399] blur-sm animate-float-slow" />
      <div className="absolute bottom-1/3 right-1/3 w-6 h-6 rounded-full bg-[#3b82f6] blur-md animate-float-medium" />
    </div>
  );
}
