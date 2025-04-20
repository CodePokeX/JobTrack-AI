// services/jobSearch.js
const axios = require('axios');

const searchJobs = async (query, location = '', page = 1) => {
  const options = {
    method: 'GET',
    url: 'https://jsearch.p.rapidapi.com/search',
    params: {
      query: query,
      page: page.toString(),
      num_pages: '1',
      location: location,
    },
    headers: {
      'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
      'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options);
    return response.data.data;
  } catch (error) {
    console.error('JSearch API error:', error.message);
    return [];
  }
};

module.exports = { searchJobs };
