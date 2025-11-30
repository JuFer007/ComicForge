let modoEdicion = false;
let comicOriginal = {};
let comicIdToDelete = null;

document.addEventListener("DOMContentLoaded", async () => {
    const categoriaSelect = document.getElementById("categoriaSelect");
    const buscarInput = document.getElementById("buscarComic");
    const tablaBody = document.querySelector("#tablaComics tbody");

    let todosLosComics = [];

    await cargarComics("/api/comics/todos");

    categoriaSelect.addEventListener("change", async () => {
        const categoria = categoriaSelect.value;

        if (categoria === "todos" || categoria === "") {
            await cargarComics("/api/comics/todos");
            return;
        }

        try {
            const response = await fetch(`/api/comics/${categoria}`);
            if (!response.ok) throw new Error("Error al obtener los cómics");

            todosLosComics = await response.json();
            renderComics(todosLosComics);
        } catch (error) {
            console.error("Error:", error);
            tablaBody.innerHTML = `<tr><td colspan='6' class='text-center text-danger'>Error al cargar cómics</td></tr>`;
            Toast.error('Error al cargar los cómics de esta categoría');
        }
    });

    buscarInput.addEventListener("input", () => {
        const termino = buscarInput.value.toLowerCase();
        const filtrados = todosLosComics.filter(c => c.title.toLowerCase().includes(termino));
        renderComics(filtrados);
    });

    async function cargarComics(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error("Error al obtener los cómics");

            todosLosComics = await response.json();
            renderComics(todosLosComics);
        } catch (error) {
            console.error("Error:", error);
            tablaBody.innerHTML = `<tr><td colspan='6' class='text-center text-danger'>Error al cargar cómics</td></tr>`;
            Toast.error('Error al cargar los cómics');
        }
    }

    function renderComics(comics) {
        tablaBody.innerHTML = "";

        if (comics.length === 0) {
            tablaBody.innerHTML = "<tr><td colspan='6' class='text-center'>No se encontraron cómics</td></tr>";
            return;
        }

        comics.forEach(comic => {
            const comicJSON = JSON.stringify(comic).replace(/"/g, '&quot;');

            const row = `
                <tr>
                    <td>
                        <div class="comic-item d-flex align-items-center gap-2">
                            <img src="${comic.imageSRC || 'https://via.placeholder.com/100x150?text=Sin+Imagen'}"
                                 class="comic-cover"
                                 style="width:70px;height:100px;object-fit:cover;border-radius:6px;"
                                 alt="${comic.title}">
                            <span>${comic.title}</span>
                        </div>
                    </td>
                    <td>${comic.publisher}</td>
                    <td>S/. ${comic.price.toFixed(2)}</td>
                    <td>${comic.discountPercent ? comic.discountPercent + "%" : "Sin descuento"}</td>
                    <td>
                        <button class="btn-action btn-view" title="Ver"
                                onclick='verComic(${comicJSON})'>
                            <i class="bi bi-eye"></i>
                        </button>
                        <button class="btn-action btn-delete" title="Eliminar"
                                onclick="confirmarEliminarComic('${comic.id}')">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
            tablaBody.insertAdjacentHTML("beforeend", row);
        });
    }

    window.cargarComics = cargarComics;
});

// ==================================
// MODAL PARA VER/EDITAR CÓMIC
// ==================================
function verComic(comicData) {
    modoEdicion = false;
    comicOriginal = { ...comicData };

    document.getElementById('modalTitleText').textContent = 'Ver Cómic';
    document.getElementById('comicId').value = comicData.id || '';
    document.getElementById('modalTitle').value = comicData.title || '';
    document.getElementById('modalCategory').value = comicData.category || '';
    document.getElementById('modalPublisher').value = comicData.publisher || '';
    document.getElementById('modalPrice').value = comicData.price || '';
    document.getElementById('modalDiscount').value = comicData.discountPercent || 0;
    document.getElementById('modalDescription').value = comicData.description || '';
    document.getElementById('modalComicImage').src = comicData.imageSRC || 'https://via.placeholder.com/300x400?text=Sin+Imagen';

    setReadOnlyMode(true);

    document.getElementById('btnEditMode').style.display = 'inline-block';
    document.getElementById('btnSaveChanges').style.display = 'none';
    document.getElementById('btnCancelEdit').style.display = 'none';

    const modal = new bootstrap.Modal(document.getElementById('comicModal'));
    modal.show();
}

function activarModoEdicion() {
    modoEdicion = true;
    document.getElementById('modalTitleText').textContent = 'Editar Cómic';

    const camposEditables = ['modalPrice', 'modalTitle', 'modalDiscount', 'modalDescription'];
    camposEditables.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.removeAttribute('readonly');
            element.style.backgroundColor = '#fff';
        }
    });

    document.getElementById('btnEditMode').style.display = 'none';
    document.getElementById('btnSaveChanges').style.display = 'inline-block';
    document.getElementById('btnCancelEdit').style.display = 'inline-block';
}

function cancelarEdicion() {
    document.getElementById('modalTitle').value = comicOriginal.title || '';
    document.getElementById('modalCategory').value = comicOriginal.category || '';
    document.getElementById('modalPublisher').value = comicOriginal.publisher || '';
    document.getElementById('modalPrice').value = comicOriginal.price || '';
    document.getElementById('modalDiscount').value = comicOriginal.discountPercent || 0;
    document.getElementById('modalDescription').value = comicOriginal.description || '';
    document.getElementById('modalComicImage').src = comicOriginal.imageSRC || 'https://via.placeholder.com/300x400?text=Sin+Imagen';

    modoEdicion = false;
    document.getElementById('modalTitleText').textContent = 'Ver Cómic';
    setReadOnlyMode(true);

    document.getElementById('btnEditMode').style.display = 'inline-block';
    document.getElementById('btnSaveChanges').style.display = 'none';
    document.getElementById('btnCancelEdit').style.display = 'none';

    Toast.info('Edición cancelada');
}

async function guardarCambios() {
    const comicId = document.getElementById('comicId').value;
    const title = document.getElementById('modalTitle').value.trim();
    const price = parseFloat(document.getElementById('modalPrice').value);
    const discount = parseInt(document.getElementById('modalDiscount').value) || 0;
    const description = document.getElementById('modalDescription').value.trim();

    if (!title || isNaN(price) || price <= 0 || !description) {
        Toast.error('Por favor completa todos los campos correctamente');
        return;
    }

    if (discount < 0 || discount > 100) {
        Toast.error('El descuento debe estar entre 0 y 100');
        return;
    }

    const comicActualizado = {
        title: title,
        category: document.getElementById('modalCategory').value,
        publisher: document.getElementById('modalPublisher').value,
        price: price,
        discountPercent: discount,
        description: description
    };

    try {
        const token = localStorage.getItem("jwtToken");

        const response = await fetch(`/api/comics/editar/${comicId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(comicActualizado)
        });

        if (response.ok) {
            Toast.success('Cómic actualizado exitosamente');
            bootstrap.Modal.getInstance(document.getElementById('comicModal')).hide();
            await cargarComics('/api/comics/todos');

            if (typeof window.recargarGraficos === 'function') {
                window.recargarGraficos();
            }
        } else {
            Toast.error('Error al actualizar el cómic');
        }
    } catch (error) {
        Toast.error('Error al guardar los cambios');
    }
}

function setReadOnlyMode(readonly) {
    const inputs = ['modalTitle', 'modalCategory', 'modalPublisher', 'modalPrice', 'modalDiscount', 'modalDescription'];
    inputs.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            if (readonly) {
                element.setAttribute('readonly', 'readonly');
                element.style.backgroundColor = '#f8f9fa';
            } else {
                element.removeAttribute('readonly');
                element.style.backgroundColor = '#fff';
            }
        }
    });
}

// ==================================
// ELIMINACIÓN CON MODAL DE CONFIRMACIÓN
// ==================================
function confirmarEliminarComic(comicId) {
    comicIdToDelete = comicId;
    const modal = new bootstrap.Modal(document.getElementById('deleteConfirmModal'));
    modal.show();
}

document.getElementById('confirmDeleteBtn').addEventListener('click', async function() {
    if (!comicIdToDelete) return;

    try {
        const token = localStorage.getItem("jwtToken");

        const response = await fetch(`/api/comics/eliminar/${comicIdToDelete}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        bootstrap.Modal.getInstance(document.getElementById('deleteConfirmModal')).hide();

        if (data.status === "success") {
            Toast.success('Cómic eliminado exitosamente');
            await cargarComics('/api/comics/todos');

            if (typeof window.recargarGraficos === 'function') {
                window.recargarGraficos();
            }
        } else {
            Toast.error('Error: ' + data.message);
        }

        comicIdToDelete = null;

    } catch (error) {
        Toast.error('Error al conectar con el servidor');
        bootstrap.Modal.getInstance(document.getElementById('deleteConfirmModal')).hide();
    }
});
