class PokemonService {
  constructor(allPokemon) {
    this.pokemon = allPokemon
      .slice()
      .sort((a, b) => parseInt(a.id) - parseInt(b.id));
  }

  getAll({ limit = 20, offset = 0, types = [] }) {
    let res = this.pokemon;

    if (types.length) {
      res = res.filter(pokemon => {
        return pokemon.types.some(type => types.includes(type.type.name));
      });
    }

    return res.slice(offset, offset + limit);
  }

  getById(id) {
    return this.pokemon.find(pokemon => pokemon.id === id);
  }
}

module.exports = PokemonService;
