const JWT = localStorage.getItem("JWT");

const orderDiv = document.getElementById("orders");

function getOrders() {
    fetch("/orders/get", { headers: { "Authorization": "Bearer " + JWT }})
        .then(res => res.json())
        .then(data => {
            for (let i = 0; i < data.length; i++) {
                let order = data[i];

                const orderContainer = document.createElement("div");
                orderContainer.className = "order-container";

                const date = document.createElement("p");
                date.innerText = "Placed " + Date(order["created"]);

                const disks = document.createElement("div");
                disks.className = "order-disks";

                for (let j = 0; j < order["products"].length; j++) {
                    const disk = order["products"][j];
                    const diskImage = document.createElement("img");
                    diskImage.src = disk["image"];
                    diskImage.alt = disk["name"];
                    disks.appendChild(diskImage);
                }

                const price = document.createElement("p");
                price.innerText = "Total:$" + parseFloat(order["price"]).toFixed(2);

                orderContainer.append(date);
                orderContainer.append(disks);
                orderContainer.append(price);
                orderDiv.appendChild(orderContainer);
            }
        })
        .catch(err => console.log(err));
}

window.onload = getOrders;