async function cargarComics(categoria, containerId) {
    try {
        const response = await fetch(`/comics/${categoria}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const comics = await response.json();

        const container = document.getElementById(containerId);
        container.innerHTML = '';
        const modalesContainer = document.getElementById('modales-container');

        for (let i = 0; i < comics.length; i += 4) {
            const rowDiv = document.createElement('div');
            rowDiv.className = 'row g-3 mb-3';

            const group = comics.slice(i, i + 4);
            group.forEach(comic => {
                const colDiv = document.createElement('div');
                colDiv.className = 'col-md-3';
                colDiv.innerHTML = `
                    <div class="card h-100">
                        <img src="${comic.imageSRC}" class="card-img-top" alt="${comic.title}">
                        <div class="card-body">
                            <h5 class="card-title">${comic.title}</h5>
                            <a href="#" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#comic-${comic.id}">
                                <i class="fa-solid fa-circle-info"></i> Más Información
                            </a>
                        </div>
                    </div>
                `;
                rowDiv.appendChild(colDiv);

                const modalHtml = `
                    <div class="modal fade" id="comic-${comic.id}" tabindex="-1" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title">${comic.title}</h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body d-flex">
                                    <div class="flex-shrink-0 me-3">
                                        <img src="${comic.imageSRC}" class="img-fluid rounded" style="max-width:150px;" alt="${comic.title}">
                                    </div>
                                    <div>
                                        <p>${comic.description}</p>
                                    </div>
                                </div>
                                <div class="modal-footer d-flex justify-content-between">
                                    <button class="buy-btn" onclick="agregarAlCarrito(${comic.id})">
                                        <i class="fas fa-shopping-cart"></i> Comprar
                                    </button>
                                    <span class="fw-bold text-danger">S/. ${Number(comic.price).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                modalesContainer.innerHTML += modalHtml;
            });

            container.appendChild(rowDiv);
        }

    } catch (error) {
        console.error(`Error cargando cómics de ${categoria}:`, error);
        alert(`Error cargando cómics de ${categoria}.`);
    }
}

function agregarAlCarrito(comicId) {
    const formData = new URLSearchParams();
    formData.append('comicID', comicId);

    fetch('/cart/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData
    })
    .then(response => {
        if (response.ok) {
            alert('¡Cómic añadido al carrito!');
        } else {
            alert('Error al añadir el cómic al carrito.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al añadir el cómic al carrito.');
    });
}

cargarComics('marvel', 'marvelContainer');
cargarComics('dc', 'dcContainer');
