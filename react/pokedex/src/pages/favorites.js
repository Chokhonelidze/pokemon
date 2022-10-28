import React from "react";
import { View, Filter, Search } from "../App";
import { NormalView, ListView } from "../components/viewGenerator";
import Loading from "../components/loading";
import { query } from "../functions/queries";

/**
 *
 * @description selects favorite pokemons from the database
 * @returns {React.NormalView,React.ListView} NormalView and ListView
 */
function Favorites() {
  const [isLoading, setLoading] = React.useState(true);
  const [data, setData] = React.useState(null);
  const [style, setStyle] = React.useContext(View);
  const [isUpdated, setUpdated] = React.useState(false);
  const [filter, setFilter] = React.useContext(Filter);
  const [search, setSearch] = React.useContext(Search);
  /**
   * loads favorite data from database.
   * @param limit: Integer
   * @param offset: Integer
   * @param type: String
   * @param search: String
   * @param isFavorite:Boolean
   * @returns {data} pokemons
   */
  const q = `query getPokemons($limit : Int, $offset : Int,$isFavorite:Boolean!,$type : String, $search: String) {
      pokemons(query:{limit:$limit,offset:$offset,filter:{isFavorite:$isFavorite,type:$type},search:$search}) {
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
   /**
    * pulls first 1000 records on update
    */
  const update = React.useCallback(async () => {
    let params = {
      isFavorite: true,
      type: filter,
      search: search,
      limit: 1000,
      offset: 0
    };
    setData(null);
    query(q, params, setData);
    setLoading(false);
  }, [q, search, filter]);
  React.useEffect(() => {
    update();
  }, [filter, search]);
  let view = null;
  /**
   * variable style changes the layout of the page.
   * if style is 0 it will load greed layout.
   * if style is 1 it will load list layout.
   */
  if (isLoading) {
    view = <Loading />;
  } else if (style === 0) {
    if (data) {
      view = <NormalView data={data} />;
    }
  } else if (style === 1) {
    view = <ListView data={data} />;
  }
  return <>{view}</>;
}
export default Favorites;
