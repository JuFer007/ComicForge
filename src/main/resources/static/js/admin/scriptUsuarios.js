document.addEventListener("DOMContentLoaded", async () => {
    const usersTableBody = document.querySelector("#manageUsers tbody");
    const searchInput = document.querySelector("#manageUsers input[type='text']");
    const token = localStorage.getItem("jwtToken");

    let users = [];

    if (!token) {
        Toast.error("No estás autenticado");
        setTimeout(() => window.location.href = '/login', 1000);
        return;
    }

    // ==================================
    // CARGAR USUARIOS
    // ==================================
    async function loadUsers() {
        try {
            const response = await fetch("http://localhost:8080/admin/users", {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            users = await response.json();
            renderUsersTable(users);

        } catch (error) {
            console.error("Error al cargar usuarios:", error);
            Toast.error("Error al cargar usuarios");
        }
    }

    // ==================================
    // RENDERIZAR TABLA DE USUARIOS
    // ==================================
    function renderUsersTable(usersArray) {
        usersTableBody.innerHTML = ""; // Limpiar tabla

        usersArray.forEach(user => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${user.userName}</td>
                <td>${user.email}</td>
                <td>
                    <button class="btn-action btn-delete" data-id="${user.id}"><i class="bi bi-trash"></i></button>
                </td>
            `;
            usersTableBody.appendChild(tr);
        });

        // Asignar eventos de eliminar
        document.querySelectorAll(".btn-delete").forEach(btn => {
            btn.addEventListener("click", async (e) => {
                const id = e.currentTarget.dataset.id;
                if (!confirm("¿Deseas eliminar este usuario?")) return;

                try {
                    const res = await fetch(`http://localhost:8080/admin/users/${id}`, {
                        method: "DELETE",
                        headers: { "Authorization": `Bearer ${token}` }
                    });

                    if (res.ok) {
                        Toast.success("Usuario eliminado");
                        users = users.filter(u => u.id != id);
                        renderUsersTable(users);
                    } else {
                        const text = await res.text();
                        Toast.error("Error: " + text);
                    }
                } catch (error) {
                    console.error("Error al eliminar usuario:", error);
                    Toast.error("Error al eliminar usuario");
                }
            });
        });
    }

    // ==================================
    // FILTRAR USUARIOS POR NOMBRE O EMAIL
    // ==================================
    searchInput.addEventListener("input", () => {
        const term = searchInput.value.toLowerCase();
        const filtered = users.filter(u =>
            u.userName.toLowerCase().includes(term) ||
            u.email.toLowerCase().includes(term)
        );
        renderUsersTable(filtered);
    });

    // Cargar usuarios al inicio
    loadUsers();
});
