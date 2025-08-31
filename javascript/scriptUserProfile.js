const coverSelect = document.getElementById('coverSelect');
const coverImg    = document.getElementById('coverImg');
const profilePic  = document.getElementById('profilePic');
const userName    = document.getElementById('username');
const userBio     = document.getElementById('userBio');
const editModalEl   = document.getElementById('editProfileModal');
const avatarModalEl = document.getElementById('avatarModal');

let selectedAvatar = profilePic?.src || '/recursos/default-avatar.png';
let selectedCover  = coverImg?.src || '';

// Restaurar datos desde localStorage
window.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("profilePic")) {
        profilePic.src = localStorage.getItem("profilePic");
        selectedAvatar = localStorage.getItem("profilePic");
    }
    if (localStorage.getItem("coverImg")) {
        coverImg.src = localStorage.getItem("coverImg");
        selectedCover = localStorage.getItem("coverImg");
    }
    if (localStorage.getItem("username")) {
        userName.textContent = localStorage.getItem("username");
    }
    if (localStorage.getItem("userBio")) {
        userBio.textContent = localStorage.getItem("userBio");
    }
});

// Selección de avatar
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

// Selección de portada
if (coverSelect) {
    coverSelect.addEventListener('change', () => {
        selectedCover = coverSelect.value;
    });
}

// Guardar cambios
const saveBtn = document.getElementById('saveChanges');
if (saveBtn) {
    saveBtn.addEventListener('click', () => {
        if (profilePic && selectedAvatar) {
            profilePic.src = selectedAvatar;
            localStorage.setItem("profilePic", selectedAvatar);
        }
        if (coverImg && selectedCover) {
            coverImg.src = selectedCover;
            localStorage.setItem("coverImg", selectedCover);
        }

        const newName = (document.getElementById('newName')?.value || '').trim();
        const newBio  = (document.getElementById('newBio')?.value  || '').trim();

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
    });
}

// Cancelar cambios
const cancelBtn = document.getElementById('cancelChanges');
if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
        bootstrap.Modal.getOrCreateInstance(editModalEl).hide();
        document.getElementById('editForm')?.reset();
    });
}

//Mostrar comic
function abrirComic(linkComic) {
    const link = linkComic?.href;
    window.open(link, "_blank", "width=1000,height=800,scrollbars=yes,resizable=yes");
}
