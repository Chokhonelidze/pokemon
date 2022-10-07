import React from "react";
import { Filter, Search, View } from "../App";
import { NormalView, ListView } from "../components/viewGenerator";
import { query } from "../functions/queries";

const server = process.env.REACT_APP_SERVER ? process.env.REACT_APP_SERVER :"http://localhost:4000/graphql";

/**
 * 
 * @description builds page with a specific view
 * @param {data} props 
 * @returns {React.NormalView,React.ListView} NormalView and ListView
 */
function Home(props) {
  const [count, setCount] = React.useState(0);
  const [data, setData] = React.useState(null);
  const [offset, setOffset] = React.useState(0);
  const [limit, setLimit] = React.useState(10);
  const [style, setStyle] = React.useContext(View);
  const [filter,setFilter] = React.useContext(Filter);
  const [search,setSearch] = React.useContext(Search);

  /**
   * 
   * database query specifically for this object.
   * @param limit: Integer
   * @param offset: Integer
   * @param type: String
   * @param search: String
   * @returns {data} pokemons
   */
  const q = `query getPokemons($limit : Int, $offset : Int,$type : String, $search : String) {
    pokemons(query:{limit:$limit,offset:$offset,filter:{type:$type},search:$search}) {
        edges {
            name,
            types,
            image,
            isFavorite,
            id
        }
    }
}
`;

  const loadMore = React.useCallback(() => {
    /**
     *  this is the callback function used for data load.
     */
    if (
      window.innerHeight + document.documentElement.scrollTop ===
      document.scrollingElement.scrollHeight
    ) {
      if (data && data.length > count) {
        return;
      }
      let newOfset = offset+10;
      let newLimit = limit;
     console.log(newLimit,newOfset);
     
    function mergeData(newData) {
      if(newData && newData.length >0) {
        setData([...data,...newData]);
        setOffset(newOfset);
      }
    }
    let parameters = {
      limit :newLimit,
      offset:newOfset,
      type:filter,
      search:search
    }
      query(q,parameters,mergeData);
    }
  }, [data, setData, count, limit,filter,offset,search,q]);

      /**
     * triggers by screen scrole.
     * loads 10 more pockemon
     */

  React.useEffect(() => {
    let query = `
      query {
        pokemons(query: { }){
          count
        }
      }
      `;
    fetch(server, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: query,
      }),
    })
      .then((res) => res.json())
      .then((data, error) => {
        if (!error) {
          if (data) {
            setCount(data.data.pokemons.count);
          }
        } else {
          console.log(error);
        }
      });
    window.addEventListener("scroll", loadMore);
    return () => {
      window.removeEventListener("scroll", loadMore);
    };
  }, [loadMore]);

  /**
   * Loads first 10 records
   */
  React.useEffect(() => {
   let params = {
     limit:10,
     offset:0,
     type:filter,
     search:search
   }
   query(q,params,setData);
  }, [filter,search,q]);

  let view = null;
  /**
   * variable style changes the layout of the page.
   * if style is 0 it will load greed layout.
   * if style is 1 it will load list layout.
   */
  if (style === 0) {
    if (data) {
      view = <NormalView data={data} />;
    }
  } else if (style === 1) {
    view = <ListView data={data}  />;
  }
  return <>{view}</>;
}

export default Home;
