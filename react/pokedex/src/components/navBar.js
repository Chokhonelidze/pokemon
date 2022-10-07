import React from "react";
import "./navBar.css";
import { View, Page,Search } from "../App";
import { Dropdown } from 'react-dropdown-now';
import { getColor } from "../functions/getColors";
import 'react-dropdown-now/style.css';
const server = process.env.REACT_APP_SERVER ? process.env.REACT_APP_SERVER :"http://localhost:4000/graphql";
/**
 * 
 * @description builds menu search and dropdown elements.
 * @param {filter} props 
 * @returns {React.NavBar} NavBar
 */
export function NavBar(props) {
  const [view, setView] = React.useContext(View);
  const [page, setPage] = React.useContext(Page);
  let clickHandler = (e) => {
    setPage(Number(e.target.value));
  };
  let viewHandler = (e) => {
    setView(Number(e.target.value));
  };
  let pageDisplay = null;
  let viewButtons = null;
  if (page === 0) {
    pageDisplay = (
      <>
        <button className="firstButton active" value="0" onClick={clickHandler}>
          ALL
        </button>
        <button className="secondButton" value="1" onClick={clickHandler}>
          Favorites
        </button>
      </>
    );
  } else {
    pageDisplay = (
      <>
        <button className="firstButton" value="0" onClick={clickHandler}>
          ALL
        </button>
        <button
          className="secondButton active"
          value="1"
          onClick={clickHandler}
        >
          Favorites
        </button>
      </>
    );
  }
  if (view === 1) {
    viewButtons = (
      <>
        <button value="0" onClick={viewHandler}>
          ⚅
        </button>
        <button value="1" onClick={viewHandler}>
          📋
        </button>
      </>
    );
  } else {
    viewButtons = (
      <>
        <button value="0" onClick={viewHandler}>
          ⚅
        </button>
        <button value="1" onClick={viewHandler}>
          📋
        </button>
      </>
    );
  }
  return (
    <div className="navBar">
      <div className="firstColumn">{pageDisplay}</div>
      <div className="secondColumn">
        <div className="search">{<FSearch filter={props.filter} />}</div>{" "}
        <div className="view">{viewButtons}</div>
      </div>
    </div>
  );
}
function FSearch(props) {
  const [dropdown,setDropdown] = React.useState('');
  const [search,setSearch] = React.useContext(Search);
  React.useEffect(()=>{
    let query = `  
    query {
      pokemonTypes
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
  .then((res, error) => {
    if (!error) {
      setDropdown(res.data.pokemonTypes);
    } else {
      console.log(error);
    }
  });
  },[]);
  let options =null;
  if(dropdown){
   options = dropdown.map((item,index)=>{
    let colors = getColor(item);
    let style = {
      color: `${colors}`,
    };
    let view = <h6 style={style}>{item}</h6>
    return {value:item, view:view, label:view}
  });
  let startOption  = {value:null,label:'All Types'}
  options = [startOption,...options];
  }
  let dp = <Dropdown placeholder="Type" className="searchDropdown" options={options} onChange={(value) => props.filter(value.value)}/>
  let input = <input type='text' placeholder="Search" value={search}  className='searchInput rdn-control' onChange={(e)=>{
    setSearch(e.target.value);
    e.preventDefault();
  }} />
  return <>{input}{dp}</>;
}
