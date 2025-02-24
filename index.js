import axios from 'axios';

const API_KEY = 'b600d64e1cmsh5e8caec07d76e2bp16d2e6jsnbad9153ff452';
const API_HOST = 'youtube138.p.rapidapi.com';

async function getChannelVideos(channelName) {
  try {
    // Step 1: Fetch the Channel ID
    const searchResponse = await axios.get('https://youtube138.p.rapidapi.com/search/', {
      params: { q: channelName, hl: 'en', gl: 'US' },
      headers: { 'x-rapidapi-key': API_KEY, 'x-rapidapi-host': API_HOST }
    });

    // Extract Channel ID
    const firstContent = searchResponse.data.contents.find(item => item.video?.author?.channelId);
    if (!firstContent) throw new Error('Channel ID not found in search results');

    const channelId = firstContent.video.author.channelId;
    console.log("Channel ID:", channelId);

    // Step 2: Fetch Latest Videos
    const videosResponse = await axios.get('https://youtube138.p.rapidapi.com/channel/videos/', {
      params: { id: channelId, filter: 'videos_latest', hl: 'en', gl: 'US' },
      headers: { 'x-rapidapi-key': API_KEY, 'x-rapidapi-host': API_HOST }
    });

    // Extract Video IDs and basic info (title & thumbnail)
    const videos = videosResponse.data.contents
      .filter(video => video.video) // Ensure valid video objects
      .map(video => ({
        videoId: video.video.videoId,
        title: video.video.title,
        thumbnail: video.video.thumbnails[0].url
      }));

    // Step 3: Fetch Video Details (description and channel name)
    for (let vid of videos) {
      try {
        const videoDetailsResponse = await axios.get('https://youtube138.p.rapidapi.com/video/details/', {
          params: { id: vid.videoId, hl: 'en', gl: 'US' },
          headers: { 'x-rapidapi-key': API_KEY, 'x-rapidapi-host': API_HOST }
        });

        vid.description = videoDetailsResponse.data.description;
        vid.channelName = videoDetailsResponse.data.author.title;
      } catch (err) {
        console.error(`Error fetching details for video ${vid.videoId}:`, err.message);
      }
    }

    console.log("Final Video Data:", videos);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

// Call function with desired channel name
getChannelVideos('Varun Mayya');
