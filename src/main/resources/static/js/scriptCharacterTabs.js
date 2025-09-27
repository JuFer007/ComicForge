document.addEventListener('DOMContentLoaded', function () {
    const triggerTabList = document.querySelectorAll('.character-card .nav-tabs button');

    triggerTabList.forEach(function (triggerEl) {
        const tabTrigger = new bootstrap.Tab(triggerEl);
    });
});