function inicializarTabs() {
    const tabButtons = document.querySelectorAll(".tabs-encabezados button");
    const tabContents = document.querySelectorAll(".tabs-contenido > div");
    const indicator = document.querySelector(".indicador");

    tabButtons.forEach((button, index) => {
        button.addEventListener("click", () => {
            const target = button.getAttribute("data-tab");

            tabButtons.forEach(btn => btn.classList.remove("activo"));
            tabContents.forEach(tab => tab.classList.remove("activo"));

            button.classList.add("activo");
            document.getElementById(target).classList.add("activo");

            indicator.style.left = `${(100 / tabButtons.length) * index}%`;
            indicator.style.width = `${100 / tabButtons.length}%`;
        });
    });
}

function abrirComic(linkComic) {
    const link = linkComic?.href;
    if (link) {
        window.open(link, "_blank");
    }
}