//=============== PARA INICIAR SESIÓN ===============
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const email = document.getElementById("exampleInputEmail1").value.trim();
        const password = document.getElementById("exampleInputPassword1").value.trim();

        const validEmail = "admin@comicforge.com";
        const validPass  = "12345";

        if (email === validEmail && password === validPass) {
            const loginNav = document.getElementById("loginNav");
            const inicioSesionResponsive = document.getElementById("inicioSesionResponsive");

            if (loginNav) {
                loginNav.querySelector("a").href = "/html/userProfile.html";
                loginNav.querySelector("a").textContent = "Mi Perfil";
            }

            if (inicioSesionResponsive) {
                inicioSesionResponsive.querySelector("a").href = "/html/userProfile.html";
                inicioSesionResponsive.querySelector(".inicio-texto").textContent = "Mi Perfil";
            }

            localStorage.setItem("isLoggedIn", "true");

            window.location.href = "/html/userProfile.html";
        } else {
            alert("Usuario o contraseña incorrectos");
        }
    });
}

//=============== PARA CERRAR SESIÓN ===============
const logoutBtn = document.getElementById("btn-CerrarSesion");

if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("isLoggedIn");

        const loginNav = document.getElementById("loginNav");
        const inicioSesionResponsive = document.getElementById("inicioSesionResponsive");

        if (loginNav) {
            loginNav.querySelector("a").href = "/html/login.html";
            loginNav.querySelector("a").textContent = "Iniciar Sesión";
        }

        if (inicioSesionResponsive) {
            inicioSesionResponsive.querySelector("a").href = "/html/login.html";
            inicioSesionResponsive.querySelector(".inicio-texto").textContent = "Iniciar Sesión";
        }
        window.location.href = "index.html";
    });
}
