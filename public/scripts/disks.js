const grid = document.getElementById("product-grid");
const categories = document.getElementById("categories");
const categoryApply = document.getElementById("category-apply");

categoryApply.onclick = e => {
    fetch("/disks/category/" + categories.value.replaceAll(" ", "+"))
        .then(res => res.json())
        .then(data => {
            grid.innerHTML = "";
            for (let i = 0; i < data.length; i++) {
                const disk = document.createElement("div");
                disk.classList = "product";

                const image = document.createElement("img");
                image.src = data[i]["image"];

                const title = document.createElement("h3");
                title.innerText = data[i]["name"];

                const category = document.createElement("p");
                category.className = "muted";
                category.innerText = data[i]["category"];

                const price = document.createElement("p");
                price.innerText = "$" + data[i]["price"];

                const link = document.createElement("a");
                link.href = `./disks/${data[i]["id"]}.html`;
                link.innerHTML = "<button>View</button>"

                disk.appendChild(image);
                disk.appendChild(title);
                disk.appendChild(category);
                disk.appendChild(price);
                disk.appendChild(link);

                grid.appendChild(disk);
            }
        })
        .catch(err => console.log(err));
}

function populate() {
    getMovies();
    getCategories();
}

function getMovies() {
    fetch("/disks/all")
        .then(res => res.json())
        .then(data => {
            for (let i = 0; i < data.length; i++) {
                const disk = document.createElement("div");
                disk.classList = "product";

                const image = document.createElement("img");
                image.src = data[i]["image"];

                const title = document.createElement("h3");
                title.innerText = data[i]["name"];

                const category = document.createElement("p");
                category.className = "muted";
                category.innerText = data[i]["category"];

                const price = document.createElement("p");
                price.innerText = "$" + data[i]["price"];

                const link = document.createElement("a");
                link.href = `./disks/${data[i]["id"]}.html`;
                link.innerHTML = "<button>View</button>"

                disk.appendChild(image);
                disk.appendChild(title);
                disk.appendChild(category);
                disk.appendChild(price);
                disk.appendChild(link);

                grid.appendChild(disk);
            }
        })
        .catch(err => console.log(err));
}

function getCategories() {
    fetch("/categories/get-all")
        .then(res => res.json())
        .then(data => {
            for (let i = 0; i < data.length; i++) {
                const option = document.createElement("option");
                option.value = data[i]["name"];
                option.innerText = data[i]["name"];
                categories.appendChild(option);
            }
        })
        .catch(err => {
            console.log(err);
        });
}

window.onload = populate();