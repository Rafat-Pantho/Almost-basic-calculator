import React, { useState, useCallback, useEffect } from 'react';
import { calculate } from '../utils/calculatorEngine';
import { Button } from './Button';
import { Display } from './Display';

export const Calculator: React.FC = () => {
  const [expression, setExpression] = useState<string>("");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [lastWasResult, setLastWasResult] = useState(false);
  const [activeKey, setActiveKey] = useState<string | null>(null);

  const handleInput = useCallback((val: string) => {
    setError(null);
    
    if (lastWasResult) {
      if (/[\d.]/.test(val)) {
        // If typing a number after a result, start fresh
        setExpression(val);
      } else {
        // If typing an operator, continue with previous result
        setExpression(result + val);
      }
      setLastWasResult(false);
      setResult(null);
    } else {
      // Prevent multiple decimals in a single number token loosely
      if (val === '.') {
         const parts = expression.split(/[^0-9.]/);
         const currentNum = parts[parts.length - 1];
         if (currentNum.includes('.')) return;
      }
      setExpression(prev => prev + val);
    }
  }, [lastWasResult, result, expression]);

  const handleClear = useCallback(() => {
    setExpression("");
    setResult(null);
    setError(null);
    setLastWasResult(false);
  }, []);

  const handleDelete = useCallback(() => {
    if (lastWasResult) {
        handleClear();
        return;
    }
    setExpression(prev => prev.slice(0, -1));
    setResult(null);
    setError(null);
  }, [lastWasResult, handleClear]);

  const handleCalculate = useCallback(() => {
    if (!expression) return;
    
    const { result: calcResult, error: calcError } = calculate(expression);
    
    if (calcError) {
      setError(calcError);
    } else if (calcResult !== null) {
      setResult(calcResult.toString());
      setHistory(prev => [...prev, `${expression} = ${calcResult}`]);
      setLastWasResult(true);
    }
  }, [expression]);

  // Key to Action mapping
  const getKeyAction = useCallback((key: string) => {
    if (key === 'Enter' || key === '=') return { label: '=', action: handleCalculate };
    if (key === 'Backspace') return { label: 'DEL', action: handleDelete };
    if (key === 'Escape' || key.toLowerCase() === 'c') return { label: 'AC', action: handleClear };
    if (/[\d.]/.test(key)) return { label: key, action: () => handleInput(key) };
    if (['+', '-', '*', '/', '%', '^', '(', ')'].includes(key)) return { label: key, action: () => handleInput(key) };
    return null;
  }, [handleCalculate, handleDelete, handleClear, handleInput]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const { key } = e;
      const mappedAction = getKeyAction(key);
      
      if (mappedAction) {
        e.preventDefault();
        setActiveKey(mappedAction.label);
        mappedAction.action();
      }
    };

    const handleKeyUp = () => {
      setActiveKey(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [getKeyAction]);

  return (
    <div className="w-full max-w-sm bg-gray-950/90 backdrop-blur-xl rounded-xl shadow-2xl shadow-black border border-gray-800 relative z-10 flex flex-col overflow-hidden ring-1 ring-white/10">
      
      {/* Desktop Title Bar */}
      <div className="h-10 bg-gray-900/50 border-b border-gray-800 flex items-center px-4 justify-between select-none draggable-region">
        {/* Traffic Lights */}
        <div className="flex space-x-2 group">
          <div className="w-3 h-3 rounded-full bg-red-500/80 group-hover:bg-red-500 transition-colors"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/80 group-hover:bg-yellow-500 transition-colors"></div>
          <div className="w-3 h-3 rounded-full bg-emerald-500/80 group-hover:bg-emerald-500 transition-colors"></div>
        </div>
        
        {/* Title */}
        <div className="text-xs font-medium text-gray-400 tracking-wide">
          Calculator
        </div>
        
        {/* Spacer to center title visually */}
        <div className="w-12"></div>
      </div>

      <div className="p-5">
        <Display 
          expression={expression} 
          result={result} 
          error={error} 
          history={history} 
        />

        {/* Keypad Grid */}
        <div className="grid grid-cols-4 gap-3 h-80">
          {/* Row 1 */}
          <Button label="AC" onClick={handleClear} variant="action" className="text-red-300" isActive={activeKey === 'AC'} />
          <Button label="(" onClick={handleInput} variant="action" isActive={activeKey === '('} />
          <Button label=")" onClick={handleInput} variant="action" isActive={activeKey === ')'} />
          <Button label="^" onClick={handleInput} variant="operator" isActive={activeKey === '^'} />

          {/* Row 2 */}
          <Button label="7" onClick={handleInput} isActive={activeKey === '7'} />
          <Button label="8" onClick={handleInput} isActive={activeKey === '8'} />
          <Button label="9" onClick={handleInput} isActive={activeKey === '9'} />
          <Button label="/" onClick={handleInput} variant="operator" isActive={activeKey === '/'} />

          {/* Row 3 */}
          <Button label="4" onClick={handleInput} isActive={activeKey === '4'} />
          <Button label="5" onClick={handleInput} isActive={activeKey === '5'} />
          <Button label="6" onClick={handleInput} isActive={activeKey === '6'} />
          <Button label="*" onClick={handleInput} variant="operator" isActive={activeKey === '*'} />

          {/* Row 4 */}
          <Button label="1" onClick={handleInput} isActive={activeKey === '1'} />
          <Button label="2" onClick={handleInput} isActive={activeKey === '2'} />
          <Button label="3" onClick={handleInput} isActive={activeKey === '3'} />
          <Button label="-" onClick={handleInput} variant="operator" isActive={activeKey === '-'} />

          {/* Row 5 */}
          <Button label="0" onClick={handleInput} isActive={activeKey === '0'} />
          <Button label="." onClick={handleInput} isActive={activeKey === '.'} />
          <Button label="%" onClick={handleInput} isActive={activeKey === '%'} />
          <Button label="+" onClick={handleInput} variant="operator" isActive={activeKey === '+'} />
          
          {/* Row 6 (Span) */}
          <Button label="DEL" onClick={handleDelete} variant="action" className="text-sm" isActive={activeKey === 'DEL'} />
          <Button label="=" onClick={handleCalculate} variant="accent" className="col-span-3 bg-gradient-to-r from-emerald-600 to-teal-500 border-t border-white/20" isActive={activeKey === '='} />
        </div>
      </div>
    </div>
  );
};