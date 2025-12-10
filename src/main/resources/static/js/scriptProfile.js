const profilePicElement = document.getElementById('profilePic');
const coverImg = document.getElementById('coverImg');
const coverSelect = document.getElementById('coverSelect');
const editModalEl = document.getElementById('editProfileModal');
const avatarModalEl = document.getElementById('avatarModal');

let selectedAvatar = profilePicElement?.src || '';
let selectedCover = coverImg?.src || '';

const userName = document.getElementById('username');
const userBio = document.getElementById('userBio');
const userId = document.getElementById('userId')?.value;

editModalEl?.addEventListener('show.bs.modal', () => {
    const newNameInput = document.getElementById('newName');
    const newBioInput = document.getElementById('newBio');

    if (newNameInput && !newNameInput.value)
        newNameInput.value = userName?.textContent.trim() || '';

    if (newBioInput && !newBioInput.value)
        newBioInput.value = userBio?.textContent.trim() || '';
});

function restaurarPerfil() {
    if (localStorage.getItem("profilePic") && profilePicElement)
        profilePicElement.src = localStorage.getItem("profilePic");
    if (localStorage.getItem("coverImg") && coverImg)
        coverImg.src = localStorage.getItem("coverImg");
    if (localStorage.getItem("username") && userName)
        userName.textContent = localStorage.getItem("username");
    if (localStorage.getItem("userBio") && userBio)
        userBio.textContent = localStorage.getItem("userBio");
}

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

coverSelect?.addEventListener('change', () => {
    selectedCover = coverSelect.value;
});

document.getElementById('saveChanges')?.addEventListener('click', async () => {
    if (!userId) {
        console.error("No se encontró ID del usuario.");
        Toast.error("Error: Usuario no identificado");
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

            Toast.success('Perfil actualizado correctamente');

            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } else {
            Toast.error("Error al guardar los cambios.");
        }
    } catch (error) {
        console.error("Error al actualizar:", error);
        Toast.error("Error de conexión al actualizar perfil");
    }
});

document.getElementById('cancelChanges')?.addEventListener('click', () => {
    document.getElementById('editForm')?.reset();
    const editModal = bootstrap.Modal.getInstance(editModalEl);
    editModal?.hide();
});

async function logout() {
    if (confirm("¿Estás seguro de que deseas cerrar sesión?")) {
        try {
            const token = localStorage.getItem("jwtToken");

            const response = await fetch("/auth/logout", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            localStorage.clear();

            if (response.ok) {
                Toast.success("Sesión cerrada con éxito");
            } else {
                Toast.warning("Sesión cerrada localmente");
            }

            setTimeout(() => {
                window.location.href = "/";
            }, 1000);

        } catch (error) {
            console.error("Error al cerrar sesión:", error);
            localStorage.clear();
            Toast.info("Sesión cerrada");
            setTimeout(() => {
                window.location.href = "/";
            }, 1000);
        }
    }
}

document.getElementById('logoutBtn')?.addEventListener('click', logout);
document.getElementById('btn-CerrarSesion')?.addEventListener('click', logout);

async function agregarAFavoritos(comicId, buttonEl) {
    if (!userId) {
        Toast.error('Inicie sesión para agregar a favoritos');
        return;
    }

    try {
        const response = await fetch(`/user/${userId}/favoritos/add/${comicId}`, { method: "POST" });
        const result = await response.text();

        if (response.ok) {
            buttonEl.style.display = 'none';

            const parentDiv = buttonEl.closest('.d-flex');
            if (parentDiv) {
                parentDiv.classList.remove('justify-content-between');
                parentDiv.classList.add('justify-content-center');
            }

            Toast.success('Cómic agregado a favoritos');

            setTimeout(() => {
                cargarFavoritos(userId);
            }, 1000);
        } else {
            Toast.error(result || 'Error al agregar favorito');
        }
    } catch (error) {
        console.error("Error al agregar favorito:", error);
        Toast.error("Error de conexión al agregar favorito");
    }
}

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

        if (!misComicsContainer) return;

        misComicsContainer.innerHTML = '';

        if (comics.length === 0) {
            if (noMisComics) noMisComics.style.display = 'block';
            return;
        }

        if (noMisComics) noMisComics.style.display = 'none';

        comics.forEach(comic => {
            const esFavorito = favoritosIds.includes(comic.id);
            const justifyClass = esFavorito ? 'justify-content-center' : 'justify-content-between';

            const comicCard = document.createElement('div');
            comicCard.className = 'col-md-4 mb-4';
            comicCard.innerHTML = `
                <div class="card h-100 shadow-sm">
                    <img src="${comic.imageSRC}" class="card-img-top" alt="${comic.title}" style="height: 400px; object-fit: cover;">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${comic.title}</h5>
                        <div class="mt-auto d-flex ${justifyClass} gap-2">
                            <a href="/comic/read/${comic.id}" class="btn btn-dark botonLeer">
                                <i class="bi bi-book-fill"></i> Leer
                            </a>
                            ${!esFavorito ? `
                                <button class="btn btn-danger btn-sm btn-add-fav botonFavoritos" data-id="${comic.id}">
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

async function cargarFavoritos(userId) {
    if (!userId) return;

    const favoritosContainer = document.getElementById('favoritosContainer');
    const noFavoritos = document.getElementById('noFavoritos');

    if (!favoritosContainer) return;

    favoritosContainer.innerHTML = '';
    if (noFavoritos) noFavoritos.style.display = 'none';

    try {
        const response = await fetch(`/user/${userId}/favoritos`);
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

        const favoritos = await response.json();

        if (favoritos.length === 0) {
            if (noFavoritos) noFavoritos.style.display = 'block';
            return;
        }

        favoritos.forEach(comic => {
            const comicCard = document.createElement('div');
            comicCard.className = 'col-md-4 mb-4';
            comicCard.innerHTML = `
                <div class="card h-100 shadow-sm">
                    <img src="${comic.imageSRC}" class="card-img-top" alt="${comic.title}" style="height: 400px; object-fit: cover;">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${comic.title}</h5>
                        <div class="mt-auto d-flex justify-content-center">
                            <a href="/comic/read/${comic.id}" class="btn btn-dark btn-sm botonLeer">
                                <i class="bi bi-book-fill"></i> Leer
                            </a>
                        </div>
                    </div>
                </div>
            `;
            favoritosContainer.appendChild(comicCard);
        });
    } catch (error) {
        console.error('Error al cargar favoritos:', error);
        if (noFavoritos) noFavoritos.style.display = 'block';
    }
}

document.addEventListener("DOMContentLoaded", () => {
    restaurarPerfil();
    cargarMisComics(userId);
    cargarFavoritos(userId);
});
