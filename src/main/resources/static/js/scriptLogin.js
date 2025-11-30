document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const email = document.getElementById("exampleInputEmail1").value.trim();
            const password = document.getElementById("exampleInputPassword1").value;

            // Validaciones
            if (!email) { Toast.error("El email es obligatorio"); return; }
            if (!password) { Toast.error("La contraseña es obligatoria"); return; }

            try {
                const response = await fetch("/auth/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (!data.success) {
                    Toast.error(data.message || "Error al iniciar sesión");
                    return;
                }

                // Guardar datos en localStorage
                localStorage.setItem("jwtToken", data.token);
                localStorage.setItem("isLoggedIn", "true");
                localStorage.setItem("userId", data.userId);
                localStorage.setItem("userName", data.userName);
                localStorage.setItem("profilePic", data.profilePic);
                localStorage.setItem("role", data.role);

                document.dispatchEvent(new CustomEvent('sesionActualizada'));

                Toast.success("Bienvenido, inicio de sesión exitoso");

                // REDIRECCIÓN INMEDIATA SIN VERIFICACIONES ADICIONALES
                setTimeout(() => {
                    if (data.role === "admin") {
                        window.location.replace("/admin");
                    } else {
                        window.location.replace("/");
                    }
                }, 800);

            } catch (error) {
                console.error("Error de conexión:", error);
                Toast.error("Error de conexión con el servidor");
            }
        });
    }
});

// ========================
// LOGOUT
// ========================
async function logout() {
    if (confirm("¿Estás seguro de que deseas cerrar sesión?")) {
        try {
            const token = localStorage.getItem("jwtToken");

            const response = await fetch("/auth/logout", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            localStorage.clear();

            if (response.ok) {
                Toast.success("Sesión cerrada con éxito");
            } else {
                Toast.warning("Sesión cerrada localmente");
            }

            setTimeout(() => {
                window.location.href = "/";
            }, 1000);

        } catch (error) {
            console.error("Error al cerrar sesión:", error);
            localStorage.clear();
            Toast.info("Sesión cerrada");
            setTimeout(() => {
                window.location.href = "/";
            }, 1000);
        }
    }
}

// ========================
// VERIFICAR SESIÓN ACTIVA - SOLO PARA PROTEGER RUTAS
// ========================
document.addEventListener("DOMContentLoaded", async () => {
    const currentPath = window.location.pathname;

    // Lista de páginas públicas que NO requieren verificación
    const publicPages = ['/login', '/registro', '/auth/register', '/', '/index', '/personajes', '/descuentos'];

    // Si estamos en una página pública, no verificar nada
    if (publicPages.some(page => currentPath === page || currentPath.startsWith(page))) {
        console.log("Página pública, no verificar sesión");
        return;
    }

    // Si estamos en /admin, verificar que sea admin
    if (currentPath === '/admin' || currentPath.startsWith('/admin/')) {
        const role = localStorage.getItem("role");
        const token = localStorage.getItem("jwtToken");

        if (!token || role !== "admin") {
            console.log("No autorizado para admin, redirigiendo...");
            Toast.error("No tienes permisos para acceder a esta página");
            setTimeout(() => window.location.href = '/login', 1000);
            return;
        }

        // Verificar token válido
        try {
            const response = await fetch('/api/session/status', {
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (response.status === 401) {
                localStorage.clear();
                Toast.error("Tu sesión ha expirado");
                setTimeout(() => window.location.href = '/login', 1500);
            }
        } catch (error) {
            console.error("Error al verificar sesión:", error);
        }
    }
});
