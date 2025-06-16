const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
const { URL } = require('url');

const app = express();
const PORT = 4000;

app.use(cors());

const makeAbsoluteUrl = (base, relative) => new URL(relative, base).href;

app.get('/scrape', async (req, res) => {
    const targetUrl = req.query.url;
    const keyword = req.query.keyword || '';

    if (!targetUrl) {
        return res.status(400).json({ error: 'Missing url parameter' });
    }

    try {
        const response = await axios.get(targetUrl);
        const html = response.data;
        const $ = cheerio.load(html);

        const newsItems = [];

        $('article, .news-item, .post, .story').each((i, elem) => {
            const title = $(elem).find('h1, h2, h3, .title').first().text().trim();
            const author = $(elem).find('.author, .byline, .writer').first().text().trim();
            const date = $(elem).find('time').attr('datetime') || $(elem).find('.date, .time').first().text().trim();
            const source = new URL(targetUrl).hostname;
            const link = $(elem).find('a').attr('href');
            const absoluteLink = link ? makeAbsoluteUrl(targetUrl, link) : '';

            if (title.toLowerCase().includes(keyword.toLowerCase())) {
                newsItems.push({
                    title,
                    author,
                    date,
                    source,
                    link: absoluteLink
                });
            }
        });

        res.json({ news: newsItems });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Scraping failed' });
    }
});

app.listen(PORT, () => {
    console.log('Server running on http://localhost:${PORT}');
});