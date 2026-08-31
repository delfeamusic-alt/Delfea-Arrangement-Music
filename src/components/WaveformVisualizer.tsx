import React, { useEffect, useRef } from 'react';
import { globalAudioEngine } from '../audio/audioEngine';

interface Props {
  isPlaying: boolean;
  accentColor?: 'gold' | 'purple' | 'cyan' | 'red' | 'blue' | 'green' | string;
  barCount?: number;
  height?: number;
  className?: string;
}

export const WaveformVisualizer: React.FC<Props> = ({
  isPlaying,
  accentColor = 'gold',
  barCount = 28,
  height = 36,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;

    const render = () => {
      try {
        time += 0.08;
        const width = canvas.width || barCount * 6;
        const h = canvas.height || height;

        ctx.clearRect(0, 0, width, h);

        const analyser = globalAudioEngine.getAnalyser();
        let freqData: Uint8Array | null = null;

        if (analyser && isPlaying) {
          try {
            freqData = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(freqData);
          } catch {
            freqData = null;
          }
        }

        const barWidth = Math.max(2, (width / barCount) - 2);
        const colorPalette: Record<string, { grad1: string; grad2: string; glow: string }> = {
          gold: {
            grad1: '#FFC857',
            grad2: '#F59E0B',
            glow: 'rgba(255, 200, 87, 0.4)',
          },
          purple: {
            grad1: '#C084FC',
            grad2: '#A55EEA',
            glow: 'rgba(165, 94, 234, 0.4)',
          },
          cyan: {
            grad1: '#2DD4BF',
            grad2: '#0D9488',
            glow: 'rgba(45, 212, 191, 0.4)',
          },
          red: {
            grad1: '#F87171',
            grad2: '#EF4444',
            glow: 'rgba(239, 68, 68, 0.4)',
          },
          blue: {
            grad1: '#60A5FA',
            grad2: '#3B82F6',
            glow: 'rgba(59, 130, 246, 0.4)',
          },
          green: {
            grad1: '#4ADE80',
            grad2: '#22C55E',
            glow: 'rgba(34, 197, 94, 0.4)',
          },
        };

        const colors = colorPalette[accentColor] || colorPalette.gold;

        for (let i = 0; i < barCount; i++) {
          let barHeight = 4;

          if (isPlaying) {
            if (freqData && freqData.length > 0) {
              const dataIdx = Math.floor((i / barCount) * 32);
              const val = (freqData[dataIdx] || 0) / 255;
              barHeight = Math.max(4, val * (h - 6));
            } else {
              // Simulated organic wave if analyser initializing
              const sineVal = Math.sin(time + i * 0.4) * 0.5 + 0.5;
              const cosVal = Math.cos(time * 0.7 + i * 0.2) * 0.3 + 0.7;
              barHeight = Math.max(4, sineVal * cosVal * (h - 8));
            }
          } else {
            // Subtle idle static wave
            barHeight = 4 + Math.sin(i * 0.3) * 3;
          }

          const x = i * (barWidth + 2);
          const y = Math.max(0, (h - barHeight) / 2);

          const grad = ctx.createLinearGradient(0, y, 0, Math.max(y + 1, y + barHeight));
          grad.addColorStop(0, colors.grad1);
          grad.addColorStop(1, colors.grad2);

          ctx.fillStyle = grad;
          ctx.beginPath();

          // Safe drawing
          if (typeof ctx.roundRect === 'function') {
            ctx.roundRect(x, y, barWidth, barHeight, 2);
          } else {
            ctx.rect(x, y, barWidth, barHeight);
          }
          ctx.fill();
        }

        animId = requestAnimationFrame(render);
      } catch (err) {
        console.warn('Visualizer animation frame error handled:', err);
      }
    };

    render();

    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [isPlaying, accentColor, barCount, height]);

  return (
    <div className={`flex items-center ${className}`}>
      <canvas
        ref={canvasRef}
        width={barCount * 6}
        height={height}
        className="w-full h-full block"
      />
    </div>
  );
};
