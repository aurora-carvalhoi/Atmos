const menuIcon = document.getElementById("menu-icon");
const menuMobile = document.getElementById("menu");

menuIcon.addEventListener("click", () => {
    menuIcon.classList.toggle("open");
    if (menuIcon.classList.contains("open")) {
        menuMobile.style.display = "flex";
    } else {
        menuMobile.style.display = "none";
    }
});