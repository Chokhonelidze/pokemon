#!/usr/bin/env node
import { ApolloServer } from 'apollo-server-express';
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault
} from "apollo-server-core";
import express from 'express';
import * as fs from 'fs';
import * as _ from 'lodash';
import pokemonsData from './pokemons.json' assert {type:'json'}

const PORT = process.env.PORT || 4000;
const BASE_URL = ``;

const typeDefs = fs.readFileSync(`src/schema.graphql`, 'utf-8');
let favorites = new Map();

const app = express();
app.get('/sounds/:id', (req, res) => res.sendFile(`src/sounds/${req.params.id}.mp3`));

const resolvers = {
  Query: {
    pokemons: (__, args) => {
      const { limit, offset, search, filter } = args.query;
      let pokemons = pokemonsData;

      if (search) {
        const regex = new RegExp(search, 'i');
        pokemons = _.filter(pokemons, p => p.name.match(regex));
      }

      if (filter) {
        if (filter.type) {
          const regex = new RegExp(filter.type, 'i');
          pokemons = _.filter(pokemons,p => _.some(p.types, t => t.match(regex)));
        }

        if (filter.isFavorite) {
          pokemons = _.filter(pokemons, p => !!favorites.get(p.id));
        }
      }

      const count = pokemons.length;
      const edges = pokemons.slice(offset, offset + limit);

      return {
        limit,
        offset,
        count,
        edges
      }
    },
    pokemonById: (_, args) => pokemonsData.find(pokemon => pokemon.id === args.id),
    pokemonByName: (_, args ) => pokemonsData.find(pokemon => pokemon.name.toLowerCase() === args.name.toLowerCase()),
    pokemonTypes: () => _.uniq(_.flatMap(pokemonsData, pokemon => pokemon.types))
  },
  Mutation: {
    favoritePokemon: (_, args) => {
      const pokemon = pokemonsData.find(pokemon => pokemon.id === args.id);
      if (!pokemon) throw Error("Pokemon not found");
      favorites.set(args.id, true);
      return pokemon;
    },
    unFavoritePokemon: (_, args) => {
      const pokemon = pokemonsData.find(pokemon => pokemon.id === args.id);
      if (!pokemon) throw Error("Pokemon not found");
      favorites.set(args.id, false);
      return pokemon;
    }
  },
  Pokemon: {
    number: pokemon => parseInt(pokemon.id, 10),
    image: pokemon => `https://img.pokemondb.net/artwork/${pokemon.name.toLowerCase().replace(/[&\\/\\\\#,+()$~%.'":*?<>{}]/g, '').replace(' ', '-')}.jpg`,
    sound: pokemon => `${BASE_URL}/sounds/${parseInt(pokemon.id, 10)}`,
    evolutions: pokemon => _.map(pokemon.evolutions || [], ev => ({...ev, id: _.padStart(ev.id, 3, '0')})),
    isFavorite: pokemon => !!favorites.get(pokemon.id)
  },
  PokemonAttack: {
    fast: pokemonAttack => pokemonAttack.fast || [],
    special: pokemonAttack => pokemonAttack.special || []
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  csrfPrevention: true,  // see below for more about this
  cache: "bounded",
  cors: {
    origin: ["https://chokhonelidze.github.io"]
  },
  plugins: [
    ApolloServerPluginLandingPageLocalDefault({ embed: true }),
  ],
});
const corsOptions = {
  origin: ["https://chokhonelidze.github.io"]
};
server.applyMiddleware({ app, cors: corsOptions, path: "/graphql" });

app.listen({ port: PORT }, () => {
  console.log(`🚀  Pokemon GraphQL server running at ${BASE_URL}${server.graphqlPath}`);
});
