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

document.addEventListener("DOMContentLoaded", function () {
    var barraLateral = document.getElementById("siderbar");
    if (barraLateral == null) {
        return;
    }
    var salvo = localStorage.getItem("sidebarMini");
    var recolhida = true;
    if (salvo != null) {
        recolhida = salvo == "true";
    }
    if (recolhida) {
        barraLateral.classList.add("mini");
    }
    var logo = barraLateral.querySelector(".logo-container");
    if (logo != null) {
        var botao = document.createElement("button");
        botao.className = "sidebar-expandida";
        botao.setAttribute("aria-label", "Abrir menu");
        botao.innerHTML = `
            <svg viewBox="0 0 24 24">
                <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
        `;
        logo.appendChild(botao);
        botao.addEventListener("click", function (evento) {
            evento.preventDefault();
            barraLateral.classList.toggle("mini");
            var estaRecolhida = barraLateral.classList.contains("mini");
            localStorage.setItem("sidebarMini", estaRecolhida);
        });
    }
    var itens = barraLateral.querySelectorAll(".nav-item a");
    for (var i = 0; i < itens.length; i++) {
        var link = itens[i];
        var texto = link.querySelector("span");
        if (texto != null) {
            link.setAttribute("data-tooltip", texto.textContent.trim());
        }
    }
});