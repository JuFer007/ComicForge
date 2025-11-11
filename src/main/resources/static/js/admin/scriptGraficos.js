const colors = {
    primary: '#db3545',
    secondary: '#db3545',
    marvel: '#ed1d24',
    dc: '#1d1c1c',
    other: '#95a5a6',
    success: '#2ecc71',
    warning: '#f39c12',
    info: '#3498db'
};

document.addEventListener('DOMContentLoaded', async () => {
    try {
        console.log('Cargando datos del dashboard...');

        const [topComicsResponse, publishersResponse] = await Promise.all([
            fetch('/top-comics'),
            fetch('/publishers')
        ]);

        if (!topComicsResponse.ok || !publishersResponse.ok) {
            throw new Error('Error en la respuesta del servidor');
        }

        const topComics = await topComicsResponse.json();
        const publishers = await publishersResponse.json();

        console.log('Top Comics:', topComics);
        console.log('Publishers:', publishers);

        renderTopComicsVertical(topComics);
        renderPublisherChart(publishers);

    } catch (error) {
        console.error('Error cargando datos del dashboard:', error);

        console.log('Mostrando datos de ejemplo...');
        renderTopComicsVerticalExample();
        renderPublisherChartExample();
    }
});

function renderTopComicsVertical(topComics) {
    const chartContainer = document.getElementById('topComicsChart');

    if (!chartContainer) {
        console.error('No se encontró el elemento topComicsChart');
        return;
    }

    chartContainer.innerHTML = '';

    if (!topComics || topComics.length === 0) {
        chartContainer.innerHTML = '<p style="text-align: center; color: #999;">No hay datos disponibles</p>';
        return;
    }

    const maxSales = Math.max(...topComics.map(c => c.totalVentas || 0));

    chartContainer.style.display = 'flex';
    chartContainer.style.alignItems = 'flex-end';
    chartContainer.style.justifyContent = 'space-around';
    chartContainer.style.height = '300px';
    chartContainer.style.gap = '15px';

    topComics.forEach((comic, index) => {
        const sales = comic.totalVentas || 0;
        const percentage = maxSales > 0 ? (sales / maxSales) * 100 : 0;

        const gradients = [
            'linear-gradient(180deg, #db3545 0%, #ff6b7a 100%)',
            'linear-gradient(180deg, #c0392b 0%, #e74c3c 100%)',
            'linear-gradient(180deg, #ed1d24 0%, #ff4d54 100%)',
            'linear-gradient(180deg, #a93226 0%, #cb4335 100%)',
            'linear-gradient(180deg, #922b21 0%, #b03a2e 100%)'
        ];
        const currentGradient = gradients[index % gradients.length];

        const barItem = document.createElement('div');
        barItem.className = 'vertical-bar-item';

        barItem.style.display = 'flex';
        barItem.style.flexDirection = 'column';
        barItem.style.alignItems = 'center';
        barItem.style.width = '80px';
        barItem.style.textAlign = 'center';
        barItem.style.height = '100%';

        barItem.innerHTML = `
            <div class="vertical-bar-wrapper" style="
                position: relative;
                width: 100%;
                height: 100%;
                background: #f1f1f1;
                border-radius: 10px;
                overflow: hidden;
                box-shadow: inset 0 -1px 5px rgba(0,0,0,0.2);
            ">
                <div class="vertical-bar-fill"
                     style="
                        position: absolute;
                        bottom: 0;
                        width: 100%;
                        height: 0%;
                        background: ${currentGradient};
                        border-radius: 10px 10px 0 0;
                        box-shadow: 0 3px 8px rgba(219,53,69,0.5);
                        transition: height 1.2s ease-in-out;
                     "
                     data-height="${percentage}">
                    <span class="bar-value-top" style="
                        position: absolute;
                        top: -25px;
                        left: 50%;
                        transform: translateX(-50%);
                        font-size: 14px;
                        font-weight: bold;
                        color: #b22222;
                    ">${sales}</span>
                </div>
            </div>
            <div class="vertical-bar-label" style="
                margin-top: 8px;
                font-size: 13px;
                font-weight: 500;
                color: #333;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                max-width: 100%;
            ">${comic.title || 'Sin título'}</div>
        `;
        chartContainer.appendChild(barItem);

        setTimeout(() => {
            const barFill = barItem.querySelector('.vertical-bar-fill');
            if (barFill) {
                barFill.style.height = percentage + '%';
            }
        }, 100 + (index * 150));
    });
}

function renderPublisherChart(publishers) {
    const ctx = document.getElementById('publisherChart');

    if (!ctx || !(ctx instanceof HTMLCanvasElement) || !Chart) {
        console.error('El canvas de Chart.js no es válido o la librería no está cargada.');
        return;
    }

    if (!publishers || Object.keys(publishers).length === 0) {
        const context = ctx.getContext('2d');
        context.font = '14px Arial';
        context.fillStyle = '#999';
        context.textAlign = 'center';
        context.fillText('No hay datos disponibles', ctx.width / 2, ctx.height / 2);
        return;
    }

    const labels = Object.keys(publishers);
    const data = Object.values(publishers);

    const backgroundColors = labels.map(label => {
        const lowerLabel = label.toLowerCase();
        if (lowerLabel.includes('marvel')) return colors.marvel;
        if (lowerLabel.includes('dc')) return colors.dc;
        if (lowerLabel.includes('image')) return '#16a085';
        if (lowerLabel.includes('dark')) return '#9b59b6';
        return colors.other;
    });

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels,
            datasets: [{
                data,
                backgroundColor: backgroundColors,
                borderWidth: 4,
                borderColor: '#fff',
                hoverBorderWidth: 6,
                hoverOffset: 15
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        font: {
                            size: 13,
                            weight: '500'
                        },
                        color: '#333',
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    padding: 12,
                    cornerRadius: 8,
                    displayColors: true,
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${label}: ${value} cómics (${percentage}%)`;
                        }
                    }
                }
            },
            cutout: '65%',
            animation: {
                animateRotate: true,
                animateScale: true,
                duration: 1500,
                easing: 'easeInOutQuart'
            }
        }
    });
}

function renderTopComicsVerticalExample() {
    const exampleData = [
        { title: 'Spider-Man: No Way Home', totalVentas: 245 },
        { title: 'Batman: The Dark Knight', totalVentas: 198 },
        { title: 'Avengers: Endgame', totalVentas: 176 },
        { title: 'Superman: Red Son', totalVentas: 152 },
        { title: 'X-Men: Days of Future', totalVentas: 134 }
    ];
    renderTopComicsVertical(exampleData);
}

function renderPublisherChartExample() {
    const exampleData = {
        'Marvel Comics': 145,
        'DC Comics': 98,
        'Image Comics': 45,
        'Dark Horse': 32,
        'Otros': 28
    };
    renderPublisherChart(exampleData);
}
