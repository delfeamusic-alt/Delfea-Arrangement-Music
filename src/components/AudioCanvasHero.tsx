import React, { useEffect, useRef } from 'react';
import { globalAudioEngine } from '../audio/audioEngine';

interface Props {
  className?: string;
  intensity?: number;
}

export const AudioCanvasHero: React.FC<Props> = ({ className = '', intensity = 1.0 }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5, isHovering: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const resize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
        isHovering: true,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current.isHovering = false;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    // Particle nodes representing musical instrument points (Bonang dots, string anchors, sax brass curves)
    const particles = Array.from({ length: 48 }, (_, i) => ({
      x: (i / 48) + (Math.random() * 0.05 - 0.025),
      y: 0.3 + Math.random() * 0.4,
      radius: 1.5 + Math.random() * 2.5,
      speed: 0.005 + Math.random() * 0.01,
      phase: Math.random() * Math.PI * 2,
      color: i % 3 === 0 ? '#FFC857' : (i % 3 === 1 ? '#A55EEA' : '#70A1FF'),
    }));

    const render = () => {
      time += 0.02 * intensity;
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      ctx.clearRect(0, 0, width, height);

      // Get real audio data if available
      const analyser = globalAudioEngine.getAnalyser();
      let freqData: Uint8Array | null = null;
      let timeData: Uint8Array | null = null;
      let audioPower = 0;

      if (analyser && globalAudioEngine.getIsPlaying()) {
        freqData = new Uint8Array(analyser.frequencyBinCount);
        timeData = new Uint8Array(analyser.fftSize);
        analyser.getByteFrequencyData(freqData);
        analyser.getByteTimeDomainData(timeData);

        // calculate energy
        let sum = 0;
        for (let i = 0; i < 32; i++) {
          sum += freqData[i];
        }
        audioPower = (sum / 32) / 255;
      }

      const activeFactor = globalAudioEngine.getIsPlaying() ? (0.8 + audioPower * 1.5) : 0.4;

      // Draw background subtle radial glow
      const gradCenterY = height * 0.5;
      const bgGlow = ctx.createRadialGradient(
        width * 0.5,
        gradCenterY,
        10,
        width * 0.5,
        gradCenterY,
        width * 0.6
      );
      bgGlow.addColorStop(0, 'rgba(165, 94, 234, 0.08)');
      bgGlow.addColorStop(0.5, 'rgba(255, 200, 87, 0.04)');
      bgGlow.addColorStop(1, 'rgba(13, 14, 18, 0)');
      ctx.fillStyle = bgGlow;
      ctx.fillRect(0, 0, width, height);

      // Draw 4 multi-layered harmonic audio waveform ribbons
      const waveLayers = [
        {
          color: 'rgba(255, 200, 87, 0.35)', // Electric Gold
          lineWidth: 2.2,
          speedMult: 1.0,
          ampMult: 55 * activeFactor,
          freqMult: 0.008,
          yOffset: 0.5,
        },
        {
          color: 'rgba(165, 94, 234, 0.4)', // Cyber Neon Purple
          lineWidth: 2.0,
          speedMult: -0.8,
          ampMult: 65 * activeFactor,
          freqMult: 0.012,
          yOffset: 0.52,
        },
        {
          color: 'rgba(94, 234, 212, 0.25)', // Cyan accent
          lineWidth: 1.5,
          speedMult: 1.4,
          ampMult: 40 * activeFactor,
          freqMult: 0.015,
          yOffset: 0.48,
        },
        {
          color: 'rgba(255, 255, 255, 0.15)', // Shimmer white
          lineWidth: 1.0,
          speedMult: 0.5,
          ampMult: 75 * activeFactor,
          freqMult: 0.005,
          yOffset: 0.5,
        },
      ];

      waveLayers.forEach((layer) => {
        ctx.beginPath();
        ctx.strokeStyle = layer.color;
        ctx.lineWidth = layer.lineWidth;

        const points = 60;
        for (let i = 0; i <= points; i++) {
          const x = (i / points) * width;
          const normalizedX = i / points;

          // Mathematical wave formula combining sin, cos, and audio frequency modulation
          let audioMod = 0;
          if (timeData && timeData.length > 0) {
            const dataIdx = Math.floor((normalizedX) * (timeData.length - 1));
            audioMod = ((timeData[dataIdx] - 128) / 128) * 45;
          }

          // Cursor interactive pinch
          let mouseDisplacement = 0;
          if (mouseRef.current.isHovering) {
            const dist = Math.abs(normalizedX - mouseRef.current.x);
            if (dist < 0.25) {
              mouseDisplacement = (1 - dist / 0.25) * 35 * Math.sin(time * 3);
            }
          }

          const baseWave = Math.sin(x * layer.freqMult + time * layer.speedMult) *
            Math.cos(x * 0.003 + time * 0.5);

          const envelope = Math.sin(normalizedX * Math.PI); // Tapers at both screen ends

          const y = (height * layer.yOffset) + (baseWave * layer.ampMult * envelope) + (audioMod * envelope) + mouseDisplacement;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      });

      // Draw floating musical particles (glistening bonang/saron metallic dust & acoustic sparkles)
      particles.forEach((p, idx) => {
        p.phase += p.speed;
        const currentX = (p.x * width + Math.sin(time + idx) * 20) % width;
        const currentY = (p.y * height + Math.cos(time * 0.8 + idx) * (25 * activeFactor));

        ctx.beginPath();
        ctx.arc(currentX, currentY, p.radius * (1 + audioPower * 0.8), 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Draw connecting subtle harmonic lines between close particles
        for (let j = idx + 1; j < Math.min(idx + 4, particles.length); j++) {
          const p2 = particles[j];
          const p2X = (p2.x * width + Math.sin(time + j) * 20) % width;
          const p2Y = (p2.y * height + Math.cos(time * 0.8 + j) * (25 * activeFactor));
          const dx = currentX - p2X;
          const dy = currentY - p2Y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 80) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 200, 87, ${0.15 * (1 - dist / 80)})`;
            ctx.lineWidth = 0.6;
            ctx.moveTo(currentX, currentY);
            ctx.lineTo(p2X, p2Y);
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      if (canvas) {
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [intensity]);

  return (
    <canvas
      ref={canvasRef}
      id="hero-audio-canvas"
      className={`absolute inset-0 w-full h-full pointer-events-auto opacity-80 ${className}`}
    />
  );
};
