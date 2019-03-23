export let resetAuthData = () => {
    localStorage.removeItem('time');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('current_user');
}