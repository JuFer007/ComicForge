document.addEventListener("DOMContentLoaded", async () => {
    const adminNameEl = document.getElementById("adminName");
    const adminProfileImg = document.getElementById("adminProfileImg");

    const userName = localStorage.getItem("userName");
    const profilePic = localStorage.getItem("profilePic");
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("jwtToken");

    if (!token || role !== "admin") {
        Toast.error("No tienes permisos para acceder al panel de administración");
        setTimeout(() => window.location.href = "/", 1000);
        return;
    }

    try {
        const response = await fetch('/api/session/status', {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!response.ok || response.status === 401) {
            localStorage.clear();
            Toast.error("Tu sesión ha expirado");
            setTimeout(() => window.location.href = '/login', 1000);
            return;
        }

        const data = await response.json();

        if (!data.isLoggedIn || data.role !== "admin") {
            localStorage.clear();
            Toast.error("No tienes permisos de administrador");
            setTimeout(() => window.location.href = '/login', 1000);
            return;
        }

        if (adminNameEl) adminNameEl.textContent = userName || "Administrador";
        if (adminProfileImg) adminProfileImg.src = profilePic || "/recursos/avatares/default-avatar.jpg";

        const btnCerrar = document.getElementById('btn-CerrarSesion');
        if (btnCerrar) {
            btnCerrar.addEventListener('click', async () => {
                if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
                    try {
                        await fetch("/auth/logout", {
                            method: "POST",
                            headers: { "Authorization": `Bearer ${token}` }
                        });

                        localStorage.clear();
                        Toast.success('Sesión cerrada correctamente');
                        setTimeout(() => window.location.href = "/", 1000);
                    } catch (error) {
                        localStorage.clear();
                        setTimeout(() => window.location.href = "/", 1000);
                    }
                }
            });
        }

        cargarEstadisticas();
        if (typeof window.recargarGraficos === 'function') {
            window.recargarGraficos();
        }

    } catch (error) {
        Toast.error("Error de conexión");
        setTimeout(() => window.location.href = '/login', 2000);
    }
});

function mostrarSeccion(seccionId) {
    const secciones = document.querySelectorAll('.seccion');
    secciones.forEach(s => s.style.display = 'none');

    const seccionActual = document.getElementById(seccionId);
    if (seccionActual) {
        seccionActual.style.display = 'block';
    }

    const navLinks = document.querySelectorAll('.sidebar-nav .nav-link');
    navLinks.forEach(link => link.classList.remove('active'));

    const activeLink = Array.from(navLinks).find(link => {
        const onclick = link.getAttribute('onclick');
        return onclick && onclick.includes(seccionId);
    });

    if (activeLink) activeLink.classList.add('active');

    if (seccionId === 'deleteUsers') cargarUsuarios();
    actualizarHeader(seccionId);
}

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

    if (header && headerContent[seccionId]) {
        header.innerHTML = `
            <h1>${headerContent[seccionId].title}</h1>
            <p>${headerContent[seccionId].subtitle}</p>
        `;
    }
}

async function cargarEstadisticas() {
    try {
        const token = localStorage.getItem("jwtToken");

        const response = await fetch('/admin/dashboard-stats', {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const stats = await response.json();

        document.getElementById('totalComics').textContent = stats.totalComics || 0;
        document.getElementById('totalCustomers').textContent = stats.totalUsers || 0;
        document.getElementById('totalSales').textContent = 'S/' + (stats.totalSales || 0).toFixed(2);

    } catch (error) {
        document.getElementById('totalComics').textContent = '0';
        document.getElementById('totalCustomers').textContent = '0';
        document.getElementById('totalSales').textContent = 'S/0.00';
    }
}

async function cargarUsuarios() {
    try {
        const token = localStorage.getItem("jwtToken");

        const response = await fetch('/admin/users', {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

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
        Toast.error('Error al cargar los usuarios');
    }
}

async function eliminarUsuario(userId) {
    if (!confirm('¿Seguro que deseas eliminar este usuario?')) return;

    try {
        const token = localStorage.getItem("jwtToken");

        const response = await fetch(`/admin/users/${userId}`, {
            method: 'DELETE',
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (response.ok) {
            Toast.success('Usuario eliminado correctamente');
            cargarUsuarios();
        } else {
            Toast.error('Error al eliminar usuario');
        }
    } catch (error) {
        Toast.error('Ocurrió un error al eliminar el usuario');
    }
}

document.getElementById('addComicForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.querySelector('[name="title"]').value.trim();
    const category = document.querySelector('[name="category"]').value.trim();
    const price = parseFloat(document.querySelector('[name="price"]').value);
    const publisher = document.querySelector('[name="publisher"]').value.trim();
    const description = document.querySelector('[name="description"]').value.trim();
    const imageFile = document.getElementById('comicImageUpload').files[0];
    const pdfFile = document.getElementById('comicPDF').files[0];

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

        const token = localStorage.getItem("jwtToken");

        const response = await fetch('/api/comics/addComic', {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData
        });

        const data = await response.json();

        if (data.status === "success") {
            Toast.success(data.message || 'Cómic agregado exitosamente');
            e.target.reset();
            removeImagePreview();
            removePdfPreview();

            setTimeout(() => {
                mostrarSeccion('manageComics');
                if (typeof window.cargarComics === 'function') {
                    window.cargarComics('/api/comics/todos');
                }
                if (typeof window.recargarGraficos === 'function') {
                    window.recargarGraficos();
                }
            }, 1500);

        } else {
            Toast.error(data.message || 'Error al agregar el cómic');
        }

    } catch (error) {
        Toast.error('Error en la solicitud. Por favor intenta de nuevo');
    }
});

document.getElementById('comicImageUpload').addEventListener('change', function(e) {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.match('image.*')) {
        Toast.error('Por favor selecciona un archivo de imagen válido');
        e.target.value = '';
        return;
    }

    if (file.size > 5 * 1024 * 1024) {
        Toast.error('La imagen no debe superar los 5MB');
        e.target.value = '';
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        document.getElementById('previewImg').src = event.target.result;
        document.getElementById('imagePreview').classList.add('show');
    };
    reader.readAsDataURL(file);

    Toast.success('Imagen cargada correctamente');
});

document.getElementById('comicPDF').addEventListener('change', function(e) {
    const file = e.target.files[0];

    if (!file) return;

    if (file.type !== 'application/pdf') {
        Toast.error('Por favor selecciona un archivo PDF válido');
        e.target.value = '';
        return;
    }

    if (file.size > 50 * 1024 * 1024) {
        Toast.error('El PDF no debe superar los 50MB');
        e.target.value = '';
        return;
    }

    document.getElementById('pdfFileName').textContent = file.name;
    document.getElementById('pdfFileSize').textContent = formatFileSize(file.size);
    document.getElementById('pdfPreview').classList.add('show');

    Toast.success('PDF cargado correctamente');
});

function removeImagePreview() {
    document.getElementById('comicImageUpload').value = '';
    document.getElementById('previewImg').src = '';
    document.getElementById('imagePreview').classList.remove('show');
    Toast.info('Imagen removida');
}

function removePdfPreview() {
    document.getElementById('comicPDF').value = '';
    document.getElementById('pdfFileName').textContent = '';
    document.getElementById('pdfFileSize').textContent = '';
    document.getElementById('pdfPreview').classList.remove('show');
    Toast.info('PDF removido');
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function resetForm() {
    if (confirm('¿Estás seguro de cancelar? Se perderán todos los datos ingresados.')) {
        document.getElementById('addComicForm').reset();
        removeImagePreview();
        removePdfPreview();
        Toast.info('Formulario reiniciado');
    }
}
