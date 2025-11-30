async function sincronizarSesion() {
    try {
        const token = localStorage.getItem("jwtToken");

        const headers = {};
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch('/api/session/status', { headers });
        const data = await response.json();

        if (data.isLoggedIn) {
            localStorage.setItem("jwtToken", token);
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("userId", data.userId);
            localStorage.setItem("role", data.role);
            localStorage.setItem("userName", data.userName || "Usuario");
            localStorage.setItem("profilePic", data.profilePic || "/recursos/avatares/avatarDefault.jpg");
        } else {
            localStorage.removeItem("jwtToken");
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

document.addEventListener("DOMContentLoaded", () => {
    inicializarNavbar();

    const logoutBtn = document.getElementById("logoutBtn");
    const logoutBtnAdmin = document.getElementById("logoutBtnAdmin");

    if (logoutBtn) {
        logoutBtn.addEventListener("click", async (e) => {
            e.preventDefault();

            try {
                const token = localStorage.getItem("jwtToken");

                await fetch('/auth/logout', {
                    method: 'POST',
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                localStorage.clear();

            } catch (error) {
                console.error("Error al cerrar sesión:", error);
                localStorage.clear();
                Toast.info("Sesión cerrada");
                setTimeout(() => window.location.href = '/', 1000);
            }
        });
    }

    if (logoutBtnAdmin) {
        logoutBtnAdmin.addEventListener("click", async (e) => {
            e.preventDefault();

            if (!confirm("¿Estás seguro de que deseas cerrar sesión?")) {
                return;
            }

            try {
                const token = localStorage.getItem("jwtToken");

                await fetch('/auth/logout', {
                    method: 'POST',
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                localStorage.clear();

                Toast.success("Sesión cerrada con éxito");
                setTimeout(() => window.location.href = '/', 1000);

            } catch (error) {
                console.error("Error al cerrar sesión:", error);
                localStorage.clear();
                Toast.info("Sesión cerrada");
                setTimeout(() => window.location.href = '/', 1000);
            }
        });
    }
});

document.addEventListener('sesionActualizada', async () => {
    await inicializarNavbar();
});
