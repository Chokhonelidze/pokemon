const server = process.env.REACT_APP_SERVER ? process.env.REACT_APP_SERVER :"http://localhost:4000/graphql";
/**
 * @description function is used to get pockemons from database.
 * @param {String} q 
 * @param {Array} values 
 * @param {Function} callback 
 * @returns {Array} pokemons
 */
export async function query(q,values,callback) {
    await fetch(server, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          query: q,
          variables: values,
        }),
      })
        .then((res) => res.json())
        .then((info, err) => {
             if(!err) {
               callback(info.data.pokemons.edges);
             }
             else {
                 console.log(err);
             }
        });
}
/**
 * 
 * @description function is used to get single pokemon from database
 * @param {String} q 
 * @param {Array} values 
 * @param {Function} callback 
 * @returns {Object} pokemon
 */
export async function query_single(q,values,callback) {
    await fetch(server, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          query: q,
          variables: values,
        }),
      })
        .then((res) => res.json())
        .then((info, err) => {
             if(!err) {
                 if(info){
                    callback(info.data.pokemonById);
                 }
             }
             else {
                 console.log(err);
             }
        });
}