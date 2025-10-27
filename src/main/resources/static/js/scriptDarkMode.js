document.addEventListener('DOMContentLoaded', () => {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;
    const DARK_MODE_CLASS = 'dark-mode';
    const DARK_MODE_STORAGE_KEY = 'darkModeEnabled';

    // Function to apply or remove dark mode
    const applyDarkMode = (isEnabled) => {
        if (isEnabled) {
            body.classList.add(DARK_MODE_CLASS);
            darkModeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>'; // Sun icon for dark mode
        } else {
            body.classList.remove(DARK_MODE_CLASS);
            darkModeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>'; // Moon icon for light mode
        }
    };

    // Load dark mode preference from localStorage
    const loadDarkModePreference = () => {
        const isEnabled = localStorage.getItem(DARK_MODE_STORAGE_KEY) === 'true';
        applyDarkMode(isEnabled);
    };

    // Toggle dark mode and save preference
    darkModeToggle.addEventListener('click', () => {
        const isEnabled = body.classList.toggle(DARK_MODE_CLASS);
        localStorage.setItem(DARK_MODE_STORAGE_KEY, isEnabled);
        applyDarkMode(isEnabled); // Update icon immediately
    });

    // Apply preference on initial load
    loadDarkModePreference();
});
