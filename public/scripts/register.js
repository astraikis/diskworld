const registerForm = document.getElementById("register");

registerForm.onsubmit = e => {
    e.preventDefault();

    let isAdmin = 0;
    if (document.getElementById("is-admin").checked) {
        isAdmin = 1;
    }

    const data = {
        "name": document.getElementById("name").value,
        "email": document.getElementById("email").value,
        "password": document.getElementById("password").value,
        "isAdmin": isAdmin
    }

    fetch("/users/register", {
        method: "post",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)})
        .then((res) => { 
            if (res.status === 200) {
                window.location.replace("../pages/signin.html");
            }
        })
        .catch(err => {
            console.log(err);
        });
}