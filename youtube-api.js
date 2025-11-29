// 채널 URL or @handle → channelId 변환
async function getChannelId(input, apiKey) {
  // 채널 ID 직접 입력한 경우 (UC로 시작)
  if (input.startsWith("UC")) {
    return input;
  }

  // search API로 채널 찾기
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${encodeURIComponent(input)}&key=${apiKey}`;

  const response = await fetch(url);
  const data = await response.json();

  if (!data.items || data.items.length === 0) {
    throw new Error("채널을 찾을 수 없습니다. URL 또는 @handle을 확인하세요.");
  }

  return data.items[0].snippet.channelId;
}


// 채널 정보 + 최신 영상 가져오기
async function fetchYouTubeData(channelId, apiKey) {
  const statsUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${apiKey}`;

  const videosUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&order=date&type=video&maxResults=10&key=${apiKey}`;

  const statsRes = await fetch(statsUrl);
  const videosRes = await fetch(videosUrl);

  const statsData = await statsRes.json();
  const videosData = await videosRes.json();

  return {
    channel: statsData.items ? statsData.items[0] : null,
    videos: videosData.items || []
  };
}
