const signinForm = document.getElementById("signin");

signinForm.onsubmit = e => {
    e.preventDefault();
    
    const data = {
        "email": document.getElementById("email").value,
        "password": document.getElementById("password").value,
    }

    fetch("/users/signin", {
        method: "post",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)})
        .then((res) => { 
            res.text().then(data => {
                localStorage.setItem("JWT", JSON.parse(data)["token"]);
                window.location.replace("../pages/home.html");
            });
        })
        .catch(err => {
            console.log(err);
        });
}