const coverSelect = document.getElementById('coverSelect');
const coverImg    = document.getElementById('coverImg');
const profilePic  = document.getElementById('profilePic');

let selectedAvatar = profilePic?.src || '';
let selectedCover  = coverImg?.src || '';

const userName = document.getElementById('username');
const userBio  = document.getElementById('userBio');

const editModalEl   = document.getElementById('editProfileModal');
const avatarModalEl = document.getElementById('avatarModal');

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
        if (profilePic && selectedAvatar) profilePic.src = selectedAvatar;
        if (coverImg && selectedCover)    coverImg.src    = selectedCover;

        const newName = (document.getElementById('newName')?.value || '').trim();
        const newBio  = (document.getElementById('newBio')?.value  || '').trim();

        if (newName) userName.textContent = newName;
        if (newBio)  userBio.textContent  = newBio;

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
