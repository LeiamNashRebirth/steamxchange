import { Leiam, GoogleKey } from '@/env/secrets';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(GoogleKey);

const conversationHistory: Record<string, { role: "user" | "model"; parts: { text: string }[] }[]> = {};

export async function generateImage(prompt: string, clientUID: string) {
  try {
    if (!conversationHistory[clientUID]) {
      conversationHistory[clientUID] = [];
    }
    conversationHistory[clientUID].push({ role: "user", parts: [{ text: prompt }] });

    const model = genAI.getGenerativeModel({ model: "imagen-1.0-generate-002" });
    const result = await model.generateContent({ contents: [{ role: "user", parts: [{ text: prompt }] }] });
    const imageResponse = result.response;
    conversationHistory[clientUID].push({ role: "model", parts: [{ text: "[Image Generated]" }] });
    return imageResponse;
  } catch (error) {
    return error.stack;
  }
}

export async function generateText(prompt: string, clientUID: string) {
  try {
    if (!conversationHistory[clientUID]) {
      conversationHistory[clientUID] = [];
    }
    conversationHistory[clientUID].push({ role: "user", parts: [{ text: prompt }] });

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
    const result = await model.generateContent({
      contents: conversationHistory[clientUID],
    });

    const aiResponse = result.response.text();
    conversationHistory[clientUID].push({ role: "model", parts: [{ text: aiResponse }] });

    
    return aiResponse;
  } catch (error) {
    return error.stack;
  }
}

export const getContent = async(id: string) => {
    try {
   const response = await fetch(`${Leiam}/video/content/${id}`);
   const data = await response.json();
     return data;
  } catch (error) {
     return []
 }
};

export const getInfo = async(id: string) => {
    try {
   const response = await fetch(`${Leiam}/video/info/${id}`);
   const data = await response.json();
     return data;
  } catch (error) {
     return []
 }
};

export const getVideo = async(id: string) => {
    try {
   const response = await fetch(`${Leiam}/video/watch/${id}`);
   const data = await response.json();
     return data;
  } catch (error) {
     return []
 }
};

export const getSearch = async(id: string) => {
    try {
   const response = await fetch(`${Leiam}/video/search/${id}`);
   const data = await response.json();
     return data;
  } catch (error) {
     return []
 }
};