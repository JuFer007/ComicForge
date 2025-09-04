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

//Cerrar sesion en pantallas grandes
document.getElementById("logoutBtn")?.addEventListener("click", () => {
    localStorage.removeItem("isLoggedIn");
    actualizarNavbar(false);
    window.location.href = "/index.html";
});

//Cerrar sesion en pantallas pequeñas
const btnCerrarSesion = document.getElementById("btn-CerrarSesion");

if (btnCerrarSesion) {
    btnCerrarSesion.addEventListener("click", () => {
        localStorage.removeItem("isLoggedIn");
        actualizarNavbar(false);
        window.location.href = "/index.html";
    });
}
