function agregarAlCarrito(comicId) {
    fetch('/cart/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
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
            Toast.error('Inicie sesión para agregar al carrito');
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
    if (checkoutBtn && localStorage.getItem("isLoggedIn") !== "true") {
        checkoutBtn.disabled = true;
        checkoutBtn.textContent = "Inicia sesión para comprar";
    }
});
