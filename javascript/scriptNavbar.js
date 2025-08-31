document.addEventListener("DOMContentLoaded", () => {
    const loginNav   = document.getElementById("loginNav");
    const userNav    = document.getElementById("userNav");
    const navUserPic = document.getElementById("navUserPic");
    const offcanvasLogin = document.querySelector("#top-navbar .nav-link[href='/html/login.html']");
    const carrito = document.getElementById("carritoCompras");
    const logoutBtn = document.getElementById("logoutBtn");
    const toastEl = document.getElementById("toastBienvenida");

    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const userNameLS = localStorage.getItem("username") || "Usuario";
    const userPicLS  = localStorage.getItem("profilePic") || "/recursos/default-avatar.png";

    if (isLoggedIn) {
        //Navbar usuario
        if (loginNav) loginNav.classList.add("d-none");
        if (userNav) userNav.classList.remove("d-none");

        if (navUserPic) navUserPic.src = userPicLS;

        if (offcanvasLogin) {
            offcanvasLogin.setAttribute("href", "/html/userProfile.html");
            offcanvasLogin.innerHTML = `<i class="fa-solid fa-user"></i> Mi Perfil`;
        }

        if (carrito) carrito.classList.remove("d-none");

        if (toastEl) {
            const toast = new bootstrap.Toast(toastEl);
            toast.show();
        }

    } else {
        //Navbar no logueado
        if (loginNav) loginNav.classList.remove("d-none");
        if (userNav) userNav.classList.add("d-none");

        if (offcanvasLogin) {
            offcanvasLogin.setAttribute("href", "/html/login.html");
            offcanvasLogin.innerHTML = `<i class="fa-solid fa-user"></i> Iniciar Sesión`;
        }

        if (carrito) carrito.classList.add("d-none");
    }

    // Botón cerrar sesión
    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.removeItem("username");
            localStorage.removeItem("profilePic");
            localStorage.removeItem("coverImg");
            localStorage.removeItem("userBio");
            localStorage.removeItem("isLoggedIn");
            window.location.href = "/index.html";
        });
    }
});
