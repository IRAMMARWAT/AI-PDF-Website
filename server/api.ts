import express from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

export const apiRouter = express.Router();
apiRouter.use(express.json({ limit: '50mb' }));
apiRouter.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Helper to get GoogleGenAI client securely
function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('GEMINI_API_KEY is not set in environment variables');
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Resilient helper to call Gemini with model fallback
async function runGeminiContent(ai: GoogleGenAI, contents: any, config?: any): Promise<string> {
  const modelsToTry = ['gemini-3.6-flash', 'gemini-3.8-flash'];
  let lastError: any = null;

  for (const model of modelsToTry) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents,
        ...(config ? { config } : {}),
      });
      return response.text || '';
    } catch (err: any) {
      lastError = err;
      console.warn(`Model ${model} failed, trying fallback:`, err.message || err);
    }
  }

  throw lastError || new Error('Failed to generate response from Gemini AI');
}

// 1. Health check
apiRouter.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    aiReady: Boolean(process.env.GEMINI_API_KEY),
    model: 'gemini-3.6-flash',
  });
});

// 2. Chat with PDF (RAG / Contextual QA)
apiRouter.post('/ai/chat', async (req, res) => {
  try {
    const { message, documentText, history = [] } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const ai = getGenAI();
    if (!ai) {
      return res.status(503).json({
        error: 'AI service unavailable. GEMINI_API_KEY is missing.',
      });
    }

    const docContext = documentText
      ? `=== DOCUMENT CONTEXT BEGIN ===\n${documentText.slice(0, 40000)}\n=== DOCUMENT CONTEXT END ===`
      : 'No document provided. Answer as a general document intelligence assistant.';

    const systemPrompt = `You are DocuNova AI, an elite document intelligence assistant.
Your mission is to answer user queries with extreme accuracy and professionalism.
Rules:
1. Ground your answers strictly in the provided DOCUMENT CONTEXT whenever applicable.
2. If the document specifies page numbers (e.g. "[Page X]") or sections, cite them clearly using tags like [Page X].
3. If the answer cannot be found in the document, explicitly state: "Based on the provided document, this information is not mentioned," and provide general contextual help if appropriate.
4. Do not fabricate or hallucinate document clauses, dates, financial figures, or names.
5. Format your answer with clean Markdown, bullet points, and code/table blocks where helpful.`;

    const chatHistoryFormatted = history
      .slice(-6)
      .map((h: any) => `${h.role === 'user' ? 'User' : 'Assistant'}: ${h.content}`)
      .join('\n\n');

    const prompt = `${systemPrompt}\n\n${docContext}\n\nChat History:\n${chatHistoryFormatted}\n\nUser Question: ${message}\n\nAssistant:`;

    const responseText = await runGeminiContent(ai, prompt);
    return res.json({ response: responseText || 'No response generated.' });
  } catch (error: any) {
    console.error('Error in /api/ai/chat:', error);
    const msg = error?.message || 'Failed to process document chat request';
    return res.status(500).json({ error: msg });
  }
});

// 3. Document Summarizer & Key Points
apiRouter.post('/ai/summarize', async (req, res) => {
  try {
    const { text, mode = 'detailed' } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Document text is required' });
    }

    const ai = getGenAI();
    if (!ai) {
      return res.status(503).json({ error: 'AI service unavailable' });
    }

    const promptInstructions: Record<string, string> = {
      tldr: 'Provide a concise, punchy TL;DR summary in 2 to 3 sentences maximum.',
      executive: 'Provide an Executive Summary with: Overview, Key Objectives, Critical Findings, and Strategic Implications.',
      detailed: 'Provide a thorough, structured breakdown covering all core sections, arguments, methodologies, and conclusions with bullet points.',
      keypoints: 'Extract the top 10 most crucial key takeaways, milestones, and actionable insights as numbered items.',
      actionitems: 'Extract all immediate action items, deadlines, owners, and deliverables from this document.',
    };

    const instruction = promptInstructions[mode] || promptInstructions.detailed;
    const prompt = `You are DocuNova AI's master document analyst.
Document text:
"""
${text.slice(0, 45000)}
"""

Task:
${instruction}

Deliver the output in polished, beautifully formatted Markdown with bold headings and structured lists.`;

    const summary = await runGeminiContent(ai, prompt);
    return res.json({ summary: summary || 'Unable to generate summary.' });
  } catch (error: any) {
    console.error('Error in /api/ai/summarize:', error);
    return res.status(500).json({ error: error.message || 'Failed to summarize document' });
  }
});

// 4. Interactive Quiz Generator
apiRouter.post('/ai/quiz', async (req, res) => {
  try {
    const { text, questionCount = 5, difficulty = 'medium' } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Document text is required' });
    }

    const ai = getGenAI();
    if (!ai) {
      return res.status(503).json({ error: 'AI service unavailable' });
    }

    const prompt = `Analyze the following document and generate a ${questionCount}-question multiple-choice quiz (${difficulty} difficulty).
Strictly output a valid JSON array of objects with NO surrounding markdown backticks or commentary.
Schema:
[
  {
    "question": "Question text here",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answerIndex": 0,
    "explanation": "Brief explanation of why this answer is correct based on the document"
  }
]

Document:
"""
${text.slice(0, 35000)}
"""`;

    const textOutput = await runGeminiContent(ai, prompt);
    let raw = textOutput || '[]';
    raw = raw.replace(/```json/gi, '').replace(/```/g, '').trim();
    const quiz = JSON.parse(raw);
    return res.json({ quiz });
  } catch (error: any) {
    console.error('Error in /api/ai/quiz:', error);
    return res.status(500).json({ error: error.message || 'Failed to generate quiz' });
  }
});

// 5. Flashcards Generator
apiRouter.post('/ai/flashcards', async (req, res) => {
  try {
    const { text, count = 8 } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Document text is required' });
    }

    const ai = getGenAI();
    if (!ai) {
      return res.status(503).json({ error: 'AI service unavailable' });
    }

    const prompt = `Extract ${count} core terms, principles, or questions from the document and generate study flashcards.
Strictly output a valid JSON array of objects with NO markdown formatting.
Schema:
[
  {
    "front": "Concept, term or question",
    "back": "Clear, memorable explanation or definition",
    "hint": "Optional quick memory clue"
  }
]

Document:
"""
${text.slice(0, 35000)}
"""`;

    const textOutput = await runGeminiContent(ai, prompt);
    let raw = textOutput || '[]';
    raw = raw.replace(/```json/gi, '').replace(/```/g, '').trim();
    const flashcards = JSON.parse(raw);
    return res.json({ flashcards });
  } catch (error: any) {
    console.error('Error in /api/ai/flashcards:', error);
    return res.status(500).json({ error: error.message || 'Failed to generate flashcards' });
  }
});

// 6. Educational Study Guide & Notes
apiRouter.post('/ai/study-guide', async (req, res) => {
  try {
    const { text, title = 'Document Study Guide' } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Document text is required' });
    }

    const ai = getGenAI();
    if (!ai) {
      return res.status(503).json({ error: 'AI service unavailable' });
    }

    const prompt = `You are an academic learning specialist. Create a complete, master-level Study Guide based on this document:
Title: ${title}

Structure the output into:
# 📚 Comprehensive Study Guide: ${title}
## 1. Executive Concept Overview
## 2. Core Themes & Theoretical Framework
## 3. Key Terminology & Glossary
## 4. Deep-Dive Section Summaries
## 5. Potential Exam / Review Questions & Model Answers
## 6. Critical Thinking Reflections

Document:
"""
${text.slice(0, 45000)}
"""`;

    const guide = await runGeminiContent(ai, prompt);
    return res.json({ guide: guide || 'No guide generated.' });
  } catch (error: any) {
    console.error('Error in /api/ai/study-guide:', error);
    return res.status(500).json({ error: error.message || 'Failed to generate study guide' });
  }
});

// 7. Structured Information / OCR Extraction (Receipt, Invoice, Table, Form)
apiRouter.post('/ai/extract', async (req, res) => {
  try {
    const { text, imageBase64, mode = 'invoice' } = req.body;
    const ai = getGenAI();
    if (!ai) {
      return res.status(503).json({ error: 'AI service unavailable' });
    }

    let contents: any[] = [];
    const instructions: Record<string, string> = {
      invoice: 'Extract all invoice data: Vendor Name, Invoice Number, Invoice Date, Due Date, Line Items (Description, Qty, Unit Price, Total), Subtotal, Tax, Total Amount, Payment Terms. Format as clean JSON.',
      receipt: 'Extract receipt details: Merchant, Date, Time, Currency, Purchased Items with Prices, Subtotal, Tax, Tip, Total Amount, Payment Method. Format as clean JSON.',
      table: 'Detect and extract all tabular data into clean Markdown tables and CSV format.',
      contract: 'Extract Contract Parties, Effective Date, Expiration Date, Governing Law, Financial Obligations, Termination Clauses, and Key Liabilities.',
    };

    const instruction = instructions[mode] || instructions.invoice;

    if (imageBase64) {
      const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');
      contents = [
        {
          inlineData: {
            mimeType: 'image/png',
            data: cleanBase64,
          },
        },
        `You are DocuNova AI's Vision OCR engine. ${instruction}`,
      ];
    } else if (text) {
      contents = [
        `You are DocuNova AI's Document Extraction engine. ${instruction}\n\nDocument Text:\n"""\n${text.slice(0, 40000)}\n"""`,
      ];
    } else {
      return res.status(400).json({ error: 'Either text or imageBase64 must be provided' });
    }

    const output = await runGeminiContent(ai, contents);
    return res.json({ result: output });
  } catch (error: any) {
    console.error('Error in /api/ai/extract:', error);
    return res.status(500).json({ error: error.message || 'Failed to extract data' });
  }
});

// 8. AI Writing & Productivity Suite
apiRouter.post('/ai/writing', async (req, res) => {
  try {
    const { input, tool, tone = 'professional', targetLanguage = 'Spanish' } = req.body;
    if (!input) {
      return res.status(400).json({ error: 'Input text is required' });
    }

    const ai = getGenAI();
    if (!ai) {
      return res.status(503).json({ error: 'AI service unavailable' });
    }

    const toolPrompts: Record<string, string> = {
      rewrite: `Rewrite the following text with a ${tone} tone, elevating clarity, engagement, and flow while retaining original meaning.`,
      simplify: `Simplify this text so that a middle-schooler or beginner can understand it effortlessly (ELI5 style). Keep core facts accurate.`,
      grammar: `Proofread and check grammar, spelling, and punctuation. Return two sections: 1) The fully corrected text, 2) A list of specific corrections made and explanations.`,
      email: `Draft a high-impact, professional business email based on the following notes/request with tone: ${tone}. Include Subject line and polite sign-off.`,
      coverletter: `Write a compelling, bespoke cover letter based on the provided candidate background and role details. Highlight quantifiable accomplishments.`,
      resume: `Optimize and polish the provided resume text/bullet points. Enhance action verbs, highlight metrics, and format for ATS friendliness.`,
      translate: `Translate the following text into ${targetLanguage}. Maintain technical terminology, cultural nuances, and natural conversational cadence.`,
      essay: `Write an insightful, well-structured academic essay with introduction, thesis, evidence-backed arguments, and conclusion based on this topic.`,
      paraphrase: `Paraphrase the following text in 3 distinct styles: 1) Direct & Punchy, 2) Formal & Academic, 3) Creative & Engaging.`,
    };

    const instruction = toolPrompts[tool] || toolPrompts.rewrite;
    const prompt = `${instruction}\n\nInput:\n"""\n${input.slice(0, 30000)}\n"""`;

    const output = await runGeminiContent(ai, prompt);
    return res.json({ result: output || 'Unable to generate content.' });
  } catch (error: any) {
    console.error('Error in /api/ai/writing:', error);
    return res.status(500).json({ error: error.message || 'Failed to process writing task' });
  }
});
