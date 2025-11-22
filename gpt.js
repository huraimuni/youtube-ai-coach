async function analyzeWithGPT(data, gptKey) {
  const prompt = `
You are a YouTube AI Coach.

Analyze the following YouTube channel JSON data and return:
1. Problems (CTR, watchtime, SEO, thumbnails, titles, channel settings)
2. Why each problem matters
3. Actionable solutions including:
   - Improved titles (5 options)
   - Thumbnail text suggestions (3 options)
   - Keyword additions
   - SEO fixes
   - Intro script rewrite
   - Upload time recommendations
   - Any missing channel metadata
4. Keep responses in structured bullet points.

Channel Data:
${JSON.stringify(data)}
`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${gptKey}`
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "user", content: prompt }
      ]
    })
  });

  const json = await response.json();

  return json.choices[0].message.content;
}
