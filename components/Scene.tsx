import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import Foliage from './Foliage';
import Ornaments from './Ornaments';
import TopStar from './TopStar';
import { AppState } from '../types';

interface SceneProps {
  appState: AppState;
}

const Scene: React.FC<SceneProps> = ({ appState }) => {
  const progressRef = useRef(0);

  useFrame((state, delta) => {
    const target = appState === AppState.FORMED ? 1 : 0;
    progressRef.current = THREE.MathUtils.lerp(progressRef.current, target, delta * 0.8);
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 4, 20]} fov={45} />
      <OrbitControls 
        enablePan={false} 
        minPolarAngle={Math.PI / 4} 
        maxPolarAngle={Math.PI / 1.9}
        minDistance={10}
        maxDistance={35}
        autoRotate
        autoRotateSpeed={0.5}
      />

      {/* Lobby Environment for realistic reflections */}
      <Environment preset="lobby" background={false} blur={0.8} />
      
      {/* Warm Gold Lighting */}
      <ambientLight intensity={0.6} color="#052005" />
      
      {/* Key Light - Warm Gold */}
      <spotLight 
        position={[10, 20, 10]} 
        angle={0.25} 
        penumbra={0.5} 
        intensity={200} 
        color="#FFD700" 
        castShadow 
        shadow-bias={-0.0001}
      />
      
      {/* Rim Light - Soft Pink for "Pink Elements" */}
      <spotLight 
        position={[-15, 5, -10]} 
        angle={0.6} 
        intensity={150} 
        color="#FF69B4" 
      />

      {/* Fill Light - Warm */}
      <pointLight position={[0, -2, 5]} intensity={40} color="#FFA500" />

      <group position={[0, -5, 0]}>
        <Foliage progress={progressRef} />
        <Ornaments progress={progressRef} />
        <TopStar progress={progressRef} />
      </group>

      <EffectComposer disableNormalPass>
        {/* Cinematic Glow */}
        <Bloom 
          luminanceThreshold={0.7} 
          mipmapBlur 
          intensity={1.0} 
          radius={0.5}
        />
        <Vignette eskil={false} offset={0.1} darkness={0.6} />
      </EffectComposer>
    </>
  );
};

export default Scene;