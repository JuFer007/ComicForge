function agregarAlCarrito(comicId) {
    fetch('/cart/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `comicID=${comicId}`
    })
    .then(response => {
        if (response.ok) {
            Toast.success('¡Cómic agregado al carrito exitosamente!');
        } else {
            Toast.error('Inicie sesión para agregar al carrito');
        }
    })
    .catch(err => {
        console.error('Error agregando al carrito:', err);
        Toast.error('Inicie sesión para agregar al carrito');
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const checkoutBtn = document.getElementById("checkoutBtn");
    if (checkoutBtn && localStorage.getItem("isLoggedIn") !== "true") {
        checkoutBtn.disabled = true;
        checkoutBtn.textContent = "Inicia sesión para comprar";
    }
});
