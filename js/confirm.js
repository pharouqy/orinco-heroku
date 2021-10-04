const infoConfirmFirst = localStorage.getItem("firstName");
const infoConfirmLast = localStorage.getItem("lastName");

function recupUrl() {
  //Retrieve the url
  const urlParams = new URLSearchParams(window.location.search);
  //Retrieve the id from the url
  const id = urlParams.get("order");
  return id;
}

displayThankful();

function displayThankful() {
    if (infoConfirmFirst !== null && infoConfirmLast !== null) {
            const idRecup = recupUrl();
            document.getElementById(
              "display_confirm"
            ).innerHTML = `Bonjour ${infoConfirmFirst} ${infoConfirmLast}, Merci D'avoir Pris Commande Chez Ornico, Votre Numéro De Commande est le : ${idRecup}`;
            localStorage.clear();
    }
    else {
        window.location.href = "index.html";
    }
}