const { GoogleGenAI } = require("@google/genai");
const pdfParse = require("pdf-parse");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});