const grid = document.getElementById("product-grid");

function getDisks() {
    const query = window.location.search;
    const cleanedQuery = query.slice(1, query.length).replaceAll("+", " ");
    document.getElementById("search-input").value = cleanedQuery;
    
    fetch("/disks/search/" + cleanedQuery)
        .then(res => res.json())
        .then(data => {
            console.log(data);

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

window.onload = getDisks;