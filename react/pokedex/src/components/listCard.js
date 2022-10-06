import React from "react";
import "./listCard.css";
import { getColor } from "../functions/getColors";
import Popup from "./popup";
const server = process.env.REACT_APP_SERVER ? process.env.REACT_APP_SERVER:"http://localhost:4000/graphql";
/**
 * 
 * @description builds pokemon list items
 * @param {Object} props 
 * @returns {React.ListItem} ListItem
 */
export function ListItem(props) {
  const [favorite, setFavorite] = React.useState(props.favorite);
  const [showPopup, setPopup] = React.useState(false);
  function refreshAll() {
    setFavorite(!favorite);
    if (props.update) props.update();
  }

  async function makeFavorite(e) {
    const query = `
        mutation makeFavorite($id :ID!){
            favoritePokemon(id:$id){
              id
            }
          }
        `;
    let id = e.target.value;
    await fetch(server, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: query,
        variables: { id },
      }),
    })
      .then((res) => res.json())
      .then((data, error) => {
        if (!error) {
          setFavorite(true);
          props.update();
        } else {
          console.log(error.message);
        }
      });
  }
  async function unFavorite(e) {
    const query = `
    mutation unFavorite($id :ID!){
        unFavoritePokemon(id:$id){
          id
        }
      }
    `;
    let id = e.target.value;
    await fetch(server, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: query,
        variables: { id },
      }),
    })
      .then((res) => res.json())
      .then((data, error) => {
        if (!error) {
          setFavorite(false);
          props.update();
        } else {
          console.log(error.message);
        }
      });
  }
  function HandleTypes({ types }) {
    if (types) {
      let out = types.map((item, index) => {
        let colors = getColor(item);
        let style = {
          color: `${colors}`,
        };
        return (
          <h6 style={style} key={"image_" + index}>
            {item}
          </h6>
        );
      });
      return out;
    }
    return <></>;
  }
  return (
    <>
      {showPopup ? (
        <Popup
          id={props.id}
          close={() => {
            setPopup(false);
          }}
          update={refreshAll}
          updateParent = {props.update}
        />
      ) : (
        ""
      )}
      <div className="small_card pokemon" key={props.id}>
        <div
          style={{cursor:"pointer"}}
          onClick={() => {
            setPopup(true);
          }}
        >
          <img
            className="smalImage"
            src={props.img}
            alt="Card"
            draggable="false"
          />
          <div className="small-card-body">
            <h5 className="small-card-title">{props.title}</h5>
            <div className="card-text">
              <HandleTypes types={props.text} />
            </div>
          </div>
        </div>
        {favorite ? (
          <button className="like_button" onClick={unFavorite} value={props.id}>
            ❤️
          </button>
        ) : (
          <button
            className="like_button"
            onClick={makeFavorite}
            value={props.id}
          >
            💔
          </button>
        )}
      </div>
    </>
  );
}
