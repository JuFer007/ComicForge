document.addEventListener("DOMContentLoaded", () => {
    const loginNav = document.getElementById("loginNav");
    const userNav = document.getElementById("userNav");
    const navUserPic = document.getElementById("navUserPic");
    const navUserName = document.getElementById("navUserName");
    const carrito = document.getElementById("carritoCompras");

    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const username = localStorage.getItem("username") || "Usuario";
    const profilePic = localStorage.getItem("profilePic") || "/recursos/default-avatar.png";

    if (isLoggedIn) {
        if (loginNav) loginNav.classList.add("d-none");
        if (userNav) userNav.classList.remove("d-none");
        if (navUserPic) navUserPic.src = profilePic;
        if (navUserName) navUserName.textContent = username;
        if (carrito) carrito.classList.remove("d-none");
    } else {
        if (loginNav) loginNav.classList.remove("d-none");
        if (userNav) userNav.classList.add("d-none");
        if (carrito) carrito.classList.add("d-none");
    }

    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("username");
            localStorage.removeItem("profilePic");
            window.location.href = "/index.html";
        });
    }
});
