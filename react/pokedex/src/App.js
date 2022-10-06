import logo from "./logo.svg";
import "./App.css";
import React from "react";

import Home from "./pages/main";
import Favorites from "./pages/favorites";
import { NavBar } from "./components/navBar";

/**
 * initialise contexts 
 */
const View = React.createContext(null);
const Page = React.createContext(null);
const Filter = React.createContext(null);
const Search = React.createContext(null);

function App() {
  const [view, setView] = React.useState(Number(0));
  const [page, setPage] = React.useState(Number(0));
  const [filter, setFilter] = React.useState('');
  const [search, setSearch] = React.useState('');

  let display = null;
  /**
   * This switches dynamic pages. 
   * This is replacement of Router.
   */
  if (page === 0) {
    /**
     * goes to the "All pokemon" page
     */
    display = <Home />;
  }
  if (page === 1) {
    /**
     * goes to the "favorite pokemon" page
     */
    display = <Favorites />;
  }
  return (
    <>
      <Filter.Provider value={[filter, setFilter]}>
        <Search.Provider value={[search, setSearch]}>
          <View.Provider value={[view, setView]}>
            <Page.Provider value={[page, setPage]}>
              <NavBar filter={setFilter} search={setSearch}/>
              {display}
            </Page.Provider>
          </View.Provider>
        </Search.Provider>
      </Filter.Provider>
    </>
  );
}

export { App, Page, View, Filter, Search };
