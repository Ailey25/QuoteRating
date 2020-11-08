
const express = require('express');
const path = require('path');
const axios = require('axios');
const nlp = require('compromise');
const app = express(),
      bodyParser = require("body-parser");
      port = 3080;

const url = 'https://programming-quotes-api.herokuapp.com';

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../Frontend/build')));

/* Currently, saving all quotes in an array of objects instead of database */
let quotes = [];
axios.get(`${url}/quotes`)
  .then(response => {
    if (response.status === 200) {
      quotes = response.data.map(data => {
        const doc = nlp(data.en);
        const topics = doc.topics().json();
        const nouns = doc.nouns().out('array');

        return {
          id: data.id,
          en: data.en,
          author: data.author,
          nouns,
        };
      });
    }
  }).catch(error => {
    console.log('get all quotes error', error);
  });

app.get('/api/random', (req, res) => {
  getRandomQuote()
    .then(data => res.json(data))
    .catch(err => res.json(err));
});

app.post('/api/rate', (req, res) => {
  const request = {
    quoteId: req.body.quoteId,
    newVote: req.body.vote
  };

  if (req.body.vote >= 4) {
    const quoteId = req.body.quoteId;
    const quote = quotes.find(x => x.id === quoteId);

    res.json(getRandomSimilarQuote(quoteId));
  } else {
    getRandomQuote()
      .then(data => res.json(data))
      .catch(err => res.json(err));
  }
});

function getRandomSimilarQuote(originalQuoteId) {
  const originalQuote = quotes.find(x => x.id === originalQuoteId);

  for(const quote of quotes) {
    if (originalQuoteId !== quote.id) {
      quote.similarity = calculateQuoteSimilarity(originalQuote, quote);
    } else {
      quote.similarity = -1;
    }
  }

  const descendingQuotes = quotes.sort((a, b) => b.similarity - a.similarity);
  let similarQuotes = [];
  for(const quote of descendingQuotes) {
      if (quote.similarity < descendingQuotes[0].similarity) {
        break;
      } else {
        similarQuotes = [...similarQuotes, quote];
      }
  }

  const randomSimilarQuote = similarQuotes[getRandomArrayIndex(similarQuotes)];
  return randomSimilarQuote;
}

function getSimilarTags(tags1, tags2) {
  return tags1.filter(elem1 => tags2.indexOf(elem1) >= 0);
}

function calculateQuoteSimilarity(quote1, quote2) {
  const tags1 = quote1.nouns;
  const tags2 = quote2.nouns;

  let similarity = getSimilarTags(tags1, tags2).length;
  if (quote1.author === quote2.author) {
    similarity += 1;
  }
  return similarity;
}

function getRandomArrayIndex(array) {
  const max = array.length - 1;
  const min = 0;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomQuote() {
  return axios.get(`${url}/quotes/random`)
      .then(response => {
        if (response.status === 200) {
          return response.data;
        }
      }).catch(error => {
        return error;
      });
}

app.listen(port, () => {
    console.log(`Server listening on the port::${port}`);
});
