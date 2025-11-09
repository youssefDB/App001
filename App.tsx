import React from 'react';
import { useState, useCallback } from 'react';
import { GameState } from './types';
import type { Choice, Scene, GameResult } from './types';
import { generateScene, generateImage } from './services/geminiService';
import { StartScreen } from './components/StartScreen';
import { LoadingScreen } from './components/LoadingScreen';
import { StoryScene } from './components/StoryScene';
import { EndScreen } from './components/EndScreen';
import { ErrorScreen } from './components/ErrorScreen';

function App() {
  const [gameState, setGameState] = useState<GameState>(GameState.START);
  const [currentScene, setCurrentScene] = useState<Scene | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [gameResult, setGameResult] = useState<GameResult | null>(null);
  const [storyHistory, setStoryHistory] = useState<{ sceneText: string; choiceText: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const handleStartGame = useCallback(async () => {
    setGameState(GameState.LOADING);
    setError(null);
    setStoryHistory([]);
    try {
      const initialPayload = await generateScene(null, []);
      const initialImage = await generateImage(initialPayload.sceneText);
      setCurrentScene({ sceneText: initialPayload.sceneText, choices: initialPayload.choices });
      setCurrentImage(initialImage);
      setGameState(GameState.PLAYING);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'حدث خطأ غير معروف.');
      setGameState(GameState.ERROR);
    }
  }, []);

  const handleChoice = useCallback(async (choice: Choice) => {
    if (!currentScene) return;
    
    setGameState(GameState.LOADING);
    setError(null);
    const updatedHistory = [...storyHistory, { sceneText: currentScene.sceneText, choiceText: choice.text }];
    setStoryHistory(updatedHistory);

    try {
        const payload = await generateScene(choice, updatedHistory);
        const imagePromise = generateImage(payload.sceneText);
        
        const newScene = { sceneText: payload.sceneText, choices: payload.choices };
        setCurrentScene(newScene);

        const newImage = await imagePromise;
        setCurrentImage(newImage);

        if (payload.isEndScene && payload.endResult) {
            setGameResult(payload.endResult);
            setGameState(GameState.END);
        } else {
            setGameState(GameState.PLAYING);
        }
    } catch (e) {
        setError(e instanceof Error ? e.message : 'حدث خطأ غير معروف.');
        setGameState(GameState.ERROR);
    }
  }, [currentScene, storyHistory]);

  const handlePlayAgain = () => {
    setGameState(GameState.START);
    setCurrentScene(null);
    setCurrentImage(null);
    setGameResult(null);
    setStoryHistory([]);
    setError(null);
  };
  
  const handleRetry = () => {
    if (storyHistory.length === 0) {
        handleStartGame();
    } else {
        // This is a simplified retry, which just restarts the game to avoid complex state management
        handlePlayAgain();
    }
  };

  const renderContent = () => {
    switch (gameState) {
      case GameState.START:
        return <StartScreen onStart={handleStartGame} />;
      case GameState.LOADING:
        return <LoadingScreen />;
      case GameState.PLAYING:
        return currentScene && <StoryScene {...currentScene} image={currentImage} onChoiceSelect={handleChoice} />;
      case GameState.END:
        return gameResult && <EndScreen result={gameResult} image={currentImage} onPlayAgain={handlePlayAgain} />;
      case GameState.ERROR:
        return error && <ErrorScreen message={error} onRetry={handleRetry} />;
      default:
        return <StartScreen onStart={handleStartGame} />;
    }
  };

  return (
    <main className="min-h-screen bg-gray-900 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] flex flex-col items-center justify-center p-4">
      <div className="w-full">
        {renderContent()}
      </div>
    </main>
  );
}

export default App;