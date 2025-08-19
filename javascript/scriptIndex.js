//CAMBIAR EL CONTENIDO SEGÚN EL BOTON DONDE SE HACE CLICK
const botonMarvel = document.getElementById('btn-marvel');
const botonDC = document.getElementById('btn-dc');
const botonDB = document.getElementById('btn-db');

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
botonMarvel.addEventListener('click', () => mostrarSeccion(contenidoMarvel));
botonDC.addEventListener('click', () => mostrarSeccion(contenidoDC));
botonDB.addEventListener('click', () => mostrarSeccion(contenidoDragonBall));