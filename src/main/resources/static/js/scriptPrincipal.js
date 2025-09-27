document.addEventListener("DOMContentLoaded", () => {
    if (typeof inicializarDarkMode === 'function') {
        inicializarDarkMode();
    }
    if (typeof inicializarNavbar === 'function') {
        inicializarNavbar();
    }
    if (typeof inicializarFormularios === 'function') {
        inicializarFormularios();
    }
    if (typeof inicializarPaginaPerfil === 'function') {
        inicializarPaginaPerfil();
    }

    const shouldShowToast = localStorage.getItem('showToast') === 'true';
    if (shouldShowToast) {
        if (typeof mostrarToastBienvenida === 'function') {
            mostrarToastBienvenida();
        }
        localStorage.removeItem('showToast'); 
    }

    if (typeof mostrarSeccion === 'function') {
        mostrarSeccion('marvel');
    }

});