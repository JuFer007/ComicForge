function actualizarNavbar(isLoggedIn) {
    const loginNav = document.getElementById("loginNav");
    const inicioSesionResponsive = document.getElementById("inicioSesionResponsive");
    const userNav = document.getElementById("userNav");
    const navUserPic = document.getElementById("navUserPic");
    const userProfileLink = document.getElementById("userProfileLink");
    const carrito = document.getElementById("carritoCompras");
    const adminNav = document.getElementById("adminNav");
    const adminUserPic = document.getElementById("adminUserPic");
    const adminLink = document.getElementById("adminLink");

    if (!loginNav || !inicioSesionResponsive) return;

    if (isLoggedIn) {
        const userId = localStorage.getItem("userId");
        const role = localStorage.getItem("role");

        loginNav.classList.add("d-none");
        inicioSesionResponsive.classList.add("d-none");

        // Siempre ocultar carrito si hay sesión
        if (carrito) carrito.classList.add("d-none");

        if (role === "admin") {
            adminNav.classList.remove("d-none");
            userNav.classList.add("d-none");

            const avatarSrc = localStorage.getItem("profilePic") || "/recursos/avatares/default-avatar.jpg";
            if (adminUserPic) adminUserPic.src = avatarSrc;

            if (adminLink) adminLink.href = `/admin/dashboard`;

        } else {
            userNav.classList.remove("d-none");
            adminNav.classList.add("d-none");

            const avatarSrc = localStorage.getItem("profilePic") || "/recursos/avatares/default-avatar.jpg";
            if (navUserPic) navUserPic.src = avatarSrc;

            if (userProfileLink) userProfileLink.href = `/user/profile/${userId}`;
        }

    } else {
        loginNav.classList.remove("d-none");
        inicioSesionResponsive.classList.remove("d-none");
        userNav.classList.add("d-none");
        adminNav.classList.add("d-none");
        if (carrito) carrito.classList.remove("d-none");

        const responsiveLink = inicioSesionResponsive.querySelector("a");
        if (responsiveLink) {
            responsiveLink.href = "/login";
            responsiveLink.innerHTML = '<i class="fa-solid fa-user"></i> <span>Iniciar Sesión</span>';
        }
    }
}

function inicializarNavbar() {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    actualizarNavbar(isLoggedIn);
}

document.addEventListener("DOMContentLoaded", inicializarNavbar);
