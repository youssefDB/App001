
import React from 'react';

interface StartScreenProps {
  onStart: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  return (
    <div className="text-center text-white p-8 max-w-2xl mx-auto">
      <h1 className="text-5xl md:text-7xl font-bold mb-4 text-yellow-300 drop-shadow-lg">
        ولد الحومة AI
      </h1>
      <p className="text-lg md:text-xl mb-8 leading-relaxed">
        أهلاً بك في مغامرة فشي شكل! غادي تعيش نهار كامل فالحومة المغربية، ولكن ماشي أي حومة. هادي عامرة بالطرولات، الضحك، والمواقف اللي ماطيحش على البال. قراراتك هي اللي غادي تحدد واش غادي تولي "ولد الحومة المثالي" ولا "طرول العام". واجد؟
      </p>
      <button
        onClick={onStart}
        className="bg-yellow-400 text-gray-900 font-bold py-4 px-10 text-2xl rounded-full shadow-2xl transform hover:scale-105 transition-transform duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-yellow-300"
      >
        بدِّي المغامرة
      </button>
    </div>
  );
};
