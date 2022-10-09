
import pokemonsData from '../src/pokemons.json' assert { type: 'json' };
//import { indexes } from "../models/indexes.json";
let favorites = new Map();

export const query = {
  pokemons: (_, args) => {
    const { limit, offset, search, filter } = args.query;
    let pokemons = pokemonsData;
    if (search) {
      const regex = new RegExp(search, "i");
      pokemons = pokemons.filter((p) => {
        return p.name.match(regex);
      });
    }
    if (filter) {
      if (filter.type) {
        const regex = new RegExp(filter.type, "i");
        pokemons = pokemons.filter((p) => {
          return p.types.match(regex);
        });
      }
      if (filter.isFavorite) {
        pokemons = pokemons.filter((p) => {
          return !!favorites.get(p.id);
        });
      }
    }
    const count = pokemons.length;
    const edges = pokemons.slice(offset, offset + limit);

    return {
      limit,
      offset,
      count,
      edges,
    };
  },
  pokemonById: (_, args) =>
    pokemonsData.find((pokemon) => pokemon.id === args.id),
  pokemonByName: (_, args) =>
    pokemonsData.find(
      (pokemon) => pokemon.name.toLowerCase() === args.name.toLowerCase()
    ),
  pokemonTypes: (_, args) => {
    let data = pokemonsData.flatMap((s) => s.types);
    return data.filter((value, index, self) => {
      return self.indexOf(value) === index;
    });
  },
};
export const mutation = {
    favoritePokemon: (_, args) => {
        const pokemon = pokemonsData.find((pokemon) => pokemon.id === args.id);
        if (!pokemon) throw Error("Pokemon not found");
        favorites.set(args.id, true);
        return pokemon;
      },
      unFavoritePokemon: (_, args) => {
        const pokemon = pokemonsData.find((pokemon) => pokemon.id === args.id);
        if (!pokemon) throw Error("Pokemon not found");
        favorites.set(args.id, false);
        return pokemon;
      },
}
let BASE_URL = process.env.WEB_SERVER
? `${process.env.WEB_SERVER}`:"http://localhost:3000/pokemon"
export const objects = {
    Pokemon: {
        number: (pokemon) => parseInt(pokemon.id, 10),
        image: (pokemon) =>
          `https://img.pokemondb.net/artwork/${pokemon.name
            .toLowerCase()
            .replace(/[&\\/\\\\#,+()$~%.'":*?<>{}]/g, "")
            .replace(" ", "-")}.jpg`,
        sound: (pokemon) => `${BASE_URL}/sounds/${parseInt(pokemon.id, 10)}.mp3`,
        evolutions: (pokemon) =>{
          if(pokemon?.evolutions ){
          return pokemon.evolutions.map(  (ev) => ({
            ...ev,
            id:String(ev.id).padStart(3, "0"),
          }))
          
        }
        else return [];
        },
        isFavorite: (pokemon) => !!favorites.get(pokemon.id),
      },
      PokemonAttack: {
        fast: (pokemonAttack) => pokemonAttack.fast || [],
        special: (pokemonAttack) => pokemonAttack.special || [],
      },
}
