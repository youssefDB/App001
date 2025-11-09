import React from 'react';
import type { GameResult } from '../types';
import { TTSButton } from './TTSButton';

interface EndScreenProps {
  result: GameResult;
  image: string | null;
  onPlayAgain: () => void;
}

export const EndScreen: React.FC<EndScreenProps> = ({ result, image, onPlayAgain }) => {
  return (
    <div className="text-center text-white p-8 max-w-3xl mx-auto bg-gray-800/60 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-700">
      <h2 className="text-2xl font-semibold mb-2 text-yellow-300">النتيجة النهائية</h2>
      <h1 className="text-5xl md:text-6xl font-bold mb-6 text-yellow-400 drop-shadow-lg">
        {result.title}
      </h1>
      
      {image && (
        <img src={image} alt="Final result" className="rounded-2xl shadow-lg mb-6 w-full max-w-md mx-auto aspect-square object-cover" />
      )}

      <p className="text-lg md:text-xl mb-2 leading-relaxed text-right">
        {result.summary}
      </p>
      <TTSButton textToRead={result.summary} />
      <button
        onClick={onPlayAgain}
        className="bg-green-500 text-white font-bold py-4 px-10 text-2xl rounded-full shadow-2xl transform hover:scale-105 transition-transform duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-green-400 mt-8"
      >
        لعب مرة أخرى
      </button>
    </div>
  );
};