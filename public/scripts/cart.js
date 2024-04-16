const JWT = localStorage.getItem("JWT");
let cartId;

const cartContainer = document.getElementById("cart");
const checkoutButton = document.getElementById("checkout-button");

function removeDisk(id) {
    const data = { "id": id }

    fetch("/carts/remove", {
        method: "delete",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + JWT
        },
        body: JSON.stringify(data)})
        .then((res) => { 
            window.location.reload();
        })
        .catch(err => {
            console.log(err);
        });
}

function getCart() {
    fetch("/carts/get", { headers: { "Authorization": "Bearer " + JWT }})
        .then(res => res.json())
        .then(data => {
            cartId = data["id"];
            let subtotal = 0;

            if (data["products"].length > 0) {
                document.getElementById("cart-empty").style.display = "none";
            }

            for (let i = 0; i < data["products"].length; i++) {
                let disk = data["products"][i][0];
                subtotal += disk["price"];

                const diskContainer = document.createElement("div");

                const img = document.createElement("img");
                img.src = disk["image"];
                img.alt = disk["name"];

                const diskDetails = document.createElement("div");
                diskDetails.className = "cart-detail";

                const name = document.createElement("h2");
                name.innerText = disk["name"];

                const quantity = document.createElement("p");
                quantity.innerText = "Quantity: 1";

                const price = document.createElement("p");
                price.innerText = "$" + disk["price"];

                const remove = document.createElement("p");
                remove.innerText = "Remove from cart";
                remove.className = "text-button-red";
                remove.onclick = () => removeDisk(disk["id"]);

                diskContainer.appendChild(img);
                diskDetails.appendChild(name);
                diskDetails.appendChild(quantity);
                diskDetails.appendChild(price);
                diskDetails.appendChild(remove);
                diskContainer.appendChild(diskDetails);
                cartContainer.appendChild(diskContainer);
            }

            const tax = parseFloat((subtotal * 0.0675).toFixed(2));
            const total = subtotal + tax + 5;
            document.getElementById("subtotal").innerText = subtotal;
            document.getElementById("tax").innerText = tax;
            document.getElementById("total").innerText = total.toFixed(2);
        })
        .catch(err => console.log(err));
}

checkoutButton.onclick = e => {
    const data = {
        "id": cartId,
        "price": parseFloat(document.getElementById("total").innerText)
    }

    fetch("/orders/order", {
        method: "post",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + JWT
        },
        body: JSON.stringify(data)})
        .then((res) => { 
            window.location.replace("./order-success.html");
        })
        .catch(err => {
            console.log(err);
    });
}

window.onload = getCart;