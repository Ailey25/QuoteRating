
const express = require('express');
const path = require('path');
const app = express(),
      bodyParser = require("body-parser");
      port = 3080;
const axios = require('axios');

const url = 'https://programming-quotes-api.herokuapp.com';

let quotes = [];

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../Frontend/build')));

app.get('/api/random', (req, res) => {
  getRandomQuote()
    .then(data => res.json(data))
    .catch(err => res.json(err))
});

app.get('/api/all', (req, res) => {
  axios.get(`${url}/quotes`)
    .then(response => {
      if (response.status === 200) {
        quotes = response.data.map(data => ({
          en: data.en,
          author: data.author
        }));
        res.json(quotes)
      }
    }).catch(error => {
      console.log('get all quotes error', error)
      res.json(error);
    });
});

app.post('/api/rate', (req, res) => {
  const request = {
    quoteId: req.body.quoteId,
    newVote: req.body.vote
  }
  if (req.body.vote >= 4) {
    res.json(req.body.vote + 'HIGH VOTE: PLACEHOLDER')
  } else {
    getRandomQuote()
      .then(data => res.json(data))
      .catch(err => res.json(err))
  }
});

function getRandomQuote() {
  return axios.get(`${url}/quotes/random`)
      .then(response => {
        if (response.status === 200) {
          return response.data
        }
      }).catch(error => {
        return error
      });
}

app.listen(port, () => {
    console.log(`Server listening on the port::${port}`);
});
