function mostrarToastBienvenida() {
    const toastEl = document.getElementById("toastBienvenida");
    if (!toastEl) return;

    const showToast = localStorage.getItem("showToast");
    if (showToast === "true") {
        const toast = new bootstrap.Toast(toastEl);
        toast.show();
        localStorage.removeItem("showToast");
    }
}
