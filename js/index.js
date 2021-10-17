recuperer();

function recuperer() {
  fetch("http://localhost:3000/api/teddies")
    .then(function (res) {
      if (res.ok) {
        return res.json();
      }
    })
    .catch(function (_err) {
      console.log("Erreur de réception");
    })
    .then(function (teddies) {
      const card = document.getElementById("display");
      //itterations throught the object
      for (let teddy in teddies) {
        //display name
        let nameTeddy = document.createElement("h2");
        card.appendChild(nameTeddy);
        nameTeddy.textContent = teddies[teddy].name;
        //display picture
        let pic = document.createElement("img");
        card.appendChild(pic);
        pic.src = teddies[teddy].imageUrl;
        pic.classList.add("resize");
        //display description
        let descTeddy = document.createElement("p");
        card.appendChild(descTeddy);
        descTeddy.textContent = teddies[teddy].description;
        //display url product
        let url = document.createElement("a");
        card.appendChild(url);
        url.href = `product.html?id=${teddies[teddy]._id}`;
        url.textContent = "Détails";
        //image clickable
        let parent = pic.parentNode;
        parent.replaceChild(url, pic);
        url.appendChild(pic);
        //display price
        let price = document.createElement("span");
        card.appendChild(price);
        //Converted price
        let price100 = teddies[teddy].price / 100;
        let priceN = new Number(price100);
        var myObj = {
          style: "currency",
          currency: "EUR",
        };
        let priceConverted = priceN.toLocaleString("fr-FR", myObj);
        price.textContent = priceConverted;
      }
    });
}
