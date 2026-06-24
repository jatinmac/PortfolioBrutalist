import { useEffect } from 'react';

export default function FaviconAnimator({ theme }) {
  useEffect(() => {
    const size = 32;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Locate or create the favicon link element
    let link = document.querySelector("link[rel*='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      link.type = 'image/png';
      document.head.appendChild(link);
    }

    let animationFrameId;
    let isDestroyed = false;
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const shouldAnimate = () => !motionQuery.matches && !document.hidden;

    const startTime = performance.now();

    // Wave/Grid constants tuned for the 32x32 favicon view
    const spacing = 4.0; // Spacing between dots
    const baseRadius = 1.0; // Base radius of each dot (increased for visibility)
    const radiusAmp = 0.5;  // Amplitude for radius modulation
    const displaceAmp = 0.5; // Amplitude for ripple displacement (slightly reduced to avoid overlapping)
    const maxDecayDist = 22.0; // Distance at which ripple decay completes
    const freq = 0.3; // Frequency of the ripple wave
    const speed = 4.0; // Wave propagation speed
    const origin = { x: size / 2, y: size / 2 }; // Center of the favicon canvas

    let lastDrawTime = 0;
    const fpsLimit = 20; // 20 FPS is smooth enough for favicon and highly CPU efficient
    const frameInterval = 1000 / fpsLimit;

    const draw = (timestamp) => {
      if (isDestroyed) return;

      // Limit frame rate for CPU efficiency
      if (timestamp - lastDrawTime < frameInterval) {
        if (shouldAnimate()) {
          animationFrameId = requestAnimationFrame(draw);
        }
        return;
      }
      lastDrawTime = timestamp;

      const rootStyle = getComputedStyle(document.documentElement);
      const bgHex = rootStyle.getPropertyValue('--primitive-terracotta-500').trim() || '#de7b61';

      // Clear the canvas
      ctx.clearRect(0, 0, size, size);

      // Draw rounded rectangle background (matching high-quality app icon style)
      ctx.fillStyle = bgHex;
      const cornerRadius = 6;
      ctx.beginPath();
      ctx.moveTo(cornerRadius, 0);
      ctx.lineTo(size - cornerRadius, 0);
      ctx.quadraticCurveTo(size, 0, size, cornerRadius);
      ctx.lineTo(size, size - cornerRadius);
      ctx.quadraticCurveTo(size, size, size - cornerRadius, size);
      ctx.lineTo(cornerRadius, size);
      ctx.quadraticCurveTo(0, size, 0, size - cornerRadius);
      ctx.lineTo(0, cornerRadius);
      ctx.quadraticCurveTo(0, 0, cornerRadius, 0);
      ctx.closePath();
      ctx.fill();

      // Calculate wave state
      const time = (performance.now() - startTime) / 1000;

      // Render dot wave grid
      ctx.fillStyle = '#000000';
      ctx.globalAlpha = 1.0; // Solid black pixels for maximum crispness

      for (let x = spacing / 2; x < size; x += spacing) {
        for (let y = spacing / 2; y < size; y += spacing) {
          const toOriginX = x - origin.x;
          const toOriginY = y - origin.y;
          const dist = Math.hypot(toOriginX, toOriginY);

          // Wave equation
          const wave = Math.sin(dist * freq - time * speed);
          const decay = Math.pow(Math.max(0, 1 - dist / maxDecayDist), 1.2);

          // Displace dots radially from center
          let dx = 0;
          let dy = 0;
          if (dist > 0) {
            dx = (toOriginX / dist) * displaceAmp * wave * decay;
            dy = (toOriginY / dist) * displaceAmp * wave * decay;
          }

          const posX = x + dx;
          const posY = y + dy;

          // Modulate dot radius
          const radius = Math.max(0.2, baseRadius + radiusAmp * wave * decay);

          ctx.beginPath();
          ctx.arc(posX, posY, radius, 0, 2 * Math.PI);
          ctx.fill();
        }
      }

      // Reset global alpha
      ctx.globalAlpha = 1.0;

      // Update favicon link
      link.href = canvas.toDataURL('image/png');

      if (shouldAnimate()) {
        animationFrameId = requestAnimationFrame(draw);
      }
    };

    const handleVisibilityChange = () => {
      cancelAnimationFrame(animationFrameId);
      if (shouldAnimate()) {
        animationFrameId = requestAnimationFrame(draw);
      }
    };

    const handleMotionChange = () => {
      cancelAnimationFrame(animationFrameId);
      if (shouldAnimate()) {
        animationFrameId = requestAnimationFrame(draw);
      } else {
        draw(performance.now());
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    motionQuery.addEventListener('change', handleMotionChange);

    // Run first frame
    if (shouldAnimate()) {
      animationFrameId = requestAnimationFrame(draw);
    } else {
      draw(performance.now());
    }

    return () => {
      isDestroyed = true;
      cancelAnimationFrame(animationFrameId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      motionQuery.removeEventListener('change', handleMotionChange);
    };
  }, [theme]); // Re-run effect/draw on theme change to instantly update colors

  return null;
}
