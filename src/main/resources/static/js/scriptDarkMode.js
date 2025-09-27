function inicializarDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;

    if (!darkModeToggle) return;

    const icon = darkModeToggle.querySelector('i');

    const applyDarkMode = (isDark) => {
        const isUserProfilePage = window.location.pathname.includes('/user-profile');

        if (isDark) {
            if (isUserProfilePage) {
                body.classList.remove('light-mode'); 
            } else {
                body.classList.add('dark-mode');
            }
            if (icon) icon.className = 'fa-solid fa-sun';
        } else {
            if (isUserProfilePage) {
                body.classList.add('light-mode');
            } else {
                body.classList.remove('dark-mode');
            }
            if (icon) icon.className = 'fa-solid fa-moon';
        }
    };

    const preference = localStorage.getItem('darkMode');
    if (preference !== null) {
        applyDarkMode(preference === 'true');
    } else {
        const isUserProfilePage = window.location.pathname.includes('/user-profile');
        applyDarkMode(isUserProfilePage);
    }

    darkModeToggle.addEventListener('click', () => {
        const currentPreference = localStorage.getItem('darkMode') === 'true';
        const isDarkMode = !currentPreference;
        localStorage.setItem('darkMode', isDarkMode);
        applyDarkMode(isDarkMode);
    });
}