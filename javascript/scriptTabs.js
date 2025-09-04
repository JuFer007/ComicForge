function inicializarTabs() {
    const tabButtons = document.querySelectorAll(".tabs-encabezados button");
    const tabContents = document.querySelectorAll(".tabs-contenido > div");
    const indicator = document.querySelector(".indicador");

    function mostrarTab(index) {
        tabButtons.forEach(btn => btn.classList.remove("activo"));
        tabContents.forEach(tab => tab.classList.remove("activo"));

        tabButtons[index].classList.add("activo");
        tabContents[index].classList.add("activo");

        if (indicator) {
            indicator.style.left = `${(100 / tabButtons.length) * index}%`;
            indicator.style.width = `${100 / tabButtons.length}%`;
        }
    }

    tabButtons.forEach((button, index) => {
        button.addEventListener("click", () => mostrarTab(index));
    });

    mostrarTab(0);
}

document.addEventListener("DOMContentLoaded", inicializarTabs);

function abrirComic(linkComic) {
    const link = linkComic?.href;
    if (link) {
        window.open(link, "_blank");
    }
}