import fetch from 'node-fetch';
import { Router } from 'express';


const replicationRouter = Router();

replicationRouter.get('/ping', (req, res) => {
    console.log('ping replication')
    res.send('ping')
  })

replicationRouter.get('/dictionary', async (req, res) => {
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

        console.log(word);
        res.send(word);
    } catch (error) {
        console.error(error.message);
    }
})

replicationRouter.get('/spaceflight_news', async (req, res) => {
    const url = "https://api.spaceflightnewsapi.net/v4/articles/?limit=5";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        const titles = json.results.map(news => news.title);

        console.log(titles);
        res.send(titles)
    } catch (error) {
        console.error(error.message);
    }
})

replicationRouter.get('/quote', async (req, res) => {
    const url = "https://uselessfacts.jsph.pl/api/v2/facts/random";
    try {
        const response = await fetch(url);
        if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        console.log(json);
        res.send(json)
    } catch (error) {
        console.error(error.message);
    }
})


export default replicationRouter;