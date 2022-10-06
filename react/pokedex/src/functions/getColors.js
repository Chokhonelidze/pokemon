/**
 * 
 * @description This function returns color for each type
 * @param {String} text 
 * @returns {HTMLStyleElement} color
 */
export function getColor(text) {
    let arr = {
        poison: "green",
        fire: "red",
        bug: "brown",
        water: "blue",
        flying: "#00ffff",
        electric: "yellow",
        ground: "#212529",
        grass: "greenyellow",
        psychic: "chocolate",
        fighting: "crimson",
        fairy: "pink",
        ice: "cornflowerblue",
        ghost:"rosybrown",
        rock:"gray",
      };
    let color = arr[text.toLowerCase()];
    return color;
}