<template>
  <div id="random-quote">
    <b-button variant="outline-primary" @click="fetchRandomQuote">
      Generate Random Quote
    </b-button>
    <h2>{{ quote.text }}</h2>
    <b-form-rating
      v-model="quote.rating"
      variant="primary"
      class="mb-2"
    />
    <div class="buttonGroup">
      <b-button variant="outline-danger" @click="clearRating">
        Clear
      </b-button>
      <b-button variant="primary" @click="postQuoteRating">
        Submit
      </b-button>
    </div>
    <h4 v-if="newQuote.text && quote.rating >=4">
      Since you liked the previous quote, here's another similar one: {{ newQuote.text }}
    </h4>
    <h4 v-else-if="newQuote.text && quote.rating">
      Since you didn't like the previous quote, here's a new one: {{ newQuote.text }}
    </h4>
  </div>
</template>

<script>
export default {
  name: 'RandomQuote',
  props: {
    msg: String
  },
  data() {
    return {
      quote: {
        id: "",
        text: "",
        rating: null
      },
      newQuote: {
        text: ""
      }
    }
  },
  methods: {
    clearRating() {
      this.quote.rating = null
    },
    fetchRandomQuote () {
      fetch('/api/random')
        .then(response => response.json())
        .then(response => {
          console.log('random quote', response);
          this.quote.id = response.id
          this.quote.text = response.en
        }).catch(error => {
          this.quote.text = `Quote could not be fetched: ${error}`
        })
    },
    postQuoteRating () {
      console.log('rating: ', this.quote.rating, this.quote.id)

      const request = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quoteId: this.quote.id,
          vote: this.quote.rating
        })
      }
      fetch('/api/rate', request)
        .then(response => response.json())
        .then(response => {
          console.log('random quote', response, response.en);
          this.newQuote.text = response.en
        })
        .catch(error => {
          console.log('error in api/rate', error)
        })
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.buttonGroup {
  display: flex;
  justify-content: space-evenly;
}
</style>
