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

      setSubmitMessage(
        "Javoblaringiz muvaffaqiyatli saqlandi. Ishtirokingiz uchun rahmat.",
      );
      setAnswers({});
      clearStoredUsername();
      setTimeout(() => {
        navigate("/login");
      }, 1800);
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
    </div>
  );
}

export default Test;
