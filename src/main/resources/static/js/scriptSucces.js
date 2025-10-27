document.addEventListener("DOMContentLoaded", () => {
    const modal = new bootstrap.Modal(document.getElementById('successModal'));
    modal.show();
});

document.getElementById('successModal').addEventListener('hidden.bs.modal', function () {
});