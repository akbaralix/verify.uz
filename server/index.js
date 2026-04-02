import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { connectToDatabase } from "./db.js";
import { surveyQuestions } from "../src/data/surveyQuestions.js";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 4000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "verifyuzakb";
const REQUIRED_QUESTION_COUNT = 15;
const SURVEY_TABLE = "survey_responses";

function getSafeAnswers(response) {
  return Array.isArray(response?.answers) ? response.answers : [];
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, "../dist");

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/surveys", async (req, res) => {
  try {
    const payload = req.body || {};
    const username = String(payload.username || "").trim();
    const answers = Array.isArray(payload.answers) ? payload.answers : [];

    if (username.length < 3) {
      return res.status(400).json({ message: "Foydalanuvchi ismi noto'g'ri." });
    }

    if (answers.length !== REQUIRED_QUESTION_COUNT) {
      return res
        .status(400)
        .json({ message: "Barcha 15 ta savolga javob bering." });
    }

    const hasInvalidAnswer = answers.some((item) => {
      const answer = String(item.answer || "").trim();
      return !item.questionId || !item.questionTitle || !item.type || !answer;
    });

    if (hasInvalidAnswer) {
      return res.status(400).json({ message: "Javoblarning ayrimlari bo'sh." });
    }

    const { db } = await connectToDatabase();
    const { error } = await db.from(SURVEY_TABLE).insert({
      username,
      answers: answers.map((item) => ({
        questionId: item.questionId,
        questionTitle: item.questionTitle,
        type: item.type,
        answer: String(item.answer).trim(),
      })),
      created_at: new Date().toISOString(),
    });

    if (error) {
      throw new Error(error.message);
    }

    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({
      message: "Serverda xatolik yuz berdi.",
      error: error.message,
    });
  }
});

app.post("/api/admin/stats", async (req, res) => {
  try {
    const providedPassword = String(req.body?.password || "").trim();

    if (providedPassword !== ADMIN_PASSWORD) {
      return res.status(401).json({ message: "Admin paroli noto'g'ri." });
    }

    const { db } = await connectToDatabase();
    const { data: responses, error } = await db
      .from(SURVEY_TABLE)
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    const safeResponses = responses || [];

    const questions = surveyQuestions.map((question) => {
      const questionAnswers = safeResponses
        .map((response) => ({
          username: response.username,
          answer: getSafeAnswers(response).find(
            (item) => item.questionId === question.id,
          ),
        }))
        .filter((item) => item.answer);

      if (question.type === "text") {
        return {
          id: question.id,
          title: question.title,
          type: question.type,
          responseCount: questionAnswers.length,
          responses: questionAnswers.map((item) => ({
            username: item.username,
            answer: item.answer.answer,
          })),
        };
      }

      return {
        id: question.id,
        title: question.title,
        type: question.type,
        options: question.options.map((option) => {
          const count = questionAnswers.filter(
            (item) => item.answer.answer === option,
          ).length;

          return {
            option,
            count,
            percentage: questionAnswers.length
              ? Math.round((count / questionAnswers.length) * 100)
              : 0,
          };
        }),
      };
    });

    return res.json({
      totalResponses: safeResponses.length,
      questions,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Statistikani hisoblashda xatolik yuz berdi.",
      error: error.message,
    });
  }
});

app.use(express.static(distPath));

app.use((_req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

async function startServer() {
  try {
    const { db } = await connectToDatabase();
    const { error } = await db.from(SURVEY_TABLE).select("*").limit(1);

    if (error) {
      throw new Error(error.message);
    }

    console.log(`Supabase ga ulandi: ${process.env.SUPABASE_URL}`);

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Supabase ulanishida xato:", error.message);
    process.exit(1);
  }
}

startServer();
