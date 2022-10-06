import React from "react";
import "./popup.css";
import { query_single } from "../functions/queries";
import { BigCardItem } from "./bigCardItem";
import { CardItem } from "./cardItem";

/**
 *
 * @description builds popup page for single pokemon
 * @param {Integer} props
 * @returns {React.Popup} Popup
 */
export default function Popup(props) {
  let [data, setData] = React.useState(null);
  let [evolShow,setEvolShow] = React.useState(false);
  const q = `
    query getPokemon($id: ID!) {
        pokemonById(id:$id) {
          id,
          name,
          types,
          maxHP,
          maxCP,
          image,
          sound,
          isFavorite,
          weight{
              maximum,
              minimum
          },
          height{
              maximum,
              minimum,
          },
          evolutions {
              id,
              name,
              image,
              isFavorite,
          }
        }
    }
    `;

  React.useEffect(() => {
    let params = {
      id: props.id,
    };
    query_single(q, params, setData);
  }, [q, props.id]);

  function handleEvolutions(e) {
      if(evolShow) {
          setEvolShow(false);
      }
      else{
          setEvolShow(true);
      }
  }

  let ev = null;
  let evalButton = ''
  if (data && data.evolutions) {
      console.log(props.updateParent);
    ev = data.evolutions.map((evolution, index) => {
      return (
        <CardItem
          update={props.updateParent}
          id={evolution.id}
          miniText={evolution.name}
          img={evolution.image}
          isFavorite={evolution.isFavorite}
          key={"evolution_" + index}
        />
      );
    });
    let count = data.evolutions.length;
    if(count)
    evalButton = <button onClick={handleEvolutions} className="evalButton">Evolutions (<span style={{color:'red'}}>{count}</span>)</button>
  }
  return (
    <div className="popup">
      <div className="popup_open">
        <button onClick={props.close} className="x_button">
          X
        </button>
        {evalButton}
        {data ? (
          <> 
             {evolShow?<div className="evolutions">{ev} </div>:''}
            <BigCardItem
              update={props.update}
              id={data.id}
              sound={data.sound}
              title={data.name}
              img={data.image}
              isFavorite={data.isFavorite}
              CP={data.maxCP}
              HP={data.maxHP}
              types={data.types}
              weight={data.weight}
              height={data.height}
            />
          </>
        ) : (
          ""
        )}
      </div>
      :
    </div>
  );
}
