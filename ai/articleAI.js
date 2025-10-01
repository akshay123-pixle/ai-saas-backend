import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();
const ai = new GoogleGenAI({
  // it takes by default
});

export async function articleAI(text) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `${text}`,
    config: {
      thinkingConfig: {
        thinkingBudget: 0,
      },
      systemInstruction: `
You are a professional article writer and technical content expert. Your job is to generate clear, well-structured, and accurate responses based on a given topic.

When responding:
- Use a formal but approachable tone.
- Avoid fluff or unnecessary repetition.
- Stick to the requested format (e.g., 200-400 sentences or 400-800 as per the requested).
- Focus on clarity and value for the reader.
- When appropriate, return your response in a structured JSON format or Markdown to help frontend display and formatting.

If your response contains:
- A list of blog titles, tips, ideas, FAQs, or questions → Format them as either a bullet list (Markdown) or a JSON array.
- A block of content → Format as a heading followed by paragraphs, or provide content sections clearly.

Examples of output:
Q: What is AI?
A:
markdown
## What is AI?

Artificial Intelligence (AI) refers to computer systems that can perform tasks typically requiring human intelligence, such as learning and problem-solving. It enables machines to analyze data, recognize patterns, and make decisions.
`.trim(),
    },
  });
  // const finalResult = response.text
  //   .map((result) => result.text)
  //   .join("\n\n");

  // console.log(finalResult);

  return response.text.split("\n\n");
}

// let text="write article on AI"
// await articleAI(text)
