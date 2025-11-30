async function cargarComics(categoria) {
    const token = localStorage.getItem("jwtToken");

    try {
        const headers = {
            'Content-Type': 'application/json'
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`/api/comics/${categoria}`, { headers });
        const masVendidos = await response.json();

        const container = document.getElementById('comicCarouselInner');
        container.innerHTML = '';

        for(let i = 0; i < masVendidos.length; i += 5) {
            const slide = document.createElement('div');
            slide.className = (i === 0) ? 'carousel-item active' : 'carousel-item';

            const slideContent = document.createElement('div');
            slideContent.className = 'd-flex justify-content-center gap-3';

            const subList = masVendidos.slice(i, i + 5);
            subList.forEach(comic => {
                slideContent.innerHTML += `
                    <div class="comic-card">
                        <img src="${comic.imageSRC}" alt="${comic.title}">
                        <div class="comic-info">
                            <h5>${comic.title}</h5>
                            <p style="text-align: justify; font-family: 'Montserrat', sans-serif; font-size: 15px;">
                                ${comic.description}
                            </p>
                            <p class="text-danger fw-bold">S/. ${Number(comic.price).toFixed(2)}</p>
                            <button class="buy-btn" onclick="agregarAlCarrito(${comic.id})">
                                <i class="fas fa-shopping-cart"></i> Comprar
                            </button>
                        </div>
                    </div>
                `;
            });

            slide.appendChild(slideContent);
            container.appendChild(slide);
        }

        const containerSmall = document.getElementById('comicCarouselInnerSmall');
        containerSmall.innerHTML = '';

        masVendidos.forEach((comic, index) => {
            const slide = document.createElement('div');
            slide.className = (index === 0) ? 'carousel-item active' : 'carousel-item';
            slide.innerHTML = `
                <div class="d-flex justify-content-center gap-3">
                    <div class="comic-card">
                        <img src="${comic.imageSRC}" alt="${comic.title}">
                        <div class="comic-info">
                            <h5>${comic.title}</h5>
                            <p style="text-align: justify; font-family: 'Montserrat', sans-serif; font-size: 15px;">
                                ${comic.description}
                            </p>
                            <span class="fw-bold text-danger">S/. ${Number(comic.price).toFixed(2)}</span>
                            <button class="buy-btn" onclick="agregarAlCarrito(${comic.id})">
                                <i class="fas fa-shopping-cart"></i> Comprar
                            </button>
                        </div>
                    </div>
                </div>
            `;
            containerSmall.appendChild(slide);
        });

    } catch (error) {
        console.error('Error al cargar los cómics:', error);
    }
}

function agregarAlCarrito(comicId) {
    const token = localStorage.getItem("jwtToken");

    if (!token) {
        Toast.error('Debes iniciar sesión para agregar al carrito');
        setTimeout(() => window.location.href = '/login', 1500);
        return;
    }

    fetch('/cart/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${token}`
        },
        body: `comicID=${comicId}`
    })
    .then(response => {
        return response.text().then(text => ({
            status: response.status,
            message: text
        }));
    })
    .then(data => {
        if (data.status === 200) {
            Toast.success(data.message);
        } else if (data.status === 401) {
            Toast.error('Tu sesión ha expirado. Inicia sesión nuevamente');
            localStorage.clear();
            setTimeout(() => window.location.href = '/login', 1500);
        } else if (data.status === 400) {
            Toast.warning(data.message);
        } else if (data.status === 404) {
            Toast.error('Cómic no encontrado');
        } else {
            Toast.error('Error al agregar al carrito');
        }
    })
    .catch(err => {
        console.error('Error agregando al carrito:', err);
        Toast.error('Error de conexión');
    });
}

cargarComics('mas-vendido');
