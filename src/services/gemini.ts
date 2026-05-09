export async function solveDoubt(query: string, context?: string) {
  try {
    const response = await fetch("/api/ai/solve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, context }),
    });
    const data = await response.json();
    if (data.error) throw new Error(data.error);
    return data.text;
  } catch (error) {
    console.error("AI Error:", error);
    return "Sorry, I couldn't process that query right now.";
  }
}

export async function generateQuickQuiz(subject: string, topic: string) {
  try {
    const response = await fetch("/api/ai/quiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject, topic }),
    });
    const data = await response.json();
    if (data.error) throw new Error(data.error);
    return data;
  } catch (error) {
    console.error("AI Error:", error);
    return [];
  }
}
