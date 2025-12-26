import axios from "axios";
import config from "./config.js";

  
export async function personalizedTeaching(student, weakSubjects) {
    const system = `
You are a Tanzanian secondary school teacher.
Explain simply, with local examples.
End with a short quiz (5 questions).
`;

    const userPrompt = `
Student Name: ${student.name}
Class: ${student.class}

Weak subjects: ${weakSubjects.join(", ")}

Teach step-by-step.
`;

    const res = await axios.post(
        OPENAI_URL,
        {
            model: config.aiModel,
            messages: [
                { role: "system", content: system },
                { role: "user", content: userPrompt }
            ],
            max_tokens: 1200,
            temperature: 0.7
        },
        { headers: { Authorization: `Bearer ${config.openaiKey}` } }
    );

    return res.data.choices[0].message.content;
}

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";

/**
 * =========================
 * 1️⃣ AI TEACHER (TEXT ONLY)
 * =========================
 */
export async function askTeachingPrompt(studentProfile, prompt) {
  const system = `
You are a friendly Tanzanian secondary school teacher.
Use simple language, local examples, step-by-step explanation.
End with a short 5-question quiz.

Student class: ${studentProfile?.class || "Form 1"}
`;

  const messages = [
    { role: "system", content: system.trim() },
    { role: "user", content: prompt }
  ];

  const res = await axios.post(
    OPENAI_URL,
    {
      model: config.aiModel, // gpt-4o-mini is fine here
      messages,
      max_tokens: 1200,
      temperature: 0.7
    },
    {
      headers: { Authorization: `Bearer ${config.openaiKey}` }
    }
  );

  return (
    res.data.choices?.[0]?.message?.content ||
    "Samahani, nilipata shida kuunda jibu."
  );
}

/**
 * =========================
 * 2️⃣ QUIZ GENERATOR
 * =========================
 */
export async function generateQuiz(studentProfile, topic) {
  const system = `
You are a Tanzanian exam setter.
Return a short quiz (5 questions).
Include answers.
Tag each question as easy, medium, or hard.
Plain text only (WhatsApp friendly).
`;

  const messages = [
    { role: "system", content: system.trim() },
    {
      role: "user",
      content: `Generate a quiz on "${topic}" for ${studentProfile?.class || "Form 1"}`
    }
  ];

  const res = await axios.post(
    OPENAI_URL,
    {
      model: config.aiModel,
      messages,
      max_tokens: 800
    },
    {
      headers: { Authorization: `Bearer ${config.openaiKey}` }
    }
  );

  return (
    res.data.choices?.[0]?.message?.content ||
    "Samahani, nilipata shida kuandaa quiz."
  );
}

/**
 * =========================
 * 3️⃣ OCR + AI MARKING (IMAGE → ANSWERS)
 * =========================
 */
export async function scanAndMarkExam(imageUrl) {
  const messages = [
    {
      role: "system",
      content: `
You are a Tanzanian secondary school examiner.
Read the exam image.
Extract questions clearly.
Provide:
- Step-by-step solutions
- Final answers
- Short marking scheme
- Weak topic detection
`
    },
    {
      role: "user",
      content: [
        { type: "text", text: "Scan this exam and solve it fully." },
        {
          type: "image_url",
          image_url: { url: imageUrl }
        }
      ]
    }
  ];

  
  const res = await axios.post(
    OPENAI_URL,
    {
      model: "gpt-4o", // MUST be full vision model
      messages,
      max_tokens: 1500
    },
    {
      headers: { Authorization: `Bearer ${config.openaiKey}` }
    }
  );

  return (
    res.data.choices?.[0]?.message?.content ||
    "Samahani, sikuweza kusoma mtihani vizuri."
  );
}

/**
 * =========================
 * 4️⃣ AI PERSONALIZED LEARNING ENGINE
 * =========================
 */
export async function personalizedTeaching(studentProfile, weakTopics = []) {
  const prompt = `
Student name: ${studentProfile?.name || "Student"}
Class: ${studentProfile?.class || "Form 1"}

Weak topics:
${weakTopics.length ? weakTopics.join(", ") : "Not specified"}

Teach step-by-step using Tanzanian examples.
Include:
1. Simple explanation
2. Worked examples
3. Common mistakes
4. Short quiz (5 questions)
`;

  return askTeachingPrompt(studentProfile, prompt);
}

export default {
  askTeachingPrompt,
  generateQuiz,
  scanAndMarkExam,
  personalizedTeaching
};
