import fetch from 'node-fetch';
import { Router } from 'express';
import { createClient } from 'redis';

const cacheRouter = Router();

const redisClient = createClient({
    url: 'redis://redis:6379'
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

(async () => {
    try {
        await redisClient.connect();
        console.log('Redis connected');

        await redisClient.flushAll();
    } catch (err) {
        console.error('Redis connection error:', err);
    }
})();

const checkCache = async (req, res, next) => {
    const cacheKey = req.originalUrl;
    try {
        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) {
            console.log('Cache hit for:', cacheKey);
            return res.send(JSON.parse(cachedData));
        } else {
            console.log('Cache miss for:', cacheKey);
            next();
        }
    } catch (err) {
        console.error('Error checking cache:', err);
        res.status(500).send('Internal Server Error');
    }
};

cacheRouter.get('/ping', (req, res) => {
    console.log('ping cache');
    res.send('ping');
});

cacheRouter.get('/dictionary', checkCache, async (req, res) => {
    const url = "https://api.dictionaryapi.dev/api/v2/entries/en/" + req.query.word;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        const word = {
            'phonetics': json[0].phonetics,
            'meanings': json[0].meanings,
        };

        const cacheKey = req.originalUrl;
        const ttl = 3600;

        await redisClient.setEx(cacheKey, ttl, JSON.stringify(word));

        res.send(word);
    } catch (error) {
        console.error('Error fetching dictionary data:', error.message);
        res.status(500).send('Error fetching data');
    }
});

cacheRouter.get('/spaceflight_news', checkCache, async (req, res) => {
    const url = "https://api.spaceflightnewsapi.net/v4/articles/?limit=5";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        const titles = json.results.map(news => news.title);

        const cacheKey = req.originalUrl;
        const ttl = 3600;

        await redisClient.setEx(cacheKey, ttl, JSON.stringify(titles));

        res.send(titles);
    } catch (error) {
        console.error('Error fetching spaceflight news:', error.message);
        res.status(500).send('Error fetching data');
    }
});

cacheRouter.get('/quote', checkCache, async (req, res) => {
    const url = "https://uselessfacts.jsph.pl/api/v2/facts/random";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        const cacheKey = req.originalUrl;
        const ttl = 3600;

        await redisClient.setEx(cacheKey, ttl, JSON.stringify(json));

        res.send(json);
    } catch (error) {
        console.error('Error fetching quote:', error.message);
        res.status(500).send('Error fetching data');
    }
});

export default cacheRouter;