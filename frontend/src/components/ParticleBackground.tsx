import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  color: string;
}

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 设置 canvas 尺寸
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // 初始化粒子
    const initializeParticles = () => {
      particlesRef.current = [];
      const particleCount = Math.floor((canvas.width * canvas.height) / 8000);

      const colors = [
        'rgba(102, 126, 234, 0.6)',  // 蓝紫
        'rgba(118, 75, 162, 0.6)',   // 深紫
        'rgba(59, 130, 246, 0.6)',   // 蓝
        'rgba(139, 92, 246, 0.6)',   // 紫
      ];

      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: Math.random() * 2 + 1,
          opacity: Math.random() * 0.5 + 0.2,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    };

    initializeParticles();

    // 粒子连线逻辑
    const drawConnections = (particles: Particle[]) => {
      const connectionDistance = 150;

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            const opacity = (1 - distance / connectionDistance) * 0.3;
            ctx.strokeStyle = `rgba(102, 126, 234, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };

    // 动画循环
    const animate = () => {
      // 清除背景（使用渐变）
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#0f172a');      // 深蓝
      gradient.addColorStop(0.5, '#1e1b4b');    // 深紫
      gradient.addColorStop(1, '#0f172a');      // 深蓝

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 更新和绘制粒子
      particlesRef.current.forEach((particle) => {
        // 更新位置
        particle.x += particle.vx;
        particle.y += particle.vy;

        // 边界反弹
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.vx *= -1;
          particle.x = Math.max(0, Math.min(canvas.width, particle.x));
        }
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.vy *= -1;
          particle.y = Math.max(0, Math.min(canvas.height, particle.y));
        }

        // 绘制粒子
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.opacity;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalAlpha = 1;

      // 绘制粒子之间的连线
      drawConnections(particlesRef.current);

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // 响应式处理
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initializeParticles();
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
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
      }}
    />
  );
}
