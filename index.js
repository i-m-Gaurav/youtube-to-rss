import axios from 'axios';

// Step 1: Fetch the channel ID
const searchOptions = {
  method: 'GET',
  url: 'https://youtube138.p.rapidapi.com/search/',
  params: { q: 'varun mayya', hl: 'en', gl: 'US' },
  headers: {
    'x-rapidapi-key': 'b600d64e1cmsh5e8caec07d76e2bp16d2e6jsnbad9153ff452',
    'x-rapidapi-host': 'youtube138.p.rapidapi.com'
  }
};

axios.request(searchOptions).then(function (response) {
  // Extract the channel ID from the search results
  const channelId = response.data.contents[1].video.author.channelId;
  console.log("Channel ID:", channelId);

  // Step 2: Fetch the list of videos for the channel
  const channelVideosOptions = {
    method: 'GET',
  url: 'https://youtube138.p.rapidapi.com/channel/videos/',
  params: {
    id: 'UCJ5v_MCY6GNUBTO8-D3XoAg', // Replace with the channel ID
    filter: 'videos_latest', // Filter for latest videos
    hl: 'en', // Language
    gl: 'US' // Region
  },
  headers: {
    'x-rapidapi-key': 'b600d64e1cmsh5e8caec07d76e2bp16d2e6jsnbad9153ff452',
    'x-rapidapi-host': 'youtube138.p.rapidapi.com'
  }
  };

  axios.request(channelVideosOptions).then(function (response) {
    // Extract the required video details
    const videos = response.data.contents.map(video => ({
      title: video
      // description: video.video.description,
      // thumbnail: video.video.thumbnails[0].url, // Use the first thumbnail
      // channelName: video.video.author.title
    }));

    console.log("Channel Videos:", videos);
  }).catch(function (error) {
    console.error("Error fetching channel videos:", error);
  });

}).catch(function (error) {
  console.error("Error fetching channel ID:", error);
});