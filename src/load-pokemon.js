const glob = require("glob");
const path = require("path");
const { promisify } = require("util");
const fs = require("fs");

const readFile = promisify(fs.readFile);

function globAsync(pattern) {
  return new Promise((resolve, reject) => {
    glob(pattern, (err, res) => {
      if (err) reject(err);

      resolve(res);
    });
  });
}

function readPokemonFileJson(file) {
  return readFile(file, "utf-8").then(pokemonFile => JSON.parse(pokemonFile));
}

async function readAllPokemonToMemory() {
  const files = await globAsync(path.join(__dirname, "/files/*.json"));
  const pokemon = files.map(file => require(file));

  return pokemon;
}

module.exports = {
  readAllPokemonToMemory
};
