
import { GoogleGenAI, Type, Modality } from "@google/genai";
import type { StoryPayload, Choice } from '../types';

// Fix: Per Gemini API guidelines, the API key must be sourced directly from process.env.API_KEY.
// This also resolves the TypeScript error on import.meta.env.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const storySceneSchema = {
  type: Type.OBJECT,
  properties: {
    sceneText: {
      type: Type.STRING,
      description: "The next part of the story, 3-6 sentences long, in funny Moroccan Darija.",
    },
    choices: {
      type: Type.ARRAY,
      description: "An array of exactly 3 choices for the player.",
      items: {
        type: Type.OBJECT,
        properties: {
          text: {
            type: Type.STRING,
            description: "The text for the choice option in Darija.",
          },
          type: {
            type: Type.STRING,
            enum: ['troll', 'normal', 'crazy'],
            description: "The type of choice: 'troll', 'normal', or 'crazy'.",
          },
        },
        required: ["text", "type"],
      },
    },
    isEndScene: {
      type: Type.BOOLEAN,
      description: "Set to true if this is the final scene of the story.",
    },
    endResult: {
      type: Type.OBJECT,
      description: "Provide this object ONLY if isEndScene is true.",
      properties: {
        title: {
          type: Type.STRING,
          description: "A final, funny title for the player, e.g., 'Troll dial L'3am'.",
        },
        summary: {
          type: Type.STRING,
          description: "A short, funny summary of the player's adventure.",
        },
      },
      required: ['title', 'summary'],
    },
  },
  required: ["sceneText", "choices", "isEndScene"],
};

const systemInstruction = `You are 'Weld L'houma AI', a witty and humorous Moroccan storyteller. Your task is to create a funny, interactive story game set in a Moroccan neighborhood (houma).
- Write in a simple, funny Moroccan Darija that is easy to understand.
- Each scene should be 3-6 sentences long.
- After each scene, provide three distinct choices for the player: one 'troll' choice, one 'normal' choice, and one 'crazy' choice.
- The story must be unpredictable and lead to hilarious outcomes.
- The main characters are: the player ('Weld L'houma'), Moul L'hanout (grouchy shopkeeper), L'9ayed (strict local authority), Moul Zzerri3a (gossipy seed seller), Troll L'kbir (the ultimate neighborhood troll), and L'3ssel AI (a mysterious and flirty AI).
- Respond ONLY with the JSON object defined in the schema.`;


export async function generateScene(
  playerChoice: Choice | null,
  history: { sceneText: string; choiceText: string }[]
): Promise<StoryPayload> {
  let prompt: string;
  if (!playerChoice) {
    prompt = "Start the story. The player, 'Weld L'houma', just woke up. What's the first funny thing that happens today?";
  } else {
    const historyText = history.map(h => `Scene: ${h.sceneText}\nPlayer Chose: ${h.choiceText}`).join('\n\n');
    prompt = `This is the story so far:\n${historyText}\n\nThe player just chose: "${playerChoice.text}".\n\nWhat happens next? Continue the story with a new, funny scene and three new choices.`;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: storySceneSchema,
        temperature: 1,
      },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as StoryPayload;
  } catch (error) {
    console.error("Error generating story scene:", error);
    throw new Error("فشل في إنشاء مشهد القصة. يمكن L'AI مشى يدير قهيوة!");
  }
}

export async function generateImage(sceneDescription: string): Promise<string> {
  const prompt = `A funny, vibrant, and slightly exaggerated cartoon-style illustration of this scene from a Moroccan neighborhood: "${sceneDescription}". The style should be playful and humorous.`;
  try {
     const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [{ text: prompt }],
        },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const base64ImageBytes: string = part.inlineData.data;
        return `data:image/png;base64,${base64ImageBytes}`;
      }
    }
    throw new Error("No image data found in response.");

  } catch (error) {
    console.error("Error generating image:", error);
    throw new Error("فشل في إنشاء صورة المشهد. يمكن الريشة ديال L'AI تهرات!");
  }
}

export async function generateSpeech(text: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Say in a friendly, slightly dramatic storyteller voice: ${text}` }] }],
        config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: 'Kore' },
                },
            },
        },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
        throw new Error("No audio data found in API response.");
    }
    return base64Audio;
  } catch (error) {
    console.error("Error generating speech:", error);
    throw new Error("فشل في إنشاء الكلام. يمكن L'AI صوتو مشى.");
  }
}
