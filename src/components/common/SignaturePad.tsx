import React, { useRef, useState, useEffect } from 'react';
import { RotateCcw, Check, PenTool, Type } from 'lucide-react';

interface SignaturePadProps {
  onSave: (dataUrl: string) => void;
  onCancel: () => void;
  candidateName: string;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({
  onSave,
  onCancel,
  candidateName,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [mode, setMode] = useState<'draw' | 'type'>('draw');
  const [typedName, setTypedName] = useState(candidateName);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = canvas.parentElement?.clientWidth || 500;
    canvas.height = 180;

    ctx.strokeStyle = '#38bdf8'; // Sky blue stroke
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, [mode]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setHasDrawn(true);

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const handleConfirm = () => {
    if (mode === 'draw') {
      const canvas = canvasRef.current;
      if (!canvas || !hasDrawn) return;
      onSave(canvas.toDataURL('image/png'));
    } else {
      // Generate SVG data url from typed signature
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="80"><text x="20" y="55" font-family="'Brush Script MT', cursive, sans-serif" font-size="34" fill="#38bdf8">${typedName}</text></svg>`;
      const encoded = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
      onSave(encoded);
    }
  };

  return (
    <div className="space-y-4">
      {/* Mode toggle */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => setMode('draw')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              mode === 'draw'
                ? 'bg-black text-white border border-black shadow-xs font-semibold'
                : 'text-slate-600 hover:text-black hover:bg-slate-100'
            }`}
          >
            <PenTool className="w-3.5 h-3.5" />
            Draw Signature
          </button>
          <button
            type="button"
            onClick={() => setMode('type')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              mode === 'type'
                ? 'bg-black text-white border border-black shadow-xs font-semibold'
                : 'text-slate-600 hover:text-black hover:bg-slate-100'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            Type Signature
          </button>
        </div>

        {mode === 'draw' && (
          <button
            type="button"
            onClick={clearCanvas}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 px-2.5 py-1 rounded border border-slate-800 hover:border-slate-700"
          >
            <RotateCcw className="w-3 h-3" />
            Clear
          </button>
        )}
      </div>

      {mode === 'draw' ? (
        <div className="border border-slate-800 bg-slate-950/60 rounded-lg p-2 text-center relative">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="w-full h-44 cursor-crosshair touch-none"
          />
          {!hasDrawn && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-500 text-xs">
              Sign using touch screen or mouse pointer here
            </div>
          )}
          <div className="border-t border-dashed border-slate-800 mt-1 pt-1 text-[11px] text-slate-500">
            Sign above this line · IP and timestamp will be embedded cryptographically
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Full Legal Name for Electronic Execution
            </label>
            <input
              type="text"
              value={typedName}
              onChange={(e) => setTypedName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
              placeholder="Enter your legal full name"
            />
          </div>
          <div className="p-4 bg-slate-100 border border-slate-200 rounded-lg text-center">
            <p className="text-2xl text-black font-serif italic tracking-wide">{typedName || candidateName}</p>
            <p className="text-[11px] text-slate-500 mt-2">Electronic Signature Representation</p>
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-black hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={mode === 'draw' && !hasDrawn}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-black hover:bg-slate-800 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm cursor-pointer"
        >
          <Check className="w-3.5 h-3.5" />
          Apply Legal Digital Signature
        </button>
      </div>
    </div>
  );
};
