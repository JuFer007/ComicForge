document.getElementById("RegistroForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("InputEmail1").value;
    const password = document.getElementById("InputPassword1").value;
    const confirmPassword = document.getElementById("InputPassword2").value;
    const userName = document.getElementById("inputUser").value;

    if (password !== confirmPassword) {
        alert("Las contraseñas no coinciden.");
        return;
    }

    try {
        const response = await fetch("/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({ email, password, userName })
        });

        if (response.ok) {
            alert("¡Registro exitoso!");
            window.location.href = "/login";
        } else {
            alert("Error al registrar usuario.");
        }
    } catch (error) {
        console.error(error);
        alert("Ocurrió un error inesperado.");
    }
});
