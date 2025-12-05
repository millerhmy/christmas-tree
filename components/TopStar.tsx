import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { AppState } from '../types';

interface TopStarProps {
  progress: React.MutableRefObject<number>;
}

const TopStar: React.FC<TopStarProps> = ({ progress }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  const { geometry, chaosPos, targetPos } = useMemo(() => {
    const shape = new THREE.Shape();
    const points = 5;
    const outerRadius = 0.9;
    const innerRadius = 0.4;
    
    for (let i = 0; i < points * 2; i++) {
      const r = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (i / (points * 2)) * Math.PI * 2 + Math.PI / 2;
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    shape.closePath();

    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: 0.25,
      bevelEnabled: true,
      bevelThickness: 0.1,
      bevelSize: 0.05,
      bevelSegments: 4,
    });
    geo.center();

    const tPos = new THREE.Vector3(0, 10.2, 0);
    const cPos = new THREE.Vector3(
      (Math.random() - 0.5) * 20,
      15, 
      (Math.random() - 0.5) * 20
    );

    return { geometry: geo, chaosPos: cPos, targetPos: tPos };
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = progress.current;
    const time = clock.getElapsedTime();
    const ease = (x: number) => x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
    const smoothedT = ease(t);

    meshRef.current.position.lerpVectors(chaosPos, targetPos, smoothedT);
    
    if (t > 0.9) {
      meshRef.current.rotation.y = time * 0.5;
    } else {
      meshRef.current.rotation.x = time + chaosPos.x;
      meshRef.current.rotation.y = time * 0.8;
    }
  });

  return (
    <mesh ref={meshRef} geometry={geometry} castShadow>
      <meshStandardMaterial 
        color="#FFD700" 
        emissive="#FFA500"
        emissiveIntensity={2}
        roughness={0.0}
        metalness={1.0}
        envMapIntensity={3}
      />
    </mesh>
  );
};

export default TopStar;