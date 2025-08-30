document.addEventListener("DOMContentLoaded", () => {
    const loginNav   = document.getElementById("loginNav");
    const userNav    = document.getElementById("userNav");
    const navUserPic = document.getElementById("navUserPic");
    const offcanvasLogin = document.querySelector("#top-navbar .nav-link[href='/html/login.html']");
    const carrito = document.getElementById("carritoCompras");

    const userNameLS = localStorage.getItem("username");
    const userPicLS  = localStorage.getItem("profilePic");

    if (userNameLS) {
        if (navUserPic && userPicLS) navUserPic.src = userPicLS;

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

    // Botón de cerrar sesión
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.removeItem("username");
            localStorage.removeItem("profilePic");
            localStorage.removeItem("coverImg");
            localStorage.removeItem("userBio");
            window.location.href = "/index.html";
        });
    }
});