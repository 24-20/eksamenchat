'use client';

import React from 'react';
import 'katex/dist/katex.min.css';

interface GeogebraCasProps {
  expressions: { latex: string; }[];
}

const GeogebraCas: React.FC<GeogebraCasProps> = ({ expressions }) => {
  return (
    <div className="flex flex-col border rounded-md p-4 bg-gray-50">
      {expressions.map((expr, index) => (
        <div
          key={index}
          className="flex items-center gap-2 border-b py-2 last:border-none"
        >
          {/* Line number */}
          <div className="text-gray-500 w-6 text-right">{index + 1}</div>
          {/* Latex expression */}
          <div className="flex-1 text-black text-lg">
            {expr.latex}
          </div>
        </div>
      ))}
    </div>
  );
};

export default GeogebraCas;

