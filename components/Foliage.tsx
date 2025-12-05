import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface FoliageProps {
  progress: React.MutableRefObject<number>;
}

const vertexShader = `
  uniform float uTime;
  uniform float uProgress;
  
  attribute vec3 aChaosPos;
  attribute vec3 aTargetPos;
  attribute float aRandom;
  attribute float aSize;

  varying vec3 vColor;
  varying float vAlpha;

  float easeInOutCubic(float x) {
    return x < 0.5 ? 4.0 * x * x * x : 1.0 - pow(-2.0 * x + 2.0, 3.0) / 2.0;
  }

  void main() {
    float noise = sin(uTime * 1.5 + aRandom * 20.0) * 0.05;
    float t = easeInOutCubic(uProgress);
    
    vec3 pos = mix(aChaosPos, aTargetPos, t);
    
    if (uProgress > 0.8) {
       pos.x += noise * (1.0 - pos.y/12.0);
       pos.z += noise * (1.0 - pos.y/12.0);
    }
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    gl_PointSize = aSize * (350.0 / -mvPosition.z);

    // Color mixing: Emerald Green Gradient
    float heightFactor = (aTargetPos.y + 1.0) / 10.0;
    
    // Deep Emerald (#003311) to Rich Forest Green (#228B22)
    vec3 colorBottom = vec3(0.0, 0.2, 0.07); 
    vec3 colorTop = vec3(0.13, 0.55, 0.13); 
    
    vColor = mix(colorBottom, colorTop, heightFactor + noise * 0.2);
    
    // Gold Sparkles (#FFD700)
    if (aRandom > 0.92) {
      vColor = vec3(1.0, 0.84, 0.0); // Gold
      gl_PointSize *= 1.5; // Bigger sparkles
    }

    vAlpha = 1.0;
  }
`;

const fragmentShader = `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec2 center = gl_PointCoord - 0.5;
    float dist = length(center);
    if (dist > 0.5) discard;

    // Harder edge for pine needle feel, less fluffy
    float alpha = 1.0 - smoothstep(0.4, 0.5, dist);

    gl_FragColor = vec4(vColor, alpha * vAlpha);
  }
`;

const Foliage: React.FC<FoliageProps> = ({ progress }) => {
  const shaderRef = useRef<THREE.ShaderMaterial>(null);
  const COUNT = 20000; // More density for luxury
  
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(COUNT * 3);
    const chaosPos = new Float32Array(COUNT * 3);
    const targetPos = new Float32Array(COUNT * 3);
    const randoms = new Float32Array(COUNT);
    const sizes = new Float32Array(COUNT);

    const TREE_HEIGHT = 10;
    const MAX_RADIUS = 3.5;

    for (let i = 0; i < COUNT; i++) {
      // Cone
      const y = Math.random() * TREE_HEIGHT; 
      const r = (1 - y / TREE_HEIGHT) * MAX_RADIUS; 
      const theta = Math.random() * Math.PI * 2;
      const radiusVol = r * Math.pow(Math.random(), 0.8); // Concentrate more outside

      const tx = radiusVol * Math.cos(theta);
      const tz = radiusVol * Math.sin(theta);
      const ty = y;

      targetPos[i * 3] = tx;
      targetPos[i * 3 + 1] = ty;
      targetPos[i * 3 + 2] = tz;

      // Chaos Sphere
      const cx = (Math.random() - 0.5) * 35;
      const cy = (Math.random() - 0.5) * 35;
      const cz = (Math.random() - 0.5) * 35;

      chaosPos[i * 3] = cx;
      chaosPos[i * 3 + 1] = cy;
      chaosPos[i * 3 + 2] = cz;

      positions[i * 3] = cx;
      positions[i * 3 + 1] = cy;
      positions[i * 3 + 2] = cz;

      randoms[i] = Math.random();
      sizes[i] = Math.random() * 0.3 + 0.1; 
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aChaosPos', new THREE.BufferAttribute(chaosPos, 3));
    geo.setAttribute('aTargetPos', new THREE.BufferAttribute(targetPos, 3));
    geo.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));
    geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));

    return geo;
  }, []);

  useFrame(({ clock }) => {
    if (shaderRef.current) {
      shaderRef.current.uniforms.uTime.value = clock.getElapsedTime();
      shaderRef.current.uniforms.uProgress.value = progress.current;
    }
  });

  return (
    <points geometry={geometry}>
      <shaderMaterial
        ref={shaderRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.NormalBlending}
        uniforms={{
          uTime: { value: 0 },
          uProgress: { value: 0 },
        }}
      />
    </points>
  );
};

export default Foliage;