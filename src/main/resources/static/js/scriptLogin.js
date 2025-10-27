document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");

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

            let user;
            try {
                user = await response.json();
            } catch (jsonError) {
                console.error("Error al convertir la respuesta a JSON:", jsonError);
                console.log("El servidor no devolvió datos válidos");
                return;
            }

            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("userId", user.id);
            localStorage.setItem("userName", user.userName);
            localStorage.setItem("profilePic", user.profilePicture);
            localStorage.setItem("role", user.role);

            Toast.success("Bienvenido, inicio de sesión exitoso");

            setTimeout(() => {
                if (user.role === "admin") {
                    window.location.href = "/admin";
                } else {
                    window.location.href = `/user/profile/${user.id}`;
                }
            }, 1000);

        } catch (error) {
            console.error("Error de conexión o servidor caído:", error);
        }
    });
});

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
                }, 2000);
            } else {
                const msg = await response.text();
                console.log("Error: " + msg);
            }
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    }
}
