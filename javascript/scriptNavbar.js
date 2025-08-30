document.addEventListener("DOMContentLoaded", () => {
    const loginNav   = document.getElementById("loginNav");
    const userNav    = document.getElementById("userNav");
    const navUserPic = document.getElementById("navUserPic");
    const offcanvasLogin = document.querySelector("#top-navbar .nav-link[href='/html/login.html']");
    const toastEl = document.getElementById("toastBienvenida");
    const userNameLS = localStorage.getItem("username");
    const userPicLS  = localStorage.getItem("profilePic");

    if (userNameLS) {
        if (userPicLS && navUserPic) navUserPic.src = userPicLS;

        if (loginNav) loginNav.classList.add("d-none");
        if (userNav) userNav.classList.remove("d-none");

        if (offcanvasLogin) {
            offcanvasLogin.setAttribute("href", "/html/userProfile.html");
            offcanvasLogin.innerHTML = `<i class="fa-solid fa-user"></i> Mi Perfil`;
        }

        //Mostrar toast solo si se acaba de iniciar sesión
        if (toastEl && localStorage.getItem("isLoggedIn") === "true") {
            const toast = new bootstrap.Toast(toastEl);
            toast.show();
            localStorage.removeItem("isLoggedIn");
        }

    } else {
        if (loginNav) loginNav.classList.remove("d-none");
        if (userNav) userNav.classList.add("d-none");

        if (offcanvasLogin) {
            offcanvasLogin.setAttribute("href", "/html/login.html");
            offcanvasLogin.innerHTML = `<i class="fa-solid fa-user"></i> Iniciar Sesión`;
        }
    }

    //Botón de cerrar sesión
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.removeItem("username");
            localStorage.removeItem("profilePic");
            localStorage.removeItem("coverImg");
            localStorage.removeItem("userBio");
            window.location.href = "/index.html";
        });
    }
});
