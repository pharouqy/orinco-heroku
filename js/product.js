const cartBtn1 = document.querySelector("span#plus");
const cartBtn3 = document.querySelector("span#moins");
const cartBtn2 = document.querySelector("a.btn");
const nameTeddy = document.querySelector("h2#nameTeddy");
const picTeddy = document.getElementById("imgTeddy");
const qty = document.getElementById("value");
const priceTeddy = document.getElementById("priceTeddy");
const id = recupUrl();

recupProduct(recupUrl());
addeDataToCart();
cartSum();

//object product
class ObjtCart {
  constructor(name, price, quantity, picT, _id) {
    this.name = name;
    this.price = price;
    this.quantity = quantity;
    this.picT = picT;
    this._id = _id;
  }
}

function recupUrl() {
  //Retrieve the url
  const urlParams = new URLSearchParams(window.location.search);
  //Retrieve the id from the url
  const id = urlParams.get("id");
  console.log(id);
  return id;
}

function conveter(amount) {
  let price100 = amount / 100;
  let priceN = new Number(price100);
  var myObj = {
    style: "currency",
    currency: "EUR",
  };
  let priceConverted = priceN.toLocaleString("fr-FR", myObj);
  return priceConverted;
}

function cartSum() {
  //cart function
  //const cartBtn = document.querySelector(".btn");
  const numberCart = document.getElementById("value");
  let compteur = 0;
  cartBtn1.addEventListener("click", function () {
    compteur++;
    numberCart.innerHTML = compteur;
    return compteur;
  });
  cartBtn3.addEventListener("click", function () {
    compteur--;
    numberCart.innerHTML = compteur;
    return compteur;
  });
}

/*function addCartSameProduct () {
  for (array in arrayData) {
    console.log(arrayData);
    if (parseInt(qty.innerHTML) > 0 && nameTeddy.innerHTML == arrayData[array].name) {
      qtyTotal = 0;
      qtyTotal += parseInt(arrayData[array].quantity);
      console.log("console 1", parseInt(arrayData[array].quantity));
      return qtyTotal;
    } else {
      console.log("console 2", qty.innerHTML);
      return parseInt(qty.innerHTML);
    }
  }
}*/

//data for cart
function addeDataToCart() {
  cartBtn2.addEventListener("click", () => {
    let arrayData = JSON.parse(localStorage.getItem("data"));
    let newObject = new ObjtCart(
      nameTeddy.innerHTML,
      //retrieve the two number of string and converted to number
      parseFloat(priceTeddy.innerHTML.substr(0, 2)),
      qty.innerHTML,
      picTeddy.src,
      id
    );
    //Store data in local strorage
    if (qty.innerHTML !== "0") {
      //if cart isn't empty
      if (localStorage.getItem("data") === null) {
        arrayData = [];
        arrayData.push(newObject);
        localStorage.setItem("data", JSON.stringify(arrayData));
        window.location.href = "cart.html";
      } else {
        //Script pour accumuler la quantités des produit identique dans le panier
        let flagId = false;
        //aditionner les quantité des produit identique dans le local storage
        for (array in arrayData) {
          //Si le nom du produit corespond entre le localstorage et le produit choisie
          if (nameTeddy.innerHTML === arrayData[array].name) {
            //j'aditionne la quantiter entre celle dans le local storage et la quantite du nouveau produit
            //j'actualise la quantite initial du local storage
            arrayData[array].quantity =
              parseInt(arrayData[array].quantity) + parseInt(qty.innerHTML);
            flagId = true;
            break;
          }
        }
        if (flagId == false) {//Si le produit n'est pas dupliquer dans local storage
          arrayData.push(newObject);
        }
        localStorage.setItem("data", JSON.stringify(arrayData));
        window.location.href = "cart.html";
      }
    }
  });
}

function recupProduct(id) {
  fetch(`https://intense-dawn-49463.herokuapp.com/api/teddies/${id}`)
    .then(function (res) {
      if (res.ok) {
        return res.json();
      }
    })
    .then(function (teddy) {
      const displayTeddy = document.getElementById("display_product");
      //retrieve the name's teddy
      nameTeddy.innerHTML = teddy.name;
      //retrieve the description's teddy
      const descTeddy = document.getElementById("descr");
      descTeddy.innerHTML = teddy.description;
      //retrieve the picture's teddy
      picTeddy.src = teddy.imageUrl;
      picTeddy.classList.add("resize");
      //retrieve the price's teddy converted
      const resultPrice = teddy.price;
      priceTeddy.innerHTML = conveter(resultPrice);
      //Display colors of teddies
      for (let color in teddy.colors) {
        const select_colors = document.getElementById("select_colors");
        const option_colors = document.createElement("option");
        option_colors.textContent = teddy.colors[color];
        option_colors.value = teddy.colors[color];
        select_colors.appendChild(option_colors);
        displayTeddy.appendChild(select_colors);
      }
    })
    .catch(function (err) {
      console.log("Erreur de réception");
    });
}
