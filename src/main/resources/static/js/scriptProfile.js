// --- Referencias principales ---
const profilePic = document.getElementById('profilePic');
const coverImg = document.getElementById('coverImg');
const coverSelect = document.getElementById('coverSelect');
const editModalEl = document.getElementById('editProfileModal');
const avatarModalEl = document.getElementById('avatarModal');

let selectedAvatar = profilePic?.src || '';
let selectedCover = coverImg?.src || '';

const userName = document.getElementById('username');
const userBio = document.getElementById('userBio');
const userId = document.getElementById('userId')?.value;

// --- Modal de edición ---
editModalEl?.addEventListener('show.bs.modal', () => {
    const newNameInput = document.getElementById('newName');
    const newBioInput = document.getElementById('newBio');

    if (newNameInput && !newNameInput.value)
        newNameInput.value = userName?.textContent.trim() || '';

    if (newBioInput && !newBioInput.value)
        newBioInput.value = userBio?.textContent.trim() || '';
});

// --- Restaurar perfil desde localStorage ---
function restaurarPerfil() {
    if (localStorage.getItem("profilePic"))
        profilePic.src = localStorage.getItem("profilePic");
    if (localStorage.getItem("coverImg"))
        coverImg.src = localStorage.getItem("coverImg");
    if (localStorage.getItem("username"))
        userName.textContent = localStorage.getItem("username");
    if (localStorage.getItem("userBio"))
        userBio.textContent = localStorage.getItem("userBio");
}

// --- Selección de avatar ---
document.querySelectorAll('.avatar-item').forEach(item => {
    item.addEventListener('click', () => {
        const img = item.querySelector('img');
        if (img) selectedAvatar = img.src;

        const avatarModal = bootstrap.Modal.getOrCreateInstance(avatarModalEl);
        avatarModal.hide();

        avatarModalEl.addEventListener('hidden.bs.modal', function reopenEditModal() {
            const editModal = bootstrap.Modal.getOrCreateInstance(editModalEl);
            editModal.show();
            avatarModalEl.removeEventListener('hidden.bs.modal', reopenEditModal);
        });
    });
});

// --- Selección de portada ---
coverSelect?.addEventListener('change', () => {
    selectedCover = coverSelect.value;
});

// --- Guardar cambios de perfil ---
document.getElementById('saveChanges')?.addEventListener('click', async () => {
    if (!userId) {
        console.log("No se encontró ID del usuario.");
        return;
    }

    const newName = (document.getElementById('newName')?.value || '').trim();
    const newBio = (document.getElementById('newBio')?.value || '').trim();

    try {
        const response = await fetch(`/user/profile/${userId}/edit`, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                userName: newName,
                userBio: newBio,
                profilePicture: selectedAvatar,
                coverImageURL: selectedCover
            })
        });

        if (response.ok) {
            localStorage.setItem("profilePic", selectedAvatar);
            localStorage.setItem("coverImg", selectedCover);
            localStorage.setItem("username", newName);
            localStorage.setItem("userBio", newBio);
            window.location.reload();
        } else {
            console("Error al guardar los cambios.");
        }
    } catch (error) {
        console.error("Error al actualizar:", error);
    }
});

// --- Cancelar cambios ---
document.getElementById('cancelChanges')?.addEventListener('click', () => {
    document.getElementById('editForm')?.reset();
    const editModal = bootstrap.Modal.getInstance(editModalEl);
    editModal?.hide();
});

// --- Cerrar sesión ---
function logout() {
    localStorage.clear();
    window.location.href = "/";
}
document.getElementById('logoutBtn')?.addEventListener('click', logout);
document.getElementById('btn-CerrarSesion')?.addEventListener('click', logout);

// --- Agregar a favoritos ---
async function agregarAFavoritos(comicId, buttonEl) {
    if (!userId) {
        Toast.error('Inicie sesión para agregar a favoritos');
        return;
    }

    try {
        const response = await fetch(`/user/${userId}/favoritos/add/${comicId}`, { method: "POST" });
        const result = await response.text();

        if (response.ok) {
            // Ocultar botón de favorito
            buttonEl.style.display = 'none';

            // Centrar el botón restante
            const parentDiv = buttonEl.closest('.d-flex');
            if (parentDiv) {
                parentDiv.classList.remove('justify-content-between');
                parentDiv.classList.add('justify-content-center');
            }

            Toast.success('Cómic agregado a favoritos');
            window.location.reload();
        } else {
            console.log(result);
        }
    } catch (error) {
        console.error("Error al agregar favorito:", error);
    }
}

// --- Cargar cómics del usuario ---
async function cargarMisComics(userId) {
    if (!userId) return;

    try {
        const [comicsRes, favsRes] = await Promise.all([
            fetch(`/user/profile/${userId}/comics`),
            fetch(`/user/${userId}/favoritos`)
        ]);

        if (!comicsRes.ok || !favsRes.ok) throw new Error("Error al obtener datos.");

        const comics = await comicsRes.json();
        const favoritos = await favsRes.json();
        const favoritosIds = favoritos.map(f => f.id);

        const misComicsContainer = document.getElementById('misComicsContainer');
        const noMisComics = document.getElementById('noMisComics');
        misComicsContainer.innerHTML = '';

        if (comics.length === 0) {
            noMisComics.style.display = 'block';
            return;
        }

        noMisComics.style.display = 'none';
        comics.forEach(comic => {
            const esFavorito = favoritosIds.includes(comic.id);
            const justifyClass = esFavorito ? 'justify-content-center' : 'justify-content-between';

            const comicCard = document.createElement('div');
            comicCard.className = 'col-md-4 mb-4';
            comicCard.innerHTML = `
                <div class="card h-100 shadow-sm">
                    <img src="${comic.imageSRC}" class="card-img-top" alt="${comic.title}">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${comic.title}</h5>
                        <div class="mt-auto d-flex ${justifyClass} gap-3">
                            <a href="${comic.link_comic || '#'}" class="btn btn-danger btn-sm" target="_blank">
                                <i class="bi bi-book"></i> Leer
                            </a>
                            ${!esFavorito ? `
                                <button class="btn btn-danger btn-sm btn-add-fav" data-id="${comic.id}">
                                    <i class="bi bi-heart"></i> Favoritos
                                </button>` : ''}
                        </div>
                    </div>
                </div>
            `;
            misComicsContainer.appendChild(comicCard);
        });

        document.querySelectorAll('.btn-add-fav').forEach(btn => {
            btn.addEventListener('click', e => {
                const comicId = e.currentTarget.getAttribute('data-id');
                agregarAFavoritos(comicId, e.currentTarget);
            });
        });
    } catch (error) {
        console.error('Error al cargar mis cómics:', error);
    }
}

// --- Cargar favoritos ---
async function cargarFavoritos(userId) {
    if (!userId) return;

    const favoritosContainer = document.getElementById('favoritosContainer');
    const noFavoritos = document.getElementById('noFavoritos');

    favoritosContainer.innerHTML = '';
    noFavoritos.style.display = 'none';

    try {
        const response = await fetch(`/user/${userId}/favoritos`);
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

        const favoritos = await response.json();

        if (favoritos.length === 0) {
            noFavoritos.style.display = 'block';
            return;
        }

        favoritos.forEach(comic => {
            const comicCard = document.createElement('div');
            comicCard.className = 'col-md-4 mb-4';
            comicCard.innerHTML = `
                <div class="card h-100 shadow-sm">
                    <img src="${comic.imageSRC}" class="card-img-top" alt="${comic.title}">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${comic.title}</h5>
                        <div class="mt-auto d-flex justify-content-center">
                            <a href="${comic.link_comic || '#'}" class="btn btn-danger btn-sm" target="_blank">
                                <i class="bi bi-book"></i> Leer
                            </a>
                        </div>
                    </div>
                </div>
            `;
            favoritosContainer.appendChild(comicCard);
        });
    } catch (error) {
        console.error('Error al cargar favoritos:', error);
        noFavoritos.style.display = 'block';
    }
}

// --- Al cargar la página ---
document.addEventListener("DOMContentLoaded", () => {
    restaurarPerfil();
    cargarMisComics(userId);
    cargarFavoritos(userId);
});
