import React, { useState } from 'react';
import { generateSpeech } from '../services/geminiService';
import { playAudio } from '../utils/audio';

interface TTSButtonProps {
  textToRead: string;
}

const SpeakerIcon = ({ isSpeaking }: { isSpeaking: boolean }) => {
    if (isSpeaking) {
        return (
            <svg className="animate-spin h-5 w-5 ml-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        );
    }
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 ml-2">
            <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.66 1.905H6.44l4.5 4.5c.944.945 2.56.276 2.56-1.06V4.06zM18.584 5.416a.75.75 0 00-1.06 1.06 7.5 7.5 0 010 10.048.75.75 0 001.06 1.06 9 9 0 000-12.168z" />
            <path d="M15.932 7.968a.75.75 0 00-1.06 1.06 3.75 3.75 0 010 5.024.75.75 0 101.06 1.06 5.25 5.25 0 000-7.144z" />
        </svg>
    );
};


export const TTSButton: React.FC<TTSButtonProps> = ({ textToRead }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleReadAloud = async () => {
    if (isSpeaking) return;
    setIsSpeaking(true);
    setError(null);
    try {
      const audioB64 = await generateSpeech(textToRead);
      await playAudio(audioB64);
    } catch (err) {
      const message = err instanceof Error ? err.message : "حدث خطأ غير معروف.";
      setError(message);
      console.error("TTS Error:", message);
    } finally {
      setIsSpeaking(false);
    }
  };

  return (
    <div className="flex flex-col items-start my-4">
        <button
            onClick={handleReadAloud}
            disabled={isSpeaking}
            className="flex items-center justify-center px-4 py-2 bg-teal-500 text-white font-semibold rounded-lg shadow-md hover:bg-teal-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300"
            aria-label="Read text aloud"
        >
            {isSpeaking ? '...جاري القراءة' : 'قراءة النص'}
            <SpeakerIcon isSpeaking={isSpeaking} />
        </button>
        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
    </div>
  );
};