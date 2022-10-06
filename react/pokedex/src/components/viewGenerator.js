import React from "react";
import { CardItem } from "./cardItem";
import { ListItem } from "./listCard";
import "./viewGenerator.css";

/**
 * 
 * @description generates grid view
 * @param {data} props 
 * @returns {React.NormalView} NormalView
 */
export function NormalView(props) {
  let display = null;
  if (props.data) {
    display = props.data.map((item, index) => {
      return (
        <CardItem
          img={item.image}
          title={item.name}
          text={item.types}
          id={item.id}
          key={index}
          favorite={item.isFavorite}
        />
      );
    });
  }

  return <div className="mid_container">{display}</div>;
}

/**
 * 
 * @description generates list view
 * @param {data} props 
 * @returns {React.ListView} ListView
 */
export function ListView(props) {
    let display = null;
    if(props.data)
    display = props.data.map((item,index)=>{
        return(
            <ListItem 
            img={item.image}
            title={item.name}
            text={item.types}
            id={item.id}
            key={index}
            favorite={item.isFavorite}
            />
        )
    });
    return <div className="mid_container_list">{display}</div>;
}