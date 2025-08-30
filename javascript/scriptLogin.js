document.addEventListener("DOMContentLoaded", () => {
    const userPic  = localStorage.getItem("profilePic");
    const userName = localStorage.getItem("username");

    //Variables del navbar
    const loginNav   = document.getElementById("loginNav");
    const userNav    = document.getElementById("userNav");
    const navUserPic = document.getElementById("navUserPic");

    const offcanvasLogin = document.querySelector("#top-navbar .nav-link[href='/html/login.html']");

    if (userName) {
        if (userPic) navUserPic.src = userPic;
        loginNav.classList.add("d-none");
        userNav.classList.remove("d-none");

        if (offcanvasLogin) {
            offcanvasLogin.setAttribute("href", "/html/userProfile.html");
            offcanvasLogin.innerHTML = `<i class="fa-solid fa-user"></i> Mi Perfil`;
        }
    } else {
        loginNav.classList.remove("d-none");
        userNav.classList.add("d-none");

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
            location.reload();
        });
    }
});
