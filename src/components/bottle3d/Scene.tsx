"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, MeshTransmissionMaterial, PerformanceMonitor, RoundedBox } from "@react-three/drei";

export interface SceneProps {
  light: string;
  liquid: string;
  no: string;
  name: string;
  angle: { current: number };
  spin: number;
  active: boolean;
  quality: "high" | "low";
  still: boolean;
  onLost?: () => void;
}

const GOLD = "#c9a96b";
const BODY = { w: 1.5, h: 2.5, d: 1.05 };

function useEngraving(no: string, name: string) {
  const texture = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 512;
    c.height = 512;
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    return t;
  }, []);

  useEffect(() => {
    let live = true;
    const draw = () => {
      if (!live) return;
      const c = texture.image as HTMLCanvasElement;
      const ctx = c.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, c.width, c.height);
      ctx.fillStyle = GOLD;
      ctx.textAlign = "center";
      ctx.font = '500 40px "Jost Variable", Futura, sans-serif';
      ctx.letterSpacing = "18px";
      ctx.fillText("QUATRÉA", c.width / 2 + 9, 150);
      ctx.fillRect(c.width / 2 - 60, 190, 120, 2);
      ctx.letterSpacing = "0px";
      let size = 120;
      ctx.font = `italic 400 ${size}px "Instrument Serif", serif`;
      while (ctx.measureText(name).width > 420 && size > 60) {
        size -= 4;
        ctx.font = `italic 400 ${size}px "Instrument Serif", serif`;
      }
      ctx.fillText(name, c.width / 2, 330);
      ctx.font = '400 34px "Jost Variable", Futura, sans-serif';
      ctx.letterSpacing = "10px";
      ctx.fillText(`N°${no}`, c.width / 2 + 5, 410);
      texture.needsUpdate = true;
    };
    draw();
    document.fonts?.ready.then(draw);
    return () => {
      live = false;
    };
  }, [no, name, texture]);

  return texture;
}

function Bottle({ light, liquid, no, name, angle, spin: spinKey, quality, still }: Omit<SceneProps, "active" | "onLost">) {
  const group = useRef<THREE.Group>(null);
  const key = useRef<THREE.DirectionalLight>(null);
  const rim = useRef<THREE.PointLight>(null);
  const liquidMat = useRef<THREE.MeshPhysicalMaterial>(null);

  const target = useMemo(() => ({ light: new THREE.Color(light), liquid: new THREE.Color(liquid) }), []);
  const lightNow = useMemo(() => new THREE.Color(light), []);
  const bg = useMemo(() => new THREE.Color("#0d0c0b"), []);
  const spin = useRef({ value: 0, target: 0 });
  const angleNow = useRef(angle.current);
  const first = useRef(true);
  const label = useEngraving(no, name);

  useEffect(() => {
    target.light.set(light);
    target.liquid.set(liquid);
  }, [light, liquid, target]);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (!still) spin.current.target += Math.PI * 2;
  }, [spinKey, still]);

  useFrame((state, delta) => {
    const k = 1 - Math.pow(0.004, delta);
    lightNow.lerp(target.light, k);
    liquidMat.current?.color.lerp(target.liquid, k);
    liquidMat.current?.emissive.copy(lightNow);
    angleNow.current += (angle.current - angleNow.current) * (1 - Math.pow(0.02, delta));

    const theta = -1.2 + angleNow.current * 2.4;
    if (key.current) {
      key.current.color.copy(lightNow);
      key.current.position.set(Math.sin(theta) * 5, 2.2 + Math.cos(theta) * 1.6, 3.2);
    }
    if (rim.current) {
      rim.current.color.copy(lightNow);
      rim.current.position.set(-Math.sin(theta) * 3, 1.5, -2.5);
    }

    spin.current.value += (spin.current.target - spin.current.value) * (1 - Math.pow(0.03, delta));
    const g = group.current;
    if (g) {
      const t = state.clock.elapsedTime;
      const px = still ? 0 : state.pointer.x;
      const py = still ? 0 : state.pointer.y;
      const idle = still ? 0.35 : 0.35 + Math.sin(t * 0.4) * 0.25;
      g.rotation.y += (idle + px * 0.5 + spin.current.value - g.rotation.y) * (1 - Math.pow(0.05, delta));
      g.rotation.x += (-py * 0.1 - g.rotation.x) * (1 - Math.pow(0.05, delta));
      g.position.y = -0.6 + (still ? 0 : Math.sin(t * 0.8) * 0.04);
    }
  });

  const liquidH = (BODY.h - 0.62) * 0.8;
  const top = BODY.h / 2;

  return (
    <>
      <ambientLight intensity={0.12} />
      <directionalLight ref={key} intensity={2.6} />
      <pointLight ref={rim} intensity={18} distance={9} />

      <group ref={group}>
        <RoundedBox args={[BODY.w, BODY.h, BODY.d]} radius={0.07} smoothness={5} renderOrder={2}>
          <MeshTransmissionMaterial
            background={bg}
            thickness={0.35}
            roughness={0}
            transmission={1}
            ior={1.3}
            chromaticAberration={0.03}
            anisotropicBlur={0}
            distortion={0}
            temporalDistortion={0}
            samples={quality === "high" ? 4 : 2}
            resolution={quality === "high" ? 384 : 256}
            color="#ffffff"
          />
        </RoundedBox>

        <RoundedBox args={[BODY.w - 0.3, liquidH, BODY.d - 0.3]} radius={0.04} smoothness={3} position={[0, -top + 0.4 + liquidH / 2, 0]}>
          <meshPhysicalMaterial
            ref={liquidMat}
            color={liquid}
            emissive={light}
            emissiveIntensity={0.05}
            roughness={0.18}
            clearcoat={1}
            clearcoatRoughness={0.1}
          />
        </RoundedBox>

        <mesh position={[0, -0.1, (BODY.d - 0.3) / 2 + 0.006]} renderOrder={1}>
          <planeGeometry args={[0.95, 0.95]} />
          <meshBasicMaterial map={label} alphaTest={0.4} toneMapped={false} />
        </mesh>

        <mesh position={[0, top + 0.06, 0]}>
          <cylinderGeometry args={[0.2, 0.22, 0.12, 48]} />
          <meshStandardMaterial color={GOLD} metalness={1} roughness={0.2} />
        </mesh>

        <RoundedBox args={[0.66, 0.07, 0.66]} radius={0.015} position={[0, top + 0.155, 0]}>
          <meshStandardMaterial color={GOLD} metalness={1} roughness={0.18} />
        </RoundedBox>

        <RoundedBox args={[0.62, 0.92, 0.62]} radius={0.03} smoothness={4} position={[0, top + 0.65, 0]}>
          <meshPhysicalMaterial color="#121110" roughness={0.18} metalness={0.25} clearcoat={1} clearcoatRoughness={0.08} />
        </RoundedBox>
      </group>
    </>
  );
}

function Ticker({ active }: { active: boolean }) {
  const invalidate = useThree((s) => s.invalidate);

  useEffect(() => {
    if (!active) return;
    let raf = 0;
    let last = 0;
    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      if (t - last < 32) return;
      last = t;
      invalidate();
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [active, invalidate]);

  return null;
}

function Watchdog({ active, onSlow }: { active: boolean; onSlow?: () => void }) {
  const frames = useRef(0);
  const cb = useRef(onSlow);
  cb.current = onSlow;
  useFrame(() => {
    frames.current += 1;
  });

  useEffect(() => {
    if (!active) return;
    let checks = 0;
    let slow = 0;
    frames.current = 0;
    const t = setInterval(() => {
      if (document.hidden) return;
      const fps = frames.current;
      frames.current = 0;
      checks += 1;
      if (checks < 2) return;
      slow = fps < 18 ? slow + 1 : 0;
      if (slow >= 2) cb.current?.();
    }, 1000);
    return () => clearInterval(t);
  }, [active]);

  return null;
}

export default function Scene({ active, onLost, ...props }: SceneProps) {
  const max = props.quality === "high" ? 1.5 : 1.25;
  const [dpr, setDpr] = useState(max);
  const declines = useRef(0);

  return (
    <Canvas
      frameloop="demand"
      dpr={dpr}
      camera={{ position: [0, 0.2, 7.4], fov: 32 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ width: "100%", height: "100%" }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener("webglcontextlost", () => onLost?.(), { once: true });
      }}
    >
      <Ticker active={active} />
      <Watchdog active={active} onSlow={onLost} />
      <PerformanceMonitor
        bounds={() => [24, 28]}
        onDecline={() => {
          declines.current += 1;
          if (declines.current === 1) setDpr(1);
          else onLost?.();
        }}
      />
      <Bottle {...props} />
      <ContactShadows position={[0, -1.86, 0]} opacity={0.7} scale={6} blur={2.4} far={2.4} resolution={256} frames={1} color="#000000" />
      <Environment resolution={256}>
        <Lightformer form="rect" intensity={2.4} position={[-3, 2, 3]} scale={[0.6, 6, 1]} color="#fff4e2" />
        <Lightformer form="rect" intensity={1.6} position={[3.2, 0.5, 2]} scale={[0.4, 5, 1]} color="#fff4e2" />
        <Lightformer form="rect" intensity={0.8} position={[0, 4, -2]} scale={[5, 0.6, 1]} color="#ffe7c2" />
        <Lightformer form="rect" intensity={0.9} position={[0, 0.5, -4]} scale={[2.5, 6, 1]} color="#fff1dc" />
        <Lightformer form="rect" intensity={3} position={[-1.6, 0, 3.5]} scale={[0.15, 6, 1]} color="#ffffff" />
      </Environment>
    </Canvas>
  );
}
