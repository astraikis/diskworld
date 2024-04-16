const JWT = localStorage.getItem("JWT");

const uploadForm = document.getElementById("upload-form");

uploadForm.onsubmit = e => {
    e.preventDefault();

    const fileInput = document.getElementById("file-input");
    const file = fileInput.files[0];

    var reader = new FileReader();
    reader.onload = function(e) {
        var jsonObj = JSON.parse(e.target.result);
        let disks = jsonObj["disks"];
        
        for (let i = 0; i < disks.length; i++) {
            fetch("/disks/add", {
                method: "post",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer " + JWT 
                },
                body: JSON.stringify(disks[i])})
                .then((res) => {
                    console.log(res);
                    window.location.replace("./admin.html");
                })
                .catch(err => {
                    console.log(err);
                });
        }
    }

    reader.readAsText(file);
}