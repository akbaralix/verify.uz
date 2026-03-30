export async function submitSurvey(payload) {
  const response = await fetch("/api/surveys", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "So'rovnomani yuborib bo'lmadi.");
  }

  return data;
}

export async function fetchAdminStats(password) {
  const response = await fetch("/api/admin/stats", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password }),
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Statistikani olib bo'lmadi.");
  }

  return data;
}
