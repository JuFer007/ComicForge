// ========================
// LOGIN TRADICIONAL
// ========================
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const email = document.getElementById("exampleInputEmail1").value;
            const password = document.getElementById("exampleInputPassword1").value;

            try {
                const response = await fetch("/auth/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    credentials: "include",
                    body: new URLSearchParams({ email, password })
                });

                if (!response.ok) {
                    Toast.error("Credenciales incorrectas");
                    return;
                }

                let data;
                try {
                    data = await response.json();
                } catch (jsonError) {
                    console.error("Error al convertir la respuesta a JSON:", jsonError);
                    Toast.error("El servidor no devolvió datos válidos");
                    return;
                }

                if (!data.success) {
                    Toast.error(data.message || "Error al iniciar sesión");
                    return;
                }

                localStorage.setItem("isLoggedIn", "true");
                localStorage.setItem("userId", data.userId);
                localStorage.setItem("userName", data.userName);
                localStorage.setItem("profilePic", data.profilePic);
                localStorage.setItem("role", data.role);

                Toast.success("Bienvenido, inicio de sesión exitoso");

                // Redirigir inmediatamente sin setTimeout
                if (data.role === "admin") {
                    window.location.href = "/admin";
                } else {
                    window.location.href = `/user/profile/${data.userId}`;
                }

            } catch (error) {
                console.error("Error de conexión o servidor caído:", error);
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
            const response = await fetch("/auth/logout", {
                method: "POST",
                credentials: "include"
            });

            if (response.ok) {
                localStorage.clear();
                Toast.success("Sesión cerrada con éxito");
                setTimeout(() => {
                    window.location.href = "/";
                }, 1500);
            } else {
                const msg = await response.text();
                Toast.error("Error al cerrar sesión: " + msg);
            }
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
            Toast.error("Error de conexión al cerrar sesión");
        }
    }
}

// ========================
// VERIFICAR SESIÓN ACTIVA
// ========================
document.addEventListener("DOMContentLoaded", async () => {
    const currentPath = window.location.pathname;
    const authPages = ['/login', '/registro', '/auth/register'];

    if (authPages.includes(currentPath)) {
        console.log("En página de autenticación, no verificar redirección");
        return;
    }

    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const userId = localStorage.getItem("userId");
    const role = localStorage.getItem("role");

    if (isLoggedIn && userId) {
        try {
            const response = await fetch('/api/session/status');
            const data = await response.json();

            if (data.isLoggedIn) {
                if (currentPath === '/' || currentPath === '/index') {
                    if (role === "admin") {
                        window.location.href = "/admin";
                    } else {
                        window.location.href = `/user/profile/${userId}`;
                    }
                }
            }
        } catch (error) {
            console.error("Error al verificar sesión:", error);
        }
    }
});
