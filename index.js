const axios = require('axios');
const RSS = require('rss');
require('dotenv').config();

class YouTubeRSS {
  constructor() {
    this.apis = [
      {
        name: 'youtube-v3',
        url: 'https://youtube-v31.p.rapidapi.com/search',
        headers: {
          'X-RapidAPI-Key': process.env.RAPIDAPI_KEY1,
          'X-RapidAPI-Host': 'youtube-v31.p.rapidapi.com'
        }
      },
      // Add more API configurations
    ];
    this.currentApiIndex = 0;
  }

  async getChannelVideos(channelName) {
    for (let i = 0; i < this.apis.length; i++) {
      try {
        const api = this.apis[this.currentApiIndex];
        const response = await axios.get(api.url, {
          params: {
            channelId: await this.getChannelId(channelName),
            part: 'snippet,id',
            order: 'date',
            maxResults: 50
          },
          headers: api.headers
        });
        return response.data.items;
      } catch (error) {
        console.error(`API ${api.name} failed, trying next...`);
        this.currentApiIndex = (this.currentApiIndex + 1) % this.apis.length;
      }
    }
    throw new Error('All APIs failed');
  }

  async getChannelId(channelName) {
    const api = this.apis[this.currentApiIndex];
    try {
      const response = await axios.get('https://www.googleapis.com/youtube/v3/channels', {
        params: {
          forUsername: channelName,
          part: 'id',
          key: process.env.YOUTUBE_API_KEY
        }
      });
      if (response.data.items.length > 0) {
        return response.data.items[0].id;
      } else {
        throw new Error('Channel not found');
      }
    } catch (error) {
      console.error('Failed to fetch channel ID:', error.message);
      throw error;
    }
  }

  async generateRSS(channelName) {
    const items = await this.getChannelVideos(channelName);
    const feed = new RSS({
      title: `${channelName} YouTube Videos`,
      description: `Latest videos from ${channelName}`,
      feed_url: 'http://example.com/rss.xml',
      site_url: 'http://example.com'
    });

    items.forEach(item => {
      feed.item({
        title: item.snippet.title,
        description: item.snippet.description,
        url: `https://youtube.com/watch?v=${item.id.videoId}`,
        date: item.snippet.publishedAt,
        enclosure: {
          url: item.snippet.thumbnails.high.url,
          type: 'image/jpeg'
        }
      });
    });

    return feed.xml();
  }
}

module.exports = YouTubeRSS;