import { useEffect, useRef, useState } from 'react';
import { MOBILE_PERFORMANCE_QUERY } from '../utils/mediaQueries';
import './CalmSeaBackground.css';

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform float u_theme;

  varying vec2 vUv;

  // Classic high-frequency sinusoidal noise hash (no spatial correlations)
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  // Twinkling star generator
  float stars(vec2 p, float time) {
    vec2 sp = p * 60.0; // scale up coordinates
    vec2 ip = floor(sp);
    vec2 fp = fract(sp);
    float h = hash(ip);
    if (h > 0.965) { // ~3.5% density
      vec2 center = vec2(h, fract(h * 10.0)) * 0.6 + 0.2; // random center in cell
      float d = length(fp - center);
      float star = smoothstep(0.08, 0.0, d);
      float speed = 0.22 + h * 0.38;
      float twinkle = sin(time * speed + h * 6.28) * 0.5 + 0.5;
      twinkle = twinkle * twinkle; // Breathing glow curve
      return star * (0.2 + 0.8 * twinkle);
    }
    return 0.0;
  }

  void main() {
    vec2 p = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y;
    
    // Position the horizon in the upper-middle region
    float horizon = 0.22;
    float dist = horizon - p.y;
    
    // Core background theme palettes
    vec3 darkBase = vec3(0.035, 0.035, 0.045); // Deep zinc dark
    vec3 lightBase = vec3(0.97, 0.98, 0.99); // Soft slate light
    vec3 baseColor = mix(darkBase, lightBase, u_theme);
    
    vec3 finalColor = baseColor;
    
    if (dist > 0.0) {
      // Perspective transform for ground plane projection
      float depth = 1.0 / dist;
      vec2 planeUV = vec2(p.x * depth * 0.45, depth * 0.24);
      
      float time = u_time * 0.25;
      
      // Layered waves using layered sine/cosine waves
      float waveVal = 0.0;
      waveVal += sin(planeUV.x * 2.0 + planeUV.y * 1.5 + time) * 0.45;
      waveVal += cos(planeUV.x * 4.5 - planeUV.y * 3.0 - time * 1.35) * 0.28;
      waveVal += sin(planeUV.x * 8.2 + planeUV.y * 6.5 + time * 2.2) * 0.16;
      waveVal += cos(planeUV.x * 16.0 - planeUV.y * 12.0 - time * 3.4) * 0.07;
      
      // Normalize wave value to 0..1
      waveVal = waveVal * 0.5 + 0.5;
      
      // Dark mode palette
      vec3 darkWaterDeep = vec3(0.015, 0.02, 0.035);
      vec3 darkWaterShallow = vec3(0.03, 0.10, 0.22);
      vec3 darkWaterHighlight = vec3(0.12, 0.36, 0.76);
      
      // Light mode palette (darker sea)
      vec3 lightWaterDeep = vec3(0.82, 0.86, 0.90);
      vec3 lightWaterShallow = vec3(0.70, 0.77, 0.84);
      vec3 lightWaterHighlight = vec3(0.98, 0.99, 1.0);
      
      vec3 deepColor = mix(darkWaterDeep, lightWaterDeep, u_theme);
      vec3 shallowColor = mix(darkWaterShallow, lightWaterShallow, u_theme);
      vec3 highlightColor = mix(darkWaterHighlight, lightWaterHighlight, u_theme);
      
      // Blend colors based on virtual depth
      float depthBlend = clamp(dist * 2.5, 0.0, 1.0);
      vec3 waterColor = mix(deepColor, shallowColor, depthBlend);
      
      // Add fine wave highlights
      float crest = smoothstep(0.66, 0.88, waveVal);
      waterColor = mix(waterColor, highlightColor, crest * 0.18);
      
      // Sun position (matches the sky rendering)
      vec2 sunPos = vec2(0.3, 0.35);
      
      // Shimmering reflection path (sun road) in light mode
      float sunRefX = abs(p.x - sunPos.x);
      float reflectionCol = exp(-sunRefX * sunRefX * 450.0 * dist);
      float shimmer = smoothstep(0.42, 0.82, waveVal) * waveVal;
      float sunSpecular = reflectionCol * (0.15 + 0.85 * shimmer) * smoothstep(0.0, 0.2, dist);
      vec3 sunRefColor = vec3(1.0, 0.88, 0.65) * sunSpecular * u_theme * 0.72;
      
      // Apply reflections
      waterColor += sunRefColor;
      
      // Subtle ambient specular shading
      float shade = sin(planeUV.x * 3.5 + time) * cos(planeUV.y * 2.5 + time) * 0.025;
      waterColor += mix(vec3(shade), vec3(-shade), u_theme * 0.4);
      
      // Fade out smoothly towards the misty horizon
      float mistFade = smoothstep(0.0, 0.35, dist);
      finalColor = mix(baseColor, waterColor, mistFade);
    } else {
      // Sky region
      vec3 color = baseColor;
      
      // Twinkling stars in dark mode
      float starsVal = stars(p, u_time) * (1.0 - u_theme);
      color += vec3(starsVal * 0.95);
      
      // Sun and warm radial glow in light mode
      vec2 sunPos = vec2(0.3, 0.35);
      float sunDist = length(p - sunPos);
      
      float sunDisc = smoothstep(0.045, 0.035, sunDist);
      float sunGlow = exp(-sunDist * 3.5);
      vec3 sunColor = vec3(1.0, 0.98, 0.94) * sunDisc + vec3(1.0, 0.76, 0.42) * sunGlow * 0.45;
      
      color += sunColor * u_theme;
      
      finalColor = color;
    }
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

export default function CalmSeaBackground({ theme }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const targetThemeRef = useRef(theme === 'light' ? 1.0 : 0.0);
  const [isReady, setIsReady] = useState(false);
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(MOBILE_PERFORMANCE_QUERY).matches;
    }
    return true;
  });

  useEffect(() => {
    targetThemeRef.current = theme === 'light' ? 1.0 : 0.0;
  }, [theme]);

  // Check mobile device / performance media query
  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_PERFORMANCE_QUERY);

    const listener = (e) => {
      setIsMobile(e.matches);
    };

    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  useEffect(() => {
    if (isMobile) return undefined;

    let cleanup = () => {};
    let cancelled = false;

    const initScene = async () => {
      const THREE = await import('three');

      if (cancelled) return;

      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

      const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: false,
        antialias: false,
        powerPreference: 'high-performance',
      });

      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

      const geometry = new THREE.PlaneGeometry(2, 2);

      const uniforms = {
        u_time: { value: 0 },
        u_resolution: { value: new THREE.Vector2() },
        u_theme: { value: targetThemeRef.current },
      };

      const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms,
        depthWrite: false,
        depthTest: false,
      });

      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      let frameId = 0;
      let lastFrameTime = 0;
      let resizeObserver;

      // Handles prefers-reduced-motion settings
      const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      let motionSpeedScale = reducedMotionQuery.matches ? 0.08 : 1.0;

      const reducedMotionListener = (e) => {
        motionSpeedScale = e.matches ? 0.08 : 1.0;
      };
      reducedMotionQuery.addEventListener('change', reducedMotionListener);

      const resize = () => {
        const width = container.clientWidth;
        const height = container.clientHeight;
        renderer.setSize(width, height, false);
        uniforms.u_resolution.value.set(width, height);
      };

      const render = (time) => {
        const delta = lastFrameTime ? Math.min((time - lastFrameTime) / 1000, 0.05) : 0;
        lastFrameTime = time;
        uniforms.u_time.value += delta * motionSpeedScale;

        uniforms.u_theme.value += (targetThemeRef.current - uniforms.u_theme.value) * 0.06;

        renderer.render(scene, camera);
        frameId = requestAnimationFrame(render);
      };

      resize();
      resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(container);

      setIsReady(true);
      frameId = requestAnimationFrame(render);

      cleanup = () => {
        cancelAnimationFrame(frameId);
        resizeObserver?.disconnect();
        reducedMotionQuery.removeEventListener('change', reducedMotionListener);

        geometry.dispose();
        material.dispose();
        renderer.dispose();
      };
    };

    initScene();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [isMobile]);

  if (isMobile) {
    return null;
  }

  return (
    <div ref={containerRef} className={`calm-sea-bg-container ${isReady ? 'is-ready' : ''}`}>
      <canvas ref={canvasRef} className="calm-sea-bg-canvas" />
    </div>
  );
}
