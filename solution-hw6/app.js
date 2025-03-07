// query string from the URL that begins with a question mark
const queryString = window.location.search;

// use query string to create a URLSearchParams object:
const params = new URLSearchParams(queryString);

// access the parameter we want using the "get" method:
const rollType = params.get("roll")

/* ------------------------------------------------------------------------- */
// use the URL parameter to update our page.

// Update the header text
const headerElement = document.querySelector("#rollsHeader");
headerElement.innerText = rollType + " Cinnamon Roll";

// Update the image
const rollImage = document.querySelector(".productThumbnail");
const rollImageFile = rolls[rollType]["imageFile"];
rollImage.src = "./assets/products/" + rollImageFile;

/* ------------------------------------------------------------------------- */
// glazing and packing options adaptations

// Objects for the glazing options and the packing options
// each with their own properties of the options that are on dropdown
const glazingOptions = 
  {
    "Keep original": 0,
    "Sugar milk": 0,
    "Vanilla milk": .5,
    "Double chocolate": 1.5,
  };

const packingOptions = 
  {
    "1": 1,
    "3": 3,
    "6": 5,
    "12": 10,
  };

//find the glazingoptions class on html
let selectGlazingElement = document.querySelector("#glazingOptions");
let selectPackingElement = document.querySelector("#packingOptions");

//loop through the object and add it to the options element 
//to create the dropdown feature with the names of the objects
for (const[key, value] of Object.entries(glazingOptions)) {
  let option = document.createElement("option");
  option.text = `${key}`;
  option.value = `${value}`;
  selectGlazingElement.add(option);
}

for (const[key, value] of Object.entries(packingOptions)) {
  let option = document.createElement("option");
  option.text = `${key}`;
  option.value = `${value}`;
  selectPackingElement.add(option);
}

//display the updated price from the options and their price adaptations
function displayPrice(newPrice) {
  let priceTextElement = document.querySelector(".productPrice");
  priceTextElement.innerText = newPrice;
}

//have a constant variable for the base price and find the new data from the rollsdata.js
//initialize the base price so that it would load with the page
const basePrice = rolls[rollType]["basePrice"];
displayPrice("$"+basePrice);

//changing the price value depending on the adaptations
function onSelectValueChange() {
    //find and change the value of each option object into a float
    let glazingPrice = parseFloat(this.glazingOptions.value);
    let packPrice = parseFloat(this.packingOptions.value);  

    //update/initialize the current price 
    let currentPrice = "$"+basePrice;

    //price calculations and display it through the current price vari
    let priceTotal = ((basePrice + glazingPrice) * packPrice).toFixed(2); 
    currentPrice = "$"+priceTotal;
    
    //display the updated price
    displayPrice(currentPrice);
}

//add the eventlistener when it changes options and start the function
selectGlazingElement.addEventListener("onchange", onSelectValueChange);
selectPackingElement.addEventListener("onchange", onSelectValueChange);

/* ------------------------------------------------------------------------- */
// adding cart implementation 

// new class for the rolls added to the cart
class Roll {
  constructor(rollType, rollGlazing, packSize, basePrice) {
      this.type = rollType;
      this.glazing =  rollGlazing;
      this.size = packSize;
      this.basePrice = basePrice;

      this.element = null;
  }
}

//empty cart
const cart = [];

//function to update the cart with the current rolls, glazing, size and price
//that were added with the button
function updateCart() {
  let glazingName = selectGlazingElement.options[selectGlazingElement.selectedIndex].text;
  let packingName = selectPackingElement.options[selectPackingElement.selectedIndex].text;
  //add the rolls to the cart array
  cart.push(new Roll(rollType, glazingName, packingName, basePrice));
  //save to the local storage
  saveToLocalStorage();
  //also update the badge whenever the cart is upated from adding new rolls
  updateBadge(numFromLocalStorage());
  //print the current cart of rolls
  console.log(cart);
}

//make the button activate the function
const btnCart = document.querySelector(".productButton");
btnCart.onclick = updateCart;

//saves the data inside the cart array to the storedRolls local storage
function saveToLocalStorage() {
  // transfer set into a array BECAUSE JSON CAN ONLY GET ARRAY THAT IS INDEXED
  const cartArrayString = JSON.stringify(cart);
  localStorage.setItem('storedRolls', cartArrayString);
  //print the rolls that are stored
  console.log(localStorage.getItem('storedRolls'));
}

//retrieve the data from the local storage when we revisit the page
function retrieveFromLocalStorage() {
  const cartArrayString = localStorage.getItem('storedRolls');
  const cartArray = JSON.parse(cartArrayString);
  //go through the data and push them into the cart again
  for (const cartData of cartArray) {
    const rolls = new Roll(cartData.type, cartData.glazing, cartData.size, cartData.basePrice);
    cart.push(rolls);
  }
}

if (localStorage.getItem('storedRolls') != null){ 
  retrieveFromLocalStorage();
}

//print the stored rolls 
console.log(localStorage.getItem('storedRolls'));