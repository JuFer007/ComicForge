document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tabs-encabezados button');
    const indicador = document.querySelector('.indicador');
    const contenidos = document.querySelectorAll('.tabs-contenido > div');

    if (tabs.length === 0 || !indicador) return;

    tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
            indicador.style.left = `${index * 50}%`;

            tabs.forEach(t => t.classList.remove('activo'));
            contenidos.forEach(c => c.classList.remove('activo'));

            const tabId = tab.getAttribute('data-tab');
            const contenidoActivo = document.getElementById(tabId);

            tab.classList.add('activo');
            if (contenidoActivo) {
                contenidoActivo.classList.add('activo');
            }
        });
    });
});