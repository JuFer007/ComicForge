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
            Toast.error('Tu sesión ha expirado. Por favor inicia sesión nuevamente');
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

document.addEventListener("DOMContentLoaded", () => {
    const checkoutBtn = document.getElementById("checkoutBtn");
    const token = localStorage.getItem("jwtToken");

    if (checkoutBtn && !token) {
        checkoutBtn.disabled = true;
        checkoutBtn.textContent = "Inicia sesión para comprar";
    }
});
