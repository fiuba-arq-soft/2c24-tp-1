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
    console.log(json);
    res.send(json)
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
    console.log(json);
    res.send(json)
} catch (error) {
    console.error(error.message);
}
})

replicationRouter.get('/quote', async (req, res) => {
const url = "https://api.quotable.io/quotes/random";
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