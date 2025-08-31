document.addEventListener("DOMContentLoaded", () => {
    const loginNav   = document.getElementById("loginNav");
    const userNav    = document.getElementById("userNav");
    const navUserPic = document.getElementById("navUserPic");
    const navUserName = document.getElementById("navUserName"); // span del navbar
    const carrito = document.getElementById("carritoCompras");
    const offcanvasLogin = document.querySelector("#top-navbar .nav-link[href='/html/login.html']");

    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const userNameLS = localStorage.getItem("username") || "Usuario";
    const userPicLS  = localStorage.getItem("profilePic") || "/recursos/default-avatar.png";

    if (isLoggedIn) {
        if (navUserPic) navUserPic.src = userPicLS;
        if (navUserName) navUserName.textContent = userNameLS;

        if (loginNav) loginNav.classList.add("d-none");
        if (userNav) userNav.classList.remove("d-none");

        if (offcanvasLogin) {
            offcanvasLogin.setAttribute("href", "/html/userProfile.html");
            offcanvasLogin.innerHTML = `<i class="fa-solid fa-user"></i> Mi Perfil`;
        }

        if (carrito) carrito.classList.remove("d-none");
    } else {
        if (loginNav) loginNav.classList.remove("d-none");
        if (userNav) userNav.classList.add("d-none");

        if (offcanvasLogin) {
            offcanvasLogin.setAttribute("href", "/html/login.html");
            offcanvasLogin.innerHTML = `<i class="fa-solid fa-user"></i> Iniciar Sesión`;
        }

        if (carrito) carrito.classList.add("d-none");
    }

    //Cerrar sesión
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.removeItem("isLoggedIn");
            window.location.href = "/index.html";
        });
    }
});
