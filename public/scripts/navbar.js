const logoutButton = document.getElementById("logout-button");
const searchInput = document.getElementById("search-input");
const searchForm = document.getElementById("search-form");

if (localStorage.getItem("JWT") != null) {
  const account = document.getElementById("account");
  account.href = "../pages/account.html";
  account.innerText = "Account";

  const accountMobile = document.getElementById("account-mobile");
  accountMobile.href = "../pages/account.html";
  accountMobile.innerText = "Account";

  document.getElementById("logout").className = "";
}

searchForm.onsubmit = e => {
  e.preventDefault();
  console.log("./search.html?" + searchInput.value.replaceAll(" ", "+"));
  window.location.replace("./search.html?" + searchInput.value.replaceAll(" ", "+"));
}

logoutButton.onclick = e => {
  localStorage.removeItem("JWT");
  window.location.reload();
}

function toggleMenu() {
    const menuVisible = document.getElementById("nav-mobile").style.display;
    if (menuVisible === "" || menuVisible !== "block") {
        document.getElementById("nav-mobile").style.display = "block";
        document.getElementById("toggle-menu-text").innerText = "Close menu";
        document.getElementById("toggle-down").style.display = "none";
        document.getElementById("toggle-up").style.display = "inline-block";
    } else {
        document.getElementById("nav-mobile").style.display = "none";
        document.getElementById("toggle-menu-text").innerText = "Open menu";
        document.getElementById("toggle-down").style.display = "inline-block";
        document.getElementById("toggle-up").style.display = "none";
    }
}

function toggleFilterOptions(filter) {
  const optionsVisible = document.getElementById(filter + "-options").style.display;
  if (optionsVisible === "" || optionsVisible === "none") {
    document.getElementById(filter + "-options").style.display = "flex";
  } else if (optionsVisible === "flex") {
    document.getElementById(filter + "-options").style.display = "none";
  }
}