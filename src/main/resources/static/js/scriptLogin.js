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
                credentials: "include", // ✅ Importante para mantener la sesión
                body: new URLSearchParams({ email, password })
            });

            if (response.ok) {
                const user = await response.json();

                localStorage.setItem("isLoggedIn", "true");
                localStorage.setItem("userId", user.id);
                localStorage.setItem("userName", user.userName);
                localStorage.setItem("profilePic", user.profilePicture);
                localStorage.setItem("role", user.role);

                alert("Bienvenido " + user.userName);

                if (user.role === "admin") {
                    window.location.href = "/admin";
                } else {
                    window.location.href = `/user/profile/${user.id}`;
                }
            } else {
                alert("Credenciales incorrectas");
            }
        } catch (error) {
            console.error(error);
            alert("Error al conectar con el servidor");
        }
    });
});

async function logout() {
    if (confirm("¿Estás seguro de que deseas cerrar sesión?")) {
        try {
            const response = await fetch("/auth/logout", {
                method: "POST",
                credentials: "include" // ✅ Sin headers ni body
            });

            if (response.ok) {
                localStorage.clear();
                window.location.href = "/";
            } else {
                const msg = await response.text();
                alert("Error: " + msg);
            }
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
            alert("Hubo un problema al cerrar sesión. Intenta de nuevo.");
        }
    }
}
