class ToastNotification {
    constructor() {
        this.container = this.createContainer();
        this.toastCounter = 0;
    }

    createContainer() {
        let container = document.getElementById('toast-notification-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-notification-container';
            container.className = 'toast-container position-fixed top-0 end-0 p-3';
            container.style.zIndex = '9999';
            document.body.appendChild(container);
        }
        return container;
    }

    show(message, title = 'Comic Forge', type = 'success', duration = 3000) {
        const toastId = `toast-${++this.toastCounter}`;
        const config = this.getTypeConfig(type);
        
        const toastHTML = `
            <div id="${toastId}" class="toast text-white border-0 shadow-lg mb-2" 
                 role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-header ${config.headerClass} text-white border-0">
                    <i class="${config.icon} me-2"></i>
                    <strong class="me-auto text-white">${title}</strong>
                    <small>Ahora</small>
                    <button type="button" class="btn-close btn-close-white" 
                            data-bs-dismiss="toast" aria-label="Cerrar"></button>
                </div>
                <div class="toast-body ${config.bodyClass} text-white">
                    ${message}
                </div>
            </div>
        `;

        this.container.insertAdjacentHTML('beforeend', toastHTML);
        
        const toastElement = document.getElementById(toastId);
        const bsToast = new bootstrap.Toast(toastElement, {
            autohide: true,
            delay: duration
        });

        toastElement.addEventListener('hidden.bs.toast', () => {
            toastElement.remove();
        });

        bsToast.show();
        return bsToast;
    }

    getTypeConfig(type) {
        const configs = {
            success: {
                icon: 'fa-solid fa-circle-check',
                headerClass: 'bg-success',
                bodyClass: 'bg-success'
            },
            error: {
                icon: 'fa-solid fa-circle-xmark',
                headerClass: 'bg-danger',
                bodyClass: 'bg-danger'
            },
            warning: {
                icon: 'fa-solid fa-triangle-exclamation',
                headerClass: 'bg-warning',
                bodyClass: 'bg-warning'
            },
            info: {
                icon: 'fa-solid fa-circle-info',
                headerClass: 'bg-info',
                bodyClass: 'bg-info'
            },
            dark: {
                icon: 'fa-regular fa-bell',
                headerClass: 'bg-dark',
                bodyClass: 'bg-dark'
            }
        };

        return configs[type] || configs.success;
    }

    success(message, title = 'Comic Forge', duration = 3000) {
        return this.show(message, title, 'success', duration);
    }

    error(message, title = 'Error', duration = 4000) {
        return this.show(message, title, 'error', duration);
    }

    warning(message, title = 'Advertencia', duration = 3500) {
        return this.show(message, title, 'warning', duration);
    }

    info(message, title = 'Información', duration = 3000) {
        return this.show(message, title, 'info', duration);
    }
}

const Toast = new ToastNotification();
