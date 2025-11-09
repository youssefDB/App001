import React from 'react';
import type { Scene, Choice, ChoiceType } from '../types';
import { TTSButton } from './TTSButton';

interface StorySceneProps extends Scene {
  image: string | null;
  onChoiceSelect: (choice: Choice) => void;
}

const getButtonClass = (type: ChoiceType) => {
    switch(type) {
        case 'troll':
            return 'bg-red-600 hover:bg-red-700 focus:ring-red-500';
        case 'normal':
            return 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500';
        case 'crazy':
            return 'bg-purple-600 hover:bg-purple-700 focus:ring-purple-500';
        default:
            return 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-500';
    }
}

export const StoryScene: React.FC<StorySceneProps> = ({ image, sceneText, choices, onChoiceSelect }) => {
  return (
    <div className="w-full max-w-4xl mx-auto bg-gray-800/50 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-gray-700">
      <div className="aspect-w-16 aspect-h-9">
        {image ? (
          <img src={image} alt="Scene illustration" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gray-900 flex items-center justify-center">
             <svg className="animate-spin h-10 w-10 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        )}
      </div>
      <div className="p-6 md:p-8">
        <p className="text-white text-xl md:text-2xl leading-relaxed mb-2 text-right">
          {sceneText}
        </p>
        <TTSButton textToRead={sceneText} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {choices.map((choice, index) => (
            <button
              key={index}
              onClick={() => onChoiceSelect(choice)}
              className={`text-white font-bold py-4 px-6 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 ${getButtonClass(choice.type)}`}
            >
              {choice.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};