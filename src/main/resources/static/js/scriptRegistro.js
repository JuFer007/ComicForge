document.getElementById("RegistroForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("InputEmail1").value.trim();
    const password = document.getElementById("InputPassword1").value;
    const confirmPassword = document.getElementById("InputPassword2").value;
    const userName = document.getElementById("inputUser").value.trim();

    if (!userName) {
        Toast.error('El nombre de usuario es obligatorio');
        return;
    }

    if (!email) {
        Toast.error('El email es obligatorio');
        return;
    }

    if (password.length < 6) {
        Toast.error('La contraseña debe tener al menos 6 caracteres');
        return;
    }

    if (password !== confirmPassword) {
        Toast.error('Las contraseñas no coinciden');
        return;
    }

    try {
        const response = await fetch("/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({ email, password, userName })
        });

        const data = await response.json();

        if (data.success) {
            localStorage.setItem("jwtToken", data.token);
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("userId", data.userId);
            localStorage.setItem("userName", data.userName);
            localStorage.setItem("profilePic", data.profilePic);
            localStorage.setItem("role", data.role);

            console.log("JWT Token guardado:", data.token);
            console.log("Usuario registrado:", {
                userId: data.userId,
                userName: data.userName,
                role: data.role
            });

            Toast.success('Registro exitoso');

            setTimeout(() => {
                window.location.href = `/user/profile/${data.userId}`;
            }, 1000);
        } else {
            Toast.error(data.message || 'Error al registrar usuario');
        }
    } catch (error) {
        console.error(error);
        Toast.error('Error de conexión');
    }
});
