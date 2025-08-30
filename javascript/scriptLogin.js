const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const email = document.getElementById("exampleInputEmail1").value.trim();
        const password = document.getElementById("exampleInputPassword1").value.trim();

        // Credenciales de ejemplo
        const validEmail = "admin@comicforge.com";
        const validPass  = "12345";

        if (email === validEmail && password === validPass) {
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("username");
            localStorage.setItem("profilePic");

            window.location.href = "/html/userProfile.html";
        } else {
            alert("Usuario o contraseña incorrectos");
        }
    });
}
