document.addEventListener("DOMContentLoaded", () => {
    const userPic  = localStorage.getItem("profilePic");
    const userName = localStorage.getItem("username");

    //Variables del navbar
    const loginNav   = document.getElementById("loginNav");
    const userNav    = document.getElementById("userNav");
    const navUserPic = document.getElementById("navUserPic");

    const offcanvasLogin = document.querySelector("#top-navbar .nav-link[href='/html/login.html']");

    //Si ya se inicio sesión
    if (userName) {
        if (userPic && navUserPic) navUserPic.src = userPic;

        if (loginNav) loginNav.classList.add("d-none");
        if (userNav) userNav.classList.remove("d-none");

        if (offcanvasLogin) {
            offcanvasLogin.setAttribute("href", "/html/userProfile.html");
            offcanvasLogin.innerHTML = `<i class="fa-solid fa-user"></i> Mi Perfil`;
        }

        //Mostrar el toast
        const toastEl = document.getElementById("toastBienvenida");
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

    //Para cerrar sesión
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.removeItem("username");
            localStorage.removeItem("profilePic");
            window.location.href = "/index.html";
        });
    }
});
