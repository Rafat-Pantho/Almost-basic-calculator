import React from 'react';
import { Calculator } from './components/Calculator';

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#030712] text-white p-4 overflow-hidden relative selection:bg-indigo-500 selection:text-white">
      
      {/* Background ambient lighting effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-900/20 rounded-full blur-[128px] pointer-events-none mix-blend-screen animate-pulse duration-[4000ms]"></div>
      <div className="absolute bottom-0 right-1/4 w-[30rem] h-[30rem] bg-emerald-900/10 rounded-full blur-[128px] pointer-events-none mix-blend-screen"></div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

      <Calculator />

    </div>
  );
};

export default App;