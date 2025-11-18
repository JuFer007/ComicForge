// ==================================
// FUNCIONES GENERALES
// ==================================
function mostrarSeccion(seccionId) {
    const secciones = document.querySelectorAll('.seccion');
    secciones.forEach(s => s.style.display = 'none');
    document.getElementById(seccionId).style.display = 'block';

    const navLinks = document.querySelectorAll('.sidebar-nav .nav-link');
    navLinks.forEach(link => link.classList.remove('active'));

    const activeLink = Array.from(navLinks).find(link => link.getAttribute('onclick').includes(seccionId));
    if (activeLink) activeLink.classList.add('active');

    if(seccionId === 'deleteUsers') cargarUsuarios();
    actualizarHeader(seccionId);

}

// ==================================
// FORMULARIO AGREGAR CÓMIC CON VALIDACIONES
// ==================================

document.getElementById('addComicForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validaciones antes de enviar
    const title = document.querySelector('[name="title"]').value.trim();
    const category = document.querySelector('[name="category"]').value.trim();
    const price = parseFloat(document.querySelector('[name="price"]').value);
    const publisher = document.querySelector('[name="publisher"]').value.trim();
    const description = document.querySelector('[name="description"]').value.trim();
    const imageFile = document.getElementById('comicImageUpload').files[0];
    const pdfFile = document.getElementById('comicPDF').files[0];

    // Validar campos obligatorios
    if (!title || !category || !publisher || !description) {
        Toast.error('Por favor completa todos los campos obligatorios');
        return;
    }

    if (isNaN(price) || price <= 0) {
        Toast.error('El precio debe ser mayor a 0');
        return;
    }

    if (!imageFile) {
        Toast.error('Debes seleccionar una imagen para el cómic');
        return;
    }

    if (!pdfFile) {
        Toast.error('Debes seleccionar el archivo PDF del cómic');
        return;
    }

    // Validar tamaños
    if (imageFile.size > 5 * 1024 * 1024) {
        Toast.error('La imagen no debe superar los 5MB');
        return;
    }

    if (pdfFile.size > 50 * 1024 * 1024) {
        Toast.error('El PDF no debe superar los 50MB');
        return;
    }

    const formData = new FormData(e.target);

    try {
        Toast.info('Subiendo cómic...');

        const response = await fetch('/api/comics/addComic', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if(data.status === "success") {
            Toast.success(data.message || 'Cómic agregado exitosamente');
            e.target.reset();
            removeImagePreview();
            removePdfPreview();

            // Redirección a gestionar cómics
            setTimeout(() => {
                mostrarSeccion('manageComics');
                if (typeof window.cargarComics === 'function') {
                    window.cargarComics('/api/comics/todos');
                }
                // Recargar gráficos
                if (typeof window.recargarGraficos === 'function') {
                    window.recargarGraficos();
                }
            }, 1500);

        } else {
            Toast.error(data.message || 'Error al agregar el cómic');
        }

    } catch (error) {
        console.error('Error:', error);
        Toast.error('Error en la solicitud. Por favor intenta de nuevo');
    }
});

// ==================================
// USUARIOS
// ==================================

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
        Toast.error('Error al cargar los usuarios');
    }
}

async function eliminarUsuario(userId) {
    if (!confirm('¿Seguro que deseas eliminar este usuario?')) return;

    try {
        const response = await fetch(`/admin/users/${userId}`, { method: 'DELETE' });

        if (response.ok) {
            Toast.success('Usuario eliminado correctamente');
            cargarUsuarios();
        } else {
            Toast.error('Error al eliminar usuario');
        }
    } catch (error) {
        console.error(error);
        Toast.error('Ocurrió un error al eliminar el usuario');
    }
}

// ==================================
// ESTADÍSTICAS DEL DASHBOARD
// ==================================

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
        Toast.error('Error al cargar las estadísticas');
    }
}

// ==================================
// INICIALIZACIÓN ADMIN
// ==================================

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
                        Toast.success('Sesión cerrada correctamente');
                        setTimeout(() => {
                            window.location.href = "/";
                        }, 1000);
                    } else {
                        Toast.error("Error al cerrar sesión en el servidor");
                    }
                } catch (error) {
                    console.error("Error al cerrar sesión:", error);
                    Toast.error("Hubo un problema al cerrar sesión");
                }
            }
        });
    }

    cargarEstadisticas();

    if (typeof window.recargarGraficos === 'function') {
        window.recargarGraficos();
    }
});

// SECCION PARA CAMBIAR EL HEADER DEPENDIENDO DE LA SECCION
const headerContent = {
    dashboard: {
        title: '<i class="bi bi-bar-chart-line"></i> Panel de Control',
        subtitle: 'Bienvenido al sistema de administración de Comic Forge'
    },
    addComic: {
        title: '<i class="bi bi-plus-circle"></i> Agregar Nuevo Cómic',
        subtitle: 'Complete los datos para registrar un nuevo cómic'
    },
    manageComics: {
        title: '<i class="bi bi-book-half"></i> Gestionar Cómics',
        subtitle: 'Administre los cómics registrados en el sistema'
    },
    sales: {
        title: '<i class="bi bi-cart-check-fill"></i> Historial de Ventas',
        subtitle: 'Registros completos de ventas realizadas'
    },
    manageUsers: {
        title: '<i class="bi bi-people-fill"></i> Gestionar Usuarios',
        subtitle: 'Revisa y administra la información de los usuarios'
    }
};

function actualizarHeader(seccionId) {
    const header = document.getElementById('dynamicHeader');
    
    if (headerContent[seccionId]) {
        header.innerHTML = `
            <h1>${headerContent[seccionId].title}</h1>
            <p>${headerContent[seccionId].subtitle}</p>
        `;
    }
}


