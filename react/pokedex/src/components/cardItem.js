import React from "react";
import "./cardItem.css";
import { getColor } from "../functions/getColors";
import Popup from "./popup";
const server = "http://localhost:4000/graphql";
/**
 *
 * @description builds pokemon card item
 * @param {data} props
 * @returns {React.CardItem} CardItem
 */
export function CardItem(props) {
  console.log(props);
  const [favorite, setFavorite] = React.useState(props.favorite);
  const [showPopup, setPopup] = React.useState(false);

  /**
   * @description refreshes parent elements.
   */
  function refreshAll() {
    setFavorite(!favorite);
    if (props.update) props.update();
  }

  /**
   *
   * makes pokemon favorite
   * @param {*} e
   */
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
          if (props.update) props.update();
        } else {
          console.log(error.message);
        }
      });
  }
  /**
   *
   * unfavorites pokemon
   * @param {} e
   */
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
          if (props.update) props.update();
        } else {
          console.log(error.message);
        }
      });
  }
  /**
   *
   * @param {type} param0
   * @returns h6 element with specific color.
   */
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
      <div className="card pokemon" key={props.id}>
        <img
          className="card-img-top"
          src={props.img}
          alt="Card"
          draggable="false"
          onClick={() => {
            setPopup(true);
          }}
        />
        <hr></hr>
        <div className="card-body">
          <h5
            className="card-title"
            onClick={() => {
              setPopup(true);
            }}
          >
            {props.title}
          </h5>
          <div className="card-text">
            <HandleTypes types={props.text} />
            {props.miniText?props.miniText :''}
            {favorite ? (
              <button onClick={unFavorite} value={props.id}>
                ❤️
              </button>
            ) : (
              <button onClick={makeFavorite} value={props.id}>
                💔
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
