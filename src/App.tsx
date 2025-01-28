import React, { useState, useEffect } from 'react';
import { Settings, Lock, Unlock, RefreshCw, Terminal } from 'lucide-react';

type CaseOption = 'preserve' | 'lowercase' | 'uppercase';
type ForeignKeyOption = 'ignore' | 'remove';

function App() {
  const [operation, setOperation] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [shift, setShift] = useState(3);
  const [modulo, setModulo] = useState(36);
  const [alphabet, setAlphabet] = useState('abcdefghijklmnopqrstuvwxyz0123456789');
  const [caseOption, setCaseOption] = useState<CaseOption>('preserve');
  const [foreignKey, setForeignKey] = useState<ForeignKeyOption>('ignore');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [matrixBg, setMatrixBg] = useState<string[]>([]);

  useEffect(() => {
    // Matrix rain effect
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*';
    const generateMatrix = () => {
      return Array.from({ length: 50 }, () =>
        Array.from({ length: 20 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
      );
    };

    const interval = setInterval(() => {
      setMatrixBg(generateMatrix());
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const processText = () => {
    let result = input;

    if (foreignKey === 'remove') {
      result = result.replace(/[^a-zA-Z0-9\s]/g, '');
    }

    result = result.split('').map(char => {
      if (!/[a-zA-Z0-9]/.test(char)) return char;

      const isUpperCase = char === char.toUpperCase();
      const baseChar = char.toLowerCase();
      const index = alphabet.indexOf(baseChar);

      if (index === -1) return char;

      let newIndex = operation === 'encrypt' 
        ? (index + shift) % modulo
        : (index - shift + modulo) % modulo;

      let newChar = alphabet[newIndex];

      if (caseOption === 'uppercase') return newChar.toUpperCase();
      if (caseOption === 'lowercase') return newChar.toLowerCase();
      return isUpperCase ? newChar.toUpperCase() : newChar.toLowerCase();
    }).join('');

    setOutput(result);
  };

  return (
    <div className="min-h-screen bg-black text-green-400 p-6 relative overflow-hidden">
      {/* Matrix rain background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        {matrixBg.map((line, i) => (
          <div key={i} className="text-xs font-mono whitespace-nowrap animate-matrix-rain" 
               style={{ animationDelay: `${Math.random() * 2}s` }}>
            {line}
          </div>
        ))}
      </div>

      <div className="max-w-4xl mx-auto relative">
        <div className="bg-gray-900 rounded-2xl shadow-xl p-8 border border-green-500">
          <div className="flex items-center gap-3 mb-8">
            <Terminal className="w-8 h-8 text-green-400 animate-pulse" />
            <h1 className="text-4xl font-bold text-green-400 tracking-wider animate-glow">
              CIPHER WHEEL
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-green-400 mb-2">Operation</label>
                <div className="flex gap-4">
                  <button
                    onClick={() => setOperation('encrypt')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                      operation === 'encrypt'
                        ? 'bg-green-600 text-black'
                        : 'bg-gray-800 text-green-400 hover:bg-gray-700'
                    }`}
                  >
                    <Lock className="w-4 h-4" />
                    Encrypt
                  </button>
                  <button
                    onClick={() => setOperation('decrypt')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                      operation === 'decrypt'
                        ? 'bg-green-600 text-black'
                        : 'bg-gray-800 text-green-400 hover:bg-gray-700'
                    }`}
                  >
                    <Unlock className="w-4 h-4" />
                    Decrypt
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-green-400 mb-2">
                    Shift Value
                  </label>
                  <input
                    type="number"
                    value={shift}
                    onChange={(e) => setShift(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full px-3 py-2 bg-gray-800 border border-green-500 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-green-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-green-400 mb-2">
                    Modulo Value
                  </label>
                  <input
                    type="number"
                    value={modulo}
                    onChange={(e) => setModulo(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-3 py-2 bg-gray-800 border border-green-500 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-green-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-green-400 mb-2">Alphabet</label>
                <input
                  type="text"
                  value={alphabet}
                  onChange={(e) => setAlphabet(e.target.value.toLowerCase())}
                  className="w-full px-3 py-2 bg-gray-800 border border-green-500 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-green-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-green-400 mb-2">Case Option</label>
                <select
                  value={caseOption}
                  onChange={(e) => setCaseOption(e.target.value as CaseOption)}
                  className="w-full px-3 py-2 bg-gray-800 border border-green-500 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-green-400"
                >
                  <option value="preserve">Preserve Original Case</option>
                  <option value="lowercase">Convert to Lowercase</option>
                  <option value="uppercase">Convert to Uppercase</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-green-400 mb-2">Foreign Keys</label>
                <select
                  value={foreignKey}
                  onChange={(e) => setForeignKey(e.target.value as ForeignKeyOption)}
                  className="w-full px-3 py-2 bg-gray-800 border border-green-500 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-green-400"
                >
                  <option value="ignore">Ignore Foreign Keys</option>
                  <option value="remove">Remove Foreign Keys</option>
                </select>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-green-400 mb-2">
                  {operation === 'encrypt' ? 'Plaintext' : 'Ciphertext'}
                </label>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="w-full h-32 px-3 py-2 bg-gray-800 border border-green-500 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-green-400 font-mono"
                  placeholder={`Enter ${operation === 'encrypt' ? 'plaintext' : 'ciphertext'}...`}
                />
              </div>

              <button
                onClick={processText}
                className="w-full flex items-center justify-center gap-2 bg-green-600 text-black py-2 px-4 rounded-lg hover:bg-green-500 transition-colors"
              >
                <RefreshCw className="w-4 h-4 animate-spin-slow" />
                Process Text
              </button>

              <div>
                <label className="block text-sm font-medium text-green-400 mb-2">
                  {operation === 'encrypt' ? 'Ciphertext' : 'Plaintext'}
                </label>
                <textarea
                  value={output}
                  readOnly
                  className="w-full h-32 px-3 py-2 bg-gray-800 border border-green-500 rounded-lg text-green-400 font-mono"
                  placeholder="Output will appear here..."
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-green-400/60">
            <Settings className="w-4 h-4" />
            <span>Shift: {shift} | Modulo: {modulo} | Case: {caseOption} | Foreign Keys: {foreignKey}</span>
          </div>
        </div>
      </div>

      {/* Copyright Footer */}
      <footer className="mt-10 text-center text-green-400/60 text-sm">
        <p>
          &copy; {new Date().getFullYear()} Jesteena Mary Oommen. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
}

export default App;