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
  if (match) return match[1];

  // 형태 3) @handle 입력
  let keyword = input.replace("https://www.youtube.com/", "").trim();

  // 검색 실행 (프록시로 호출)
  const searchPath = `/youtube/v3/search?part=snippet&type=channel&q=${encodeURIComponent(keyword)}&key=${apiKey}`;
  const data = await googleAPI(searchPath);

  if (!data.items || data.items.length === 0) {
    throw new Error("채널을 찾을 수 없습니다. URL 또는 @handle을 확인하세요.");
  }

  return data.items[0].snippet.channelId;
}


// ---- 채널 정보 + 최신 영상 받아오기 ----
async function fetchYouTubeData(channelId, apiKey) {

  const statsPath =
    `/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${apiKey}`;

  const videosPath =
    `/youtube/v3/search?part=snippet&channelId=${channelId}&order=date&type=video&maxResults=10&key=${apiKey}`;

  const channelData = await googleAPI(statsPath);
  const videosData = await googleAPI(videosPath);

  return {
    channel: channelData.items ? channelData.items[0] : null,
    videos: videosData.items || []
  };
}
