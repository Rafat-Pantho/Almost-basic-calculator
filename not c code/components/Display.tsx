import React, { useEffect, useRef } from 'react';

interface DisplayProps {
  expression: string;
  result: string | null;
  error: string | null;
  history: string[];
}

export const Display: React.FC<DisplayProps> = ({ expression, result, error, history }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll input to end
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [expression]);

  return (
    <div className="flex flex-col h-48 bg-gray-900 rounded-3xl p-6 mb-6 shadow-inner shadow-black/50 border border-gray-800 relative overflow-hidden">
      {/* Glassy reflection top right */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* History Tape */}
      <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col justify-end space-y-1 mb-2 pr-2">
        {history.slice(-5).map((item, idx) => (
          <div key={idx} className="text-right text-gray-500 text-sm font-mono truncate opacity-60">
            {item}
          </div>
        ))}
      </div>

      {/* Current Expression */}
      <div 
        ref={scrollRef}
        className="text-right text-3xl font-light text-gray-100 whitespace-nowrap overflow-x-auto overflow-y-hidden pb-1 custom-scrollbar scroll-smooth"
      >
        {expression || "0"}
      </div>

      {/* Live Result / Error */}
      <div className={`text-right h-8 font-mono truncate transition-colors duration-300 ${error ? 'text-red-400' : 'text-emerald-400'}`}>
        {error ? error : (result !== null ? `= ${result}` : '')}
      </div>
    </div>
  );
};