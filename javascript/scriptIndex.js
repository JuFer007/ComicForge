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

mostrarSeccion(contenidoMarvel);
