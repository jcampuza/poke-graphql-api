const axios = require("axios");
const fs = require("fs");
const util = require("util");

function sleep(ms) {
  return new Promise(res => setTimeout(res, ms));
}

function createRateLimitedGet(client, ms, limit) {
  let count = 0;

  return async function(...args) {
    if (count === limit) {
      await sleep(ms);
      count = 0;
    }

    // wait on every request to be a little safe
    await sleep(ms / limit);
    return client.get(...args);
  };
}

const pokeClient = createRateLimitedGet(
  axios.create({
    baseURL: "https://pokeapi.co/api/v2/"
  }),
  60000,
  100
);

async function getAllPokemon() {
  const { data } = await pokeClient("pokemon", { params: { limit: 1000 } });

  return data;
}

// Catch individual pokemon errors, but don't stop the process.
async function getPokemon(name) {
  try {
    const { data } = await pokeClient(`pokemon/${name}`);
    fs.writeFileSync(
      `src/files/pokemon-${name}.json`,
      JSON.stringify(data, null, 4)
    );

    return data;
  } catch (err) {
    console.error("fetching pokemon ${name} failed 😢");
  }
}

async function scrape() {
  const allPokemon = await getAllPokemon();

  const results = allPokemon.results;
  const errors = [];

  // Have fun waiting :) You could probably make the wait time between requests smaller,
  // but it's a good idea to be nice to free open api's. This took me ~25-30 minutes
  // if I remember correctly
  for (const pokemonResult of results) {
    await getPokemon(pokemonResult.name);
  }

  console.log("Thanks for waiting 🙂");
}

try {
  console.log("Beginning scrape of pokeApi");
  scrape();
} catch (err) {
  console.log(err);
}
