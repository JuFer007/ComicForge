document.addEventListener("DOMContentLoaded", () => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    actualizarNavbar(isLoggedIn);
    if (isLoggedIn) {
        mostrarToastBienvenida();
    }
    restaurarPerfil();
    cargarModalesExternos();
    inicializarTabs();
});