const profilePic = document.getElementById("profilePic");
const userName = document.getElementById("username");
const userBio = document.getElementById("userBio");
const coverImg = document.getElementById("coverImg");
const coverSelect = document.getElementById("coverSelect");
const editModalEl = document.getElementById("editProfileModal");
const avatarModalEl = document.getElementById("avatarModal");

let selectedAvatar = localStorage.getItem("profilePic") || "/recursos/default-avatar.png";
let selectedCover  = localStorage.getItem("coverImg") || "";

//Restaurar perfil desde localStorage
function restaurarPerfil() {
    if (profilePic) profilePic.src = selectedAvatar;
    if (coverImg) coverImg.src = selectedCover;
    if (userName) userName.textContent = localStorage.getItem("username") || "ComicForgeAdmin";
    if (userBio) userBio.textContent = localStorage.getItem("userBio") || "";
}

//Seleccionar avatar
function configurarSeleccionAvatar() {
    document.querySelectorAll('.avatar-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const img = item.querySelector('img');
            if (img) selectedAvatar = img.src;

            bootstrap.Modal.getOrCreateInstance(avatarModalEl).hide();
            bootstrap.Modal.getOrCreateInstance(editModalEl).show();
        });
    });
}

//Seleccionar portada
function configurarSeleccionCover() {
    if (!coverSelect) return;
    coverSelect.addEventListener('change', () => {
        selectedCover = coverSelect.value;
    });
}

//Guardar cambios
function guardarCambiosPerfil() {
    if (profilePic && selectedAvatar) {
        profilePic.src = selectedAvatar;
        localStorage.setItem("profilePic", selectedAvatar);
    }
    if (coverImg && selectedCover) {
        coverImg.src = selectedCover;
        localStorage.setItem("coverImg", selectedCover);
    }

    const newName = (document.getElementById('newName')?.value || '').trim();
    const newBio  = (document.getElementById('newBio')?.value || '').trim();

    if (newName) {
        userName.textContent = newName;
        localStorage.setItem("username", newName);
    }
    if (newBio) {
        userBio.textContent = newBio;
        localStorage.setItem("userBio", newBio);
    }

    bootstrap.Modal.getOrCreateInstance(editModalEl).hide();
    document.getElementById('editForm')?.reset();
}

//Cancelar cambios
function cancelarCambiosPerfil() {
    bootstrap.Modal.getOrCreateInstance(editModalEl).hide();
    document.getElementById('editForm')?.reset();
}

//Abrir ccomic
function abrirComic(linkComic) {
    const link = linkComic?.href;
    if (!link) return;
    window.open(link, "_blank", "width=1000,height=800,scrollbars=yes,resizable=yes");
}

//Para cargar la pagina
window.addEventListener("DOMContentLoaded", () => {
    restaurarPerfil();
    configurarSeleccionAvatar();
    configurarSeleccionCover();

    document.getElementById('saveChanges')?.addEventListener('click', guardarCambiosPerfil);
    document.getElementById('cancelChanges')?.addEventListener('click', cancelarCambiosPerfil);
});
