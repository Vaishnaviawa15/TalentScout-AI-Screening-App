import { GoogleGenerativeAI } from "@google/generative-ai";


const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is missing");
}

const genAI = new GoogleGenerativeAI(apiKey);



type QuestionInput = {
  roles: string[];
  techStack: string[];
  experienceLevel: "Fresher" | "Experienced";
  difficultyStage: "Conceptual" | "Practical" | "RealWorld";
};

export async function generateTechnicalQuestion(input: QuestionInput) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });

  const prompt = `
You are a technical interviewer conducting a pre-HR screening.

Rules:
- Ask exactly ONE technical question.
- Stay strictly within the given tech stack.
- Do NOT provide explanations or answers.
- Keep the question concise and clear.
- Do NOT ask multiple questions.
- If unsure, ask a simpler question.

Candidate details:
- Desired roles: ${input.roles.join(", ")}
- Tech stack: ${input.techStack.join(", ")}
- Experience level: ${input.experienceLevel}
- Question type: ${input.difficultyStage}

Ask one ${input.difficultyStage} technical question now.
`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}
