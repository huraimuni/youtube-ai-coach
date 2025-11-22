function saveKeys() {
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

  document.getElementById("results").textContent = "Analyzing...";

  const data = { message: "임시 분석 준비됨" };

  document.getElementById("results").textContent = JSON.stringify(data, null, 2);
}
