'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface FallingHeartsProps {
  className?: string;
}

const HEART_COUNT = 300;
const COLORS = [
  [236, 72, 153],  // pink-500
  [244, 114, 182], // pink-400
  [251, 113, 133], // rose-400
  [253, 164, 175], // rose-300
] as const;

interface Heart {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  wobbleOffset: number;
  wobbleSpeed: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  color: readonly [number, number, number];
}

function createHeart(width: number, height: number, startFromTop?: boolean): Heart {
  const layer = Math.random();
  // 3 depth layers: far (small/faint), mid, close (big/bright)
  const size = layer < 0.33 ? 8 + Math.random() * 6 : layer < 0.66 ? 12 + Math.random() * 8 : 18 + Math.random() * 10;
  const opacity = layer < 0.33 ? 0.3 + Math.random() * 0.15 : layer < 0.66 ? 0.4 + Math.random() * 0.2 : 0.5 + Math.random() * 0.25;
  const speedY = 0.3 + Math.random() * 0.6 + (size / 14) * 0.3;

  return {
    x: Math.random() * width,
    y: startFromTop ? -(Math.random() * height * 0.3) : Math.random() * height,
    size,
    speedY,
    speedX: 0,
    wobbleOffset: Math.random() * Math.PI * 2,
    wobbleSpeed: 0.01 + Math.random() * 0.02,
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * 0.02,
    opacity,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
  };
}

// Bootstrap heart-fill SVG path (16×16 viewBox)
// Source: https://icons.getbootstrap.com/icons/heart-fill/
const HEART_PATH = new Path2D(
  'M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314'
);

function drawHeart(ctx: CanvasRenderingContext2D, heart: Heart, time: number) {
  const { x, y, size, rotation, color, opacity } = heart;
  const wobbleX = Math.sin(time * heart.wobbleSpeed + heart.wobbleOffset) * 0.8;
  // Scale factor: SVG path is 16×16, scale to desired heart size
  const scale = size / 16;

  ctx.save();
  ctx.translate(x + wobbleX, y);
  ctx.rotate(rotation);
  ctx.scale(scale, scale);
  // Center the 16×16 path so rotation is around the heart's center
  ctx.translate(-8, -8);
  ctx.globalAlpha = opacity;
  ctx.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
  ctx.fill(HEART_PATH);
  ctx.restore();
}

export function FallingHearts({ className }: FallingHeartsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    let width = parent.clientWidth;
    let height = parent.clientHeight;
    const dpr = window.devicePixelRatio || 1;

    function resize() {
      if (!parent || !canvas) return;
      width = parent.clientWidth;
      height = parent.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();

    // Initialize hearts scattered across the canvas
    const hearts: Heart[] = Array.from({ length: HEART_COUNT }, () =>
      createHeart(width, height, false)
    );

    let frame = 0;
    let animId: number;
    let time = 0;

    function animate() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      time += 1;

      for (const heart of hearts) {
        heart.y += heart.speedY;
        heart.rotation += heart.rotationSpeed;

        // Reset when fallen past the bottom
        if (heart.y > height + heart.size * 2) {
          heart.y = -(heart.size * 2);
          heart.x = Math.random() * width;
        }

        drawHeart(ctx, heart, time);
      }

      frame++;
      animId = requestAnimationFrame(animate);
    }

    animId = requestAnimationFrame(animate);

    const ro = new ResizeObserver(() => resize());
    ro.observe(parent);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn('pointer-events-none', className)}
    />
  );
}
