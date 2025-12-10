document.addEventListener("DOMContentLoaded", async () => {
    const salesTableBody = document.querySelector("#sales tbody");
    const exportBtn = document.getElementById("exportSales");
    const startDateInput = document.getElementById("startDate");
    const endDateInput = document.getElementById("endDate");
    const token = localStorage.getItem("jwtToken");

    let sales = [];

    if (!token) {
        Toast.error("No estás autenticado");
        setTimeout(() => window.location.href = '/login', 1000);
        return;
    }

    async function loadSales() {
        try {
            const response = await fetch("http://localhost:8080/sales", {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            sales = await response.json();
            renderSalesTable(sales);

        } catch (error) {
            console.error("Error al cargar ventas:", error);
            Toast.error("Error al cargar ventas");
        }
    }

    function renderSalesTable(salesArray) {
        salesTableBody.innerHTML = "";

        salesArray.forEach(sale => {
            const comics = sale.comics ? sale.comics.join(", ") :
                           sale.detailSale?.map(d => d.comic.title).join(", ");

            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${sale.id.toString().padStart(4, "0")}</td>
                <td>${sale.userName || sale.user?.userName}</td>
                <td>${comics}</td>
                <td>${new Date(sale.saleDate).toLocaleString()}</td>
                <td>S/${sale.totalAmount.toFixed(2)}</td>
                <td><span class="badge-status badge-active">Completado</span></td>
            `;
            salesTableBody.appendChild(tr);
        });
    }

    function filterSalesByDate() {
        const startDate = startDateInput.value ? new Date(startDateInput.value) : null;
        const endDate = endDateInput.value ? new Date(endDateInput.value) : null;

        const filtered = sales.filter(sale => {
            const saleDate = new Date(sale.saleDate);
            if (startDate && saleDate < startDate) return false;
            if (endDate && saleDate > endDate) return false;
            return true;
        });

        renderSalesTable(filtered);
    }

    startDateInput.addEventListener("change", filterSalesByDate);
    endDateInput.addEventListener("change", filterSalesByDate);

    if (exportBtn) {
        exportBtn.addEventListener("click", async () => {
            try {
                const response = await fetch("http://localhost:8080/sales/export", {
                    headers: { "Authorization": `Bearer ${token}` }
                });

                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "ventas_detalladas.xlsx";
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
                Toast.success("Excel generado correctamente");

            } catch (error) {
                console.error("Error al exportar Excel:", error);
                Toast.error("Error al exportar Excel");
            }
        });
    }
    loadSales();
});