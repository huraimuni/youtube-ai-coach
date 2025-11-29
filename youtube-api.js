// 사용 가능한 공개 프록시 서버
const PROXY = "https://yt-api-proxy.vercel.app/youtube/v3";

// 채널 URL / @handle / channelId 등 어떤 입력이든 처리
async function getChannelId(input, apiKey) {

  // 1) 이미 UC로 시작하는 channelId인 경우
  if (input.startsWith("UC")) {
    return input;
  }

  // 2) /channel/ UCxxx 형태에서 ID 추출
  const match = input.match(/channel\/(UC[\w-]+)/);
  if (match) return match[1];

  // 3) handle (@example) 정리
  let keyword = input.replace("https://www.youtube.com/", "").trim();

  // 검색 API (프록시 사용)
  const url = `${PROXY}/search?part=snippet&type=channel&q=${encodeURIComponent(keyword)}&key=${apiKey}`;

  const res = await fetch(url);
  const data = await res.json();

  if (!data.items || data.items.length === 0) {
    throw new Error("채널을 찾을 수 없습니다. URL 또는 @handle을 확인하세요.");
  }

  return data.items[0].snippet.channelId;
}


// 채널 기본정보 + 최신 영상 가져오기
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
