const featuredRow = document.getElementById("collection-row");
const featuredProducts = document.getElementById("product-grid");

function getFeaturedMovies() {
    fetch("/disks/featured")
        .then(res => res.json())
        .then(data => {
            for (let i = 0; i < data.length; i++) {
                const disk = document.createElement("div");
                disk.classList = "product";

                const image = document.createElement("img");
                image.src = data[i]["image"];

                const title = document.createElement("h3");
                title.innerText = data[i]["name"];

                const price = document.createElement("p");
                price.innerText = "$" + data[i]["price"];

                const link = document.createElement("a");
                link.href = `./disks/${data[i]["id"]}.html`;
                link.innerHTML = "<button>View</button>"

                disk.appendChild(image);
                disk.appendChild(title);
                disk.appendChild(price);
                disk.appendChild(link);

                featuredProducts.appendChild(disk);
            }
        })
        .catch(err => {
            console.log(err)
        });
}

window.onload = getFeaturedMovies;