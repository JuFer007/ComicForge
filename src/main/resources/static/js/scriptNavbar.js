async function sincronizarSesion() {
    try {
        const response = await fetch('/api/session/status');
        const data = await response.json();
        
        if (data.isLoggedIn) {
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("userId", data.userId);
            localStorage.setItem("role", data.role);
            localStorage.setItem("userName", data.userName || "Usuario");
            localStorage.setItem("profilePic", data.profilePic || "/recursos/avatares/avatarDefault.jpg");
        } else {
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("userId");
            localStorage.removeItem("role");
            localStorage.removeItem("userName");
            localStorage.removeItem("profilePic");
        }

        return data.isLoggedIn;
    } catch (error) {
        console.error("Error al sincronizar sesión:", error);
        return localStorage.getItem("isLoggedIn") === "true";
    }
}

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
        const userName = localStorage.getItem("userName") || "Usuario";
        const profilePic = localStorage.getItem("profilePic") || "/recursos/avatares/avatarDefault.jpg";

        loginNav.classList.add("d-none");
        inicioSesionResponsive.classList.add("d-none");

        // Siempre ocultar carrito si hay sesión
        if (carrito) carrito.classList.add("d-none");

        if (role === "admin") {
            adminNav.classList.remove("d-none");
            userNav.classList.add("d-none");

            if (adminUserPic) {
                adminUserPic.src = profilePic;
                adminUserPic.alt = userName;
            }

            if (adminLink) adminLink.href = `/admin/dashboard`;

        } else {
            userNav.classList.remove("d-none");
            adminNav.classList.add("d-none");

            if (navUserPic) {
                navUserPic.src = profilePic;
                navUserPic.alt = userName;
            }

            if (userProfileLink) userProfileLink.href = `/user/profile/${userId}`;
        }
        console.log("Navbar actualizado:", { userId, role, userName, profilePic });

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

async function inicializarNavbar() {
    const isLoggedIn = await sincronizarSesion();
    actualizarNavbar(isLoggedIn);
}

// Listener para el botón de cerrar sesión
document.addEventListener("DOMContentLoaded", () => {
    inicializarNavbar();

    const logoutBtn = document.getElementById("btn-CerrarSesion");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", async () => {
            try {
                await fetch('/auth/logout', { method: 'POST' });
                localStorage.clear();
                window.location.href = '/';
            } catch (error) {
                console.error("Error al cerrar sesión:", error);
            }
        });
    }
});
