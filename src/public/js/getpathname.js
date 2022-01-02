if (checkPathName(window.location.pathname)) {
    localStorage.setItem('pathname', window.location.pathname);
}

function checkPathName(path) {
    if (path == '/account/login' || path == 'account/signup') {
        return false;
    } else {
        return true;
    }
}
