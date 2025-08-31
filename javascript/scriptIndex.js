const contenidoMarvel = document.getElementById('marvel');
const contenidoDC = document.getElementById('dc');
const contenidoDragonBall = document.getElementById('dragon-ball');
const secciones = [contenidoMarvel, contenidoDC, contenidoDragonBall];

function mostrarSeccion(seccion) {
    secciones.forEach(s => {
        s.style.transition = "opacity 0.5s ease";
        if (s === seccion) {
            s.style.display = "block";
            setTimeout(() => s.style.opacity = "1", 50);
        } else {
            s.style.opacity = "0";
            setTimeout(() => s.style.display = "none", 500);
        }
    });
}

document.getElementById('btn-marvel')?.addEventListener('click', () => mostrarSeccion(contenidoMarvel));
document.getElementById('btn-dc')?.addEventListener('click', () => mostrarSeccion(contenidoDC));
document.getElementById('btn-db')?.addEventListener('click', () => mostrarSeccion(contenidoDragonBall));

// Mostrar por defecto Marvel
mostrarSeccion(contenidoMarvel);

// Cargar modales externos
document.addEventListener("DOMContentLoaded", () => {
    const modales = [
        "html/modalesMarvel.html",
        "html/modalesDC.html",
    ];

    modales.forEach(ruta => {
        fetch(ruta)
            .then(res => res.text())
            .then(data => document.body.insertAdjacentHTML("beforeend", data))
            .catch(err => console.error("Error cargando modal:", ruta, err));
    });
});

// Función para abrir comic
function abrirComic(linkComic) {
    const link = linkComic?.href;
    window.open(link, "_blank", "width=1000,height=800,scrollbars=yes,resizable=yes");
}