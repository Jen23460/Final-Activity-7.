import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [url, setUrl] = useState('');
  const [keyword, setKeyword] = useState('');
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleScrape = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:4000/scrape', {
        params: { url, keyword }
      });
      setNews(response.data.news);
    } catch (error) {
      console.error('Scraping failed', error);
    }
    setLoading(false);
  };

  return (
    <div className="App">
      <h1>News Scraper</h1>
      <input
        type="text"
        placeholder="Target URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <input
        type="text"
        placeholder="Keyword (optional)"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
      <button onClick={handleScrape}>Scrape</button>

      {loading && <p>Loading...</p>}

      <ul>
        {news.map((item, index) => (
          <li key={index}>
            <h3>{item.title}</h3>
            <p>{item.author} - {item.date}</p>
            <p>Source: {item.source}</p>
            <a href={item.link} target="_blank" rel="noreferrer">Read more</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;