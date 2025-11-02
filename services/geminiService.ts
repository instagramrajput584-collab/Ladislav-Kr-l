import { GoogleGenAI, Type } from "@google/genai";
import { CalendarEventData, FullNameDay } from '../types';

if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. Using a placeholder. Please set your API key for the app to function.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "YOUR_API_KEY_HERE" });

const calendarSchema = {
    type: Type.OBJECT,
    properties: {
        holidays: {
            type: Type.ARRAY,
            description: "A list of official public holidays.",
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING, description: "The official name of the holiday." },
                    description: { type: Type.STRING, description: "A brief description of the holiday." },
                },
                required: ["name", "description"],
            },
        },
        nameDays: {
            type: Type.ARRAY,
            description: "A list of common name days celebrated. In Czech, this is 'jmeniny' or 'svátek'.",
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING, description: "The name being celebrated." },
                },
                required: ["name"],
            },
        },
        observances: {
            type: Type.ARRAY,
            description: "Other non-holiday observances or notable events.",
            items: {
                type: Type.STRING,
            },
        },
        notes: {
            type: Type.STRING,
            description: "Any additional notes, for example if the country does not celebrate name days."
        }
    },
    required: ["holidays", "nameDays", "observances"],
};

export const fetchCalendarData = async (country: string, date: Date): Promise<CalendarEventData> => {
    const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    
    const prompt = `For ${country} on ${formattedDate}, please provide a list of public holidays, important observances, and any celebrated name days (in Czech: 'jmeniny' or 'svátek'). If the country does not celebrate name days, please state that in the notes.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: calendarSchema,
            },
        });

        const jsonString = response.text.trim();
        const parsedData: CalendarEventData = JSON.parse(jsonString);
        return parsedData;

    } catch (error) {
        console.error("Error fetching calendar data from Gemini:", error);
        throw new Error("Failed to fetch calendar data. Please check your API key and network connection.");
    }
};

const allNameDaysSchema = {
    type: Type.ARRAY,
    description: "A complete list of name days for the specified country.",
    items: {
        type: Type.OBJECT,
        properties: {
            date: {
                type: Type.STRING,
                description: "The date in MM-DD format.",
            },
            names: {
                type: Type.ARRAY,
                description: "An array of names celebrated on this date.",
                items: {
                    type: Type.STRING,
                },
            },
        },
        required: ["date", "names"],
    },
};

export const fetchAllNameDays = async (country: string): Promise<FullNameDay[]> => {
    const prompt = `Please provide a complete list of all name days celebrated in ${country}. Structure the response as an array of objects, where each object contains a 'date' (in MM-DD format) and an array of 'names' for that date. If the country does not celebrate name days, return an empty array.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: allNameDaysSchema,
            },
        });

        const jsonString = response.text.trim();
        if (!jsonString || jsonString === '[]') return [];
        const parsedData: FullNameDay[] = JSON.parse(jsonString);
        return parsedData;

    } catch (error) {
        console.error("Error fetching all name days from Gemini:", error);
        throw new Error(`Failed to fetch name day list for ${country}. The AI model may not have this data available.`);
    }
};

export const generateWish = async (name: string, country: string, style: string): Promise<string> => {
    const prompt = `Write a ${style} name day wish for a person named ${name}. The celebration is in ${country}. Keep the wish concise, warm, and under 50 words. Write it in the local language of the country.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        
        return response.text.trim();

    } catch (error) {
        console.error("Error generating wish from Gemini:", error);
        throw new Error("Failed to generate a wish. The AI model might be busy.");
    }
};