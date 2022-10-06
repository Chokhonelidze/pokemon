import React from "react";
import "./bigCardItem.css";
import { getColor } from "../functions/getColors";
const server = "http://localhost:4000/graphql"

/**
 * 
 * @description builds single view pockemon.
 * @param {data} props 
 * @returns {React.BigCardItem} BigCardItem
 */
export function BigCardItem(props) {
    const [favorite, setFavorite] = React.useState(props.isFavorite);
    /**
     * 
     * @description favorites pockemon and refrshes parent components.
     * @param {Event} e 
     * 
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
              if(props.update)props.update();
            } else {
              console.log(error.message);
            }
          });
      }
      /**
       * 
       * unfavorites pockemon and refreshes parents
       * @param {Event} e 
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
              if(props.update)props.update();
            } else {
              console.log(error.message);
            }
          });
      }
      /**
       * 
       * @param String type
       * @returns {h6} h6 element with a speicifc color
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
      <div className="evolutions">

      </div>
      <div className="card bigpokemon" key={"bigCard" + props.id}>
        <img
          className="card-img-top"
          src={props.img}
          alt="Big card cap"
          draggable="false"
        />
        <hr></hr>
        <div className="bigCard-body">
          <div className="bigCard-title">{props.title}</div>
          <div className="bigCard-types">
            <HandleTypes types={props.types} />
          </div>
          {favorite? (
              <button
                className="like_button big_like_button"
                onClick={unFavorite}
                value={props.id}
              >
                ❤️
              </button>
            ) : (
              <button
                className="like_button big_like_button "
                onClick={makeFavorite}
                value={props.id}
              >
                💔
              </button>
            )}
            <div className="progress-bar cardCP" aria-valuenow="100">100%</div>
            <div className="CP">CP: {props.CP}</div>
            <div className="progress-bar cardHP" aria-valuenow="100">100%</div>
            <div className="HP">HP: {props.HP}</div>
            <div className="WeightAndHeight">
                <div className="Wcontainer"><h4>Weight</h4><h6>{props.weight.minimum}-{props.weight.maximum}</h6></div>
                <div className="Wcontainer"><h4>Height</h4><h6>{props.height.minimum}-{props.height.maximum}</h6></div>

            </div>
            <div className="audio" onClick={()=>{
                const audio = new Audio(props.sound);
                audio.play();
            }}>🔊</div>
        
        
        </div>
      </div>
    </>
  );
}
