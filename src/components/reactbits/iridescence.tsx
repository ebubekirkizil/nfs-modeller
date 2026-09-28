"use client";

import { cn } from "@/lib/utils";
import { Color, Mesh, Program, Renderer, Triangle } from "ogl";
import { useEffect, useRef } from "react";

/**
 * React Bits — Iridescence
 * https://reactbits.dev
 *
 * Tam ekran, WebGL tabanlı gökkuşağı arka planı.
 *
 * Kaynağa göre farklar (hepsi bilinçli):
 *  - TypeScript'e çevrildi; ayrı CSS dosyası yerine Tailwind kullanılıyor.
 *  - WebGL bağlamı yalnızca bir kez kurulur. Renk/hız gibi proplar değişince
 *    bağlam yeniden yaratılmaz, sadece uniform güncellenir — orijinal sürümde
 *    `color` dizisi her render'da yeni referans olduğu için bağlam sürekli
 *    yeniden kuruluyordu.
 *  - Fare hareketi `window` üzerinden dinlenir: bu bileşen arka planda ve
 *    `pointer-events-none` olduğu için kendi üstünde olay alamaz.
 *  - Sekme arka plana alındığında ve `paused` verildiğinde çizim durur.
 */

const vertexShader = /* glsl */ `
attribute vec2 uv;
attribute vec2 position;

varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 0, 1);
}
`;

const fragmentShader = /* glsl */ `
precision highp float;

uniform float uTime;
uniform vec3 uColor;
uniform vec3 uResolution;
uniform vec2 uMouse;
uniform float uAmplitude;
uniform float uSpeed;

varying vec2 vUv;

void main() {
  float mr = min(uResolution.x, uResolution.y);
  vec2 uv = (vUv.xy * 2.0 - 1.0) * uResolution.xy / mr;

  uv += (uMouse - vec2(0.5)) * uAmplitude;

  float d = -uTime * 0.5 * uSpeed;
  float a = 0.0;
  for (float i = 0.0; i < 8.0; ++i) {
    a += cos(i - d - a * uv.x);
    d += sin(uv.y * i + a);
  }
  d += uTime * 0.5 * uSpeed;
  vec3 col = vec3(cos(uv * vec2(d, a)) * 0.6 + 0.4, cos(a + d) * 0.5 + 0.5);
  col = cos(col * cos(vec3(d, a, 2.5)) * 0.5 + 0.5) * uColor;
  gl_FragColor = vec4(col, 1.0);
}
`;

export type IridescenceProps = {
  /** Ana renk, 0-1 aralığında RGB. */
  color?: readonly [number, number, number];
  /** Animasyon hız çarpanı. */
  speed?: number;
  /** Fareye tepkinin genliği. */
  amplitude?: number;
  /** Fare etkileşimini aç/kapat. */
  mouseReact?: boolean;
  /** Animasyonu dondurur (örn. hareketi azaltma tercihi). */
  paused?: boolean;
  className?: string;
};

export function Iridescence({
  color = [1, 1, 1],
  speed = 1,
  amplitude = 0.1,
  mouseReact = false,
  paused = false,
  className,
}: IridescenceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const programRef = useRef<Program | null>(null);
  const pausedRef = useRef(paused);
  const mouseReactRef = useRef(mouseReact);

  // Kurulum yalnızca bağlanmada çalışır; proplar aşağıdaki efektlerle akar.
  useEffect(() => {
    const ctn = containerRef.current;
    if (!ctn) return;

    const renderer = new Renderer();
    const gl = renderer.gl;
    gl.clearColor(1, 1, 1, 1);

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new Color(...color) },
        uResolution: {
          value: new Color(
            gl.canvas.width,
            gl.canvas.height,
            gl.canvas.width / gl.canvas.height
          ),
        },
        uMouse: { value: new Float32Array([0.5, 0.5]) },
        uAmplitude: { value: amplitude },
        uSpeed: { value: speed },
      },
    });
    programRef.current = program;

    const mesh = new Mesh(gl, { geometry, program });

    function resize() {
      if (!ctn) return;
      renderer.setSize(ctn.offsetWidth, ctn.offsetHeight);
      program.uniforms.uResolution.value = new Color(
        gl.canvas.width,
        gl.canvas.height,
        gl.canvas.width / gl.canvas.height
      );
    }

    // Kapsayıcı boyutu pencereye bağlı olmayabilir (fixed/absolute kutu).
    const observer = new ResizeObserver(resize);
    observer.observe(ctn);
    resize();

    ctn.appendChild(gl.canvas);

    let animateId = 0;
    function update(t: number) {
      animateId = requestAnimationFrame(update);
      if (pausedRef.current || document.hidden) return;
      program.uniforms.uTime.value = t * 0.001;
      renderer.render({ scene: mesh });
    }
    // Duraklatılmış başlasa bile ilk kare çizilmeli.
    renderer.render({ scene: mesh });
    animateId = requestAnimationFrame(update);

    function handleMouseMove(e: MouseEvent) {
      if (!mouseReactRef.current) return;
      const x = e.clientX / window.innerWidth;
      const y = 1 - e.clientY / window.innerHeight;
      const uMouse = program.uniforms.uMouse.value as Float32Array;
      uMouse[0] = x;
      uMouse[1] = y;
    }
    window.addEventListener("mousemove", handleMouseMove);
    function handleVisibilityChange() {
      if (!document.hidden) {
        // iOS Safari BFCache'den dnǬYte requestAnimationFrame dngǬsǬnǬ kaybedebilir.
        // GrǬnǬr olduYunda dngǬyǬ tekrar tetikleyerek animasyonun donmasn nleriz.
        cancelAnimationFrame(animateId);
        animateId = requestAnimationFrame(update);
      }
    }
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pageshow", handleVisibilityChange);

    function handleContextLost(e: Event) {
      e.preventDefault();
      cancelAnimationFrame(animateId);
    }
    function handleContextRestored() {
      renderer.render({ scene: mesh });
      cancelAnimationFrame(animateId);
      animateId = requestAnimationFrame(update);
    }
    gl.canvas.addEventListener("webglcontextlost", handleContextLost, false);
    gl.canvas.addEventListener("webglcontextrestored", handleContextRestored, false);

    return () => {
      cancelAnimationFrame(animateId);
      observer.disconnect();
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pageshow", handleVisibilityChange);
      gl.canvas.removeEventListener("webglcontextlost", handleContextLost);
      gl.canvas.removeEventListener("webglcontextrestored", handleContextRestored);
      programRef.current = null;
      gl.canvas.remove();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
    // Kurulum bir kez; prop değişimleri aşağıdaki efektlerde ele alınıyor.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Prop değişimlerini uniform'lara yaz — bağlamı yeniden kurmadan.
  // Dizi yerine bileşenlerine bakılır; böylece satır içi `color={[1,1,1]}`
  // yazımı her render'da bu efekti tetiklemez.
  const [colorR, colorG, colorB] = color;
  useEffect(() => {
    const program = programRef.current;
    if (!program) return;
    program.uniforms.uColor.value = new Color(colorR, colorG, colorB);
    program.uniforms.uSpeed.value = speed;
    program.uniforms.uAmplitude.value = amplitude;
  }, [colorR, colorG, colorB, speed, amplitude]);

  useEffect(() => {
    pausedRef.current = paused;
    mouseReactRef.current = mouseReact;
  }, [paused, mouseReact]);

  return <div ref={containerRef} className={cn("size-full", className)} />;
}

export default Iridescence;
