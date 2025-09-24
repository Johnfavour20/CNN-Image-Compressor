import { GoogleGenAI } from "@google/genai";

const readFileAsBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // result is "data:mime/type;base64,THE_BASE_64_STRING"
      // We only need the base64 part
      resolve(result.split(',')[1]);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

export const getAiQualitySuggestion = async (imageFile: File): Promise<number> => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not configured. AI features are disabled.");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const imageBase64 = await readFileAsBase64(imageFile);

    const imagePart = {
        inlineData: {
            mimeType: imageFile.type,
            data: imageBase64,
        },
    };

    const textPart = {
        text: `You are an expert in medical imaging diagnostics. Analyze this medical image. Based on its contents (e.g., MRI, X-Ray, CT scan) and visual complexity, suggest an optimal compression quality level on a scale from 1 to 100. A higher value preserves more detail but results in a larger file. Your goal is to find the best balance that preserves critical diagnostic details while still providing good compression.

Respond with ONLY the numerical value for the quality setting. Do not include any other text, explanation, or symbols. For example, if you think the quality should be 85, your response should be exactly "85".`
    };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, textPart] },
        });

        const text = response.text.trim();
        const quality = parseInt(text, 10);

        if (isNaN(quality) || quality < 1 || quality > 100) {
            console.error("AI returned an invalid quality value:", text);
            throw new Error("AI returned an invalid response. Please try again.");
        }
        
        return quality;

    } catch(e) {
        console.error("Error calling Gemini API:", e);
        // Re-throw a more user-friendly error
        throw new Error("Failed to get AI suggestion. The API may be unavailable or the request was blocked.");
    }
};
