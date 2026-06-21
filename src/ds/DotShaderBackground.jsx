import { useEffect, useRef } from 'react';

export default function DotShaderBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let gl = canvas.getContext('webgl', { alpha: true, antialias: true, premultipliedAlpha: true });
    if (!gl) {
      gl = canvas.getContext('experimental-webgl', { alpha: true, antialias: true, premultipliedAlpha: true });
    }

    let animationFrameId;

    // Fallback if WebGL isn't supported
    if (!gl) {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const draw2D = () => {
        const dpr = window.devicePixelRatio || 1;
        const width = window.innerWidth;
        const height = window.innerHeight;

        if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
          canvas.width = width * dpr;
          canvas.height = height * dpr;
          canvas.style.width = `${width}px`;
          canvas.style.height = `${height}px`;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const isLight = document.documentElement.classList.contains('light');
        const opacity = isLight ? 0.18 : 0.35;

        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;

        const dotSpacing = 40 * dpr;
        const dotRadius = 2.0 * dpr;

        for (let x = 0; x < canvas.width; x += dotSpacing) {
          for (let y = 0; y < canvas.height; y += dotSpacing) {
            ctx.beginPath();
            ctx.arc(x, y, dotRadius, 0, 2 * Math.PI);
            ctx.fill();
          }
        }
      };

      const scheduleDraw = () => {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = requestAnimationFrame(draw2D);
      };
      const themeObserver = new MutationObserver(scheduleDraw);
      themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class', 'data-theme'],
      });
      window.addEventListener('resize', scheduleDraw);
      draw2D();
      return () => {
        cancelAnimationFrame(animationFrameId);
        themeObserver.disconnect();
        window.removeEventListener('resize', scheduleDraw);
      };
    }

    // Vertex Shader Source
    const vsSource = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    // Fragment Shader Source
    const fsSource = `
      precision mediump float;
      uniform vec2 u_resolution;
      uniform vec3 u_dot_color;
      uniform float u_pixel_ratio;
      uniform float u_opacity_mult;

      void main() {
        vec2 coord = gl_FragCoord.xy;
        float dot_spacing = 40.0 * u_pixel_ratio;
        
        vec2 grid = mod(coord, dot_spacing);
        vec2 dist_to_center = min(grid, dot_spacing - grid);
        float dist = length(dist_to_center);
        
        // Dot radius: 2.0 CSS pixels (4px diameter in CSS, scaled by DPI)
        float dot_radius = 2.0 * u_pixel_ratio;
        
        // Correct smoothstep logic to avoid undefined behavior (edge0 must be < edge1)
        float dot_pattern = 1.0 - smoothstep(dot_radius - 0.5, dot_radius + 0.5, dist);
        
        vec2 uv = gl_FragCoord.xy / u_resolution;
        float vignette = uv.x * (1.0 - uv.x) * uv.y * (1.0 - uv.y);
        vignette = clamp(pow(16.0 * vignette, 0.4), 0.0, 1.0);
        
        // Increased base opacity to 0.35 for clean visibility
        float alpha = dot_pattern * 0.35 * vignette * u_opacity_mult;
        gl_FragColor = vec4(u_dot_color * alpha, alpha);
      }
    `;

    const createShader = (glCtx, type, source) => {
      const shader = glCtx.createShader(type);
      glCtx.shaderSource(shader, source);
      glCtx.compileShader(shader);
      if (!glCtx.getShaderParameter(shader, glCtx.COMPILE_STATUS)) {
        console.error('Shader compilation error:', glCtx.getShaderInfoLog(shader));
        glCtx.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program linking error:', gl.getProgramInfoLog(program));
      return;
    }

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const vertices = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1,
    ]);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'position');
    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
    const dotColorLocation = gl.getUniformLocation(program, 'u_dot_color');
    const pixelRatioLocation = gl.getUniformLocation(program, 'u_pixel_ratio');
    const opacityMultLocation = gl.getUniformLocation(program, 'u_opacity_mult');

    const render = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = window.innerWidth;
      const height = window.innerHeight;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        gl.viewport(0, 0, canvas.width, canvas.height);
      }

      gl.clearColor(0.0, 0.0, 0.0, 0.0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(program);

      gl.enableVertexAttribArray(positionLocation);
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform1f(pixelRatioLocation, dpr);

      gl.uniform3f(dotColorLocation, 1.0, 1.0, 1.0);

      const isLight = document.documentElement.classList.contains('light');
      gl.uniform1f(opacityMultLocation, isLight ? 0.5 : 1.0);

      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    const scheduleRender = () => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(render);
    };
    const themeObserver = new MutationObserver(scheduleRender);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'data-theme'],
    });
    window.addEventListener('resize', scheduleRender);
    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      themeObserver.disconnect();
      window.removeEventListener('resize', scheduleRender);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(positionBuffer);
    };
  }, []);

  return <canvas ref={canvasRef} className="dot-shader-canvas" aria-hidden="true" />;
}
