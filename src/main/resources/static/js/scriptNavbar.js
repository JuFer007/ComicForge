function actualizarNavbar(isLoggedIn) {
    const loginNav = document.getElementById("loginNav");
    const inicioSesionResponsive = document.getElementById("inicioSesionResponsive");
    const userNav = document.getElementById("userNav");
    const navUserPic = document.getElementById("navUserPic");
    const profilePic = document.getElementById("profilePic");
    const carrito = document.getElementById("carritoCompras");

    if (!loginNav || !inicioSesionResponsive || !userNav || !navUserPic) return;

    if (isLoggedIn) {
        userNav.classList.remove("d-none");
        loginNav.classList.add("d-none");
        carrito.classList.add("d-none");

        const responsiveLink = inicioSesionResponsive.querySelector("a");
        if (responsiveLink) {
            responsiveLink.href = "/html/userProfile.html";
            responsiveLink.innerHTML = '<i class="fa-solid fa-user"></i> <span class="inicio-texto">Mi Cuenta</span>';
        }

        const avatarSrc = localStorage.getItem("profilePic") || "/recursos/avatares/default-avatar.jpg";
        navUserPic.src = avatarSrc;
        if (profilePic) {
            profilePic.src = avatarSrc;
        }

    } else {
        userNav.classList.add("d-none");
        loginNav.classList.remove("d-none");
        carrito.classList.remove("d-none");

        const responsiveLink = inicioSesionResponsive.querySelector("a");
        if (responsiveLink) {
            responsiveLink.href = "/html/login.html";
            responsiveLink.innerHTML = '<i class="fa-solid fa-user"></i> <span class="inicio-texto">Iniciar Sesión</span>';
        }
    }
}

function inicializarNavbar() {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    actualizarNavbar(isLoggedIn);
}
