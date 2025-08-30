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
            localStorage.setItem("username", "Admin");
            localStorage.setItem("profilePic", "https://cdn-icons-png.flaticon.com/512/1946/1946429.png");
            window.location.href = "html/userProfile.html";
        }
    });
}
