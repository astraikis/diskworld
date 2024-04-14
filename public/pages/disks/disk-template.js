const id = "id";
const JWT = localStorage.getItem("JWT");

const img = document.getElementById("img");
const title = document.getElementById("title");
const description = document.getElementById("description");
const price = document.getElementById("price");
const category = document.getElementById("category");
const addToCart = document.getElementById("add-to-cart");

function getDisk() {
    fetch("/disks/disk/" + id)
    .then(res => res.json())
    .then(data => {
        img.src = data[0]["image"];
        img.alt = data[0]["name"] + " cover.";
        title.innerText = data[0]["name"];
        price.innerText = "$" + data[0]["price"];
        category.innerText = data[0]["category"];
        description.innerText = data[0]["description"];
    })
    .catch(err => {
        console.log(err);
    });
}

addToCart.onclick = e => {
    const data = { 'id': id };
    fetch(
        "/carts/add/", {
        method: "post",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + JWT
        },
        body: JSON.stringify(data)})
    .then(res => res.json())
    .then(data => {
        addToCart.innerHTML = 
            '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cart-check" viewBox="0 0 16 16">' +
                '<path d="M11.354 6.354a.5.5 0 0 0-.708-.708L8 8.293 6.854 7.146a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0z"/>' +
                '<path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1zm3.915 10L3.102 4h10.796l-1.313 7zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0m7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>' +
            '</svg> In cart';
    })
    .catch(err => {
        console.log(err);
    });
}

window.onload = getDisk;