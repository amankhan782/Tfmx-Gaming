'use client';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

function Building({ position, width, height, depth, tone, seed }: { position: [number, number, number]; width: number; height: number; depth: number; tone: string; seed: number }) {
  const windows = Array.from({ length: Math.min(4, Math.max(2, Math.floor(height / 2.8))) }, (_, row) => row);
  return <group position={position}>
    <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
      <boxGeometry args={[width, height, depth]} />
      <meshStandardMaterial color={tone} roughness={0.86} />
    </mesh>
    <mesh position={[0, height + .08, 0]} castShadow>
      <boxGeometry args={[width + .18, .16, depth + .18]} />
      <meshStandardMaterial color="#292d30" roughness={.8} />
    </mesh>
    {windows.map((row) => Array.from({ length: 2 }, (_, col) => {
      const x = col === 0 ? -width * .24 : width * .24;
      const lit = (row * 7 + col * 3 + seed) % 6 === 0;
      return <mesh key={`${row}-${col}`} position={[x, .9 + row * 1.85, depth / 2 + .012]}>
        <boxGeometry args={[.38, .55, .025]} />
        <meshStandardMaterial color={lit ? '#f4c77c' : '#26383d'} emissive={lit ? '#d88b32' : '#071216'} emissiveIntensity={lit ? .55 : .08} roughness={.3} />
      </mesh>;
    }))}
    <mesh position={[0, height * .48, -depth / 2 - .015]}>
      <boxGeometry args={[width * .76, height * .7, .025]} />
      <meshStandardMaterial color="#20282b" />
    </mesh>
  </group>;
}

function StreetLamp({ x, z }: { x: number; z: number }) {
  return <group position={[x, 0, z]}>
    <mesh position={[0, 2.4, 0]}><cylinderGeometry args={[.055, .08, 4.8, 8]} /><meshStandardMaterial color="#25292b" metalness={.7} roughness={.4} /></mesh>
    <mesh position={[-.48, 4.75, 0]} rotation={[0, 0, -.18]}><boxGeometry args={[1.05, .09, .12]} /><meshStandardMaterial color="#25292b" /></mesh>
    <mesh position={[-.93, 4.67, 0]}><boxGeometry args={[.28, .12, .3]} /><meshStandardMaterial color="#fff0c8" emissive="#ffbf65" emissiveIntensity={2.4} /></mesh>
    <pointLight position={[-.93, 4.55, 0]} color="#ffc879" intensity={1.2} distance={8} decay={2} />
  </group>;
}

function Tree({ x, z, scale = 1 }: { x: number; z: number; scale?: number }) {
  return <group position={[x, 0, z]} scale={scale}>
    <mesh position={[0, .8, 0]} castShadow><cylinderGeometry args={[.13, .2, 1.6, 7]} /><meshStandardMaterial color="#49372a" /></mesh>
    <mesh position={[0, 2.05, 0]} castShadow><icosahedronGeometry args={[1.05, 1]} /><meshStandardMaterial color="#344d3a" roughness={1} /></mesh>
    <mesh position={[.32, 2.55, .08]} castShadow><icosahedronGeometry args={[.62, 1]} /><meshStandardMaterial color="#496448" roughness={1} /></mesh>
  </group>;
}

function Car() {
  const wheelRefs = useRef<THREE.Mesh[]>([]);
  return <group>
    <mesh position={[0, .82, 0]} castShadow>
      <boxGeometry args={[1.92, .62, 4.05]} />
      <meshPhysicalMaterial color="#b92d1c" metalness={.72} roughness={.24} clearcoat={.9} clearcoatRoughness={.2} />
    </mesh>
    <mesh position={[0, 1.35, -.25]} castShadow>
      <boxGeometry args={[1.62, .78, 2.05]} />
      <meshPhysicalMaterial color="#182328" metalness={.48} roughness={.18} clearcoat={1} />
    </mesh>
    <mesh position={[0, 1.34, .82]} rotation={[-.18, 0, 0]}>
      <boxGeometry args={[1.55, .62, .035]} /><meshStandardMaterial color="#9bb4bb" metalness={.25} roughness={.12} transparent opacity={.52} />
    </mesh>
    <mesh position={[0, 1.34, -1.31]} rotation={[.18, 0, 0]}>
      <boxGeometry args={[1.52, .58, .035]} /><meshStandardMaterial color="#78949b" metalness={.2} roughness={.15} transparent opacity={.42} />
    </mesh>
    {[-.72, .72].map((x) => <group key={x}>
      <mesh position={[x, .94, -2.035]}><boxGeometry args={[.42, .18, .035]} /><meshStandardMaterial color="#f6e8c6" emissive="#ffdda0" emissiveIntensity={2.2} /></mesh>
      <mesh position={[x, .82, 2.04]}><boxGeometry args={[.42, .16, .035]} /><meshStandardMaterial color="#a51d16" emissive="#e31d12" emissiveIntensity={1.1} /></mesh>
      {[1.35, -1.35].map((z) => <mesh key={z} ref={(el) => { if (el && !wheelRefs.current.includes(el)) wheelRefs.current.push(el); }} position={[x * 1.26, .48, z]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[.43, .43, .24, 24]} /><meshStandardMaterial color="#111315" roughness={.94} />
      </mesh>)}
    </group>)}
  </group>;
}

function SceneObjects() {
  const car = useRef<THREE.Group>(null);
  const progress = useRef(0);
  const traffic = useRef<THREE.Group>(null);
  useEffect(() => {
    const update = () => {
      const hero = document.getElementById('top');
      if (!hero) return;
      const range = Math.max(1, hero.offsetHeight - window.innerHeight);
      progress.current = THREE.MathUtils.clamp((window.scrollY - hero.offsetTop) / range, 0, 1);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => { window.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
  }, []);
  useFrame((state, delta) => {
    const p = progress.current;
    const travel = p * 34;
    state.camera.position.set(Math.sin(p * Math.PI) * 1.35, 5.2 - p * .35, 14 - travel);
    state.camera.lookAt(Math.sin(p * Math.PI) * .55, 1.15, -10 - travel);
    state.camera.updateProjectionMatrix();
    if (car.current) {
      car.current.position.set(Math.sin(state.clock.elapsedTime * .42) * .18, .08 + Math.sin(state.clock.elapsedTime * 2.1) * .018, 5 - travel);
      car.current.rotation.y = Math.sin(state.clock.elapsedTime * .42) * .025;
    }
    if (traffic.current) traffic.current.children.forEach((vehicle, i) => {
      vehicle.position.z = -12 - ((state.clock.elapsedTime * (2.5 + i) + i * 13) % 54);
    });
  });
  const blocks = Array.from({ length: 12 }, (_, i) => i);
  return <>
    <color attach="background" args={['#68777a']} />
    <fog attach="fog" args={['#68777a', 22, 82]} />
    <ambientLight intensity={.72} />
    <hemisphereLight args={['#c8d8df', '#28342b', .9]} />
    <directionalLight position={[-9, 16, 8]} intensity={2.3} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -.08, -24]} receiveShadow><planeGeometry args={[180, 150]} /><meshStandardMaterial color="#596052" roughness={1} /></mesh>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, .005, -24]} receiveShadow><planeGeometry args={[7.5, 115]} /><meshStandardMaterial color="#292d2e" roughness={.92} /></mesh>
    {[-3.55, 3.55].map((x) => <mesh key={x} position={[x, .018, -24]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[.12, 115]} /><meshBasicMaterial color="#d7c99f" /></mesh>)}
    {Array.from({ length: 25 }, (_, i) => <mesh key={i} position={[0, .025, 12 - i * 4.7]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[.13, 2.1]} /><meshBasicMaterial color="#e5dfc9" /></mesh>)}
    {blocks.map((i) => <group key={i}>
      <Building position={[-7.5 - (i % 3) * .55, 0, 9 - i * 6.7]} width={3.8 + (i % 2) * .8} height={5.5 + (i % 4) * 1.7} depth={4.5} tone={['#77756e', '#8c8172', '#686e6c', '#9a8c7b'][i % 4]} seed={i} />
      <Building position={[7.8 + (i % 2) * .65, 0, 6 - i * 6.7]} width={4.2 + (i % 3) * .45} height={6.5 + (i % 3) * 2.1} depth={4.8} tone={['#777d78', '#8b8073', '#77736c'][i % 3]} seed={i + 5} />
      {i % 2 === 0 && <Tree x={-4.9} z={5 - i * 6.7} scale={.8 + (i % 3) * .12} />}
      {i % 3 === 0 && <Tree x={5.1} z={1 - i * 6.7} scale={.9} />}
      {i % 2 === 1 && <StreetLamp x={-4.1} z={2 - i * 6.7} />}
      {i % 2 === 0 && <StreetLamp x={4.1} z={-1 - i * 6.7} />}
    </group>)}
    <group ref={traffic}>
      {[0, 1, 2].map((i) => <group key={i} position={[i % 2 ? 2.15 : -2.1, .1, -12 - i * 13]}>
        <mesh position={[0, .52, 0]} castShadow><boxGeometry args={[1.15, .65, 2.35]} /><meshStandardMaterial color={i === 1 ? '#d1c6a7' : '#263c49'} metalness={.45} roughness={.35} /></mesh>
        <mesh position={[0, .94, -.1]}><boxGeometry args={[.92, .4, 1.05]} /><meshStandardMaterial color="#26383e" metalness={.25} roughness={.2} /></mesh>
        <mesh position={[0, .53, 1.19]}><boxGeometry args={[.65, .13, .025]} /><meshStandardMaterial color="#df3222" emissive="#a71912" emissiveIntensity={1.5} /></mesh>
      </group>)}
    </group>
    <group ref={car} position={[0, 0, 5]}><Car /></group>
    <Float speed={.35} rotationIntensity={0} floatIntensity={.1}><mesh position={[-17, 13, -45]}><sphereGeometry args={[2.2, 24, 24]} /><meshBasicMaterial color="#f3c17b" /></mesh></Float>
  </>;
}

export default function WorldScene() {
  return <div className="world-canvas"><Canvas camera={{ position: [0, 5.2, 14], fov: 52 }} shadows dpr={[1, 1.5]} gl={{ antialias: true, powerPreference: 'high-performance' }}><SceneObjects /></Canvas></div>;
}
