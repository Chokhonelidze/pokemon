export const types = `
type Attack {
    name: String!
    type: String!
    damage: Int!
}

type Pokemon {
    id: ID!
    number: Int!
    name: String!
    weight: PokemonDimension!
    height: PokemonDimension!
    classification: String!
    types: [String!]!
    resistant: [String!]!
    attacks: PokemonAttack!
    weaknesses: [String!]!
    fleeRate: Float!
    maxCP: Int!
    evolutions: [Pokemon!]!
    evolutionRequirements: PokemonEvolutionRequirement
    maxHP: Int!
    image: String!
    sound: String!
    isFavorite: Boolean!
}

type PokemonConnection {
    limit: Int!
    offset: Int!
    count: Int!
    edges: [Pokemon!]!
}

input PokemonsQueryInput {
    limit: Int = 10
    offset: Int = 0
    search: String
    filter: PokemonFilterInput
}

input PokemonFilterInput {
    type: String
    isFavorite: Boolean
}

type PokemonAttack {
    fast: [Attack!]!
    special: [Attack!]!
}

type PokemonDimension {
    minimum: String!
    maximum: String!
}

type PokemonEvolutionRequirement {
    amount: Int!
    name: String!
}
`;
export const queries = `
    pokemons(query: PokemonsQueryInput!): PokemonConnection!
    pokemonByName(name: String!): Pokemon
    pokemonById(id: ID!): Pokemon
    pokemonTypes: [String!]!
`;

export const mutations = `
    favoritePokemon(id: ID!): Pokemon
    unFavoritePokemon(id: ID!): Pokemon
`;