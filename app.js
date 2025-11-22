async function saveKeys() {
  const ytKey = document.getElementById("ytKey").value;
  const gptKey = document.getElementById("gptKey").value;
  const channelInput = document.getElementById("channelInput").value;

  localStorage.setItem("ytKey", ytKey);
  localStorage.setItem("gptKey", gptKey);
  localStorage.setItem("channelInput", channelInput);

  alert("Saved! Now run analysis.");
}

async function runAnalysis() {
  const ytKey = localStorage.getItem("ytKey");
  const gptKey = localStorage.getItem("gptKey");
  const channelInput = localStorage.getItem("channelInput");

  if (!ytKey || !gptKey || !channelInput) {
    alert("Please enter all keys first.");
    return;
  }

  document.getElementById("results").textContent = "Fetching YouTube data...";

  try {
    // 1) 채널 ID 가져오기
    const channelId = await getChannelId(channelInput, ytKey);

    // 2) 채널 정보 + 최근 영상 정보 가져오기
    const data = await fetchYouTubeData(channelId, ytKey);

    // 화면에 잠시 데이터 표시
    document.getElementById("results").textContent =
      "YouTube data loaded. Now analyzing with AI...";

    // 3) GPT 분석 요청
    const aiResult = await analyzeWithGPT(data, gptKey);

    // 4) 최종 분석 결과 출력
    document.getElementById("results").textContent = aiResult;

  } catch (e) {
    document.getElementById("results").textContent = "Error: " + e.message;
  }
}
