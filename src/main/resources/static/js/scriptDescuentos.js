document.addEventListener('DOMContentLoaded', () => {
    const personajesMap = {
        "33": ["Iron Fist", "Misty Knight", "Luke Cage"],
        "34": ["Moon Knight", "Khonshu", "Scarlet Scarab"],
        "35": ["Superman", "Jor-El", "Lois Lane"],
        "36": ["Black Panther", "Deadpool"],
        "37": ["Aquaman", "Mera", "Orm"],
        "38": ["Black Adam", "Isis", "Shazam"],
        "39": ["Shazam", "Wizard Shazam", "Dr. Sivana"],
        "40": ["Spider-Man 2099", "Lyla", "Vulture 2099"]
    };

    const itemsPerPage = 2;
    let currentPage = 1;
    let descuentos = [];

    async function cargarDescuentos() {
        try {
            const response = await fetch('/comics/descuento');
            descuentos = await response.json();

            descuentos.forEach(d => {
                if (typeof d.discountPercent === 'string') {
                    d.discountPercent = parseFloat(d.discountPercent.replace('%', ''));
                }
                if (typeof d.price === 'string') {
                    d.price = parseFloat(d.price.replace('S/.', '').trim());
                }
            });

            renderPage(currentPage);
        } catch (error) {
            console.error('Error al cargar los descuentos:', error);
            alert('Error al cargar los descuentos.');
        }
    }

    function renderPage(page) {
        const container = document.getElementById('descuentos-container');
        container.innerHTML = '';

        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const pageItems = descuentos.slice(start, end);

        pageItems.forEach(descuento => {
            const col = document.createElement('div');
            col.className = 'col-lg-9 mb-4';

            const precioOriginal = (descuento.price / (1 - descuento.discountPercent / 100)).toFixed(2);
            const personajes = personajesMap[descuento.id] || [];

            col.innerHTML = `
                <div class="comic-card">
                    <div class="row g-0">
                        <div class="col">
                            <div class="comic-info">
                                <div>
                                    <h2 class="comic-title">${descuento.title}</h2>
                                    <p class="comic-description">${descuento.description}</p>
                                </div>
                                <div class="mt-auto">
                                    <div class="characters">
                                        ${personajes.map(c => `<button class="character-tag">${c}</button>`).join('')}
                                    </div>
                                    <div class="price-section">
                                        <span class="old-price">S/. ${precioOriginal}</span>
                                        <span class="new-price">S/. ${descuento.price.toFixed(2)}</span>
                                    </div>
                                    <button class="buy-btn" onclick="agregarAlCarrito(${descuento.id})">
                                        <i class="fas fa-shopping-cart"></i> Comprar
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="col-auto">
                            <div class="comic-image">
                                <div class="discount-badge">${descuento.discountPercent}%</div>
                                <img src="${descuento.imageSRC}" alt="${descuento.title}">
                            </div>
                        </div>
                    </div>
                </div>
            `;
            container.appendChild(col);
        });

        renderPagination(page);
    }

    function renderPagination(page) {
        const totalPages = Math.ceil(descuentos.length / itemsPerPage);
        const pagination = document.getElementById('pagination-container');
        pagination.innerHTML = '';

        const prevLi = document.createElement('li');
        prevLi.className = `page-item ${page === 1 ? 'disabled' : ''}`;
        prevLi.innerHTML = `<a class="page-link" href="#">&laquo;</a>`;
        prevLi.addEventListener('click', e => {
            e.preventDefault();
            if (page > 1) renderPage(page - 1);
        });
        pagination.appendChild(prevLi);

        for (let i = 1; i <= totalPages; i++) {
            const li = document.createElement('li');
            li.className = `page-item ${i === page ? 'active' : ''}`;
            li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
            li.addEventListener('click', e => {
                e.preventDefault();
                renderPage(i);
            });
            pagination.appendChild(li);
        }

        const nextLi = document.createElement('li');
        nextLi.className = `page-item ${page === totalPages ? 'disabled' : ''}`;
        nextLi.innerHTML = `<a class="page-link" href="#">&raquo;</a>`;
        nextLi.addEventListener('click', e => {
            e.preventDefault();
            if (page < totalPages) renderPage(page + 1);
        });
        pagination.appendChild(nextLi);
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

    cargarDescuentos();
});
