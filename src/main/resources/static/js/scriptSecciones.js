const contenidoMarvel = document.getElementById('marvel');
const contenidoDC = document.getElementById('dc');
const contenidoDragonBall = document.getElementById('dragon-ball');
const secciones = [contenidoMarvel, contenidoDC, contenidoDragonBall];

function mostrarSeccion(seccionId) {
    secciones.forEach(s => {
        if (!s) return;
        s.style.transition = "opacity 0.5s ease";
        if (s.id === seccionId) {
            s.style.display = "block";
            setTimeout(() => s.style.opacity = "1", 50);
        } else {
            s.style.opacity = "0";
            setTimeout(() => s.style.display = "none", 500);
        }
    });
}
