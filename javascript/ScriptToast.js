document.addEventListener("DOMContentLoaded", function() {
  const toastEl = document.getElementById("toastBienvenida");
  if (toastEl && localStorage.getItem("isLoggedIn") === "true") {
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
    
    localStorage.removeItem("isLoggedIn");
  }
});