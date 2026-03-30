import React, { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { fetchAdminStats } from "../../lib/api";
import "./admin.css";

const CHART_COLORS = ["#2563eb", "#0ea5e9", "#38bdf8", "#60a5fa"];

function Admin() {
  const [password, setPassword] = useState("");
  const [stats, setStats] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadStats = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const data = await fetchAdminStats(password);
      setStats(data);
    } catch (error) {
      setStats(null);
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-shell">
        <section className="admin-login-card">
          <p className="admin-eyebrow">Admin Panel</p>
          <h1>Verify.uz statistikasi</h1>
          <p className="admin-description">
            Parolni kiriting va jami so&apos;rovnomalar soni hamda savollar
            bo&apos;yicha foizlarni ko&apos;ring.
          </p>

          <form className="admin-login-form" onSubmit={handleLoadStats}>
            <input
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Admin paroli"
              type="password"
              value={password}
            />
            <button disabled={isLoading} type="submit">
              {isLoading ? "Yuklanmoqda..." : "Statistikani ko'rish"}
            </button>
          </form>

          {errorMessage ? <p className="admin-error">{errorMessage}</p> : null}
        </section>

        {stats ? (
          <section className="admin-stats">
            <div className="summary-card">
              <span>Jami so&apos;rovnoma</span>
              <strong>{stats.totalResponses}</strong>
            </div>

            <div className="stats-grid">
              {stats.questions.map((question) => (
                <article className="stats-card" key={question.id}>
                  <div className="stats-card-head">
                    <p>{question.title}</p>
                    <span>{question.type === "text" ? "Yozma javob" : "Foizlar"}</span>
                  </div>

                  {question.type === "radio" ? (
                    <div className="option-stats">
                      <div className="chart-wrap">
                        <ResponsiveContainer height={280} width="100%">
                          <BarChart
                            data={question.options}
                            layout="vertical"
                            margin={{ top: 8, right: 16, left: 16, bottom: 8 }}
                          >
                            <CartesianGrid horizontal stroke="#dbeafe" strokeDasharray="3 3" />
                            <XAxis
                              allowDecimals={false}
                              domain={[0, 100]}
                              tickFormatter={(value) => `${value}%`}
                              type="number"
                            />
                            <YAxis
                              dataKey="option"
                              tick={{ fontSize: 12 }}
                              type="category"
                              width={180}
                            />
                            <Tooltip
                              formatter={(value, _name, item) => [
                                `${value}% (${item.payload.count} ta)`,
                                "Natija",
                              ]}
                              labelFormatter={(label) => `Variant: ${label}`}
                            />
                            <Bar dataKey="percentage" radius={[0, 10, 10, 0]}>
                              {question.options.map((option, index) => (
                                <Cell
                                  fill={CHART_COLORS[index % CHART_COLORS.length]}
                                  key={`${question.id}-${option.option}`}
                                />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>

                      {question.options.map((option) => (
                        <div className="option-stat-row" key={option.option}>
                          <div className="option-stat-label">
                            <span>{option.option}</span>
                            <strong>
                              {option.count} ta / {option.percentage}%
                            </strong>
                          </div>
                          <div className="stat-bar">
                            <div
                              className="stat-bar-fill"
                              style={{ width: `${option.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-stat-box">
                      <strong>{question.responseCount} ta yozma javob</strong>
                      {question.responses.length > 0 ? (
                        <ul>
                          {question.responses.map((response, index) => (
                            <li key={`${question.id}-${index}`}>
                              <span>{response.username}</span>
                              <p>{response.answer}</p>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>Hozircha yozma javoblar yo&apos;q.</p>
                      )}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}

export default Admin;
