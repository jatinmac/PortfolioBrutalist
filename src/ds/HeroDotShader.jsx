import { useEffect, useRef } from 'react';

// Parses CSS hex colors to float values for WebGL [R, G, B]
function parseHexColor(hex) {
  if (!hex) return [0.957, 0.945, 0.871]; // Default #f4f1de cream
  const cleanHex = hex.trim().replace('#', '');
  if (cleanHex.length === 3) {
    const r = parseInt(cleanHex[0] + cleanHex[0], 16) / 255;
    const g = parseInt(cleanHex[1] + cleanHex[1], 16) / 255;
    const b = parseInt(cleanHex[2] + cleanHex[2], 16) / 255;
    return [r, g, b];
  }
  if (cleanHex.length === 6) {
    const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
    const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
    const b = parseInt(cleanHex.substring(4, 6), 16) / 255;
    return [r, g, b];
  }
  return [0.957, 0.945, 0.871];
}

export default function HeroDotShader({ headingRef }) {
  const canvasRef = useRef(null);
  const originRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let gl = canvas.getContext('webgl', { alpha: true, antialias: true, premultipliedAlpha: true });
    if (!gl) {
      gl = canvas.getContext('experimental-webgl', { alpha: true, antialias: true, premultipliedAlpha: true });
    }

    let animationFrameId;
    let isDestroyed = false;

    // Helper to calculate the origin (center of the heading) relative to the canvas
    const updateOrigin = () => {
      if (isDestroyed || !canvas) return;
      const heading = headingRef?.current;
      const canvasRect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      if (!heading) {
        // Fallback to center of canvas if heading isn't ready
        originRef.current = {
          x: (canvasRect.width / 2) * dpr,
          y: (canvasRect.height / 2) * dpr,
        };
        return;
      }

      const headingRect = heading.getBoundingClientRect();
      
      // Calculate center coordinates relative to canvas
      const x = (headingRect.left + headingRect.width / 2) - canvasRect.left;
      const y = (headingRect.top + headingRect.height / 2) - canvasRect.top;

      // WebGL Y coordinate starts from the bottom of the canvas
      const yWebGL = canvasRect.height - y;

      if (headingRect.width === 0 || headingRect.height === 0) {
        originRef.current = {
          x: (canvasRect.width / 2) * dpr,
          y: (canvasRect.height / 2) * dpr,
        };
      } else {
        originRef.current = {
          x: x * dpr,
          y: yWebGL * dpr,
        };
      }
    };

    // Setup observers for responsive origin calculation
    const resizeObserver = new ResizeObserver(() => {
      updateOrigin();
    });

    if (headingRef?.current) {
      resizeObserver.observe(headingRef.current);
    }
    resizeObserver.observe(canvas);

    updateOrigin();

    // Fallback if WebGL isn't supported
    if (!gl) {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      let prevTheme = null;
      let cachedColorStr = 'rgba(244, 241, 222, 1)'; // #f4f1de cream
      let opacityMult = 1.0;
      const startTime = performance.now();

      const draw2D = () => {
        if (isDestroyed) return;

        const dpr = window.devicePixelRatio || 1;
        const width = canvas.parentElement?.clientWidth || window.innerWidth;
        const height = canvas.parentElement?.clientHeight || window.innerHeight;

        if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
          canvas.width = width * dpr;
          canvas.height = height * dpr;
          canvas.style.width = `${width}px`;
          canvas.style.height = `${height}px`;
          updateOrigin();
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Dynamic theme checking (only query getComputedStyle on theme change)
        const currentTheme = document.documentElement.classList.contains('light') ? 'light' : 'dark';
        if (currentTheme !== prevTheme) {
          prevTheme = currentTheme;
          const rootStyle = getComputedStyle(document.documentElement);
          const colorHex = rootStyle.getPropertyValue('--section-home-text') || '#f4f1de';
          const rgb = parseHexColor(colorHex);
          cachedColorStr = `rgba(${Math.round(rgb[0] * 255)}, ${Math.round(rgb[1] * 255)}, ${Math.round(rgb[2] * 255)}`;
          opacityMult = currentTheme === 'light' ? 0.6 : 1.0;
        }

        const time = (performance.now() - startTime) / 1000;
        const origin = originRef.current;

        const spacing = 36 * dpr;
        const baseRadius = 1.5 * dpr;
        const radiusAmp = 1.2 * dpr;
        const displaceAmp = 8.0 * dpr;
        const maxDecayDist = 600 * dpr;
        const freq = 0.025 / dpr;
        const speed = 4.0;
        const fadeMargin = 120 * dpr;
        const hFadeMargin = 100 * dpr;

        // Draw dot wave grid
        for (let x = spacing / 2; x < canvas.width; x += spacing) {
          for (let y = spacing / 2; y < canvas.height; y += spacing) {
            // Distance in 2D space (2D canvas Y starts from top, so we convert origin Y back)
            const canvasY = canvas.height - origin.y;
            const toOriginX = x - origin.x;
            const toOriginY = y - canvasY;
            const dist = Math.hypot(toOriginX, toOriginY);

            const wave = Math.sin(dist * freq - time * speed);
            const decay = Math.pow(Math.max(0, 1 - dist / maxDecayDist), 1.5);

            // Shift position
            let dx = 0;
            let dy = 0;
            if (dist > 0) {
              dx = (toOriginX / dist) * displaceAmp * wave * decay;
              dy = (toOriginY / dist) * displaceAmp * wave * decay;
            }

            const posX = x + dx;
            const posY = y + dy;

            // Edge fading
            let verticalFade = 1.0;
            if (posY < fadeMargin) {
              verticalFade = posY / fadeMargin;
            } else if (canvas.height - posY < fadeMargin) {
              verticalFade = (canvas.height - posY) / fadeMargin;
            }

            let horizontalFade = 1.0;
            if (posX < hFadeMargin) {
              horizontalFade = posX / hFadeMargin;
            } else if (canvas.width - posX < hFadeMargin) {
              horizontalFade = (canvas.width - posX) / hFadeMargin;
            }

            const edgeFade = Math.max(0, Math.min(1, verticalFade * horizontalFade));
            const radius = Math.max(0.5 * dpr, baseRadius + radiusAmp * wave * decay);
            const opacity = 0.45 * edgeFade * opacityMult;

            if (opacity > 0.01) {
              ctx.beginPath();
              ctx.fillStyle = `${cachedColorStr}, ${opacity})`;
              ctx.arc(posX, posY, radius, 0, 2 * Math.PI);
              ctx.fill();
            }
          }
        }

        animationFrameId = requestAnimationFrame(draw2D);
      };

      draw2D();

      return () => {
        isDestroyed = true;
        cancelAnimationFrame(animationFrameId);
        resizeObserver.disconnect();
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
      uniform float u_time;
      uniform vec2 u_origin;

      void main() {
        vec2 coord = gl_FragCoord.xy;
        float spacing = 36.0 * u_pixel_ratio;
        
        vec2 cell = floor(coord / spacing);
        vec2 cell_center = (cell + 0.5) * spacing;
        
        float dist_to_origin = length(cell_center - u_origin);
        
        // Concentric ripples propagating outwards
        float freq = 0.025 / u_pixel_ratio;
        float speed = 4.0;
        float wave = sin(dist_to_origin * freq - u_time * speed);
        
        // Smoothly decay wave amplitude away from the heading origin
        float max_decay_dist = 600.0 * u_pixel_ratio;
        float decay = clamp(1.0 - (dist_to_origin / max_decay_dist), 0.0, 1.0);
        decay = pow(decay, 1.5);
        
        // Modulate dot displacement
        vec2 to_origin = cell_center - u_origin;
        vec2 dir = vec2(0.0);
        if (dist_to_origin > 0.0) {
          dir = to_origin / dist_to_origin;
        }
        
        float displace_amp = 8.0 * u_pixel_ratio * wave * decay;
        vec2 displaced_center = cell_center + dir * displace_amp;
        
        float dist_to_dot = length(coord - displaced_center);
        
        // Modulate dot size
        float base_radius = 1.5 * u_pixel_ratio;
        float radius_amp = 1.2 * u_pixel_ratio * wave * decay;
        float dot_radius = max(0.5 * u_pixel_ratio, base_radius + radius_amp);
        
        // Anti-aliased circle render
        float dot_pattern = 1.0 - smoothstep(dot_radius - 0.75, dot_radius + 0.75, dist_to_dot);
        
        // Vertical and horizontal boundary fades for seamless integration
        float vertical_fade = 1.0;
        float fade_margin = 120.0 * u_pixel_ratio;
        if (coord.y < fade_margin) {
          vertical_fade = coord.y / fade_margin;
        } else if (u_resolution.y - coord.y < fade_margin) {
          vertical_fade = (u_resolution.y - coord.y) / fade_margin;
        }
        vertical_fade = clamp(vertical_fade, 0.0, 1.0);
        
        float horizontal_fade = 1.0;
        float h_fade_margin = 100.0 * u_pixel_ratio;
        if (coord.x < h_fade_margin) {
          horizontal_fade = coord.x / h_fade_margin;
        } else if (u_resolution.x - coord.x < h_fade_margin) {
          horizontal_fade = (u_resolution.x - coord.x) / h_fade_margin;
        }
        horizontal_fade = clamp(horizontal_fade, 0.0, 1.0);
        
        float edge_fade = vertical_fade * horizontal_fade;
        float alpha = dot_pattern * 0.45 * edge_fade * u_opacity_mult;
        
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
    const timeLocation = gl.getUniformLocation(program, 'u_time');
    const originLocation = gl.getUniformLocation(program, 'u_origin');

    let prevTheme = null;
    let cachedColor = [0.957, 0.945, 0.871]; // Default #f4f1de
    let opacityMult = 1.0;
    const startTime = performance.now();

    const render = () => {
      if (isDestroyed) return;

      const dpr = window.devicePixelRatio || 1;
      const width = canvas.parentElement?.clientWidth || window.innerWidth;
      const height = canvas.parentElement?.clientHeight || window.innerHeight;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        gl.viewport(0, 0, canvas.width, canvas.height);
        updateOrigin();
      }

      gl.clearColor(0.0, 0.0, 0.0, 0.0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(program);

      gl.enableVertexAttribArray(positionLocation);
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform1f(pixelRatioLocation, dpr);

      // Performance optimization: check theme and update uniforms only when it changes
      const currentTheme = document.documentElement.classList.contains('light') ? 'light' : 'dark';
      if (currentTheme !== prevTheme) {
        prevTheme = currentTheme;
        const rootStyle = getComputedStyle(document.documentElement);
        const colorHex = rootStyle.getPropertyValue('--section-home-text') || '#f4f1de';
        cachedColor = parseHexColor(colorHex);
        opacityMult = currentTheme === 'light' ? 0.6 : 1.0;
      }

      gl.uniform3f(dotColorLocation, cachedColor[0], cachedColor[1], cachedColor[2]);
      gl.uniform1f(opacityMultLocation, opacityMult);

      const time = (performance.now() - startTime) / 1000;
      gl.uniform1f(timeLocation, time);

      const origin = originRef.current;
      gl.uniform2f(originLocation, origin.x, origin.y);

      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      isDestroyed = true;
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      
      // GL Cleanup
      if (gl) {
        gl.deleteProgram(program);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
        gl.deleteBuffer(positionBuffer);
      }
    };
  }, [headingRef]);

  return <canvas ref={canvasRef} className="hero-dot-shader-canvas" aria-hidden="true" />;
}
