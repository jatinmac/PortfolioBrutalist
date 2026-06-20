import { useEffect, useRef } from 'react';

export default function GrainShaderBackground({ theme }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let gl = canvas.getContext('webgl', {
      alpha: true,
      antialias: false,
      premultipliedAlpha: false,
    });
    if (!gl) {
      gl = canvas.getContext('experimental-webgl', {
        alpha: true,
        antialias: false,
        premultipliedAlpha: false,
      });
    }

    // Canvas 2D fallback.
    if (!gl) {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const TILE = 256;

      const buildNoiseTile = () => {
        const off = document.createElement('canvas');
        off.width = TILE;
        off.height = TILE;
        const offCtx = off.getContext('2d');
        if (!offCtx) return null;

        const img = offCtx.createImageData(TILE, TILE);
        const d = img.data;
        const isLight = document.documentElement.classList.contains('light');
        const alpha = isLight ? 20 : 35;

        for (let i = 0; i < d.length; i += 4) {
          const v = (Math.random() * 255) | 0;
          d[i] = v;
          d[i + 1] = v;
          d[i + 2] = v;
          d[i + 3] = alpha;
        }
        offCtx.putImageData(img, 0, 0);
        return off;
      };

      const paint = () => {
        const dpr = window.devicePixelRatio || 1;
        const w = window.innerWidth;
        const h = window.innerHeight;

        canvas.width = w * dpr;
        canvas.height = h * dpr;
        canvas.style.width = `${w}px`;
        canvas.style.height = `${h}px`;

        const tile = buildNoiseTile();
        if (!tile) return;
        const pat = ctx.createPattern(tile, 'repeat');
        if (pat) {
          ctx.fillStyle = pat;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
      };

      paint();

      const onResize = () => paint();
      window.addEventListener('resize', onResize);
      return () => window.removeEventListener('resize', onResize);
    }

    // WebGL path.

    const vsSource = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    // Static per-pixel noise — tiny dots that look like paper/film grain.
    // No animation: renders once per resize, not every frame.
    const fsSource = `
      precision highp float;
      uniform float u_intensity;
      uniform float u_seed;

      // Two-component hash for high-quality spatial noise
      float hash(vec2 p) {
        vec3 p3 = fract(vec3(p.xyx) * 0.1031);
        p3 += dot(p3, p3.yzx + 33.33);
        return fract((p3.x + p3.y) * p3.z);
      }

      void main() {
        // Use raw gl_FragCoord — one noise dot per physical pixel
        vec2 uv = gl_FragCoord.xy;
        float n = hash(uv + u_seed);

        // Output straight-alpha grayscale noise
        gl_FragColor = vec4(vec3(n), u_intensity);
      }
    `;

    const compile = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error('Grain shader error:', gl.getShaderInfoLog(s));
        gl.deleteShader(s);
        return null;
      }
      return s;
    };

    const vs = compile(gl.VERTEX_SHADER, vsSource);
    const fs = compile(gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Grain program link error:', gl.getProgramInfoLog(program));
      return;
    }

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );

    const aPos = gl.getAttribLocation(program, 'position');
    const uIntensity = gl.getUniformLocation(program, 'u_intensity');
    const uSeed = gl.getUniformLocation(program, 'u_seed');

    // A fixed random seed so the pattern is stable but unique per page load
    const seed = Math.random() * 1000;

    const paint = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = window.innerWidth;
      const h = window.innerHeight;

      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      gl.viewport(0, 0, canvas.width, canvas.height);

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);

      gl.enableVertexAttribArray(aPos);
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

      gl.uniform1f(uSeed, seed);

      const isLight = document.documentElement.classList.contains('light');
      gl.uniform1f(uIntensity, isLight ? 0.09 : 0.14);

      gl.disable(gl.BLEND);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    // Render once (static texture), then re-render on resize or theme change
    paint();

    const onResize = () => paint();
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buf);
    };
  }, [theme]);

  return <canvas ref={canvasRef} className="grain-shader-canvas" aria-hidden="true" />;
}
