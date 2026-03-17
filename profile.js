const PROFILE_STORAGE_KEY = 'weatherUserProfile';

function getStoredUser() {
    try {
        return JSON.parse(localStorage.getItem(PROFILE_STORAGE_KEY) || 'null');
    } catch {
        return null;
    }
}

function clearStoredUser() {
    localStorage.removeItem(PROFILE_STORAGE_KEY);
}

function initProfilePage() {
    const user = getStoredUser();
    if (!user?.username || !user?.profile) {
        window.location.href = 'login.html';
        return;
    }

    const nameEl = document.getElementById('profile-name');
    const avatarEl = document.getElementById('profile-img');
    if (nameEl) nameEl.textContent = user.username;
    if (avatarEl) {
        avatarEl.src = user.profile;
        avatarEl.alt = user.username;
    }

    const editBtn = document.getElementById('edit-profile');
    if (editBtn) {
        editBtn.addEventListener('click', () => {
            window.location.href = 'login.html';
        });
    }

    const logoutBtn = document.getElementById('logout-button');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            clearStoredUser();
            window.location.href = 'login.html';
        });
    }
}

window.addEventListener('load', initProfilePage);
