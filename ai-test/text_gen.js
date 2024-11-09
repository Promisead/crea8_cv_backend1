// Make sure to include these imports:
import dotenv from 'dotenv';
dotenv.config();

 import { GoogleGenerativeAI } from "@google/generative-ai";

 const apiKey = console.log(process.env.API_KEY)
 console.log(apiKey)
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const prompt = "Write a story about a magic backpack.";

const result = await model.generateContent(prompt);
console.log(result.response.text());