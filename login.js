const PROFILE_IMAGES = [
    'profile/5f0af377c9f0872ef6df0f4d7475b0ba.jpg',
    'profile/60e8a39240b91baff657147d248471ac.jpg',
    'profile/778731865a5fca7465e46c634ac2d9ef.jpg',
    'profile/dd78a707c0f0ae6433d22be06478c044.jpg',
];

const STORAGE_KEY = 'weatherUserProfile';

function getStoredUser() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    } catch {
        return null;
    }
}

function setStoredUser(user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

function renderProfileGrid(selected) {
    const grid = document.getElementById('profile-grid');
    if (!grid) return;
    grid.innerHTML = PROFILE_IMAGES
        .map((src) => {
            const isSelected = selected === src;
            return `
                <button type="button" class="profile-card ${isSelected ? 'selected' : ''}" data-src="${src}">
                    <img src="${src}" alt="Profile" />
                </button>
            `;
        })
        .join('');

    grid.querySelectorAll('.profile-card').forEach((btn) => {
        btn.addEventListener('click', () => {
            const src = btn.getAttribute('data-src');
            renderProfileGrid(src);
            document.getElementById('login-error').textContent = '';
            grid.setAttribute('data-selected', src);
        });
    });
}

function initLogin() {
    const stored = getStoredUser();
    if (stored?.username && stored?.profile) {
        window.location.href = 'index.html';
        return;
    }

    renderProfileGrid(null);

    const loginBtn = document.getElementById('login-button');
    if (!loginBtn) return;

    loginBtn.addEventListener('click', () => {
        const username = document.getElementById('username')?.value.trim();
        const profile = document.getElementById('profile-grid')?.getAttribute('data-selected');
        const err = document.getElementById('login-error');

        if (!username) {
            if (err) err.textContent = 'Username is required.';
            return;
        }
        if (!profile) {
            if (err) err.textContent = 'Please select a profile picture.';
            return;
        }

        setStoredUser({ username, profile });
        window.location.href = 'index.html';
    });
}

window.addEventListener('load', initLogin);
