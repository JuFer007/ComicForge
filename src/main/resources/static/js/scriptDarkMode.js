document.addEventListener('DOMContentLoaded', () => {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;
    const DARK_MODE_CLASS = 'dark-mode';
    const DARK_MODE_STORAGE_KEY = 'darkModeEnabled';

    const applyDarkMode = (isEnabled) => {
        if (isEnabled) {
            body.classList.add(DARK_MODE_CLASS);
            darkModeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
        } else {
            body.classList.remove(DARK_MODE_CLASS);
            darkModeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
        }
    };

    const loadDarkModePreference = () => {
        const isEnabled = localStorage.getItem(DARK_MODE_STORAGE_KEY) === 'true';
        applyDarkMode(isEnabled);
    };

    darkModeToggle.addEventListener('click', () => {
        const isEnabled = body.classList.toggle(DARK_MODE_CLASS);
        localStorage.setItem(DARK_MODE_STORAGE_KEY, isEnabled);
        applyDarkMode(isEnabled);
    });
    loadDarkModePreference();
});
