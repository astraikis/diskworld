const productTable = document.getElementById("products");
const addForm = document.getElementById("add-form");
const editForm = document.getElementById("edit-form");
const editFormContainer = document.getElementById("edit-form-container");

const JWT = localStorage.getItem("JWT");
let disks;

const orderDiv = document.getElementById("orders");

function populate() {
    getMovies();
    getOrders();
}

function getOrders() {
    fetch("/orders/get-all-orders", { headers: { "Authorization": "Bearer " + JWT }})
        .then(res => res.json())
        .then(data => {
            for (let i = 0; i < data.length; i++) {
                let order = data[i];
                console.log(order);

                const orderContainer = document.createElement("div");
                orderContainer.className = "order-container";

                const user = document.createElement("h2");
                user.innerText = "User ID: " + order["user"];

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
                price.innerText = "Total: $" + parseFloat(order["price"]).toFixed(2);

                orderContainer.append(user);
                orderContainer.append(date);
                orderContainer.append(disks);
                orderContainer.append(price);
                orderDiv.appendChild(orderContainer);
            }
        })
        .catch(err => console.log(err));
}

function getMovies() {
    fetch("/disks/all")
        .then(res => res.json())
        .then(data => {
            disks = data;
            for (let i = 0; i < data.length; i++) {
                const row = document.createElement("tr");

                row.onclick = e => {
                    editFormContainer.className = "";
                    document.getElementById("edit-id").innerText = data[i]["id"];
                    document.getElementById("edit-name").value = data[i]["name"];
                    document.getElementById("edit-description").value = data[i]["description"];
                    document.getElementById("edit-category").value = data[i]["category"];
                    document.getElementById("edit-image").value = data[i]["image"];
                    document.getElementById("edit-price").value = data[i]["price"];
                    document.getElementById("edit-featured").value = data[i]["featured"];
                }

                row.innerHTML = 
                    `<td>${data[i]["id"]}</td>
                    <td>${data[i]["name"]}</td>
                    <td>${data[i]["description"]}</td>
                    <td>${data[i]["category"]}</td>
                    <td>${data[i]["image"]}</td>
                    <td>${data[i]["price"]}</td>
                    <td>${data[i]["featured"]}</td>`;
                productTable.appendChild(row);
            }
        })
        .catch(err => {
            console.log(err);
        });
}

addForm.onsubmit = e => {
    e.preventDefault();

    let featured;
    if (document.getElementById("featured").value === "on") {
        featured = 1;
    } else {
        featured = 0;
    }
    
    const data = {
        "name": document.getElementById("name").value,
        "description": document.getElementById("description").value,
        "category": document.getElementById("category").value,
        "image": document.getElementById("image").value,
        "price": document.getElementById("price").value,
        "featured": featured
    }

    fetch("/disks/add", {
        method: "post",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)})
        .then((res) => {
            console.log(res);
            window.location.reload();
        })
        .catch(err => {
            console.log(err);
        });
}

editForm.onsubmit = e => {
    e.preventDefault();

    let featured;
    if (document.getElementById("featured").value === "on") {
        featured = 1;
    } else {
        featured = 0;
    }

    const data = {
        "id": document.getElementById("edit-id").innerText,
        "name": document.getElementById("edit-name").value,
        "description": document.getElementById("edit-description").value,
        "category": document.getElementById("edit-category").value,
        "image": document.getElementById("edit-image").value,
        "price": document.getElementById("edit-price").value,
        "featured": featured
    }

    fetch("/disks/update", {
        method: "put",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)})
        .then((res) => { 
            console.log(res);
        })
        .catch(err => {
            console.log(err);
        });
}

window.onload = populate;