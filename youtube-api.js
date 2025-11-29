const PROXY = "https://yt-api-proxy.vercel.app/youtube/v3";

async function getChannelId(input, apiKey) {
  // 1) channelId 직접 입력한 경우
  if (input.startsWith("UC")) {
    return input;
  }

  // 2) URL에서 channelId 추출
  const match = input.match(/channel\/(UC[\w-]+)/);
  if (match) return match[1];

  // 3) @handle 만 입력한 경우
  const clean = input.replace("https://www.youtube.com/", "").trim();

  // Proxy search API
  const url = `${PROXY}/search?part=snippet&type=channel&q=${encodeURIComponent(clean)}&key=${apiKey}`;

  const response = await fetch(url);
  const data = await response.json();

  if (!data.items || data.items.length === 0) {
    throw new Error("채널을 찾을 수 없습니다. URL 또는 @handle을 확인하세요.");
  }

  return data.items[0].snippet.channelId;
}

async function fetchYouTubeData(channelId, apiKey) {
  const statsUrl = `${PROXY}/channels?part=snippet,statistics&id=${channelId}&key=${apiKey}`;
  const videosUrl = `${PROXY}/search?part=snippet&channelId=${channelId}&order=date&type=video&maxResults=10&key=${apiKey}`;

  const statsRes = await fetch(statsUrl);
  const videosRes = await fetch(videosUrl);

  const statsData = await statsRes.json();
  const videosData = await videosRes.json();

  return {
    channel: statsData.items ? statsData.items[0] : null,
    videos: videosData.items || []
  };
}
