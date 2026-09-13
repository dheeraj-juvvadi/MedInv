"use client";

import { useEffect, useRef } from "react";

// Scroll-driven texture displacement adapted from Fetch, MIT © 2026 Nikesh Kumar.
// Full license: /third-party-notices.txt. Float literals keep the shader WebKit-compatible.
const VERTEX = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = vec2(aPos.x * 0.5 + 0.5, 0.5 - aPos.y * 0.5);
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;
const FRAGMENT = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
varying vec2 vUv;
uniform sampler2D uTex;
uniform vec2 uU;
uniform float uV0;
uniform float uVSpan;
uniform float uProgress;
uniform float uMelt;
uniform vec3 uPaper;
float hash(vec2 p) { return fract(sin(dot(p, vec2(41.3, 289.1))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}
void main() {
  float d = vUv.y;
  float x = vUv.x;
  float stretch = mix(1.0, 0.70, uProgress);
  float prof = 0.16;
  prof = mix(prof, 0.34, smoothstep(0.04, 0.20, x));
  prof = mix(prof, -0.26, smoothstep(0.30, 0.48, x));
  prof = mix(prof, 0.62, smoothstep(0.55, 0.70, x));
  prof = mix(prof, 0.11, smoothstep(0.74, 0.90, x));
  float rate = noise(vec2(x * 520.0, 17.2)) * 0.50
    + noise(vec2(x * 70.0, 23.4)) * 0.32
    + noise(vec2(x * 4.5, 11.8)) * 0.18;
  float base = mix(0.20, 0.34, uProgress);
  float amt = prof * uMelt * 1.4 * mix(0.62, 1.42, rate);
  float startFade = base + min(amt, 0.0);
  float endFade = base + max(amt, 0.0);
  float below = max(0.0, d - startFade);
  float k = smoothstep(startFade - 0.20, startFade + 0.06, d);
  float dWarp = mix(d, startFade + below * 0.085, k);
  vec4 c = texture2D(uTex, vec2(mix(uU.x, uU.y, x),
    clamp(uV0 + dWarp * uVSpan * stretch, 0.0, 0.998)));
  float fade = smoothstep(startFade, endFade + 0.004, d);
  c.rgb = mix(c.rgb, uPaper, smoothstep(0.30, 1.10, fade));
  float a = c.a * (1.0 - fade) * (1.0 - smoothstep(0.94, 1.0, d));
  gl_FragColor = vec4(c.rgb, a);
}`;

export function GrassFold() {
  const landRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const land = landRef.current;
    if (!canvas || !land) return;
    const gl = canvas.getContext("webgl", {
      alpha: true,
      premultipliedAlpha: false,
      antialias: false,
      depth: false,
    });
    if (!gl) return;
    const shaders: WebGLShader[] = [];
    const program = gl.createProgram();
    if (!program) return;
    for (const [type, source] of [
      [gl.VERTEX_SHADER, VERTEX],
      [gl.FRAGMENT_SHADER, FRAGMENT],
    ] as const) {
      const shader = gl.createShader(type);
      if (!shader) {
        gl.deleteProgram(program);
        return;
      }
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      shaders.push(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.warn("Grass shader:", gl.getShaderInfoLog(shader));
        shaders.forEach((s) => gl.deleteShader(s));
        gl.deleteProgram(program);
        return;
      }
      gl.attachShader(program, shader);
    }
    gl.linkProgram(program);
    shaders.forEach((s) => gl.deleteShader(s));
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      return;
    }
    gl.useProgram(program);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    const position = gl.getAttribLocation(program, "aPos");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const uniforms = {
      slice: gl.getUniformLocation(program, "uU"),
      start: gl.getUniformLocation(program, "uV0"),
      span: gl.getUniformLocation(program, "uVSpan"),
      progress: gl.getUniformLocation(program, "uProgress"),
      melt: gl.getUniformLocation(program, "uMelt"),
      paper: gl.getUniformLocation(program, "uPaper"),
    };
    gl.enable(gl.BLEND);
    gl.blendFuncSeparate(
      gl.SRC_ALPHA,
      gl.ONE_MINUS_SRC_ALPHA,
      gl.ONE,
      gl.ONE_MINUS_SRC_ALPHA,
    );
    gl.uniform3f(uniforms.paper, 250 / 255, 250 / 255, 247 / 255);
    const texture = gl.createTexture();
    const image = new Image();
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let disposed = false;
    let ready = false;
    let frame = 0;
    let visible = false;
    let lastProgress = -1;
    let lastWidth = 0;
    let lastHeight = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) schedule();
      },
      { rootMargin: "100px 0px" },
    );
    observer.observe(canvas);
    function draw() {
      frame = 0;
      if (
        !ready ||
        disposed ||
        document.hidden ||
        !canvas ||
        !land ||
        !gl ||
        gl.isContextLost()
      )
        return;
      const box = canvas.getBoundingClientRect();
      const plate = land.getBoundingClientRect();
      if (!box.width || !box.height) return;
      const seamProgress = Math.min(Math.max(1 - box.top / innerHeight, 0), 1);
      const progress = reduced.matches
        ? 0.55
        : Math.min(Math.max((seamProgress - 0.22) / 0.78, 0), 1);
      const resized = box.width !== lastWidth || box.height !== lastHeight;
      if (
        !resized &&
        ((!visible && lastProgress >= 0) || progress === lastProgress)
      )
        return;
      lastWidth = box.width;
      lastHeight = box.height;
      lastProgress = progress;
      const dpr = Math.min(devicePixelRatio || 1, 1.5);
      const width = Math.round(box.width * dpr),
        height = Math.round(box.height * dpr);
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      gl.viewport(0, 0, width, height);
      const scale = Math.max(
        plate.width / image.naturalWidth,
        plate.height / image.naturalHeight,
        (plate.height + box.height * 0.55) / (image.naturalHeight * 0.98),
      );
      const drawnWidth = image.naturalWidth * scale,
        drawnHeight = image.naturalHeight * scale;
      const size = `${drawnWidth}px ${drawnHeight}px`;
      if (land.style.backgroundSize !== size) land.style.backgroundSize = size;
      const half = plate.width / drawnWidth / 2;
      gl.uniform2f(uniforms.slice, 0.5 - half, 0.5 + half);
      gl.uniform1f(uniforms.start, Math.min(plate.height / drawnHeight, 1));
      gl.uniform1f(uniforms.span, box.height / drawnHeight);
      gl.uniform1f(uniforms.progress, progress);
      gl.uniform1f(uniforms.melt, 0.07 + progress * 0.39);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      canvas.dataset.rendered = "true";
      canvas.dataset.progress = progress.toFixed(3);
    }
    function schedule() {
      if (!frame && !document.hidden) frame = requestAnimationFrame(draw);
    }
    image.onload = () => {
      if (disposed) return;
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        image,
      );
      ready = true;
      schedule();
    };
    image.src = "/scenery/grass.webp";
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    document.addEventListener("visibilitychange", schedule);
    reduced.addEventListener("change", schedule);
    return () => {
      disposed = true;
      image.onload = null;
      cancelAnimationFrame(frame);
      observer.disconnect();
      document.removeEventListener("visibilitychange", schedule);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      reduced.removeEventListener("change", schedule);
      gl.deleteTexture(texture);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    };
  }, []);
  return (
    <>
      <div ref={landRef} className="grass-plate" />
      <canvas ref={canvasRef} className="grass-fold" aria-hidden="true" />
    </>
  );
}
