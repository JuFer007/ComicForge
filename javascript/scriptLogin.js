document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.querySelector("form");
    const loginBtn = document.querySelector("a[href='html/login.html']");
    const logoutBtn = document.getElementById("btn-CerrarSesion");


    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const email = document.getElementById("exampleInputEmail1").value.trim();
            const password = document.getElementById("exampleInputPassword1").value.trim();

            const validEmail = "admin@comicforge.com";
            const validPass = "12345";

            if (email === validEmail && password === validPass) {
                localStorage.setItem("isLoggedIn", "true");

                window.location.href = "/html/userProfile.html";
            } else {
                alert("Usuario o contraseña incorrectos");
            }
        });
    }

    if (loginBtn) {
        if (localStorage.getItem("isLoggedIn") === "true") {
            loginBtn.setAttribute("href", "html/userProfile.html");
        } else {
            loginBtn.setAttribute("href", "html/login.html");
        }
    }

    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("isLoggedIn");
            window.location.href = "/index.html";
        });
    }
});
