document.addEventListener("DOMContentLoaded", () => {
    // Selecciona el formulario
    const form = document.querySelector("form");

    // Maneja el evento submit
    form.addEventListener("submit", (e) => {
        e.preventDefault(); // Evita recarga automática

        // Obtiene valores ingresados
        const email = document.getElementById("exampleInputEmail1").value.trim();
        const password = document.getElementById("exampleInputPassword1").value.trim();

        // Credenciales de prueba
        const validEmail = "admin@comicforge.com";
        const validPass = "12345";

        if (email === validEmail && password === validPass) {
            window.location.href = "/html/userProfile.html";
        } else {
            alert("Usuario o contraseña incorrectos");
        }
    });
});