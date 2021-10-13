let arrayData = JSON.parse(localStorage.getItem("data"));

//check input order
const submitInput = document.getElementById("submit");
const firstNameInput = document.getElementById("firstName");
const lastNameInput = document.getElementById("lastName");
const adressInput = document.getElementById("adress");
const cityInput = document.getElementById("city");
const emailInput = document.getElementById("email");
const erreurDisplay = document.getElementById("erreur");

diplayDaata();
clearItem();
sendDataToApi();
priceTotal();
clearStorage();

//create a table to send for server
let tableOfIds = [];
if (arrayData !== []) {
  for (table of tableOfIds) {
    tableOfIds.push(arrayData[table]["_id"]);
  }
} else {
  console.log("panier est vide");
}

//Display the data on the web page
function diplayDaata() {
  if (localStorage.getItem("data")) {
    for (const data in arrayData) {
      let name = arrayData[data].name;
      let price = arrayData[data].price;
      let quantite = arrayData[data].quantity;
      const picture = arrayData[data].picT;
      const total = price * quantite;
      let totaux = 0;
      totaux += total;
      let tBody = document.getElementsByTagName("tbody")[0];
      //display data on web page
      tBody.innerHTML += `<tr>
      <td class="p-4">
        <div class="media align-items-center">
          <img
            id="img"
            src="${picture}"
            class="d-block ui-w-40 ui-bordered mr-4"
            alt=""
          />
          <div class="media-body">
            <a href="#" class="d-block text-dark" id="name">${name}</a>
            <small>
              <span class="text-muted"></span>
              <span class="align-text-bottom"></span>
              <span class="text-muted"></span>
            </small>
          </div>
        </div>
      </td>
      <td
        class="text-right font-weight-semibold align-middle p-4"
        id="price"
      >${price}</td>
      <td class="align-middle p-4">
        <input
          type="text"
          class="form-control text-center"
          value="${quantite}"
          id="quantite"
        />
      </td>
      <td
        class="text-right font-weight-semibold align-middle p-4 totaux"
        id="total"
      >${total}
      </td>
      <td class="text-center align-middle px-0">
      <a
        id="X"
        href="#"
        class="delete shop-tooltip close float-none text-danger"
        title=""
        data-original-title="Remove"
        >Supprimer le produit</a>
    </td>
  </tr>`;
    }
  }
}
function priceTotal() {
  //total price
  let totaux = document.querySelectorAll("td.totaux");
  let sum = 0;
  let i = 0;
  for (i; i < totaux.length; i++) {
    sum += parseInt(totaux[i].innerHTML);
  }
  document.getElementById("totals").innerHTML = `Total = ${sum}`;
  return sum;
}

function clearItem() {
  const btnDelete = document.querySelectorAll(".delete");
  console.log(btnDelete);
  // boucler sur le tableau de btn
  for (let i = 0; i < btnDelete.length; i++) {
    //crée une constante qui recupere le tableau des btn html
    btnDelete[i].addEventListener("click", (e) => {
      e.preventDefault();
      //recuperer le name du produit
      console.log(arrayData);
      let nameDelete = arrayData[i].name;
      console.log(nameDelete);
      //utiliser la methode filter qui boucle sur l'array et retourne un tableau des element a ne pas supprimer
      arrayData = arrayData.filter((el) => el.name !== nameDelete); //retourne un tableau des elements qui ne corespondent pas a nameDelete
      //mettre le tableau retourner dans le local storage encore une fois
      localStorage.setItem("data", JSON.stringify(arrayData));
      window.location.href = "cart.html";
    });
  }
}
if (arrayData === []) {
  localStorage.clear();
  erreurDisplay.innerHTML = `<h1>le panier est vide choisissez des produits pour valider votre commande</h1>`;
}
function clearStorage() {
  //clear localstorage
  if (document.getElementById("X") != null) {
    document.getElementById("X").addEventListener("click", function () {
      localStorage.removeItem("data");
      window.location.href = "index.html";
    });
  }
}

//regex to check the email
function validateEmail(email) {
  const re =
    /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  return re.test(String(email).toLowerCase());
}

function sendDataToApi() {
  submitInput.addEventListener("click", function (e) {
    if (arrayData.length !== 0) {
      if (
        firstNameInput.value.toString().trim() &&
        lastNameInput.value.toString().trim() &&
        validateEmail(emailInput.value).toString().trim() &&
        cityInput.value.toString().trim() &&
        emailInput.value.toString().trim() &&
        arrayData != null
      ) {
        //create the object to send
        let objectToSend = {
          contact: {
            firstName: firstNameInput.value,
            lastName: lastNameInput.value,
            address: adressInput.value,
            city: cityInput.value,
            email: emailInput.value,
          },
          products: tableOfIds,
        };
        let jsonOrder = JSON.stringify(objectToSend);
        erreurDisplay.innerHTML = ``;
        fetch("https://intense-dawn-49463.herokuapp.com/api/teddies/order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(objectToSend),
        })
          .then(function (res) {
            if (res.ok) {
              return res.json();
            }
          })
          .then((value) => {
            localStorage.clear();
            const orderId = localStorage.setItem("orderId", value.orderId);
            localStorage.setItem("firstName", value.contact["firstName"]);
            localStorage.setItem("lastName", value.contact["lastName"]);
            const idRetrieve = localStorage.getItem("orderId");
            window.location.href = `confirm.html?order=${idRetrieve}`;
          })
          .catch(function (erreur) {
            console.log(erreur);
          });
      } else if (!validateEmail(emailInput.value)) {
        erreurDisplay.innerHTML = `<h1>Remplissez tous les champs svp en vérifiant le bon format d'email</h1>`;
      } else {
        erreurDisplay.innerHTML = `<h1>Remplissez tous les champs svp</h1>`;
      }
    } else {
      erreurDisplay.innerHTML = `<h1>le panier est vide choisissez des produits pour valider votre commande</h1>`;
    }
  });
}
