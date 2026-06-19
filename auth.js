// Stackly Authentication Module — session-based with optional persistent login
const AUTH_KEY           = 'stackly_user';
const ACCOUNTS_KEY       = 'stackly_accounts';
const PERSISTENT_AUTH_KEY = 'stackly_persistent_user';

const Auth = {
    // Session
    login(identifier, fullName, role, mobile, registeredAt, rememberMe = false) {
        const userData = { identifier, fullName, role, mobile, registeredAt, loginTime: Date.now() };
        sessionStorage.setItem(AUTH_KEY, JSON.stringify(userData));

        // Persistent login if "Remember Me" is checked
        if (rememberMe) {
            localStorage.setItem(PERSISTENT_AUTH_KEY, JSON.stringify(userData));
        }
    },

    logout() {
        sessionStorage.removeItem(AUTH_KEY);
        localStorage.removeItem(PERSISTENT_AUTH_KEY);
        window.location.href = 'index.html';
    },

    // Restore session from persistent storage if available
    restorePersistentSession() {
        if (!this.isLoggedIn()) {
            const persistedUser = localStorage.getItem(PERSISTENT_AUTH_KEY);
            if (persistedUser) {
                sessionStorage.setItem(AUTH_KEY, persistedUser);
            }
        }
    },

    isLoggedIn() {
        return !!sessionStorage.getItem(AUTH_KEY);
    },

    getUser() {
        const d = sessionStorage.getItem(AUTH_KEY);
        return d ? JSON.parse(d) : null;
    },

    requireAuth() {
        if (!this.isLoggedIn()) {
            window.location.href = 'signin.html';
        }
    },

    // Account store (localStorage)
    getAccounts() {
        const data = localStorage.getItem(ACCOUNTS_KEY);
        return data ? JSON.parse(data) : [];
    },

    hasAccounts() {
        return this.getAccounts().length > 0;
    },

    register(userData) {
        const accounts = this.getAccounts();
        accounts.push(userData);
        localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
    },

    // Returns the matching account or null
    findUser(identifier, password) {
        return this.getAccounts().find(acc =>
            acc.email === identifier && acc.password === password
        ) || null;
    }
};
