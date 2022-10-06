import {
  fireEvent,
  render,
  screen,

} from "@testing-library/react";
import { App } from "./App";
import { CardItem } from "./components/cardItem";
import {BigCardItem} from "./components/bigCardItem";
import {ListItem} from "./components/listCard";
/*
test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
*/

test("testing navigation", () => {
  render(<App />);
  const all = screen.getByText("ALL");
  expect(all).toBeInTheDocument();
  const Favorites = screen.getByText("Favorites");
  expect(Favorites).toBeInTheDocument();
  const search = screen.getByPlaceholderText("Search");
  expect(search).toBeInTheDocument();
});

test("testing cardItem", () => {

  const types = ['Grass','Poison'];
  render(
    <CardItem
      favorite={true}
    
      id="001"
      title="Bulbasaur"
      text = {['Poison','Grass']}
    />
  );
  let type = screen.getByText('Poison');
  expect(type).toBeInTheDocument();
  expect(type.style.color === 'green');
  expect(screen.getByText("Bulbasaur")).toBeInTheDocument();
  expect(screen.getByText("❤️")).toBeInTheDocument();
  render(
    <CardItem
      favorite={false}

      id="002"
      title="Ivysaur"

    />
  );
  expect(screen.getByText("💔")).toBeInTheDocument();
 
});

test("testing big card",()=>{
  let weight = {'maximum':5,'minimum':1}
  let height = {'maximum':4,'minimum':9}
  render(<BigCardItem 
    id = "001"
    title = "Bulbasaur"
    isFavorite = {false}
    weight = {weight}
    height = {height}
  />);
  expect(screen.getByText('Bulbasaur')).toBeInTheDocument();
  expect(screen.getByText("💔")).toBeInTheDocument();
  render(<BigCardItem 
    id = "002"
    title = "Ivysaur"
    isFavorite = {true}
    weight = {weight}
    height = {height}
    types = {['Poison','Grass']}
  />);
  expect(screen.getByText('Ivysaur')).toBeInTheDocument();
  expect(screen.getByText("❤️")).toBeInTheDocument();
  let type = screen.getByText('Poison');
  expect(type).toBeInTheDocument();
  expect(type.style.color === 'green');
  let test = screen.getByText("❤️");
  fireEvent.click(test);
  expect(test.innerHTML === "💔");
});

test("testing list card",()=>{
render(<ListItem 
id ='001'
title = "Bulbasaur"
favorite = {true}
/>);
expect(screen.getByText('Bulbasaur')).toBeInTheDocument();
expect(screen.getByText("❤️")).toBeInTheDocument();
render(<ListItem 
  id ='002'
  title = "Ivysaur"
  favorite = {false}
  text = {['Grass','Poison']}
  />);
  expect(screen.getByText('Ivysaur')).toBeInTheDocument();
  let type = screen.getByText('Poison');
  expect(type).toBeInTheDocument();
  expect(type.style.color === 'green');
  expect(screen.getByText("💔")).toBeInTheDocument();


});