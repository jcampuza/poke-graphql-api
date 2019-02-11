const { readAllPokemonToMemory } = require("./load-pokemon");
const { ApolloServer, gql } = require("apollo-server");
const PokemonService = require("./services/pokemon");

const typeDefs = gql`
  enum TypeEnum {
    normal
    fire
    fighting
    water
    flying
    grass
    poison
    electric
    ground
    psychic
    rock
    ice
    bug
    dragon
    ghost
    dark
    steel
    fairy
  }

  type SpriteMap {
    back_default: String
    back_female: String
    back_shiny: String
    back_shiny_female: String
    front_default: String
    front_female: String
    front_shiny: String
    front_shiny_female: String
  }

  type PokemonType {
    slot: Int!
    type: PokemonTypeResource
  }

  type PokemonTypeResource {
    name: TypeEnum!
    url: String!
  }

  type Pokemon {
    id: ID!
    name: String!
    weight: Int!
    types: [PokemonType]
    sprites: SpriteMap
  }

  type Query {
    pokemon(limit: Int, offset: Int, types: [TypeEnum!]): [Pokemon]
  }
`;

const resolvers = {
  Query: {
    pokemon: (root, args, { pokemonService }) => {
      const { limit, offset, types } = args;
      return pokemonService.getAll({ limit, offset, types });
    }
  }
};

async function start() {
  const pokemon = await readAllPokemonToMemory();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
    playground: true,
    context: () => ({ pokemonService: new PokemonService(pokemon) })
  });

  const { url } = await server.listen({ port: process.env.PORT || 4000 });
  console.log(`server running  at ${url}`);

  return server;
}

start();
