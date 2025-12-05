import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Loader } from '@react-three/drei';
import Scene from './components/Scene';
import { AppState } from './types';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.CHAOS);

  const toggleState = () => {
    setAppState((prev) => (prev === AppState.CHAOS ? AppState.FORMED : AppState.CHAOS));
  };

  return (
    <div className="relative w-full h-screen bg-[#020502]">
      {/* Cinematic Vignette - Dark Emerald Tone */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,10,0,0.9)_100%)] z-10" />

      {/* 3D Scene */}
      <Canvas
        shadows
        camera={{ position: [0, 4, 20], fov: 45 }}
        dpr={[1, 2]}
        gl={{ 
          antialias: false,
          toneMapping: 3, // Cineon
          toneMappingExposure: 1.5
        }} 
      >
        <Suspense fallback={null}>
          <Scene appState={appState} />
        </Suspense>
      </Canvas>
      
      <Loader 
        containerStyles={{ background: '#020502' }}
        innerStyles={{ width: '200px', height: '2px', background: '#333' }}
        barStyles={{ background: '#D4AF37', height: '100%' }} // Gold
        dataStyles={{ color: '#D4AF37', fontFamily: 'Cinzel', fontSize: '0.9rem' }}
      />

      {/* UI Overlay */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none flex flex-col justify-between p-10 z-20">
        
        {/* Header */}
        <div className="flex flex-col items-center animate-fade-in-down mix-blend-screen">
          <h1 className="text-4xl md:text-6xl text-[#D4AF37] tracking-[0.2em] uppercase drop-shadow-[0_0_15px_rgba(255,20,147,0.4)]" style={{ fontFamily: 'Cinzel', fontWeight: 700 }}>
            A6’s Christmas Tree
          </h1>
          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#FF69B4] to-transparent my-4 opacity-50"></div>
          <p className="text-[#8FBC8F] text-xs md:text-sm tracking-[0.4em] uppercase font-light drop-shadow-lg" style={{ fontFamily: 'Playfair Display' }}>
            Emerald, Gold & Pink Edition
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center pb-12 pointer-events-auto">
          <button
            onClick={toggleState}
            className={`
              group relative px-10 py-4 
              border border-[#D4AF37] bg-[#001000] bg-opacity-40 backdrop-blur-sm
              text-[#D4AF37] text-sm tracking-[0.25em] uppercase transition-all duration-700 ease-out
              hover:bg-[#D4AF37] hover:text-[#052005] hover:scale-105
              shadow-[0_0_30px_rgba(212,175,55,0.1)]
              hover:shadow-[0_0_40px_rgba(255,105,180,0.3)]
            `}
            style={{ fontFamily: 'Cinzel' }}
          >
            <span className="relative z-10 flex items-center gap-3">
              {appState === AppState.CHAOS ? 'Assemble' : 'Scatter'}
            </span>
          </button>
        </div>
        
        {/* Footer */}
        <div className="absolute bottom-6 right-8 text-[#556B2F] text-[10px] font-serif italic tracking-widest opacity-50">
           EST. 2024 • LUXURY EDITION
        </div>
      </div>
    </div>
  );
};

export default App;