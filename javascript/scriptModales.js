document.addEventListener("DOMContentLoaded", () => {
    const modales = [
        "html/modalesMarvel.html",
        "html/modalesDC.html",
    ];

    const contenedorModales = document.getElementById("modales-container");
    if (!contenedorModales) {
        console.error("No se encontró el contenedor de modales (#modales-container)");
        return;
    }

    modales.forEach(ruta => {
        fetch(ruta)
            .then(res => res.text())
            .then(data => contenedorModales.insertAdjacentHTML("beforeend", data))
            .catch(err => console.error("Error cargando modal:", ruta, err));
    });
});