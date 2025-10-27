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
            alert('Comic agregado al carrito');
        } else {
            alert('Error al agregar al carrito');
        }
    })
    .catch(err => {
        console.error('Error agregando al carrito:', err);
        alert('Inicie sesion para agregar al carrito');
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const checkoutBtn = document.getElementById("checkoutBtn");
    if (checkoutBtn && localStorage.getItem("isLoggedIn") !== "true") {
        checkoutBtn.disabled = true;
        checkoutBtn.textContent = "Inicia sesión para comprar";
    }
});
