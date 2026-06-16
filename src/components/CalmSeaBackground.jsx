import { useEffect, useRef, useState } from 'react';
import { MOBILE_VIEWPORT_QUERY } from '../utils/mediaQueries';
import './CalmSeaBackground.css';

// EDIT THESE HEX CODES TO CHANGE THE SEA COLORS EASILY.
// Editors like VS Code will show a visual color picker next to these strings!
const OCEAN_COLORS = {
  // Dark mode: deep twilight starry ocean (from reference image)
  darkDeep: '#040b1e',
  darkShallow: '#101c38',

  // Light mode: vibrant daytime/sunset ocean (from reference image)
  lightDeep: '#094bb4',
  lightShallow: '#3b9af8',
};

const THEME_DIFFUSION_RATE = 0.36;

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
  uniform float u_scroll;
  uniform float u_scrollVelocity;
  uniform vec2 u_rippleCenters[4];
  uniform float u_rippleAges[4];
  uniform float u_rippleStrengths[4];
  
  uniform vec3 u_darkDeep;
  uniform vec3 u_darkShallow;
  
  uniform vec3 u_lightDeep;
  uniform vec3 u_lightShallow;

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

  // Simple 2D value noise
  float noise(vec2 p) {
    vec2 ip = floor(p);
    vec2 fp = fract(p);
    fp = fp * fp * (3.0 - 2.0 * fp); // Hermite curve interpolation
    
    // Hash grid corners
    float d00 = hash(ip);
    float d10 = hash(ip + vec2(1.0, 0.0));
    float d01 = hash(ip + vec2(0.0, 1.0));
    float d11 = hash(ip + vec2(1.0, 1.0));
    
    return mix(mix(d00, d10, fp.x), mix(d01, d11, fp.x), fp.y);
  }

  // 3-octave FBM for sunset clouds
  float cloudFBM(vec2 p, float time) {
    vec2 uv = p * 2.2;
    uv.x -= time * 0.045; // horizontal wind drift
    
    float f = 0.0;
    f += 0.5000 * noise(uv); uv = uv * 2.02 + vec2(time * 0.025, 0.0);
    f += 0.2500 * noise(uv); uv = uv * 2.03;
    f += 0.1250 * noise(uv);
    return f;
  }

  // Helper to compute sky color (used for sky and reflections)
  // Matches reference image: warm dusk horizon with peach/salmon tones
  vec3 getSkyColor(vec2 p, float horizon, float theme, float time) {
    // Dark mode: deep navy sky with twilight purple horizon base
    vec3 darkZenith = vec3(0.015, 0.045, 0.16);     // Dark indigo/navy
    vec3 darkHorizon = vec3(0.18, 0.10, 0.24);     // Deep purple-rose base
    
    // Light mode sky matching reference image (vibrant blue gradient to yellow-orange sunset)
    vec3 lightZenith = vec3(0.08, 0.58, 0.98);     // Vibrant azure upper sky
    vec3 lightHorizon = vec3(0.98, 0.72, 0.44);    // Warm peach-gold at horizon
    
    // Vertical gradient factor: 0 at horizon, 1 at top
    float skyGrad = clamp((p.y - horizon) * 2.2, 0.0, 1.0);
    float smoothGrad = smoothstep(0.0, 1.0, skyGrad); // Smooth ease-in-out gradient
    
    vec3 darkSky = mix(darkHorizon, darkZenith, smoothGrad);
    vec3 lightSky = mix(lightHorizon, lightZenith, smoothGrad);
    
    vec3 color = mix(darkSky, lightSky, theme);
    
    // Twinkling stars in dark mode (with celestial scroll parallax)
    float starsVal = stars(p - vec2(0.0, u_scroll * 0.000010), time) * (1.0 - theme);
    color += vec3(starsVal * 0.95);
    

    
    // 2. Smooth Moving Clouds in both Dark and Light Modes
    if (p.y > horizon - 0.05) {
      // Parallax coordinate for clouds
      vec2 cloudUV = p - vec2(0.0, u_scroll * 0.000015);
      
      float cVal = cloudFBM(cloudUV, time);
      // Lower thresholds for more cloud volume and defined edges
      float clouds = smoothstep(0.18, 0.58, cVal);
      
      // Interpolate colors based on theme
      // Dark mode clouds: deep navy shadow to silver-grey highlights
      vec3 cloudShadowDark = vec3(0.012, 0.022, 0.065);
      vec3 cloudHighlightDark = vec3(0.24, 0.28, 0.38); // Brighter silver/blue highlights
      vec3 cloudColorDark = mix(cloudShadowDark, cloudHighlightDark, cVal);
      
      // Light mode clouds: lavender shadow to brighter peachy sunset gold
      vec3 cloudShadowLight = vec3(0.60, 0.50, 0.65);
      vec3 cloudPeachLight = vec3(1.0, 0.82, 0.72);
      vec3 cloudColorLight = mix(cloudShadowLight, cloudPeachLight, cVal);
      
      vec3 cloudColor = mix(cloudColorDark, cloudColorLight, theme);
      
      // Higher opacity to make them clearly visible
      float maxOpacity = mix(0.55, 0.72, theme);
      
      // Blend clouds, fading out near mist horizon
      float mistFade = smoothstep(0.0, 0.12, p.y - horizon);
      color = mix(color, cloudColor, clouds * maxOpacity * mistFade);
    }
    
    // Smooth mix-based sunset glow (non-additive to ensure a perfectly smooth gradient)
    float horizonDist = abs(p.y - horizon);
    
    // Light mode sunset glow: centered to rise behind the home page container
    float lightGlowWeight = exp(-horizonDist * 5.5) * theme;
    float lightHorizontalFactor = 1.0 - smoothstep(0.0, 1.2, abs(p.x)); // Symmetrical fade left & right from center
    vec3 lightSunsetGlowColor = mix(vec3(0.96, 0.82, 0.70), vec3(0.99, 0.70, 0.35), lightHorizontalFactor);
    color = mix(color, lightSunsetGlowColor, lightGlowWeight * 0.85);
    
    // Light mode sun disc + glow (with celestial scroll parallax)
    vec2 sunPos = vec2(0.0, 0.25 + u_scroll * 0.000010);
    float sunDist = length(p - sunPos);
    float sunDisc = smoothstep(0.025, 0.015, sunDist) * theme;
    float sunGlow = exp(-sunDist * 3.5) * theme;
    color = mix(color, vec3(1.0, 0.98, 0.92), sunDisc);
    color += vec3(0.99, 0.76, 0.44) * sunGlow * 0.55;
    
    // Dark mode moon disc + glow (with celestial scroll parallax)
    vec2 moonPos = vec2(-0.55, 0.35 + u_scroll * 0.000010);
    float moonDist = length(p - moonPos);
    float moonDisc = smoothstep(0.02, 0.01, moonDist) * (1.0 - theme);
    float moonGlow = exp(-moonDist * 4.0) * (1.0 - theme);
    color = mix(color, vec3(0.95, 0.97, 1.0), moonDisc); // Silver moon disc
    color += vec3(0.65, 0.78, 1.0) * moonGlow * 0.22;    // Soft blue-white moon halo
    
    // Dark mode twilight glow: fiery orange-red on the left, fading to deep purple on the right
    float darkGlowWeight = exp(-horizonDist * 6.5) * (1.0 - theme);
    float darkHorizontalFactor = smoothstep(0.6, -0.8, p.x); // Fades right, brightens left
    vec3 darkSunsetGlowColor = mix(vec3(0.16, 0.08, 0.22), vec3(0.95, 0.32, 0.12), darkHorizontalFactor);
    color = mix(color, darkSunsetGlowColor, darkGlowWeight * 0.72);
    
    return color;
  }

  void main() {
    vec2 p = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y;
    
    // Very simple, low-amplitude ripple distortion on screen coordinates
    float rippleTime = u_time * 0.8;
    vec2 ripple = vec2(
      sin(p.y * 5.0 + rippleTime) * 0.015 + cos(p.x * 8.0 + rippleTime * 0.6) * 0.008,
      cos(p.x * 5.0 + rippleTime) * 0.015 + sin(p.y * 8.0 + rippleTime * 0.6) * 0.008
    );
    p += ripple;
    
    // Mouse flick ripples (propagating expanding rings)
    vec2 mouseRippleDisplacement = vec2(0.0);
    for (int i = 0; i < 4; i++) {
      float age = u_rippleAges[i];
      if (age < 1.6) {
        float distToCenter = length(p - u_rippleCenters[i]);
        float waveFront = age * 0.9; // Slower propagation (thin water)
        float distFromWaveFront = abs(distToCenter - waveFront);
        
        if (distFromWaveFront < 0.12) {
          float wave = sin((distToCenter - waveFront) * 75.0) * 0.035; // Tight high-frequency ripples
          float ageFade = clamp(1.0 - age / 1.6, 0.0, 1.0); // Fades over 1.6 seconds
          float envelope = smoothstep(0.12, 0.0, distFromWaveFront); // Narrow wave packet
          float amplitude = wave * u_rippleStrengths[i] * ageFade * envelope;
          
          vec2 dir = p - u_rippleCenters[i];
          float len = length(dir);
          if (len > 0.001) {
            mouseRippleDisplacement += (dir / len) * amplitude;
          }
        }
      }
    }
    p += mouseRippleDisplacement;
    
    // Horizon shifts UP with scroll, and tilts/curves with scroll velocity
    float horizonScroll = u_scroll * 0.000025;
    float horizon = 0.22 + horizonScroll - u_scrollVelocity * 0.012 * p.x + abs(u_scrollVelocity) * 0.004 * cos(p.x * 2.0);
    float dist = horizon - p.y;
    
    vec3 finalColor;
    
    if (dist > 0.0) {
      // Perspective transform for ground plane projection
      float depth = 1.0 / dist;
      vec2 planeUV = vec2(p.x * depth * 0.45, depth * 0.24);
      
      float time = u_time * 0.12;
      
      // Calculate layered waves and analytical gradients (slopes)
      float waveVal = 0.0;
      float dx = 0.0;
      float dy = 0.0;
      
      // Fade factors to prevent aliasing near the horizon (small dist)
      float fade1 = 1.0;
      float fade2 = smoothstep(0.015, 0.10, dist);
      float fade3 = smoothstep(0.04, 0.18, dist);
      float fade4 = smoothstep(0.08, 0.28, dist);
      float fade5 = smoothstep(0.12, 0.38, dist);
      float fade6 = smoothstep(0.16, 0.48, dist);
      
      // Pre-declare variables for wave octaves to avoid redeclaration in block scopes
      vec2 waveDir;
      vec2 warpedUV;
      float waveFreq;
      float waveArg;
      float waveS;
      float waveC;
      float wTemp;
      float wSq;
      float dwTemp;
      
      // Wave 1: Large swells (slightly diagonal to keep it flowing)
      waveDir = vec2(0.06, 0.99);
      waveFreq = 1.6;
      waveArg = (planeUV.x * waveDir.x + planeUV.y * waveDir.y) * waveFreq + time * 0.4 - u_scroll * 0.00012;
      waveS = sin(waveArg);
      waveC = cos(waveArg);
      waveVal += waveS * 0.45 * fade1;
      dx += waveC * waveDir.x * waveFreq * 0.45 * fade1;
      dy += waveC * waveDir.y * waveFreq * 0.45 * fade1;
      
      // Update warped UV (displace coordinates based on slope of previous waves)
      warpedUV = planeUV - vec2(dx, dy) * 0.04;
      
      // Wave 2: Medium chop (using billowy 1.0 - abs(sin) pattern for sharper crests)
      waveDir = vec2(-0.08, 0.99);
      waveFreq = 3.6;
      waveArg = (warpedUV.x * waveDir.x + warpedUV.y * waveDir.y) * waveFreq - time * 0.6 - u_scroll * 0.00022;
      waveS = sin(waveArg);
      waveC = cos(waveArg);
      wTemp = 1.0 - abs(waveS);
      wSq = wTemp * wTemp;
      waveVal += wSq * 0.28 * fade2;
      dwTemp = 2.0 * wTemp * (-sign(waveS)) * waveC;
      dx += dwTemp * waveDir.x * waveFreq * 0.28 * fade2;
      dy += dwTemp * waveDir.y * waveFreq * 0.28 * fade2;
      
      // Update warped UV
      warpedUV = planeUV - vec2(dx, dy) * 0.04;
      
      // Wave 3: Smaller waves
      waveDir = vec2(0.04, 0.99);
      waveFreq = 8.0;
      waveArg = (warpedUV.x * waveDir.x + warpedUV.y * waveDir.y) * waveFreq + time * 0.9 - u_scroll * 0.00038;
      waveS = sin(waveArg);
      waveC = cos(waveArg);
      wTemp = 1.0 - abs(waveS);
      wSq = wTemp * wTemp;
      waveVal += wSq * 0.18 * fade3;
      dwTemp = 2.0 * wTemp * (-sign(waveS)) * waveC;
      dx += dwTemp * waveDir.x * waveFreq * 0.18 * fade3;
      dy += dwTemp * waveDir.y * waveFreq * 0.18 * fade3;
      
      // Update warped UV
      warpedUV = planeUV - vec2(dx, dy) * 0.04;
      
      // Wave 4: Ripples
      waveDir = vec2(-0.05, 0.99);
      waveFreq = 16.0;
      waveArg = (warpedUV.x * waveDir.x + warpedUV.y * waveDir.y) * waveFreq - time * 1.4 - u_scroll * 0.00062;
      waveS = sin(waveArg);
      waveC = cos(waveArg);
      wTemp = 1.0 - abs(waveS);
      wSq = wTemp * wTemp;
      waveVal += wSq * 0.09 * fade4;
      dwTemp = 2.0 * wTemp * (-sign(waveS)) * waveC;
      dx += dwTemp * waveDir.x * waveFreq * 0.09 * fade4;
      dy += dwTemp * waveDir.y * waveFreq * 0.09 * fade4;
      
      // Update warped UV
      warpedUV = planeUV - vec2(dx, dy) * 0.04;
      
      // Wave 5: Fine wind ripples
      waveDir = vec2(0.03, 0.99);
      waveFreq = 32.0;
      waveArg = (warpedUV.x * waveDir.x + warpedUV.y * waveDir.y) * waveFreq + time * 2.1 - u_scroll * 0.00095;
      waveS = sin(waveArg);
      waveC = cos(waveArg);
      wTemp = 1.0 - abs(waveS);
      wSq = wTemp * wTemp;
      waveVal += wSq * 0.05 * fade5;
      dwTemp = 2.0 * wTemp * (-sign(waveS)) * waveC;
      dx += dwTemp * waveDir.x * waveFreq * 0.05 * fade5;
      dy += dwTemp * waveDir.y * waveFreq * 0.05 * fade5;
      
      // Update warped UV
      warpedUV = planeUV - vec2(dx, dy) * 0.04;
 
      // Wave 6: Micro-ripples
      waveDir = vec2(-0.02, 0.99);
      waveFreq = 64.0;
      waveArg = (warpedUV.x * waveDir.x + warpedUV.y * waveDir.y) * waveFreq - time * 3.2 - u_scroll * 0.00140;
      waveS = sin(waveArg);
      waveC = cos(waveArg);
      wTemp = 1.0 - abs(waveS);
      wSq = wTemp * wTemp;
      waveVal += wSq * 0.02 * fade6;
      dwTemp = 2.0 * wTemp * (-sign(waveS)) * waveC;
      dx += dwTemp * waveDir.x * waveFreq * 0.02 * fade6;
      dy += dwTemp * waveDir.y * waveFreq * 0.02 * fade6;
 
      // Re-scale waveVal to 0..1 range
      waveVal = waveVal * 0.5 + 0.5;
      
      // Normal vector in tangent space (agitated slightly during fast scrolling)
      float waviness = 0.10 + abs(u_scrollVelocity) * 0.015;
      vec3 normal = normalize(vec3(-dx * waviness, -dy * waviness, 1.0));
      
      // Dark mode palette (dynamic)
      vec3 darkWaterDeep = u_darkDeep;
      vec3 darkWaterShallow = u_darkShallow;
      
      // Light mode palette (dynamic)
      vec3 lightWaterDeep = u_lightDeep;
      vec3 lightWaterShallow = u_lightShallow;
      
      vec3 deepColor = mix(darkWaterDeep, lightWaterDeep, u_theme);
      vec3 shallowColor = mix(darkWaterShallow, lightWaterShallow, u_theme);
      
      // Blend refracted colors based on virtual depth (smooth step gradient)
      float depthBlend = smoothstep(0.0, 1.0, clamp(dist * 2.2, 0.0, 1.0));
      vec3 refractedColor = mix(deepColor, shallowColor, depthBlend);
      
      // 3D Procedural Reflection of the Sky
      float skyY = horizon + dist;
      vec2 reflectUV = vec2(p.x + normal.x * 0.07, skyY + normal.y * 0.03);
      reflectUV.y = max(horizon + 0.005, reflectUV.y); // Keep reflection in the sky
      vec3 reflectedColor = getSkyColor(reflectUV, horizon, u_theme, u_time);
      
      // Fresnel reflection factor (higher base reflection in dark mode to show waves and star reflection)
      float minFresnel = mix(0.08, 0.04, u_theme);
      float perturbedDist = dist + normal.y * 0.03;
      float fresnel = minFresnel + (1.0 - minFresnel) * pow(1.0 - clamp(perturbedDist * 1.5, 0.0, 1.0), 3.0);
      
      // Combine refracted water and reflected sky
      vec3 waterColor = mix(refractedColor, reflectedColor, fresnel);
      
      // Diffuse warm horizon glow reflection (flat gradient, no wave-modulated shimmer)
      float horizonProximity = smoothstep(0.35, 0.0, dist);
      vec3 warmGlowRef = vec3(0.85, 0.55, 0.40) * horizonProximity * u_theme * 0.05;
      waterColor += warmGlowRef;
      
      // Specular sun road reflection in light mode (centered at x = 0.0 behind container)
      vec2 rSunPos = vec2(0.0, 0.25);
      float sunRefX = abs((p.x + normal.x * 0.04) - rSunPos.x);
      float reflectionCol = exp(-sunRefX * sunRefX * 350.0 * dist);
      float rShimmer = smoothstep(0.42, 0.82, waveVal) * (0.3 + 0.7 * max(0.0, normal.y));
      float sunSpecular = reflectionCol * (0.15 + 0.85 * rShimmer) * smoothstep(0.0, 0.25, dist);
      vec3 sunRefColor = vec3(0.99, 0.85, 0.55) * sunSpecular * u_theme * 0.82;
      waterColor += sunRefColor;
      
      // Specular moon road reflection in dark mode (aligned with moon at x = -0.55)
      vec2 rMoonPos = vec2(-0.55, 0.35);
      float moonRefX = abs((p.x + normal.x * 0.04) - rMoonPos.x);
      float moonReflectionCol = exp(-moonRefX * moonRefX * 350.0 * dist);
      float moonShimmer = smoothstep(0.42, 0.82, waveVal) * (0.3 + 0.7 * max(0.0, normal.y));
      float moonSpecular = moonReflectionCol * (0.15 + 0.85 * moonShimmer) * smoothstep(0.0, 0.25, dist);
      vec3 moonRefColor = vec3(0.72, 0.85, 1.0) * moonSpecular * (1.0 - u_theme) * 0.28;
      waterColor += moonRefColor;
      
      // Add subtle film grain / micro-texture to water matching the photo
      float grain = hash(gl_FragCoord.xy + vec2(u_time * 13.0, u_time * 37.0)) * 0.012;
      waterColor += mix(vec3(grain), vec3(-grain), u_theme * 0.5);
      
      // Fade out smoothly towards the misty horizon
      vec3 horizonSkyColor = getSkyColor(vec2(p.x, horizon), horizon, u_theme, u_time);
      float mistFade = smoothstep(0.0, 0.35, dist);
      finalColor = mix(horizonSkyColor, waterColor, mistFade);
    } else {
      // Sky region
      finalColor = getSkyColor(p, horizon, u_theme, u_time);
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
      return window.matchMedia(MOBILE_VIEWPORT_QUERY).matches;
    }
    return true;
  });

  useEffect(() => {
    targetThemeRef.current = theme === 'light' ? 1.0 : 0.0;
  }, [theme]);

  // Check mobile viewport media query
  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_VIEWPORT_QUERY);

    const listener = (e) => {
      setIsMobile(e.matches);
    };

    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  useEffect(() => {
    if (isMobile) return undefined;

    let cleanup = () => { };
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
        u_darkDeep: { value: new THREE.Color(OCEAN_COLORS.darkDeep) },
        u_darkShallow: { value: new THREE.Color(OCEAN_COLORS.darkShallow) },
        u_lightDeep: { value: new THREE.Color(OCEAN_COLORS.lightDeep) },
        u_lightShallow: { value: new THREE.Color(OCEAN_COLORS.lightShallow) },
        u_scroll: { value: window.scrollY },
        u_scrollVelocity: { value: 0 },
        u_rippleCenters: { value: Array.from({ length: 4 }, () => new THREE.Vector2(0, 0)) },
        u_rippleAges: { value: new Float32Array(4).fill(999.0) },
        u_rippleStrengths: { value: new Float32Array(4).fill(0.0) },
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

      // Mouse tracking state for flick ripples
      const targetMouse = new THREE.Vector2(0, 0);
      const lastSpawnPosition = new THREE.Vector2(0, 0);
      let hasMouseMoved = false;

      const RIPPLE_COUNT = 4;
      const rippleCenters = uniforms.u_rippleCenters.value;
      const rippleAges = uniforms.u_rippleAges.value;
      const rippleStrengths = uniforms.u_rippleStrengths.value;
      let nextRippleIndex = 0;

      const spawnRipple = (x, y, strength) => {
        const idx = nextRippleIndex;
        rippleCenters[idx].set(x, y);
        rippleAges[idx] = 0.0;
        rippleStrengths[idx] = strength;
        nextRippleIndex = (nextRippleIndex + 1) % RIPPLE_COUNT;
        lastSpawnPosition.set(x, y);
      };

      const handlePointerMove = (e) => {
        const width = container.clientWidth || window.innerWidth || 800;
        const height = container.clientHeight || window.innerHeight || 600;
        
        // Map mouse from screen space to shader coordinates
        const nextX = (e.clientX - 0.5 * width) / height;
        const nextY = (0.5 * height - e.clientY) / height;
        
        if (!hasMouseMoved) {
          targetMouse.set(nextX, nextY);
          lastSpawnPosition.set(nextX, nextY);
          hasMouseMoved = true;
          return;
        }
        
        const dx = nextX - targetMouse.x;
        const dy = nextY - targetMouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        targetMouse.set(nextX, nextY);
        
        const distFromLastSpawn = targetMouse.distanceTo(lastSpawnPosition);
        
        // Spawning logic: high velocity (flick) and sufficiently spaced
        if (dist > 0.005 && distFromLastSpawn > 0.04) {
          const strength = Math.min(1.0, dist * 35.0); // Scale strength with flick speed
          if (strength > 0.15) { // Flick threshold
            spawnRipple(nextX, nextY, strength);
          }
        }
      };

      window.addEventListener('pointermove', handlePointerMove, { passive: true });

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

      let lastScroll = window.scrollY;
      let currentScroll = window.scrollY;
      let scrollVelocity = 0;

      const render = (time) => {
        const delta = lastFrameTime ? Math.min((time - lastFrameTime) / 1000, 0.05) : 0;
        lastFrameTime = time;
        uniforms.u_time.value += delta * motionSpeedScale;

        const themeBlendStep = 1 - Math.exp(-delta * THEME_DIFFUSION_RATE);
        uniforms.u_theme.value += (targetThemeRef.current - uniforms.u_theme.value) * themeBlendStep;

        // Capture window scroll positions and calculate velocity
        const targetScroll = window.scrollY;
        
        // Smoothly interpolate current scroll position (lowered from 12 to 3.2 for gorgeous glide)
        const scrollLerpFactor = 1 - Math.exp(-delta * 3.2);
        currentScroll += (targetScroll - currentScroll) * scrollLerpFactor;

        // Calculate scroll velocity (viewports per second)
        const rawVelocity = (targetScroll - lastScroll) / (window.innerHeight || 768) / (delta || 0.016);
        lastScroll = targetScroll;

        // Smoothly decay velocity (lowered from 6 to 2.5 for slow, calming fade)
        const velocityLerpFactor = 1 - Math.exp(-delta * 2.5);
        scrollVelocity += (rawVelocity - scrollVelocity) * velocityLerpFactor;

        // Clamp velocity to a safe range
        const clampedVelocity = Math.max(-2.0, Math.min(2.0, scrollVelocity));

        // Disable velocity effects when reduced motion is preferred
        const finalVelocity = motionSpeedScale < 0.5 ? 0.0 : clampedVelocity;

        uniforms.u_scroll.value = currentScroll;
        uniforms.u_scrollVelocity.value = finalVelocity;

        // Update ages of active flick ripples
        for (let i = 0; i < RIPPLE_COUNT; i++) {
          if (rippleAges[i] < 3.0) {
            rippleAges[i] += delta * motionSpeedScale;
          }
        }
        // Force uniforms upload updates
        uniforms.u_rippleAges.value = rippleAges;
        uniforms.u_rippleStrengths.value = rippleStrengths;

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
        window.removeEventListener('pointermove', handlePointerMove);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isMobile,
    OCEAN_COLORS.darkDeep,
    OCEAN_COLORS.darkShallow,
    OCEAN_COLORS.lightDeep,
    OCEAN_COLORS.lightShallow
  ]);

  if (isMobile) {
    return null;
  }

  return (
    <div ref={containerRef} className={`calm-sea-bg-container ${isReady ? 'is-ready' : ''}`}>
      <canvas ref={canvasRef} className="calm-sea-bg-canvas" />
    </div>
  );
}
