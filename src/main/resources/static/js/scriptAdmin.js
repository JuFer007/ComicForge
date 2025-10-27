// --------------------------
// FUNCIONES GENERALES
// --------------------------

//Función para mostrar la sección seleccionada y aplicar active
function mostrarSeccion(seccionId) {
    const secciones = document.querySelectorAll('.seccion');
    secciones.forEach(s => s.style.display = 'none');
    document.getElementById(seccionId).style.display = 'block';

    const navLinks = document.querySelectorAll('.sidebar-nav .nav-link');
    navLinks.forEach(link => link.classList.remove('active'));

    const activeLink = Array.from(navLinks).find(link => link.getAttribute('onclick').includes(seccionId));
    if (activeLink) activeLink.classList.add('active');

    if(seccionId === 'deleteUsers') cargarUsuarios();
}

// --------------------------
// FORMULARIO AGREGAR CÓMIC
// --------------------------
document.getElementById('addComicForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    try {
        const response = await fetch('/addComic', { method: 'POST', body: formData });
        if (!response.ok) throw new Error('Error en la solicitud');

        const data = await response.json();

        Toast.success('¡Cómic agregado correctamente!');

        e.target.reset();
    } catch (error) {
        console.error('Error:', error);
        Toast.error('Error al guardar el comic');
    }
});

// --------------------------
// USUARIOS
// --------------------------

// Cargar todos los usuarios
async function cargarUsuarios() {
    try {
        const response = await fetch('/admin/users');
        if (!response.ok) throw new Error('Error al obtener usuarios');
        const users = await response.json();

        const tbody = document.getElementById('usersTable');
        tbody.innerHTML = '';

        users.forEach(user => {
            tbody.innerHTML += `
                <tr>
                    <td>${user.userName}</td>
                    <td>${user.email}</td>
                    <td>
                        <button class="btn btn-danger btn-sm" onclick="eliminarUsuario(${user.id})">
                            <i class="bi bi-trash"></i> Eliminar
                        </button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error('Error al cargar usuarios:', error);
    }
}

// Eliminar usuario
async function eliminarUsuario(userId) {
    if (!confirm('¿Seguro que deseas eliminar este usuario?')) return;
    try {
        const response = await fetch(`/admin/users/${userId}`, { method: 'DELETE' });
        if (response.ok) {
            alert('Usuario eliminado');
            cargarUsuarios();
        } else {
            alert('Error al eliminar usuario');
        }
    } catch (error) {
        console.error(error);
        alert('Ocurrió un error');
    }
}

// Cargar estadísticas del dashboard
async function cargarEstadisticas() {
    try {
        const response = await fetch('/admin/dashboard-stats');
        if (!response.ok) throw new Error('Error al obtener estadísticas');
        const stats = await response.json();

        document.getElementById('totalComics').textContent = stats.totalComics;
        document.getElementById('totalCustomers').textContent = stats.totalUsers;
        document.getElementById('totalSales').textContent = 'S/' + stats.totalSales.toFixed(2);
    } catch (error) {
        console.error('Error al cargar estadísticas:', error);
    }
}

// --------------------------
// INICIALIZACIÓN ADMIN
// --------------------------
document.addEventListener("DOMContentLoaded", () => {
    const adminNameEl = document.getElementById("adminName");
    const adminProfileImg = document.getElementById("adminProfileImg");

    const userName = localStorage.getItem("userName");
    const profilePic = localStorage.getItem("profilePic");
    const role = localStorage.getItem("role");

    if (role === "admin") {
        if (adminNameEl) adminNameEl.textContent = userName || "Administrador";
        if (adminProfileImg) adminProfileImg.src = profilePic || "/recursos/avatares/default-avatar.jpg";
    } else {
        window.location.href = "/";
    }

    // Cerrar sesión
    const btnCerrar = document.getElementById('btn-CerrarSesion');
    if (btnCerrar) {
        btnCerrar.addEventListener('click', async () => {
            if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
                try {
                    const response = await fetch("/auth/logout", {
                        method: "POST",
                        credentials: "include"
                    });

                    if (response.ok) {
                        localStorage.clear();
                        window.location.href = "/";
                    } else {
                        console.log("Error al cerrar sesión correctamente en el servidor.");
                    }
                } catch (error) {
                    console.error("Error al cerrar sesión:", error);
                    console.log("Hubo un problema al cerrar sesión. Intenta de nuevo.");
                }
            }
        });
    }
    cargarEstadisticas();
});
