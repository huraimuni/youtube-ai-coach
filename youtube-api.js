// 네 전용 Cloudflare Worker 프록시 주소
const WORKER = "https://aged-pond-d467.boa2424.workers.dev";

// ---- 프록시 요청 함수 ----
async function googleAPI(path) {
  const url = `${WORKER}?url=${encodeURIComponent(path)}`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("프록시 요청 실패: " + res.status);
  }

  return await res.json();
}

// ---- 입력 → channelId 변환 ----
async function getChannelId(input, apiKey) {

  // 형태 1) UC로 시작하는 channelId 그대로 입력
  if (input.startsWith("UC")) {
    return input;
  }

  // 형태 2) /channel/UCxxxxxx URL 입력
  const match = input.match(/channel\/(UC[\w-]+)/);
  i
