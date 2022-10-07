//const { ApolloServer, gql } = require("apollo-server");
//const { restaurant } = require("./models/restaurant");
//const { indexes } = require("./models/indexes");
//const {dishes} = require("./models/dishes");
//const mongoose = require("mongoose");
import {ApolloServer,gql} from "apollo-server";
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault
} from "apollo-server-core";
import mongoose from "mongoose";
import * as Pokemons from "./schemas/Pokemons.js"
import * as PokemonsResolver from "./resolvers/Pokemons.js";
import {} from 'dotenv/config';
import  jwt from "jsonwebtoken";

const DB = process.env.DB
  ? process.env.DB
  : "mongodb://mongo:27017/app_development";

  const PORT = process.env.PORT || 4000;


const types = [];
const queries = [];
const mutations = [];
let resolverQueries = [];
let resolverMutations = [];
let objects = [];

const schemas = [
Pokemons,
];
const resolver = [
  PokemonsResolver,
];


schemas.forEach((item)=>{
  types.push(item.types);
  queries.push(item.queries);
  mutations.push(item.mutations);

});

resolver.forEach((item)=>{
  resolverQueries = {...resolverQueries,...item.query};
  resolverMutations = {...resolverMutations,...item.mutation};
  if(item?.objects){
    objects  = {...objects,...item?.objects};
  }
});
const typeDefs = gql`
  ${types.join('\n')}
  type Query {
    ${queries.join('\n')}
  }
  type Mutation {
    ${mutations.join('\n')}
  }
`;


const resolvers = {
  Query: 
    resolverQueries
  ,
  Mutation: resolverMutations,
  ...objects,
};
console.log(resolvers);

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs,
  resolvers,
  csrfPrevention: true,
  cache: "bounded",
  context:  async ({ req }) => {
    const authHeader = req.headers.authorization || '';
    const accessTokenSecret = 'somerandomaccesstoken';
    if(authHeader) {
      const sp = authHeader.split(' ');
      const loginUser= sp[0];
      const token = sp[1]; 
     return await jwt.verify(token, accessTokenSecret, (err, user) => {
        if (err) {
            return null;
        }
        return {user};
    });
    }

  }
});

// The `listen` method launches a web server.
mongoose.connect(DB, { useNewUrlParser: true }).then(() => {
  server.listen(PORT).then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });
});
