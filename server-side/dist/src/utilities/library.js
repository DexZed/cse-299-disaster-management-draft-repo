"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = generateText;
const genai_1 = require("@google/genai");
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not defined");
}
const ai = new genai_1.GoogleGenAI({ apiKey: GEMINI_API_KEY });
async function generateText(prompt) {
    const response = await ai.models.generateContentStream({
        model: "gemini-2.5-flash",
        contents: prompt
    });
    console.log(response);
    return response;
}
//# sourceMappingURL=library.js.map