// navbar.js
document.addEventListener("DOMContentLoaded", () => {
    const loginNav = document.getElementById("loginNav");
    const userNav = document.getElementById("userNav");
    const navUserPic = document.getElementById("navUserPic");
    const navUserName = document.getElementById("navUserName");
    const carrito = document.getElementById("carritoCompras");
    const inicioSesionResponsive = document.getElementById("inicioSesionResponsive");
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const username = localStorage.getItem("username") || "Usuario";
    const profilePic = localStorage.getItem("profilePic") || "/recursos/default-avatar.png";

    if (isLoggedIn) {
        loginNav?.classList.add("d-none");
        userNav?.classList.remove("d-none");
        navUserPic && (navUserPic.src = profilePic);
        navUserName && (navUserName.textContent = username);
        carrito?.classList.remove("d-none");
    } else {
        loginNav?.classList.remove("d-none");
        userNav?.classList.add("d-none");
        carrito?.classList.add("d-none");
    }

    if (inicioSesionResponsive) {
        const linkText = inicioSesionResponsive.querySelector(".inicio-texto");
        const link = inicioSesionResponsive.querySelector("a");
        if (isLoggedIn) {
            if (linkText) linkText.textContent = "Mi Perfil";
            if (link) link.href = "/html/userProfile.html";
        } else {
            if (linkText) linkText.textContent = "Iniciar Sesión";
            if (link) link.href = "/html/login.html";
        }
    }

    const logoutBtn = document.getElementById("logoutBtn");
    logoutBtn?.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("username");
        localStorage.removeItem("profilePic");
        localStorage.removeItem("userBio");
        window.location.href = "/index.html";
    });
});
