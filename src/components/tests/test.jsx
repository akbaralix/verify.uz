import React, { useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { surveyQuestions } from "../../data/surveyQuestions";
import { clearStoredUsername, getStoredUsername } from "../../lib/storage";
import { submitSurvey } from "../../lib/api";
import "./test.css";

function Test() {
  const navigate = useNavigate();
  const username = getStoredUsername();
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [submittedAnswers, setSubmittedAnswers] = useState([]);

  const unansweredQuestions = useMemo(
    () =>
      surveyQuestions.filter((question) => {
        const answer = answers[question.id];

        if (question.type === "text") {
          return !answer || !answer.trim();
        }

        return !answer;
      }),
    [answers],
  );

  if (!username) {
    return <Navigate replace to="/login" />;
  }

  const handleAnswerChange = (questionId, value) => {
    setAnswers((currentAnswers) => ({
      ...currentAnswers,
      [questionId]: value,
    }));
  };

  const handleLogout = () => {
    clearStoredUsername();
    navigate("/login");
  };

  // AI matnidagi **bold** qismlarni formatlash uchun funksiya
  const formatAiResponse = (text) => {
    if (!text) return null;
    return text.split(/(\*\*.*?\*\*)/g).map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  const handleGetAIAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const prompt = `Iste'molchi huquqlari bo'yicha quyidagi so'rovnoma javoblarini tahlil qiling va foydalanuvchiga tavsiyalar bering. Javobingizni o'zbek tilida, qisqa va lo'nda yozing:\n\n${submittedAnswers.map((a) => `Savol: ${a.questionTitle}\nJavob: ${a.answer}`).join("\n\n")}`;

      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: prompt }],
          }),
        },
      );

      const data = await response.json();
      setAiAnalysis(data.choices[0].message.content);
    } catch (error) {
      console.error("AI Analysis error:", error);
      setAiAnalysis(
        "Kechirasiz, tahlil jarayonida xatolik yuz berdi. Iltimos qaytadan urinib ko'ring.",
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (unansweredQuestions.length > 0) {
      alert(
        `Iltimos, barcha savollarga javob bering. Hozir ${unansweredQuestions.length} ta savol javobsiz qoldi.`,
      );
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      const normalizedAnswers = surveyQuestions.map((question) => ({
        questionId: question.id,
        questionTitle: question.title,
        type: question.type,
        answer: answers[question.id].trim(),
      }));

      await submitSurvey({
        username,
        answers: normalizedAnswers,
      });

      setSubmittedAnswers(normalizedAnswers);
      setShowSuccess(true);
      setAnswers({});
    } catch (error) {
      setSubmitMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="survey-page">
      <div className="survey-shell">
        <div className="survey-header">
          <div>
            <p className="survey-eyebrow">So&apos;rovnoma</p>
            <h1>
              Iste&apos;molchi huquqlarini buzish holatlari va oqibatlari
              tahlili
            </h1>
            <p className="survey-subtitle">
              <span style={{ color: "black", fontWeight: "600" }}>
                {username}
              </span>
              , 15 ta savolning barchasiga javob bering. 2 ta savolda o&apos;z
              fikringizni yozma tarzda kiriting.
            </p>
          </div>
          <button
            className="survey-logout"
            onClick={handleLogout}
            type="button"
          >
            Chiqish
          </button>
        </div>

        <form className="survey-form" onSubmit={handleSubmit}>
          {surveyQuestions.map((question, index) => (
            <section className="question-card" key={question.id}>
              <div className="question-meta">
                <span>{index + 1}-savol</span>
                <span>
                  {question.type === "text" ? "Yozma javob" : "Bitta variant"}
                </span>
              </div>
              <h2>{question.title}</h2>

              {question.type === "radio" ? (
                <div className="options-grid">
                  {question.options.map((option) => (
                    <label className="option-item" key={option}>
                      <input
                        checked={answers[question.id] === option}
                        name={question.id}
                        onChange={(event) =>
                          handleAnswerChange(question.id, event.target.value)
                        }
                        type="radio"
                        value={option}
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <textarea
                  className="text-answer"
                  onChange={(event) =>
                    handleAnswerChange(question.id, event.target.value)
                  }
                  placeholder={question.placeholder}
                  rows="5"
                  value={answers[question.id] || ""}
                />
              )}
            </section>
          ))}

          {submitMessage ? (
            <p className="submit-message">{submitMessage}</p>
          ) : null}

          <button
            className="submit-button"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Yuborilmoqda..." : "Javoblarni yuborish"}
          </button>
        </form>
      </div>

      {showSuccess && (
        <div className="success-overlay">
          <div className={`success-card ${aiAnalysis ? "expanded" : ""}`}>
            {!aiAnalysis && !isAnalyzing ? (
              <>
                <div className="checkmark-circle">
                  <div className="checkmark draw"></div>
                </div>
                <h2>Javoblaringiz uchun rahmat!</h2>
                <p>So'rovnomada ishtirok etganingiz biz uchun muhim.</p>
                <div className="success-actions">
                  <button className="ai-button" onClick={handleGetAIAnalysis}>
                    AI tahlilni ko'rish
                  </button>
                  <button className="close-simple" onClick={handleLogout}>
                    Yopish
                  </button>
                </div>
              </>
            ) : isAnalyzing ? (
              <div className="ai-status">
                <div className="ai-spinner"></div>
                <p>AI javoblaringizni tahlil qilmoqda...</p>
              </div>
            ) : (
              <div className="ai-result">
                <h3>AI Tahlili</h3>
                <div className="ai-content">{formatAiResponse(aiAnalysis)}</div>
                <button className="close-success" onClick={handleLogout}>
                  Tugatish
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Test;
