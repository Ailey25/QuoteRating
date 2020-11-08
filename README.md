# QuoteRating
A simple web page that generates a random quote and allows you to rate the quote on a scale of 1 to 5. If rating is 4 or above,  a 'similar' quote will be generated

`NodeJS` `Express` `Vue`

## To run the app
Both Backend and Frontend has their own node modules and start scripts. They'll need to be run in 2 termials

In terminal 1 (backend):

```cd Backend```

```npm run dev```

Backend should now be running on `http://localhost:3080`

In terminal 2 (frontend):

```cd Frontend```

```npm run serve```

Frontend should now be runnung on `http://localhost:8080/`


## Logic for finding a similar quote
All quotes are fetched and saved. The package `compromise` is used to parse out the nouns in a quote. When a quote has a high rating, the code goes through all the quotes and calculates a 'similarity score' based on how similar the extracted nouns are in the 2 phrases. An additional score is added for the same author. The quotes are then sorted in descending order of the scores. A random quote from the top scores is then selected
