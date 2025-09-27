function inicializarFormularios() {
    const loginForm = document.getElementById("loginForm");

    const usuariosPre = [
        {usario:'ComicForgeAdmin',email :'admin@comicforge.com', password : '12345'}
    ]

    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const emailImmput = document.getElementById("exampleInputEmail1");
            const passwordImmput = document.getElementById("exampleInputPassword1");

            const email = emailImmput.value.trim();
            const password = passwordImmput.value.trim();

            if(!email || !password){
                alert('Por favor completa todos los campos');
            }else{
                const usuarioValidos = usuariosPre.find(e => e.email === email && e.password === password);
                if(usuarioValidos){
                    localStorage.setItem('isLoggedIn','true');
                    localStorage.setItem('showToast','true');
                    localStorage.setItem('profilePic', 'https://i.pinimg.com/736x/f2/3d/d6/f23dd6eb040a2419677b05712d61597e.jpg');
                    actualizarNavbar(true);
                    window.location.href = "/user-profile";
                }else{
                    alert('Email o contraseña incorrecta');
                    emailImmput.value = "";
                    passwordImmput.value = "";
                }
            }

        });
    }

    //Cerrar sesion en pantallas grandes
    document.getElementById("logoutBtn")?.addEventListener("click", () => {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("profilePic");
        actualizarNavbar(false);
        window.location.href = "/";
    });

    //Cerrar sesion en pantallas pequeñas
    const btnCerrarSesion = document.getElementById("btn-CerrarSesion");

    if (btnCerrarSesion) {
        btnCerrarSesion.addEventListener("click", () => {
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("profilePic");
            actualizarNavbar(false);
            window.location.href = "/";
        });
    }

    const RegistroForm = document.getElementById('RegistroForm');
    if(RegistroForm){
        RegistroForm.addEventListener('submit', function(e){
            e.preventDefault();
            const username = document.getElementById('inputUser').value.trim();
            const email = document.getElementById('InputEmail1').value.trim();
            const password1 = document.getElementById('InputPassword1').value.trim();
            const password2 = document.getElementById('InputPassword2').value.trim();
            const usuarioValido = usuariosPre.find(e=> e.usario === username)


            if (!username || !email || !password1 || !password2) {
                alert('Por favor, completa todos los campos para registrarte.');
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
                alert('Ingresa un correo valido ');
            } else if (password1.length < 6){
                alert('La contraseña debe tener al menos 6 caracteres.');
            } else if (password1 !== password2){
                alert('Las contraseñas no coinciden')
            }else if (usuarioValido) {
                alert('El nombre de usuario no se encuentra disponible. Escoja otro.');
            }else{
                localStorage.setItem('isLoggedIn','true');
                localStorage.setItem('showToast','true');
                localStorage.setItem('profilePic', 'https://i.pinimg.com/736x/f2/3d/d6/f23dd6eb040a2419677b05712d61597e.jpg');
                actualizarNavbar(true);
                window.location.href = "/user-profile";
            }
        });
    }
}
