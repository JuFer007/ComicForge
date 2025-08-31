const coverSelect = document.getElementById('coverSelect');
const coverImg    = document.getElementById('coverImg');
const profilePic  = document.getElementById('profilePic');

let selectedAvatar = profilePic?.src || '';
let selectedCover  = coverImg?.src || '';

const userName = document.getElementById('username');
const userBio  = document.getElementById('userBio');

const editModalEl   = document.getElementById('editProfileModal');
const avatarModalEl = document.getElementById('avatarModal');

// ====== Restaurar datos desde localStorage ======
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

//====== Selección de avatar (modal secundario) ======
document.querySelectorAll('.avatar-item').forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const img = item.querySelector('img');
        if (img) selectedAvatar = img.src;

        const avatarModal = bootstrap.Modal.getOrCreateInstance(avatarModalEl);
        avatarModal.hide();

        const editModal = bootstrap.Modal.getOrCreateInstance(editModalEl);
        editModal.show();
    });
});

// ====== Selección de portada (combo) ======
if (coverSelect) {
    coverSelect.addEventListener('change', () => {
        selectedCover = coverSelect.value;
    });
}

// ====== Guardar cambios (modal principal) ======
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

        const editModal = bootstrap.Modal.getOrCreateInstance(editModalEl);
        editModal.hide();
        document.getElementById('editForm')?.reset();
    });
}

// ====== Cancelar cambios (modal principal) ======
const cancelBtn = document.getElementById('cancelChanges');
if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
        const editModal = bootstrap.Modal.getOrCreateInstance(editModalEl);
        editModal.hide();
        document.getElementById('editForm')?.reset();
    });
}

//Logica para cambiar entre los tabs
document.addEventListener("DOMContentLoaded", () => {
    const tabButtons = document.querySelectorAll(".tabs-encabezados button");
    const tabContents = document.querySelectorAll(".tabs-contenido > div");
    const indicator = document.querySelector(".indicador");

    tabButtons.forEach((button, index) => {
        button.addEventListener("click", () => {
            const target = button.getAttribute("data-tab");

            tabButtons.forEach(btn => btn.classList.remove("activo"));
            tabContents.forEach(tab => tab.classList.remove("activo"));

            button.classList.add("activo");
            document.getElementById(target).classList.add("activo");

            indicator.style.left = `${(100 / tabButtons.length) * index}%`;
            indicator.style.width = `${100 / tabButtons.length}%`;
        });
    });
});

//Mostrar comic
function abrirComic(linkComic) {
    const link = linkComic?.href;
    window.open(
        link,
        "_blank",
        "width=1000,height=800,scrollbars=yes,resizable=yes"
    );
}