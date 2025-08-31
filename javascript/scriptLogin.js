const loginNav = document.getElementById("loginNav");
const inicioSesionResponsive = document.getElementById("inicioSesionResponsive");
const logoutBtn = document.getElementById("btn-CerrarSesion");
const toastEl = document.getElementById("toastBienvenida");

//Función para actualizar el navbar según sesión
function actualizarNavbar(isLoggedIn) {
    if (!loginNav || !inicioSesionResponsive) return;

    if (isLoggedIn) {
        loginNav.querySelector("a").href = "/html/userProfile.html";
        loginNav.querySelector("a").textContent = "Mi Perfil";

        inicioSesionResponsive.querySelector("a").href = "/html/userProfile.html";
        inicioSesionResponsive.querySelector(".inicio-texto").textContent = "Mi Perfil";
    } else {
        loginNav.querySelector("a").href = "/html/login.html";
        loginNav.querySelector("a").textContent = "Iniciar Sesión";

        inicioSesionResponsive.querySelector("a").href = "/html/login.html";
        inicioSesionResponsive.querySelector(".inicio-texto").textContent = "Iniciar Sesión";
    }
}

//Mostrar toast bienvenida una sola vez
function mostrarToastBienvenida() {
    if (!toastEl) return;
    const showToast = localStorage.getItem("showToast");
    if (showToast === "true") {
        const toast = new bootstrap.Toast(toastEl);
        toast.show();
        localStorage.removeItem("showToast");
    }
}

// ==========================
// Inicio de sesión
// ==========================
const loginForm = document.getElementById("loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const email = document.getElementById("exampleInputEmail1").value.trim();
        const password = document.getElementById("exampleInputPassword1").value.trim();

        const validEmail = "admin@comicforge.com";
        const validPass = "12345";

        if (email === validEmail && password === validPass) {
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("showToast", "true");
            actualizarNavbar(true);
            window.location.href = "/html/userProfile.html";
        } else {
            alert("Usuario o contraseña incorrectos");
        }
    });
}

// ==========================
// Cierre de sesión
// ==========================
if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("isLoggedIn");
        actualizarNavbar(false);
        window.location.href = "/index.html";
    });
}

// ==========================
// Mantener estado al recargar
// ==========================
document.addEventListener("DOMContentLoaded", () => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    actualizarNavbar(isLoggedIn);
    mostrarToastBienvenida();
});
