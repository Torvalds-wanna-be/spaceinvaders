import React, { useEffect, useRef } from "react";

export default function SpaceMinigames(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const stars: Array<{ x: number; y: number; len: number; speed: number; alpha: number; thickness: number }> = [];

    const STAR_COUNT = Math.max(80, Math.floor((width * height) / 8000));

    const rand = (min: number, max: number) => Math.random() * (max - min) + min;

    const createStars = () => {
      stars.length = 0;
      for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
          x: rand(0, width),
          y: rand(-height, height),
          len: rand(8, 30),
          speed: rand(1.5, 4.5),
          alpha: rand(0.4, 1),
          thickness: rand(0.6, 2),
        });
      }
    };

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      createStars();
    };

    window.addEventListener("resize", resize);
    createStars();

    let raf = 0;

    const draw = () => {
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, width, height);

      // draw stars behind everything
      stars.forEach((s) => {
        const vx = s.speed * 0.3;
        const vy = s.speed * 1.2;
        s.x += vx;
        s.y += vy;

        if (s.y - s.len > height) {
          s.y = -s.len;
          s.x = rand(0, width);
        }
        if (s.x - s.len > width) s.x = -s.len;

        // tail opposite to motion with glow
        const tailLength = s.speed * 8;
        ctx.beginPath();
        ctx.moveTo(s.x - vx * tailLength, s.y - vy * tailLength);
        ctx.lineTo(s.x, s.y);
        ctx.strokeStyle = `rgba(255,255,255,${Math.max(0.15, s.alpha * 0.8)})`;
        ctx.lineWidth = Math.max(0.5, s.thickness);
        ctx.shadowBlur = 8;
        ctx.shadowColor = `rgba(255,255,255,${s.alpha * 0.6})`;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(s.x, s.y, Math.max(0.8, s.thickness * 1.5), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${Math.min(1, s.alpha + 0.3)})`;
        ctx.shadowBlur = 12;
        ctx.shadowColor = `rgba(255,255,255,${s.alpha})`;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      raf = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const items = Array.from({ length: 6 }, (_, i) => ({ id: i + 1 }));

  return (
    <div className="min-h-screen relative overflow-hidden bg-black text-white">
      {/* Canvas for stars */}
      <canvas ref={canvasRef} className="fixed inset-0 -z-10 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 py-12">
        <header className="relative mb-8 text-center">
          <h1 className="text-4xl sm:text-6xl font-extrabold inline-block relative">
            Space minigames
            {/* Diagonal byline */}
            <span className="absolute" style={{ right: '-20px', bottom: '-18px', transform: 'rotate(-8deg)', fontFamily: "'Gloria Hallelujah', cursive", fontSize: '1.1rem', fontWeight: 'normal', color: 'rgba(255,255,255,0.7)' }}>
              by Lee
            </span>
          </h1>
        </header>
        <main>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {items.map((it) => (
              <button key={it.id} aria-label={`Open game ${it.id}`} className="group relative w-full overflow-visible" type="button">
                <div className="aspect-16-9 bg-white/5 rounded-2xl border border-white/6 relative overflow-hidden transition-transform duration-300 ease-out transform-gpu group-hover:scale-105 group-hover:-translate-y-2">
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-lg font-semibold">Game {it.id}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </main>
      </div>
      <style>{`
        .aspect-16-9{ position: relative; width: 100%; padding-top: 56.25%; }
        .aspect-16-9 > *{ position: absolute; top:0; left:0; right:0; bottom:0; }
        .group:hover .aspect-16-9{ box-shadow: 0 28px 48px rgba(0,0,0,0.6), 0 6px 18px rgba(0,0,0,0.45); border-color: rgba(255,255,255,0.12); transform: translateY(-6px) scale(1.03); }
        @media (min-width: 640px){ .grid-cols-1.sm\:grid-cols-3{ grid-template-columns: repeat(3, minmax(0,1fr)); } }
      `}</style>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Gloria+Hallelujah&display=swap" rel="stylesheet" />
    </div>
  );
}
