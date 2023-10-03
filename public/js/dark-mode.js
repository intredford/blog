// чёрная тема
const darkModeCheckbox = document.getElementById('darkModeCheckbox');
const body = document.body;
darkModeCheckbox.addEventListener('change', () => {
    if (darkModeCheckbox.checked) {
        body.classList.add('dark-mode');
    } else {
        body.classList.remove('dark-mode');
    }
});