

import { GoogleGenAI, GenerateContentParameters, Part, Modality, Type } from '@google/genai';
// Fix: Imported BarChartData and PieChartData to resolve type errors.
import { ChatMode, Source, AllChartData, BarChartData, PieChartData } from '../types';
import { SYSTEM_INSTRUCTION } from '../constants';
// Fix: Removed unused 'decodeAudioData' import and only import 'decode'.
import { decode } from '../utils/helpers';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const getModelForMode = (mode: ChatMode): string => {
  switch (mode) {
    case 'fast':
      // Fix: Updated model name to follow latest guidelines.
      return 'gemini-flash-lite-latest';
    case 'deep':
      return 'gemini-2.5-pro';
    case 'image':
      return 'gemini-2.5-flash'; // This is a good model for multi-modal
    case 'search':
    case 'standard':
    default:
      return 'gemini-2.5-flash';
  }
};

export const generateResponse = async (
  prompt: string,
  history: { role: string; parts: Part[] }[],
  mode: ChatMode,
  imagePart: Part | null
): Promise<{ text: string; sources?: Source[] }> => {
  const model = getModelForMode(mode);

  const contents: Part[] = [];
  if (imagePart) {
      contents.push(imagePart);
  }
  if (prompt) {
      contents.push({ text: prompt });
  }

  // Fix: Replaced deprecated GenerateContentRequest with GenerateContentParameters.
  const request: GenerateContentParameters = {
    model,
    contents: [...history, { role: 'user', parts: contents }],
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
    },
  };

  if (mode === 'deep') {
    request.config!.thinkingConfig = { thinkingBudget: 32768 };
  }
  
  if (mode === 'search') {
    request.config!.tools = [{ googleSearch: {} }];
  }

  const response = await ai.models.generateContent(request);

  const text = response.text;
  let sources: Source[] | undefined = undefined;

  if (mode === 'search') {
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (groundingChunks) {
      sources = groundingChunks
        .map((chunk: any) => chunk.web)
        .filter((web: any) => web?.uri && web?.title)
        .map((web: any) => ({ uri: web.uri, title: web.title }));
    }
  }

  return { text, sources };
};

export async function* generateResponseStream(
  prompt: string,
  history: { role: string; parts: Part[] }[],
  mode: ChatMode,
  imagePart: Part | null
): AsyncGenerator<{ text?: string; sources?: Source[] }> {
  const model = getModelForMode(mode);

  const contents: Part[] = [];
  if (imagePart) {
    contents.push(imagePart);
  }
  if (prompt) {
    contents.push({ text: prompt });
  }

  const request: GenerateContentParameters = {
    model,
    contents: [...history, { role: 'user', parts: contents }],
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
    },
  };

  if (mode === 'deep') {
    request.config!.thinkingConfig = { thinkingBudget: 32768 };
  }
  
  if (mode === 'search') {
    request.config!.tools = [{ googleSearch: {} }];
  }

  const responseStream = await ai.models.generateContentStream(request);

  let sources: Source[] | undefined = undefined;
  for await (const chunk of responseStream) {
    const text = chunk.text;
    if (text) {
      yield { text };
    }
    
    if (mode === 'search') {
        const groundingChunks = chunk.candidates?.[0]?.groundingMetadata?.groundingChunks;
        if (groundingChunks) {
          sources = groundingChunks
            .map((c: any) => c.web)
            .filter((web: any) => web?.uri && web?.title)
            .map((web: any) => ({ uri: web.uri, title: web.title }));
        }
    }
  }

  if (sources) {
    yield { sources };
  }
}

// Fix: Changed return type to Promise<Uint8Array> to decouple from Web Audio API context.
export const generateSpeech = async (text: string): Promise<Uint8Array> => {
    const model = 'gemini-2.5-flash-preview-tts';

    const response = await ai.models.generateContent({
        model,
        contents: [{ parts: [{ text: `Read this analysis: ${text}` }] }],
        config: {
            // Fix: Used Modality.AUDIO enum instead of a raw string.
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: 'Kore' },
                },
            },
        },
    });

    const audioDataB64 = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!audioDataB64) {
        throw new Error("No audio data returned from API.");
    }

    const audioBytes = decode(audioDataB64);
    // Fix: Return raw audio bytes and let the component handle decoding and playback.
    return audioBytes;
};

export const analyzeGeneratedChartData = async (chartData: AllChartData, chartTitles: any): Promise<string> => {
  const model = 'gemini-2.5-flash';

  const dataDescription = `
- ${chartTitles.barChart.title}: A bar chart showing values for different categories. Data: ${JSON.stringify(chartData.barData.map(d => ({ category: d.label, value: d.value.toFixed(2) })))}
- ${chartTitles.lineChart.title}: A line chart showing a trend over time. Data: ${JSON.stringify(chartData.lineData.map(d => ({ period: d.x, value: d.y.toFixed(2) })))}
- ${chartTitles.pieChart.title}: A pie chart showing contribution of different segments. Data: ${JSON.stringify(chartData.pieData.map(d => ({ segment: d.label, contribution: d.value.toFixed(2) })))}
- ${chartTitles.scatterPlot.title}: A scatter plot showing a relationship between two variables. Data: ${JSON.stringify(chartData.scatterData.map(d => ({ item: d.label, xValue: d.x.toFixed(2), yValue: d.y.toFixed(2) })))}
  `;

  const prompt = `
You are an expert data analyst for Econify. Your task is to interpret a set of business intelligence or data visualization charts. Provide a concise, insightful analysis based on the data provided below.

**Data Summary:**
${dataDescription}

**Your Analysis Instructions:**
- Use '###' for main section titles (e.g., '### 1. Overall Summary').
- Use '-' for bullet points.
- Do not use any other markdown.
- Be clear, professional, and insightful.

### 1. Overall Summary
(Start with a 2-3 sentence executive summary of the key insights from all charts.)

### 2. Chart-by-Chart Breakdown
- **${chartTitles.barChart.title}:** (Analyze the bar chart. What does it compare? What are the key findings or outliers?)
- **${chartTitles.lineChart.title}:** (Interpret the line chart. What is the trend over time? Are there significant peaks or troughs?)
- **${chartTitles.pieChart.title}:** (Analyze the pie chart. What is the composition of the whole? Which segments are most significant?)
- **${chartTitles.scatterPlot.title}:** (Interpret the scatter plot. What is the relationship between the two variables? Are there clusters or correlations?)

### 3. Synthesized Outlook & Key Takeaways
(Combine the insights from all charts. What is the overall narrative? Are there conflicting signals? Provide 2-3 bullet points of the most critical takeaways.)
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
  });

  return response.text;
};

export const generateDataFromText = async (textPrompt: string): Promise<Omit<AllChartData, 'barData' | 'pieData'> & { barData: Omit<BarChartData, 'color'>[], pieData: Omit<PieChartData, 'color'>[] }> => {
  const model = 'gemini-2.5-flash';

  const schema = {
    type: Type.OBJECT,
    properties: {
      barData: {
        type: Type.ARRAY,
        description: 'Data for a bar chart comparing a metric across several categories.',
        items: {
          type: Type.OBJECT,
          properties: {
            label: { type: Type.STRING, description: 'Category label (e.g., a country name)' },
            value: { type: Type.NUMBER, description: 'Value for the category' },
          },
          required: ['label', 'value'],
        },
      },
      lineData: {
        type: Type.ARRAY,
        description: 'Data for a line chart showing a trend over time.',
        items: {
          type: Type.OBJECT,
          properties: {
            x: { type: Type.NUMBER, description: 'The x-axis value, typically a time period like a quarter or year.' },
            y: { type: Type.NUMBER, description: 'The y-axis value for that time period.' },
          },
          required: ['x', 'y'],
        },
      },
      pieData: {
        type: Type.ARRAY,
        description: 'Data for a pie chart showing parts of a whole. Values should sum to 100.',
        items: {
          type: Type.OBJECT,
          properties: {
            label: { type: Type.STRING, description: 'Sector or category label.' },
            value: { type: Type.NUMBER, description: 'Percentage value for the category.' },
          },
          required: ['label', 'value'],
        },
      },
      scatterData: {
        type: Type.ARRAY,
        description: 'Data for a scatter plot showing the relationship between two variables.',
        items: {
          type: Type.OBJECT,
          properties: {
            x: { type: Type.NUMBER, description: 'The x-axis value (e.g., competitiveness).' },
            y: { type: Type.NUMBER, description: 'The y-axis value (e.g., innovation).' },
            size: { type: Type.NUMBER, description: 'The size of the data point bubble.' },
            label: { type: Type.STRING, description: 'Label for the data point.' },
          },
          required: ['x', 'y', 'size', 'label'],
        },
      },
    },
    required: ['barData', 'lineData', 'pieData', 'scatterData'],
  };

  // Fix: Completed the function to make the API call and return data.
  const prompt = `You are a data visualization engine for Econify. Based on the following text prompt, generate a complete set of data for four different charts (bar, line, pie, scatter plot) that are relevant to the user's request. Ensure the data is realistic and well-structured according to the provided JSON schema.

Prompt: "${textPrompt}"`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: schema,
    },
  });

  const jsonStr = response.text.trim();
  const data = JSON.parse(jsonStr);
  return data;
};